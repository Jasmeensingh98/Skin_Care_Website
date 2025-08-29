import express from "express";
import dotenv from "dotenv";
import dbConnection from "./utils/db.js";
import cron from "node-cron";
import sendWelcomeEmail from "./EmailServices/sendWelcomeEmail.js";
import sendPendingOrderEmail from "./EmailServices/sendPendingOrderEmail.js";
import sendDeliveredOrderEmail from "./EmailServices/sendDeliveredOrderEmail.js";
import sendPromotionEmail from "./EmailServices/sendPromotionemail.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

const services = () => {
  cron.schedule("* * * * *", () => { // every minute instead of every second
    sendWelcomeEmail();
    sendPendingOrderEmail();
    sendDeliveredOrderEmail();
  });
};
const promotion = () => {
  cron.schedule("30 5 * * 5", () => { // every minute instead of every second
   //sending promotion email 
   sendPromotionEmail();
  });
};

services();
promotion();
const startServer = async () => {
  try {
    await dbConnection(); // connect first
    console.log(" Database connected");

    services(); // then start cron jobs

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(" Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
