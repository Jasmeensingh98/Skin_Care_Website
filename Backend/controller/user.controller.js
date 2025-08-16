import User from "../models/user.model.js";
import AsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

// update user

const updateUser = AsyncHandler(async (req, res) => {
  if (req.body.password) {
    const salt = await bcrypt.getSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await Useer.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  if (!updateUser) {
    res.status(400);
    throw new Error("user was not updated");
  } else {
    res.status(201).json(updateUser);
  }
});

// delete user

const deleteUser = AsyncHandler(async (req, res) => {
  const deleteUser = await User.findByIdAndDelete(req.params.id);
  if (!deleteUser) {
    res.status(400);
    throw new Error("User was not deleted successfully");
  } else {
    res.status(201).json("User was deleted Successfully");
  }
});

//get one user

const getUser = AsyncHandler(async (req, res) => {
  const user = await User.findBy(req.params.id);
  if (!user) {
    res.status(400);
    throw new Error("user was not found");
  } else {
    res.status(200).json(user);
  }
});

//get all users  

const getAllUsers = AsyncHandler(async(req,res)=>{
    const users =await  User.find();
    if(!users){
        res.status(400);
        throw new Error("Users not fetche ");
    }
    else{
        res.status(200).json(users);
    }
});

export {getAllUsers,getUser,deleteUser,updateUser}
