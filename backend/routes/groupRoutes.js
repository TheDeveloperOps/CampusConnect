import { createGroupChat, getAllGroups, sendGroupMessage, getGroupChats, renameGroup, addUser, removeUser, leaveGroup, removeGroup, joinGroup } from "../controllers/groupController.js";
import protectRoute from "../middlewares/protectRoute.js";
import express from "express";


const router = express.Router();

router.post("/createGroupChat", protectRoute, createGroupChat);
router.post("/sendGroupMessage", protectRoute, sendGroupMessage);
router.post("/renameGroup", protectRoute, renameGroup);
router.put("/addUser", protectRoute, addUser);
router.post("/removeUserFromGroup", protectRoute, removeUser);

router.post("/leaveGroup", protectRoute, leaveGroup);
router.delete("/removeGroup/:groupId", protectRoute, removeGroup);
router.get("/getAllGroups", protectRoute, getAllGroups);
router.get("/:myGroupId", protectRoute, getGroupChats);
router.post("/joinGroup", protectRoute, joinGroup);


export default router;
