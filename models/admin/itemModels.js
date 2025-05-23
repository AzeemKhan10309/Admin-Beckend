import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      quantity: {
        type: Number,
        default: 0
      },
      category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
      },
      imageUrl: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin' // or 'User', depending on your app
      }
});
const Item = mongoose.model("Item", itemSchema);
export default Item;