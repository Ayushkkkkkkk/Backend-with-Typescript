import express, { NextFunction } from "express";
import { Request, Response  } from "express";

// importing routes
import userRoutes from "./routes/user.js";
import { connectDB } from "./utils/features.js";
const app = express();
const port: number = 3000;

connectDB();
// middleware
app.use(express.json());
// using routers
app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.send("working");
});

app.use((err:Error , req:Request , res:Response , next:NextFunction)=>{
    return res.status(400).json({
        success:true,
        message:"some erroer"
    })
})

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
