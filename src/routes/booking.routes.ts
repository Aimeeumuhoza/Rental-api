import express from "express";
import { BookingController } from "../controllers/booking.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = express.Router();

// router.use(authenticateJWT);

// Renter routes
router.post("/", authenticateJWT, BookingController.createBooking);
router.get("/renter",authenticateJWT, BookingController.getRenterBookings);
router.get("/all",BookingController.getAllBooking)

// Host routes
router.get("/property/:propertyId", BookingController.getPropertyBookings);
// router.put("/:id/status", BookingController.updateBookingStatus);
router.put("/:id/cancel",authenticateJWT, BookingController.cancelBooking);
router.put("/:id/confirm",authenticateJWT, BookingController.confirmBooking);

router.get("/:id", BookingController.getBookingById);


export default router;
