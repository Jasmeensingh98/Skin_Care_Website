import express from  "express";
import cors from "cors";
import { errorHandler, notFound } from "./middleware/error.middleware";
import cookieParser from "cookie-parser";
const app = express();

//JSON BODY
app.use(express.json());

//cookie parser
app.use(cookieParser());

//cors
app.use(cors());
//Error middleware
app.use(notFound);
app.use(errorHandler);
export default app;
