import mongoose from "mongoose";
const { Schema } = mongoose;
const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin', 
            required: true,
          },
          products: [
            {
              product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Item',
                required: true,
              },
              quantity: {
                type: Number,
                required: true,
                min: 1,
              }
            }
          ],
          totalPrice: {
            type: Number,
            required: true,
          },
          shippingAddress: {
            street: String,
            city: String,
            postalCode: String,
            country: String,
          },
          status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
          },
          paymentMethod: {
            type: String,
            enum: ['CashOnDelivery', 'Card'],
            required: true,
          },
          isPaid: {
            type: Boolean,
            default: false,
          },
          paidAt: {
            type: Date,
          },
        }, { timestamps: true });
        export default mongoose.model("Order", orderSchema);
