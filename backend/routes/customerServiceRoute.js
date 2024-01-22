import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { getReports, sendReport } from "../controllers/customerServiceController.js";

const router = express.Router();

router.post("/sendReport", protectRoute, sendReport);
router.get("/getReports", protectRoute, getReports);


export default router;