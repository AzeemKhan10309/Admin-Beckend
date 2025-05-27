// controllers/userControllers.js
import cart from "../../models/user/cart.js";
import Item from "../../models/admin/itemModels.js";
import Admin from "../../models/admin/adminModel.js";
import Order from "../../models/orders/orderModel.js";
import bcrypt from "bcryptjs";

export const userCreate = async (req, res) => {
  try {
    const { username, email, password, address, cart, isAdmin } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required" });
    }
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.render("user/createUser", {
        message: "Email already registered",
      });
    }
        const hashedPassword = await bcrypt.hash(password, 10);
    

    const newUser = new Admin({
      username,
      email,
      password : hashedPassword,
      address,
      cart: cart || [],
      isAdmin: false,
    });
    await newUser.save();
    return res.render("index", {
      error: "User created successfully! You can now login.",
    });
    //res.status(201).json({ message: "User created", user: newUser });

    //res.redirect("/login?msg=User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: "Failed to create user" });
  }
};

export const Addtocart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const userId = req.user.id;
    console.log("User ID from req.user:", userId);

    const user = await Admin.findById(userId);
    if (!user) {
      return res.redirect("/index");
    }

    if (!productId) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = await Item.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let userCart = await cart.findOne({ userId: user._id });

    if (!userCart) {
      userCart = new cart({
        userId: user._id,
        items: [{ productId, quantity }],
      });
    } else {
      const itemIndex = userCart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (itemIndex > -1) {
        userCart.items[itemIndex].quantity += quantity;
      } else {
        userCart.items.push({ productId, quantity });
      }
    }

    await userCart.save();

    return res.redirect("/?msg=Item added to cart successfully");
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};


//View Cart
export const viewCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const userCart = await cart.findOne({ userId }).populate("items.productId");

    if (!userCart || userCart.items.length === 0) {
      return res.render("user/viewcart", {
        userCart: [],
        message: "Your cart is empty.",
      });
    }
    const validItems = userCart.items.filter((item) => item.productId);
    res.render("user/viewcart", {
      userCart: validItems,
      totalPrice: validItems.reduce(
        (total, item) => total + item.productId.price * item.quantity,
        0
      ),
    });
  } catch (error) {
    console.error("Error viewing cart:", error);
    res.status(500).json({ error: "Failed to view cart" });
  }
};

//checkout

export const checkout = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    if (!paymentMethod) {
      return res.status(400).send("Payment method is required.");
    } 
    const userId = req.user.id;
    console.log("User ID from req.user:", userId);
    const userCart = await cart.findOne({ userId }).populate("items.productId");
    if (!userCart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const validItems = userCart.items.filter((item) => item.productId);
    if (validItems.length !== userCart.items.length) {
      userCart.items = validItems;
      await userCart.save();
    }

    if (validItems.length === 0) {  
      return res
        .status(400)
        .json({ error: "Your cart contains no valid products." });
    }
    const totalPrice = validItems.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );

    const newOrder = {
      userId: userId,
      products: validItems.map((item) => ({
        product: item.productId._id,
        quantity: item.quantity,
      })),
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
      orderDate: new Date(),
    };
    await new Order(newOrder).save();

    await cart.deleteOne({ userId });

    res.redirect("/order-success");
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ error: "Failed to complete checkout" });
  }
};

// Update User Profile
export const updateAdmin = async (req, res) => {
  try {
    // const { id } = req.params;
    const { username, password, email, phone, address } = req.body;

    // Find the admin user by ID
    const adminUser = await Admin.findById(req.user._id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update the admin user details
    adminUser.username = username || adminUser.username;
    adminUser.email = email || adminUser.email;
    adminUser.phone = phone || adminUser.phone;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      adminUser.password = hashedPassword;
    }

    if (address) {
      adminUser.address.street = address.street || adminUser.address.street;
      adminUser.address.city = address.city || adminUser.address.city;
      adminUser.address.state = address.state || adminUser.address.state;
      adminUser.address.zip = address.zip || adminUser.address.zip;
      adminUser.address.country = address.country || adminUser.address.country;
    }

    await adminUser.save();
    res.redirect("/api/users/profile?msg=Updated successfully");

    // res.status(200).json({ message: "Admin updated successfully", user: adminUser });
  } catch (error) {
    console.error("Error updating Admin:", error);
    res.status(500).json({ error: "Failed to update Admin" });
  }
};
