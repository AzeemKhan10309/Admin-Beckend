
import Order from"../../models/orders/orderModel.js"

//view all orders
export const viewAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'username email');
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

//update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const  orderId  = req.params.id;
    const { status } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ message: "Order ID missing" });
    }
    
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.redirect(`/api/admin/orders/manageOrders?successMessage=Order+updated+successfully`);

    }catch (error) {
        console.error("Error updating order status:", error);
        res.redirect(`/api/admin/orders/manageOrders?errorMessage=Failed+to+update+order`);

  };
}
    //delete order
    export const deleteOrder = async (req, res) => {
        try {
          const { orderId } = req.params;
          const order = await Order.findByIdAndDelete(orderId);
          if (!order) {
            return res.status(404).json({ message: "Order not found" });
          }
          res.redirect(`/api/admin/orders/manageOrders?errorMessage=Failed+to+update+order`);
        } catch (error) {
          console.error("Error deleting order:", error);
          res.status(500).json({ error: "Failed to delete order" });
        }
      };