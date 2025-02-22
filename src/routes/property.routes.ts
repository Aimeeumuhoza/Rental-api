// src/routes/property.routes.ts
import express from "express";
import { PropertyController } from "../controllers/property.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import uploadImage from "../helper/uplaodImage";

const router = express.Router();

// Public routes
router.get("/", PropertyController.getAllProperties);
router.get("/:id", PropertyController.getPropertyById);

// Protected routes (require authentication)
// router.use("/", authenticateJWT);
router.post("/", authenticateJWT ,uploadImage.single("imageUrl"),PropertyController.createProperty);
router.put("/:id", PropertyController.updateProperty);
router.delete("/:id", PropertyController.deleteProperty);
router.get("/host/properties", PropertyController.getHostProperties);
router.get("/rent",authenticateJWT,PropertyController.getPropertiesByRent)

export default router;