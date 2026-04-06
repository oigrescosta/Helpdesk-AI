import express from "express";
import cors from "cors";
import { ticketRoutes } from "./routes/tickets";
import { healthRoutes } from "./routes/health";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/tickets", ticketRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
