import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";

//create  product

const createProduct = asyncHandler(async () => {
  const newProduct = await Product(req.body);
  const product = newProduct.save();

  if (product) {
    resize.status(201).json(product);
  } else {
    resizeBy.status(400);
    throw new Error("Product was not created");
  }
});

// Update product

const updateProduct = asyncHandler(async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );
  if (!updateProduct) {
    res.status(400);
    throw new Error("Product has not being updated");
  } else {
    res.status(201).json(updatedProduct);
  }
});

//Delete Product

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(400);
    throw new Error("Product has not been deleted");
  } else {
    res.status(201).json("product deleted successfully");
  }
});

// get product

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(400);
    throw new Error("Product has not been found");
  } else {
    res.status(200).json(product);
  }
});

// get all products

const getAllproducts = asyncHandler(async (req, res) => {
  const qnew = req.query.new;
  const qcategory = req.query.category;
  const qsearch = req.query.search;
  let products;
  if (qnew) {
    products = await Product.find().sort({ createdAt: -1 });
  } else if (qcategory) {
    products = await Product.find({ categories: { $in: [qcategory] } });
  } else if (qsearch) {
    products = await Product.find({
      $text: {
        $search: qsearch,
        $caseSensitive: false,
        $diacriticSensitive: false,
      },
    });
  } else {
    products = await Product.find().sort({ createdAt: -1 });
  }
});

//--------------------------------------------------//
//Rating a product

const ratingProduct = asyncHandler(async (req, res) => {
  const { star, name, comment, postedBy } = req.body;
  if (star && name && comment && postedBy) {
    const postedBy = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $push: { ratings: { star, name, comment, postedBy } },
      },
      {
        new: true,
      }
    );
    res.status(201).json("product was rated successfully");
  }
  else{
    res.status(400);
    throw new Error("Product not rated succesfully");
    }
});
export { ratingProduct,getAllproducts,getProduct,createProduct,updateProduct,deleteProduct}
