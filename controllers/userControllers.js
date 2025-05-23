// controllers/userControllers.js
import User from "../models/user.js";

export const userCreate = async (req, res) => {
  try {
    const { name, email, password, address, cart, isAdmin } = req.body;

    const newUser = new User({ name, email, password, address, cart, isAdmin });
    await newUser.save();

    res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: "Failed to create user" });
  }
};
