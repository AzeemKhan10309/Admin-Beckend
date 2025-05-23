import Admin from '../../models/admin/adminModel.js';
import Category from '../../models/admin/categoryModel.js';
import Item from '../../models/admin/itemModels.js';
import express from "express";
import {
  addItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} from "../../controllers/admin/adminController.js";
import { verifyAdmin } from "../../middlewares/verifyAdmin.js";

const router = express.Router();
router.get('/manageProducts', verifyAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).lean();
    const items = await Item.find().populate("category_id").lean();  
    const categories = await Category.find().lean();
    const editingId = req.query.editingId || null; 

    res.render('admin/manageproducts', { admin, categories , editingId ,items   ,errorMessage: null,
      successMessage: null });
  } catch (error) {
    console.error('Error loading manageProduts:', error);
    res.render('admin/manageProducts', {
      items: [],
      categories: [],
      editingId: null,
      successMessage: null,
      errorMessage: 'Error loading products'
    });
  }
});
router.post("/", verifyAdmin, addItem);
router.get("/", verifyAdmin, getAllItems);
router.get("/:id", verifyAdmin, getItemById);
router.put("/:id", verifyAdmin, updateItem);
router.delete("/:id", verifyAdmin, deleteItem);

export default router;
