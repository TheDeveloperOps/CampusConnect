import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});

export const getRecipientSocketId = (recipientId) => {
    return userSocketMap.get(recipientId);
};

export const getGroupSocketId = (groupId) => {
    return groupSocketMap.get(groupId);
};

const userSocketMap = new Map();
const groupSocketMap = new Map();

io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    // One-to-One Chat
    const userId = socket.handshake.query.userId;

    if (userId !== "undefined") userSocketMap.set(userId, socket.id);
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

    socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
        try {
            await Message.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } });
            await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });
            io.to(userSocketMap.get(userId)).emit("messagesSeen", { conversationId });
        } catch (error) {
            console.log(error);
        }
    });

    // Group Chat
    socket.on("joinGroup", ({ groupId }) => {
        socket.join(groupId);
        groupSocketMap.set(groupId, socket);
    });
});

export { io, server, app };
