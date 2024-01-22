import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Department from "../models/departmentModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Diploma from "../models/diplomaModel.js";


const getUserProfile = async (req, res) => {
	const { query } = req.params;

	try {
		let user;

		// query is userId
		if (mongoose.Types.ObjectId.isValid(query)) {
			user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
		} else {
			// query is username
			user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
		}

		if (!user) return res.status(404).json({ error: "User not found" });

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in getUserProfile: ", err.message);
	}
};

const signupUser = async (req, res) => {
	try {
		const { nric, email, username, password } = req.body;
		const user = await User.findOne({ $or: [{ email }, { nric }] });

		if (user) {
			return res.status(400).json({ error: "User already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			nric,
			username,
			email,
			password: hashedPassword,
			isStudent: true,
		});

		await newUser.save();

		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);

			res.status(201).json({
				_id: newUser._id,
				username: newUser.username,
				nric: newUser.nric,
				email: newUser.email,
				bio: newUser.bio,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in signupUser: ", err.message);
	}
};


const loginUser = async (req, res) => {
    try {
        const { email, password, access } = req.body;
        let user;
		console.log("Email: ", email);

        // Find user by email
        user = await User.findOne({ email });

        // Check if the user exists and if the provided password is correct
        const isPasswordCorrect = user ? await bcrypt.compare(password, user.password) : false;

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Determine the user's access level
        let isAdmin = user.isAdmin;
        let isLecturer = user.isLecturer;
        let isStudent = user.isStudent;


        // Check if the user has the correct access level
        if (access === "Admin" && !isAdmin) {
            return res.status(403).json({ error: "Access denied. User is not an admin." });
        } else if (access === "Lecturer" && !isLecturer) {
            return res.status(403).json({ error: "Access denied. User is not a lecturer." });
        } else if (access === "Student" && !isStudent) {
            return res.status(403).json({ error: "Access denied. User is not a student." });
        } else if (access === "") {
			return res.status(403).json({ error: "Please select your access level. "});
		}

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic,
            isAdmin,
            isLecturer,
            isStudent,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in loginUser: ", error.message);
    }
};


const logoutUser = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 1 });
		res.status(200).json({ message: "User logged out successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in signupUser: ", err.message);
	}
};


const followUnFollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString())
			return res.status(400).json({ error: "You cannot follow/unfollow yourself" });

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in followUnFollowUser: ", err.message);
	}
};

const updateUser = async (req, res) => {
	const { email, username, password, bio } = req.body;
	let { profilePic } = req.body;

	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

		if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();

		// Find all posts that this user replied and update username and userProfilePic fields
		await Post.updateMany(
			{ "replies.userId": userId },
			{
				$set: {
					"replies.$[reply].username": user.username,
					"replies.$[reply].userProfilePic": user.profilePic,
				},
			},
			{ arrayFilters: [{ "reply.userId": userId }] }
		);

		// password should be null in response
		user.password = null;

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);
	}
};

const getSuggestedUsers = async (req, res) => {
	try {
		const userId = req.user._id;

		const usersFollowedByYou = await User.findById(userId).select("following");

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{
				$sample: { size: 10 },
			},
		]);
		const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const freezeAccount = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(400).json({ error: "User not found" });
		}

		user.isFrozen = true;
		await user.save();

		res.status(200).json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getAllUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
              $or: [
                  { username: { $regex: req.query.search, $options: "i" } },
              ],
          }
        : {};

    try {
        let users;

        if (req.user.isStudent) {
            users = await User.find({ ...keyword, isLecturer: true, _id: { $ne: req.user._id } });
        } else if (req.user.isLecturer || req.user.isAdmin) {
            users = await User.find({ ...keyword, _id: { $ne: req.user._id } });
        } else {
            return res.status(403).json({ error: "Forbidden: Access denied" });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const changePassword = async (req, res) => {
	const { email, newPassword } = req.body;

	try {
		const user = await User.findOne({ email: email });

		if(!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		user.password = hashedPassword;

		await user.save();

	  	res.status(200).json({ message: 'Password changed successfully' });
	} catch (error) {
	  	console.error(error);
	  	res.status(500).json({ error: 'Internal server error' });
	}
};


const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json(departments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getDiplomas = async (req, res) => {
	try {
		const diplomas = await Diploma.find();
		res.status(200).json(diplomas);
	} catch (error) {
		console.error(error);
	}
};


const setupUser = async (req, res) => {
    const { department, diploma } = req.body;
    const userId = req.user._id;
	const departmentObject = JSON.parse(department);
	const diplomaObject = JSON.parse(diploma);

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { department: departmentObject._id, diploma: diplomaObject._id } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getUser = async (req, res) => {
	const { userId } = req.params;

	const user = await User.findById(userId);

	res.status(200).json(user);
};

export {
	signupUser,
	loginUser,
	logoutUser,
	followUnFollowUser,
	updateUser,
	getUserProfile,
	getSuggestedUsers,
	freezeAccount,
	getAllUsers,
	changePassword,
	getDepartments,
	getDiplomas,
	setupUser,
	getUser
};
