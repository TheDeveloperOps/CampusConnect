import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import Department from "../models/departmentModel.js";
import Diploma from "../models/diplomaModel.js";
import Course from "../models/courseModel.js";
import Conversation from "../models/conversationModel.js";

const salt = await bcrypt.genSalt(10);

const createUserAccount = async (req, res) => {
    const { nric, username, email, access, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { nric }]});

    if(user) {
        return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, salt);

    let isAdmin = false;
    let isLecturer = false;
    let isStudent = false;

    if(access === "Admin") {
        isAdmin = true;
    } else if(access === "Lecturer") {
        isLecturer = true;
    } else if(access === "Student") {
        isStudent = true;
    } else if(access === "") {
        return res.status(400).json({ error: "Please select valid access level."});
    }

    const newUser = new User({
        nric,
        username,
        email,
        password: hashedPassword,
        isAdmin: isAdmin,
        isLecturer: isLecturer,
        isStudent: isStudent
    });

    await newUser.save();

    return res.status(200).json({ message: "User account has been created."});
};


const deleteUserAccount = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find and delete the user
        const deletedUser = await User.findByIdAndDelete(userId);

        if (deletedUser) {
          // Delete conversations associated with the user
          await Conversation.deleteMany({ participants: userId });

          res.status(200).json({ message: "User account and associated conversations deleted successfully." });
        } else {
          res.status(404).json({ error: "User not found." });
        }

    } catch (error) {
      console.error("Error deleting user account:", error);
      res.status(500).json({ error: "Internal server error." });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false });

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const createDepartment = async (req, res) => {
    try {
        const { departmentName } = req.body;

        const newDepartment = await Department.create({
            name: departmentName
        });

        await newDepartment.save();

        res.status(200).json({ message: "Successfully Create New Department" });
    }catch(error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error " });
    }
}


const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json(departments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const addNewDiploma = async (req, res) => {
    const { department, diplomaName } = req.body;
    const departmentObject = JSON.parse(department);

    try {
        // Create a new diploma
        const newDiploma = await Diploma.create({
            name: diplomaName,
            department: departmentObject._id
        });

        await Department.findOneAndUpdate(
            { _id: departmentObject._id },
            { $push: { diploma: newDiploma._id } },
            { new: true }
        );

        res.status(200).json({ message: "Successfully added new Diploma" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const addNewCourse = async (req, res) => {
    const { diploma, courseCode, courseName } = req.body;
    const diplomaObject = JSON.parse(diploma);

    try {
        const newCourse = await Course.create({
            courseCode: courseCode,
            courseName: courseName,
            diploma: diplomaObject._id
        });

        await Diploma.findOneAndUpdate(
            { _id: diplomaObject._id },
            { $push: { courses: newCourse._id } },
        );

        res.status(200).json({ message: "New courses has been added" });
    }catch(error){
        res.status(500).json("Internal Server Error");
        console.error(error);
    }
};


export {
    createUserAccount,
    getAllUsers,
    deleteUserAccount,
    createDepartment,
    getDepartments,
    addNewDiploma,
    addNewCourse
};