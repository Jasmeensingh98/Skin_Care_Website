import {
  ratingProduct,
  getAllproducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/product.controller.js";
import express from "express";
const router = express.Router();

// Rating product route

router.put("/rating/:productId", ratingProduct);
// get All products
router.get("/", getAllproducts);
// get one product

router.get("/:id", getProduct);

//create product
router.post("/", createProduct);
//update product

router.put("/:id", updateProduct);

//delete product

router.delete("/:id", deleteProduct);

export default router;
