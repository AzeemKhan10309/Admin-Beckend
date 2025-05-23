import Admin from '../../models/admin/adminModel.js';
import Category from '../../models/admin/categoryModel.js';
import express from "express";
import {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../../controllers/admin/adminController.js";
import { verifyAdmin } from "../../middlewares/verifyAdmin.js";

const router = express.Router();
router.get('/manageCategory', verifyAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).lean();
    const categories = await Category.find().lean();
    const editingId = req.query.editingId || null; 

    res.render('admin/managecategory', { admin, categories , editingId ,errorMessage: null,
      successMessage: null });
  } catch (error) {
    console.error('Error loading manageCategory:', error);
    res.status(500).send('Server Error');
  }
});
router.post("/", verifyAdmin, addCategory);
router.get("/", verifyAdmin, getAllCategories);
router.get("/:id", verifyAdmin, getCategoryById);
router.put("/:id", verifyAdmin, updateCategory);
router.delete("/:id", verifyAdmin, deleteCategory);

export default router;
