import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

function createTransporter(config) {
  return nodemailer.createTransport(config);
}


let configurations = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use TLS
  requireTLS: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD, // ✅ correct key
  },
};

const sendMail = async (messageoption) => {
  try {
    const transporter = createTransporter(configurations);

    await transporter.verify();
    console.log("SMTP server is ready to take messages");

    await transporter.sendMail(messageoption);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendMail;
