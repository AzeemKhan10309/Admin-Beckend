import Order from  "../../models/orders/orderModel.js"
import express from "express";
import {
  viewAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../controllers/orders/ordersControllers.js";
import { verifyAdmin } from "../../middlewares/verifyAdmin.js";

const router = express.Router();
router.get('/manageOrders', verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("userId" ,"username"). populate('products.product' ,'name price').lean();
    const editingId = req.query.editingId || null;
    res.render('admin/manageOrders', { orders, editingId:req.query.editingId || null   ,errorMessage: null,
      successMessage: null });
  } catch (error) {
    console.error('Error loading manageCategory:', error);
    res.render('admin/manageOrders', {
      orders: [] ,     
      editingId: null,
      successMessage: null,
      errorMessage: 'Error loading products'
    });
  }
});

router.get("/", verifyAdmin, viewAllOrders);
router.put("/:id", verifyAdmin, updateOrderStatus);
router.delete("/:orderId", verifyAdmin, deleteOrder);

export default router;
