import {
    enrollCourse,
    getAssignments,
    getCourses,
    getEnrolledCourses,
    markAssignmentDone
} from "../controllers/studentController.js";
import express from "express";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/getCourses", protectRoute, getCourses);
router.post("/enrollCourse", protectRoute, enrollCourse);
router.post("/getAssignments/:courseId", protectRoute, getAssignments);
router.get("/getEnrolledCourses", protectRoute, getEnrolledCourses);
router.put("/markAssignmentDone/:assignmentId", protectRoute, markAssignmentDone);


export default router;
