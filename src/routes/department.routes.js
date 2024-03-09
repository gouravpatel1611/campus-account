import { Router } from "express";
import { createDepartment } from "../controllers/department.controller.js";

const router = Router();

router.route("/create-department").post(createDepartment)

export default router;