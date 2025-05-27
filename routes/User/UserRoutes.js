import express from "express";
import verifyToken from "../../middlewares/verifyAdmin.js";
import Admin from"../../models/admin/adminModel.js"
import { Addtocart , viewCart ,checkout ,updateAdmin ,userCreate } from "../../controllers/user/userControllers.js";

const router = express.Router();

//router.post("/", userCreate);

router.post("/", userCreate);

router.post("/addtocart", verifyToken ,Addtocart);
router.get("/viewcart", verifyToken, viewCart);
router.post("/checkout", verifyToken, checkout);
router.put("/update", verifyToken, updateAdmin);
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await Admin.findById(req.user._id); 

    if (!user) {
      return res.status(404).send("User not found");
    }
    const message = req.query.msg || null;
    res.render("user/profile", { user ,message }); 
  } catch (err) {
    console.error("Error loading profile:", err);
    res.status(500).send("Internal Server Error");
  }
});
router.post("/usercreate",userCreate);

export default router;
