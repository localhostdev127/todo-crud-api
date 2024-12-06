import express, { Application } from "express";
import cors from "cors";
import todoRoutes from "./routes/tode.routes";
import errorMiddleware from "./middlewares/errorMiddleware";

const app: Application = express();

const allowedOrigin = process.env.ALLOWED_ORIGIN as string;

app.use(cors({
  origin:[allowedOrigin]
}));

app.use(express.json());
app.use("/todos", todoRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });
app.use(errorMiddleware);

export default app;