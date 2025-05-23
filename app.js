import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/UserRoutes.js";
import adminRoutes from "./routes/Admin/adminRoutes.js";
import Category from "./routes/Admin/categoryRoutes.js";
import Item from "./routes/Admin/itemRoutes.js";
import Order from "./routes/Admin/orderRoutes.js";
import publicRoutes from "./routes/Admin/publicRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { verifyAdmin } from "./middlewares/verifyAdmin.js";
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import cookieParser from "cookie-parser";
app.use(cookieParser());

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

import methodOverride from "method-override";
app.use(methodOverride("_method"));

app.use("/", publicRoutes);

app.use("/api/users", userRoutes);

app.use("/api/admin", adminRoutes); // Admin auth routes: /api/admin/create, /api/admin/login
app.use("/api/admin/category", Category); // Category CRUD: /api/admin/categories/
app.use("/api/admin/items", Item); // Item CRUD: /api/admin/items/
app.use("/api/admin/orders", Order); //public routes


const HOST = '192.168.18.131';
const PORT = 3000;

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

