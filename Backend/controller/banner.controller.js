import Banner from "../models/banner.model.js";
import asyncHandler from "express-async-handler";


//create banner

const createBanner = asyncHandler(async(req,res)=>{
    const banner = new Banner(req.body);
    const savedBanner = await banner.save();

    if(!savedBanner){
        res.status(400);
            throw new Error("Banner was not created");
        
    }
    else{
            res.status(200).json(savedBanner);
        }
});

//delete banner

const deleteBanner = asyncHandler(async(req,res)=>{
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if(!banner){
        res.status(400);
     throw new Error("banner was not deleted ");
    }
    else{
      res.status(201).json("banner was deleted successfully");
    }
});


//get a banner's

const getAllBanners = asyncHandler(async(req,res)=>{
    const banners = await Banner.find();
    if(!banners){
        res.status(400);
        throw new Error("banner were not fetched");
    }
    else{
        res.status(200).json(banners);
    }
});

//get random banner or random banner 
const getRandomBanner = asyncHandler(async(req,res)=>{
    const banners = await Banner.find();
    if(!banners){
        res.status(400);
        throw new Error("banner were not fetched");
    }
    else{
        const randomIndex = Math.floor(Math.random()* banners.length);
        const randomBanner = banners[randomIndex];     
        res.status(200).json(randomBanner);
    }
});

export {getAllBanners,createBanner,deleteBanner,getRandomBanner};