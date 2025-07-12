import express from  "express";
import cors from "cors";
const app = express();

//JSON BODY
app.use(express.json());

//cors
app.use(cors());

export default app;
