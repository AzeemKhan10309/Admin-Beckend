
import express from "express";
import { userCreate } from "../controllers/userControllers.js";
const router = express.Router();

//router.post("/", userCreate);

  router.post("/", userCreate);

export default router;