import express from  "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import bannerRoute from "./routes/banner.route.js";
import userRoute from "./routes/user.route.js";
import orderRoute from "./routes/order.route.js";
import paymentRoute from "./routes/payment.route.js";
import skinRoute from "./routes/skin.route.js";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//JSON BODY
app.use(express.json());

//cookie parser
app.use(cookieParser());
//cors
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

app.use(cors({
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			return callback(null, true);
		}
		return callback(new Error("Not allowed by CORS"));
	},
	credentials: true,
}));

//routes
app.use("/productsimages", express.static(path.join(__dirname, "Productsimages")));
app.use("/api/auth",authRoute);
app.use("/api/product",productRoute);
app.use("/api/banners",bannerRoute);
app.use("/api/users",userRoute);
app.use("/api/orders",orderRoute);
app.use("/api/payment",paymentRoute);
app.use("/api/skin", skinRoute);
//Error middleware
app.use(notFound);
app.use(errorHandler);
export default app;
