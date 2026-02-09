import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

// update user

const updateUser = asyncHandler(async (req, res) => {
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  if (!updatedUser) {
    res.status(400);
    throw new Error("user was not updated");
  } else {
    res.status(201).json(updatedUser);
  }
});

// delete user

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(400);
    throw new Error("User was not deleted successfully");
  } else {
    res.status(201).json("User was deleted Successfully");
  }
});

//get one user

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(400);
    throw new Error("user was not found");
  } else {
    res.status(200).json(user);
  }
});

//get all users  

const getAllUsers = asyncHandler(async(req,res)=>{
    const users = await User.find();
    if(!users){
        res.status(400);
        throw new Error("Users not fetche ");
    }
    else{
        res.status(200).json(users);
    }
});

export {getAllUsers,getUser,deleteUser,updateUser}
