import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { UserRole } from "../entities/User";
import { BookingStatus } from "../entities/Booking";

export class BookingController {
  static async createBooking(req: Request, res: Response) : Promise<void> {
    try {
      const user = req.user as any;
      
      if (user.role !== UserRole.RENTER) {
        res.status(403).json({ message: "Access denied" });
        return;
      }

      const booking = await BookingService.createBooking({
        ...req.body,
        renterId: user.id
      });
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  // static async updateBookingStatus(req: Request, res: Response) : Promise<void> {
  //   try {
  //     const user = req.user as any;
  //     const { id } = req.params;
  //     const { status } = req.body;

  //     if (user.role !== UserRole.HOST) {
  //       res.status(403).json({ message: "Only hosts can update booking status" });
  //       return;
  //     }

  //     if (!Object.values(BookingStatus).includes(status)) {
  //       res.status(400).json({ message: "Invalid booking status" });
  //     }

  //     const booking = await BookingService.updateBookingStatus(id, status, user.id);
  //     res.json(booking);
  //   } catch (error) {
  //     res.status(400).json({ message: (error as Error).message });
  //   }
  // }

  static async confirmBooking(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
      const { id } = req.params;

      if (user.role !== UserRole.HOST) {
        res.status(403).json({ message: "Only hosts can confirm bookings" });
        return;
      }

      const updatedBooking = await BookingService.confirmBooking(id, user.id);
      res.status(200).json(updatedBooking);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async cancelBooking(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
      const { id } = req.params;

      if (user.role !== UserRole.HOST) {
        res.status(403).json({ message: "Only hosts can cancel bookings" });
        return;
      }

      const updatedBooking = await BookingService.cancelBooking(id, user.id);
      res.status(200).json(updatedBooking);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  

  static async getRenterBookings(req: Request, res: Response) : Promise<void> {
    try {
      const user = req.user as any;
      // if (user.role !== UserRole.RENTER) {
      //   res.status(403).json({ message: "Access denied" });
      //   return;
      // }
      const bookings = await BookingService.getBookingsByRenter(user.id);
      res.json(bookings);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async getPropertyBookings(req: Request, res: Response) : Promise<void> {
    try {
      const user = req.user as any;
      const { propertyId } = req.params;

      if (user.role !== UserRole.HOST) {
        res.status(403).json({ message: "Access denied" });
      }

      const bookings = await BookingService.getBookingsByProperty(propertyId, user.id);
      res.json(bookings);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async getBookingById(req: Request, res: Response) : Promise<void> {
    try {
      const user = req.user as any;
      const { id } = req.params;

      const booking = await BookingService.getBookingById(id, user.id);
      res.json(booking);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

   static async getAllBooking(req: Request, res: Response) {
      try {
        const bookings = await BookingService.getAllBookings();
        res.json(bookings);
      } catch (error) {
        console.log("err",error)
        // res.status(400).json({ message: (error as Error).message });
      }
    }
}