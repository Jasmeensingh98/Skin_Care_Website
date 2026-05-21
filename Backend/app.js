import express from  "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import multer from "multer";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import protect from "./middleware/auth.middleware.js";
import { dermatologistOnly } from "./middleware/dermatologist.middleware.js";
import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import bannerRoute from "./routes/banner.route.js";
import userRoute from "./routes/user.route.js";
import orderRoute from "./routes/order.route.js";
import paymentRoute from "./routes/payment.route.js";
import skinRoute from "./routes/skin.route.js";
import skinReportRoute from "./routes/skinReport.route.js";
import appointmentRoute from "./routes/appointment.route.js";
import {
	getMe,
} from "./controller/auth.controller.js";
import {
	createSkinReport,
	getMyReports,
	getReportById,
	getAllReportsForDerm,
	reviewReport,
} from "./controller/skinReport.controller.js";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.join(__dirname, "../Frontend/dist");
const frontendIndexPath = path.join(frontendDistPath, "index.html");

//JSON BODY
app.use(express.json());

//cookie parser
app.use(cookieParser());
//cors
const envAllowedOrigins = (process.env.CORS_ORIGIN || "")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

const allowedOrigins = [
	"http://localhost:3000",
	"http://localhost:3001",
	...envAllowedOrigins,
];

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
});

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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
if (fs.existsSync(frontendIndexPath)) {
	app.use(express.static(frontendDistPath));
}
app.use("/api/auth",authRoute);
app.use("/api/product",productRoute);
app.use("/api/banners",bannerRoute);
app.use("/api/users",userRoute);
app.use("/api/orders",orderRoute);
app.use("/api/payment",paymentRoute);
app.use("/api/skin", skinRoute);
app.use("/api/skin", skinReportRoute);
app.use("/api/appointments", appointmentRoute);

if (fs.existsSync(frontendIndexPath)) {
	app.get(/^\/(?!api).*/, (req, res) => {
		res.sendFile(frontendIndexPath);
	});
} else {
	app.get("/", (req, res) => {
		res.status(200).json({
			message: "skin_analysis API is running",
		});
	});
}

app.get("/api/auth/me", protect, getMe);
app.post("/api/skin/reports", protect, upload.single("image"), createSkinReport);
app.get("/api/skin/reports/my", protect, getMyReports);
app.get("/api/skin/reports/derm/all", protect, dermatologistOnly, getAllReportsForDerm);
app.get("/api/skin/reports/:id", protect, getReportById);
app.put("/api/skin/reports/:id/review", protect, dermatologistOnly, reviewReport);
//Error middleware
app.use(notFound);
app.use(errorHandler);
export default app;
