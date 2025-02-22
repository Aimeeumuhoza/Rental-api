import { Between, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { AppDataSource } from "../config/ormconfig";
import { Booking, BookingStatus } from "../entities/Booking";
import { Property } from "../entities/Property";

const bookingRepository = AppDataSource.getRepository(Booking);
const propertyRepository = AppDataSource.getRepository(Property);

export class BookingService {
  // static async createBooking(bookingData: {
  //   propertyId: string;
  //   renterId: string;
  //   checkInDate: Date;
  //   checkOutDate: Date;
  // }) {
  //   // Check if property exists and is available
  //   const property = await propertyRepository.findOne({
  //     where: { id: bookingData.propertyId, isAvailable: true }
  //   });

  //   if (!property) {
  //     throw new Error("Property not found or unavailable");
  //   }

  //   // Check for double booking
  //   const existingBooking = await bookingRepository.findOne({
  //     where: {
  //       propertyId: bookingData.propertyId,
  //       status: BookingStatus.CONFIRMED,
  //       checkInDate: LessThanOrEqual(bookingData.checkOutDate),
  //       checkOutDate: MoreThanOrEqual(bookingData.checkInDate)
  //     }
  //   });
  //   console.log("existingBooking",existingBooking)

  //   if (existingBooking) {
  //     throw new Error("Property is already booked for these dates");
  //   }

  //   const booking = bookingRepository.create(bookingData);
  //   return await bookingRepository.save(booking);
  // }

  static async createBooking(bookingData: {
    propertyId: string;
    renterId: string;
    checkInDate: Date;
    checkOutDate: Date;
  }) {
    // Check if property exists and is available
    const property = await propertyRepository.findOne({
      where: { id: bookingData.propertyId, isAvailable: true },
    });

    if (!property) {
      throw new Error("Property not found or unavailable");
    }

    // Check for existing confirmed bookings within the requested date range
    const existingBooking = await bookingRepository.findOne({
      where: {
        propertyId: bookingData.propertyId,
        status: BookingStatus.CONFIRMED,
        checkInDate: LessThanOrEqual(bookingData.checkOutDate),
        checkOutDate: MoreThanOrEqual(bookingData.checkInDate),
      },
    });

    if (existingBooking) {
      // Find the next available check-in date
      const nextAvailableBooking = await bookingRepository.findOne({
        where: {
          propertyId: bookingData.propertyId,
          status: BookingStatus.CONFIRMED ,
          checkInDate: MoreThanOrEqual(existingBooking.checkOutDate as Date), // Find the next check-in date
        },
        order: { checkInDate: "ASC" },
      });

      let suggestedCheckIn = nextAvailableBooking
        ? new Date(nextAvailableBooking.checkOutDate!)
        : null;

      throw new Error(
        `Property is already booked for these dates. ${
          suggestedCheckIn
            ? `Next available check-in date is ${suggestedCheckIn.toDateString()}.`
            : "Please choose different dates."
        }`
      );
    }

    // Create the booking
    const booking = bookingRepository.create(bookingData);
    return await bookingRepository.save(booking);
  }

  static async confirmBooking(bookingId: string, hostId: string) {
    return await this.updateBookingStatus(bookingId, BookingStatus.CONFIRMED, hostId);
  }

  static async cancelBooking(bookingId: string, hostId: string) {
    return await this.updateBookingStatus(bookingId, BookingStatus.CANCELED, hostId);
  }

  private static async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
    hostId: string
  ) {
    const booking = await bookingRepository.findOne({
      where: { id: bookingId },
      relations: ["property", "property.host"],
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (!booking.property || booking.property.host?.id !== hostId) {
      throw new Error("Unauthorized to update this booking");
    }

    booking.status = status;
    return await bookingRepository.save(booking);
  }
  

  static async getBookingsByRenter(renterId: string) {
    return await bookingRepository.find({
      where: { renterId },
      relations: ["property"],
      order: { createdAt: "DESC" }
    });
  }

  static async getBookingsByProperty(propertyId: string, host: string) {
    const property = await propertyRepository.findOne({
      where: { id: propertyId, host: { id: host } }
    });

    if (!property) {
      throw new Error("Property not found or unauthorized");
    }

    return await bookingRepository.find({
      where: { propertyId },
      relations: ["renter"],
      order: { createdAt: "DESC" }
    });
  }

  static async getBookingById(bookingId: string, userId: string) {
    const booking = await bookingRepository.findOne({
      where: { id: bookingId },
      relations: ["property", "renter"]
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.renterId !== userId && booking.property?.host?.id !== userId) {
      throw new Error("Unauthorized to view this booking");
    }

    return booking;
  }

  static async getAllBookings() {
    return await bookingRepository.find({
      order: { createdAt: "DESC" },
      relations: ["property", "renter"]
    });
  }
}