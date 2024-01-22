import {
    createUserAccount,
    getAllUsers,
    deleteUserAccount,
    createDepartment,
    getDepartments,
    addNewDiploma,
    addNewCourse
} from "../controllers/adminController.js";
import express from "express";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/createUserAccount", protectRoute, createUserAccount);
router.delete("/deleteUser/:userId", protectRoute, deleteUserAccount);
router.get("/getAllUsers", protectRoute, getAllUsers);
router.post("/createDepartment", protectRoute, createDepartment);
router.get("/getDepartments", protectRoute, getDepartments);
router.post("/addDiploma", protectRoute, addNewDiploma);
router.post("/addCourse", protectRoute, addNewCourse);


export default router;