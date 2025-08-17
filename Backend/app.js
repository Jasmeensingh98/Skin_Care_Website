import express from  "express";
import cors from "cors";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import bannerRoute from "./routes/banner.route.js";
import userRoute from "./routes/user.route.js";
import orderRoute from "./routes/order.route.js";
const app = express();

//JSON BODY
app.use(express.json());

//cookie parser
app.use(cookieParser());
//routes

app.use("/api/auth",authRoute);
app.use("/api/product",productRoute);
app.use("/api/banners",bannerRoute);
app.use("/api/users",userRoute);
app.use("/api/orders",orderRoute);
//cors
app.use(cors());
//Error middleware
app.use(notFound);
app.use(errorHandler);
export default app;
