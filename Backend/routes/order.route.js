import express from "express";
const router = express.Router();

import  {getAllOrders,getUserOrder,deleteOrder,createOrder,updateOrder} from "../controller/order.controller.js";
import protect from "../middleware/auth.middleware.js";
//create order routes 

router.post("/",createOrder);

//update order router

router.put("/:id",updateOrder);

//get all orders router
router.get("/",protect,getAllOrders);

//delete router
router.delete("/:id",deleteOrder);

//get users order
router.get("/find/:userId",getUserOrder);

export default router;