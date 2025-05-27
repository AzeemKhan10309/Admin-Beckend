import Admin from "../../models/admin/adminModel.js";
import Category from "../../models/admin/categoryModel.js";
import Item from "../../models/admin/itemModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;


//login
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const adminUser = await Admin.findOne({ username });
    if (!adminUser) {
     // return res.status(400).json({ message: "Invalid username or password" });
    return  res.render("index", {
      error: "Invalid Username" 
    })
  }
    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
    //  return res.status(400).json({ message: "Invalid username or password" });
    return res.render("index", {
      error: "Invalid Password",  
    })
    }
    const role = adminUser.role || 'admin';
 
    const token = jwt.sign(
      { id: adminUser._id, role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    // res.status(200).json({ message: 'Login successful', token });
    //res.redirect('/dashboard');
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    if (role === 'admin') {
      return res.redirect("/api/admin/dashboard");
    } else if (role === 'user') {
      return res.redirect("/"); // or any user page you define
    } else {
      return res.status(403).json({ message: "Access denied. Unknown role." });
    }
   // res.redirect("/api/admin/dashboard");
  } catch (error) {
    console.error("Login Error", error);
    res.status(500).json({ error: "Server failed" });
  }
};

//admin update

//Add Category
export const addCategory = async (req, res) => {
  console.log("Controller: req.user is", req.user);

  if (!req.user || !req.user.id) {
    return res.status(401).render("_categories", {
      errorMessage: "Unauthorized: Missing user ID",
      successMessage: null,
      categories: await Category.find(),
      editingId: null,
    });
  }
  try {
    const { name, description } = req.body;
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      //return res.status(400).json({ message: 'Category already exists' });
      return res.status(400).render("admin/manageCategory", {
        errorMessage: "Category already exists",
        successMessage: null,
        categories: await Category.find(),
        editingId: null,
      });
    }
    const category = new Category({
      name,
      description,
      createdBy: req.user.id,
    });
    await category.save();
    const categories = await Category.find(); // <== add this line

    res.status(201).render("admin/manageCategory", {
      successMessage: "Category created successfully!",
      errorMessage: null,
      categories,
      admin: req.user,
      editingId: null,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).render("admin/manageCategory", {
      errorMessage: "Failed to create category",
      successMessage: null,
      categories: await Category.find(),
      editingId: null,
    });
  }
};

//Get All Categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
//Get Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ category });
  } catch (error) {
    console.error("Error Find Category:", error);
    res.status(500).json({ error: "Error Find Category" });
  }
};

//Update Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const categories = await Category.find(); // <== add this line
    //res.status(200).json({ message: 'Category updated', category });

    res.redirect("/api/admin/category/manageCategory");
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
};
//Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.redirect("/api/admin/category/manageCategory");

    res.status(200).json({ message: "Category deleted", category });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};

//Item Add
export const addItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
      category,
    
      createdAt,
      createdBy,
    } = req.body;
    let imageUrl = null;
    if (req.file) {
      imageUrl = '/uploads/' + req.file.filename; 
    }
    const existingItem = await Item.findOne({ name });
    if (existingItem) {
      return res.status(400).json({ message: "Item already exists" });
    }

    const item = new Item({
      name,
      description,
      price,
      quantity,
      category_id: category,
      imageUrl,
      createdAt,
      createdBy: req.user.id,
    });
    await item.save();
    const categories = await Category.find().lean();
    const items = await Item.find()
      .populate({
        path: "category_id",
        select: "name",
      })
      .lean();
    //res.status(201).json({ message: 'item created ',item});
    res.status(201).render("admin/manageProducts", {
      successMessage: "Items created successfully!",
      errorMessage: null,
      categories,
      items,
      admin: req.user,
      editingId: null,
    });
  } catch (error) {
    console.error("Error creating item:", error);
    const categories = await Category.find().lean();
    const items = await Item.find().populate("category_id").lean();
    res.status(500).render("admin/manageproducts", {
      errorMessage: "Failed to create item",
      successMessage: null,
      categories,
      items,
      admin: req.user,
      editingId: null,
    });
  }
};
//Get All Items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json({ items });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
};
//Get Item by ID
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ item });
  } catch (error) {
    console.error("Error Find Item:", error);
    res.status(500).json({ error: "Error Find Item" });
  }
};
//Update Item
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, category, imageUrl } = req.body;
    const item = await Item.findByIdAndUpdate( id,
      { name, description, price, quantity, category_id:category, imageUrl },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.redirect("/api/admin/items/manageProducts");

  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Failed to update item" });
  }
};
//Delete Item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.redirect("/api/admin/items/manageProducts");

    res.status(200).json({ message: "Item deleted", item });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
};
