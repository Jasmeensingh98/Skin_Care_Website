import express from "express";
const router  = express.Router();

import{createBanner,getAllBanners,getRandomBanner,deleteBanner} from "../controller/banner.controller.js";

//create banner route
router.post("/",createBanner);

//get random banners 
router.get("/random",getRandomBanner);

//get all banners

router.get("/",getAllBanners);

//delete all banners

router.delete("/:id",deleteBanner);

export default router;