import express from "express";
import { adminCreate, adminLogin } from "../../controllers/admin/adminController.js";
import Admin from "../../models/admin/adminModel.js";
import { verifyAdmin, verifyUserOnly } from "../../middlewares/verifyAdmin.js";
const router = express.Router();

router.post("/create", adminCreate);
router.post("/login", adminLogin);
router.get("/dashboard", verifyAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).lean();

    res.render("admin/dashboard", {
      admin,
    });
  } catch (error) {
    console.error("Dashboard Error:", error.message);
    res.status(500).send(error.message);
  }
});
export default router;
