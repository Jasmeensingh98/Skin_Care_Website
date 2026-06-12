import ejs from "ejs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import sendMail from "../helpers/sendMail.js";
import User from "../models/user.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendWelcomeEmail = async () => {
  const users = await User.find({ status: 0 });

  if (users.length > 0) {
    for (let user of users) {
      const templatePath = path.join(__dirname, "../templates/welcome.ejs");

      ejs.renderFile(templatePath, { name: user.name }, async (err, data) => {
        if (err) {
          console.log("EJS render error:", err);
          return;
        }

        let messageoptions = {
          from: process.env.EMAIL,
          to: user.email,
          subject: "Welcome to Vulpine",
          html: data,
        };

        try {
          await sendMail(messageoptions);
          await User.findByIdAndUpdate(user._id, { $set: { status: 1 } });
        } catch (error) {
          console.log(error);
        }
      });
    }
  }
};

export default sendWelcomeEmail;
