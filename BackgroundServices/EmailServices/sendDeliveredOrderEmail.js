import dotenv from "dotenv";
import ejs from "ejs";
import sendMail from "../helpers/sendMail.js";
import Order from "../models/order.model.js";

dotenv.config();

const sendDeliveredOrderEmail = async () => {
  const orders = await Order.find({ status: 2 });
  if (!orders || orders.length === 0) return;

  for (const order of orders) {
    try {
      const data = await new Promise((resolve, reject) => {
        ejs.renderFile(
          "templates/deliveveredorder.ejs",
          { name: order.name, products: order.products },
          (err, str) => (err ? reject(err) : resolve(str))
        );
      });

      const messageoptions = {
        from: process.env.EMAIL,
        to: order.email,
        subject: "Your Order has been delivered.",
        html: data,
      };

      await sendMail(messageoptions);
      await Order.findByIdAndUpdate(order._id, { $set: { status: 3 } });
    } catch (error) {
      console.error("sendDeliveredOrderEmail error:", error);
    }
  }
};

export default sendDeliveredOrderEmail;