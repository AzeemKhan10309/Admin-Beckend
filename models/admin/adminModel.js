import mongoose from "mongoose";
const { Schema } = mongoose;
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
  },

  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },

  cart: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],

  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
}, { timestamps: true });

    export default mongoose.model("Admin", adminSchema);