import "./config/db.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import productSaleRoutes from "./routes/productSale.js";
import expenseRoutes from "./routes/expense.js";
import rewardRoutes from "./routes/rewards.js";

const app = express();

// const allowedOrigins = ["http://localhost:9000", "https://www.zybizobazar.com"];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Origen no permitido por CORS"));
//     }
//   },
// };

app.use(cors({ origin: "*" }));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/productSale", productSaleRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/rewards", rewardRoutes);

app.get("/", (req, res) => {
  res.send("API zybizo");
});

app.use((err, req, res, next) => {
  console.error(err.stack || err);

  const statusCode = err.statusCode || 500;
  let message = err.message;

  if (process.env.NODE_ENV === "production" && !err.statusCode) {
    message = "Ocurrió un error en el servidor";
  }

  res.status(statusCode).json({ result: "error", message: message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
