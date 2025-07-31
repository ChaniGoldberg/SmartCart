import { Router } from "express";
import productByCategoryController from "../controllers/productController";

const router = Router();

// POST /products/by-category
router.post("/by-category", productByCategoryController.getProductsByCategoryAndStores);

export default router;
