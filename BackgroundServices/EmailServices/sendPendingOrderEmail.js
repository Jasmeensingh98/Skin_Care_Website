import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMail.js";
import Order from "../models/order.model.js";

dotenv.config();

const sendPendingOrderEmail = async () => {
  const orders = await Order.find({ status: 0 });
  if (!orders || orders.length === 0) return;

  for (const order of orders) {
    try {
      const data = await new Promise((resolve, reject) => {
        ejs.renderFile(
          "templates/pendingorder.ejs",
          { name: order.name, products: order.products },
          (err, str) => (err ? reject(err) : resolve(str))
        );
      });

      const messageoptions = {
        from: process.env.EMAIL,
        to: order.email,
        subject: "Your Order has been placed",
        html: data,
      };

      await sendMail(messageoptions);
      await Order.findByIdAndUpdate(order._id, { $set: { status: 1 } });
    } catch (error) {
      console.error("sendPendingOrderEmail error:", error);
    }
  }
};

export default sendPendingOrderEmail;