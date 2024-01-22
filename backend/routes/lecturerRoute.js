import { addCourse, deleteCourse, getCourses, uploadFile, getAllCourses, addAssignment, getAssignments, deleteAssignment } from "../controllers/lecturerController.js";
import protectRoute from "../middlewares/protectRoute.js";
import express from "express";

const router = express.Router();

router.post("/addCourse", protectRoute, addCourse);
router.delete("/deleteCourse/:courseId", protectRoute, deleteCourse);
router.get("/getCourses/:userId", protectRoute, getCourses);
router.get("/getAllCourses", protectRoute, getAllCourses);
router.post("/uploadFile", protectRoute, uploadFile);
router.post("/addAssignment", protectRoute, addAssignment);
router.get("/getAssignments/:userId", protectRoute, getAssignments);
router.delete("/deleteAssignment/:assignmentId", protectRoute, deleteAssignment);


export default router;
