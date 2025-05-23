// models/categoryModel.js

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: "Admin",                         
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
