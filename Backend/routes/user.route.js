import express from "express";
const router  = express.Router();
import {getAllUsers,getUser,deleteUser,updateUser} from "../controller/user.controller.js";

//get all users routes 

router.get("/",getAllUsers);
//delete users route
router.delete("/:id",deleteUser);

//UPDATE USER route

router.put("/:id",updateUser);

//get one user route
router.get("/find:userId",getUser);

export default router;