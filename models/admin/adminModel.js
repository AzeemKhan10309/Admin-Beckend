import mongoose from "mongoose";
const { Schema } = mongoose;
const adminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
          },
          email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
          },
          password: {
            type: String,
            required: true,
          },
          role: {
            type: String,
            enum: ['superadmin', 'admin'],
            default: 'admin',
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
    })
    export default mongoose.model("Admin", adminSchema);