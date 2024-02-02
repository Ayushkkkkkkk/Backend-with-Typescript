import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { getAdminProducts, getAllCategories, getLatestProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, getAllProducts, } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
app.post("/new", adminOnly, singleUpload, newProduct);
app.get("/latest", getLatestProducts);
app.get("/categories", getAllCategories);
app.get("/all", getAllProducts);
app.get("/admin-products", getAdminProducts);
app
    .route("/:id")
    .get(getSingleProduct)
    .put(adminOnly, singleUpload, updateProduct)
    .delete(adminOnly, deleteProduct);
export default app;
