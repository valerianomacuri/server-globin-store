import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import data from "./products.json" assert { type: "json" };
import { createConnection, getConnection } from "./db.js";
createConnection();
const app = express();

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 4000;

app.get("/products", (req, res) => {
  return res.json(data);
});

app.post("/checkout", async (req, res) => {
  const db = getConnection();
  const newOrder = req.body;
  await db.read();
  db.data.orders.push(newOrder);
  const orderId = db.data.orders.length - 1;
  await db.write();
  res.json({ success: true, orderId });
});

app.get("/order/:orderId", async (req, res) => {
  const db = getConnection();
  const { orderId } = req.params;
  await db.read();
  const order = db.data.orders[Number(orderId)];
  await db.write();

  if (order) {
    return res.json({
      success: true,
      products: order.products,
    });
  } else {
    return res.json({
      success: false,
    });
  }
});

app.listen(port, () =>
  console.log(`Goblin store backend running on http://localhost:${port}!`)
);
