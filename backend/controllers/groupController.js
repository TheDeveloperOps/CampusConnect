import GroupMessage from "../models/groupMessageModel.js";
import Group from "../models/groupModel.js";
import User from "../models/userModel.js";
import { getGroupSocketId, io } from "../socket/socket.js";
import crypto from "crypto";

// Create Group Chat Function
const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ error: 'Please fill all required fields' });
    }

    const user = req.user;
    let participants = [user, ...req.body.users];

    try {
        // Generate a 12-character hexadecimal string for the group code
        const groupCode = crypto.randomBytes(6).toString('hex');

        const newGroup = await Group.create({
            name: req.body.name,
            participants: participants,
            admin: user,
            code: groupCode,
        });

        const groupChat = await Group.findOne({ _id: newGroup._id })
            .populate("participants")
            .populate("admin");


        res.status(200).json(groupChat);
    } catch (error) {
        res.status(500).json(error);
    }
}


//  Join Group Function
const joinGroup = async (req, res) => {
    try {
        const { groupCode } = req.body;
        const user = req.user;

        // Find the group
        const group = await Group.findOne({ code: groupCode });

        // Check if the group exists
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Check if the user is already a member of the group
        if (group.participants.includes(user._id)) {
            return res.status(400).json({ error: "User is already a member of the group" });
        }

        // Add the user to the group
        group.participants.push(user._id);

        await group.save();

        io.emit("joinGroup", group);

        res.status(201).json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


//	Get All Groups function
const getAllGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        const groups = await Group.find({ participants: userId }).populate("participants", "-password").populate("admin", "-password");

        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json(error);
    }
};


//	Get Group Message Function
const getGroupChats = async (req, res) => {
    const { myGroupId } = req.params;

    try {
        const group = await Group.findOne({ _id: myGroupId })
            .populate({
                path: 'participants',
                select: '-password'
            })
            .populate('admin', '-password');

        if (!group) {
            return res.status(404).json({ error: 'Group not found or user not authorized to access this group' });
        }

        const groupMessages = await GroupMessage.find({ groupId: myGroupId })
            .sort({ createdAt: 1 });

        res.status(200).json(groupMessages);
    } catch (error) {
        res.status(500).json(error);
    }
};


//	Send Group Message Function
const sendGroupMessage = async (req, res) => {
    const { groupId, message } = req.body;
    let user = req.user;

    try {
        let group = await Group.findOne({ _id: groupId });

        if (!group) {
            return res.status(404).json({ error: 'Group not found or user not authorized to send messages in this group' });
        }

        user = await User.findOne({ _id: user });

        const groupMessage = new GroupMessage({
            groupId: groupId,
            user: user._id,
            username: user.username,
            text: message,
        });

        await Promise.all([
            groupMessage.save(),
            group.updateOne({
                lastMessage: {
                    text: message,
                    sender: user._id,
                    username: user.username
                }
            })
        ]);


        const groupSocketId = getGroupSocketId(groupId);

        if (groupSocketId) {
            groupSocketId.broadcast.to(groupId).emit("sendGroupMessage", groupMessage);
        }


        res.status(201).json(groupMessage);
    } catch (error) {
        res.status(500).json(error);
    }
};



const renameGroup = async (req, res) => {
    const { groupId, groupName } = req.body;

    const updateGroup = await Group.findOneAndUpdate({ _id: groupId }, { name: groupName }, { new: true }).populate("participants", "-password").populate("admin", "-password");

    if (!updateGroup) {
        res.status(404);
        throw new Error("Group Not Found");
    } else {
        res.json(updateGroup);
    }
};


const addUser = async (req, res) => {
    const { groupId, userIds } = req.body;

    try {
        const updateGroup = await Group.findByIdAndUpdate(
            groupId,
            {
                $addToSet: { participants: { $each: userIds } }
            },
            { new: true }
        ).populate("participants", "-password").populate("admin", "-password");

        if (!updateGroup) {
            res.status(404).json({ error: "Group Not Found" });
        } else {
            res.json(updateGroup);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const removeUser = async (req, res) => {
    const { groupId, userId } = req.body;

    try {
        // Check if the requester is the group admin
        const group = await Group.findOne({ _id: groupId, admin: req.user._id });

        if (!group) {
            return res.status(403).json({ error: 'Only group admin can remove users from the group' });
        }

        // Check if the requester's ID is the same as the user's ID to be removed
        if (req.user._id.toString() === userId) {
            return res.status(400).json({ error: 'You cannot remove yourself from the group' });
        }

        // Remove the user from the group
        await Group.findByIdAndUpdate(groupId, {
            $pull: { participants: userId }
        });

        res.status(200).json({ message: 'User removed from the group successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error removing user from the group' });
    }
};


const leaveGroup = async (req, res) => {
    const { groupId } = req.body;

    try {
        // Check if the user is a participant of the group
        const group = await Group.findOne({ _id: groupId, participants: req.user._id });

        if (!group) {
            return res.status(403).json({ error: 'You are not a member of this group' });
        }

        // Check if the user is the group admin
        if (group.admin.toString() === req.user._id.toString()) {
            return res.status(403).json({ error: 'Group admin cannot leave the group. Please remove the group instead.' });
        }

        // Remove the user from the group
        await Group.findByIdAndUpdate(groupId, {
            $pull: { participants: req.user._id }
        });

        io.emit("leftGroup", group);

        res.status(200).json({ message: 'You have left the group successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error leaving the group' });
    }
};


const removeGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Check if the requester is the group admin
        if (group.admin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Only the group admin can remove the group' });
        }

        // Remove the group along with its participants
        await Group.findByIdAndRemove(groupId);

        io.emit("groupDeleted", { groupId: group._id });

        res.status(200).json({ message: 'Group removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error removing the group' });
    }
};


export {
    createGroupChat,
    joinGroup,
    getAllGroups,
    sendGroupMessage,
    getGroupChats,
    renameGroup,
    addUser,
    removeUser,
    leaveGroup,
    removeGroup
};
