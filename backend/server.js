import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import customerServiceRoutes from "./routes/customerServiceRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import lecturerRoute from "./routes/lecturerRoute.js";
import studentRoute from "./routes/studentRoute.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Middlewares
app.use(express.json({ limit: "900mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/customerService", customerServiceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/lecturer", lecturerRoute);
app.use("/api/students", studentRoute);


server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
