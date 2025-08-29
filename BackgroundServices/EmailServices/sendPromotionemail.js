import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMail.js";
import Product from "../models/product.model.js";
import user from "../models/user.model.js";
dotenv.config();

const sendPromotionEmail = async()=>{
const users = await User.find();
const products = await Product.aggregate([
    {$sample : {size:5}}
])
  for(let user of users){
   
    ejs.renderFile(
        "templates/promotion.ejs",
        {
         products
        },
       async (err, data) => {
          let messageoptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Your weekely products.",
            html: data,
          };
          try {
            await sendMail(messageoptions);
              //await order.findByIdAndUpdate(order._id, { $set: { status: 1 } });
          } catch (error) {
            console.log(error);
          }
        }
      );
  }
}
export default sendPromotionEmail;
