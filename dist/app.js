import express from "express";
// importing routes
import userRoutes from "./routes/user.js";
import { connectDB } from "./utils/features.js";
const app = express();
const port = 3000;
connectDB();
// using routers
app.use("/api/v1/user", userRoutes);
app.get("/", (req, res) => {
    res.send("working");
});
app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});
