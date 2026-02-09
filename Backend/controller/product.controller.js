import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";

//create  product

const createProduct = asyncHandler(async (req, res) => {
  const newProduct = new Product(req.body);
  const product = await newProduct.save();

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
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
  if (!updatedProduct) {
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
  const qskintype = req.query.skintype;
  const qconcern = req.query.concern;

  const normalizeList = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [];
  };

  const filter = {};
  const categoryList = normalizeList(qcategory);
  const skinTypeList = normalizeList(qskintype);
  const concernList = normalizeList(qconcern);

  if (categoryList.length > 0) {
    filter.categories = { $in: categoryList };
  }

  if (skinTypeList.length > 0) {
    filter.skintype = { $in: skinTypeList };
  }

  if (concernList.length > 0) {
    filter.concern = { $in: concernList };
  }

  if (qsearch) {
    filter.$text = {
      $search: qsearch,
      $caseSensitive: false,
      $diacriticSensitive: false,
    };
  }

  const products = await Product.find(filter).sort({
    createdAt: qnew ? -1 : -1,
  });

  res.status(200).json(products);
});

//--------------------------------------------------//
//Rating a product

const ratingProduct = asyncHandler(async (req, res) => {
  const { star, name, comment, postedBy } = req.body;
  if (star && name && comment && postedBy) {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        $push: { ratings: { star, name, comment, postedBy } },
      },
      {
        new: true,
      }
    );
    res.status(201).json(product);
  }
  else{
    res.status(400);
    throw new Error("Product not rated succesfully");
    }
});
export { ratingProduct,getAllproducts,getProduct,createProduct,updateProduct,deleteProduct}
