import express from "express";
import Item from "../../models/admin/itemModels.js"
import Category from '../../models/admin/categoryModel.js';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const token = req.cookies?.token;
    const categoryId = req.query.category;
    let filter = {};
  

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      filter.category_id = new mongoose.Types.ObjectId(categoryId);
    }
    let user = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = decoded; 
      } catch (err) {
        user = null; 
      }
    }
    const products = await Item.find(filter).lean();
    const categories= await Category.find().lean();
    const msg = req.query.msg || null;

    res.render("user/userdashboard", {
      user,
      products,
      categories,
      msg
    })
  } catch (error) {
    console.error("Dashboard Error:", error.message);
    res.status(500).send(error.message);
  }
});
router.get("/login", (req, res) => {
  res.render("index" ,{ error: null });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});
router.get("/signup", (req, res) => {
  res.render("user/createUser", {message:null}); 
});
router.get('/order-success', (req, res) => {
  res.render('user/order-success'); // Render EJS view
});
  export default router;