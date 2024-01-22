import express from "express";
import {
	followUnFollowUser,
	getUserProfile,
	loginUser,
	logoutUser,
	signupUser,
	updateUser,
	getSuggestedUsers,
	freezeAccount,
	getAllUsers,
	changePassword,
	getDepartments,
	getDiplomas,
	setupUser,
	getUser
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.get("/getAllUsers", protectRoute, getAllUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);

router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.put("/update/:id", protectRoute, updateUser);
router.put("/freeze", protectRoute, freezeAccount);
router.put("/changePassword", changePassword);

router.get("/getDepartments", protectRoute, getDepartments);
router.get("/getDiplomas", protectRoute, getDiplomas);
router.post("/setupUser", protectRoute, setupUser);
router.get("/getUser/:currentUser", protectRoute, getUser);


export default router;
