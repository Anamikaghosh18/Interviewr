import express from "express";
import { getStreamToken } from "../controllers/chatContoller.js";
import { protectRoute } from "../middleware/protectRoute.js";


export const router = express.Router();

router.get("/token", protectRoute, getStreamToken);


export default router;
