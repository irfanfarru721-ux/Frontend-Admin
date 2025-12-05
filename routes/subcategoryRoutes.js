import express from "express";
import {
  createSubcategory,
  getSubcategories,
  getSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../controllers/subcategoryController.js";

const router = express.Router();

// Public routes
router.get("/", getSubcategories);           // GET all
router.get("/:id", getSubcategory);         // GET one

// Admin routes (protected with middleware if needed)
router.post("/", createSubcategory);        // CREATE
router.put("/:id", updateSubcategory);      // UPDATE
router.delete("/:id", deleteSubcategory);   // DELETE

export default router;
