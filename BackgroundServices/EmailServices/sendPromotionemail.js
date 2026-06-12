import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMail.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
dotenv.config();

const sendPromotionEmail = async () => {
  const users = await User.find();
  const products = await Product.aggregate([{ $sample: { size: 5 } }]);

  for (const user of users) {
    try {
      const data = await new Promise((resolve, reject) => {
        ejs.renderFile(
          "templates/promotion.ejs",
          { products },
          (err, str) => (err ? reject(err) : resolve(str))
        );
      });

      const messageoptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Your weekly products.",
        html: data,
      };

      await sendMail(messageoptions);
    } catch (error) {
      console.error("sendPromotionEmail error:", error);
    }
  }
};

export default sendPromotionEmail;
