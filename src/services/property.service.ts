// src/services/property.service.ts
import { AppDataSource } from "../config/ormconfig";
import { Booking } from "../entities/Booking";
import { Property } from "../entities/Property";
import { User } from "../entities/User";
import { UserRole } from "../entities/User";

const propertyRepository = AppDataSource.getRepository(Property);
const bookingRepository = AppDataSource.getRepository(Booking);


export class PropertyService {
  static async createProperty(propertyData: Partial<Property>, hostId: string) {
    const property = propertyRepository.create({
      ...propertyData,
      host: { id: hostId }
    });
    return await propertyRepository.save(property);
  }

  static async updateProperty(id: string, propertyData: Partial<Property>, hostId: string) {
    // Fixed query to use the correct property path for hostId
    const property = await propertyRepository.findOne({ 
      where: { 
        id: id,
        host: { id: hostId } // Correct way to query the relationship
      },
      relations: ['host'] // Include host relation
    });

    if (!property) {
      throw new Error("Property not found or unauthorized");
    }

    propertyRepository.merge(property, propertyData);
    return await propertyRepository.save(property);
  }

  static async deleteProperty(id: string, hostId: string) {
    // Apply the same fix to delete method
    const property = await propertyRepository.findOne({ 
      where: { 
        id: id,
        host: { id: hostId }
      },
      relations: ['host']
    });

    if (!property) {
      throw new Error("Property not found or unauthorized");
    }

    await propertyRepository.remove(property);
    return true;
  }

  static async getAllProperties() {
    return await propertyRepository.find({
      where: { isAvailable: true } as any,
      relations: ['host'],
      order: { createdAt: "DESC" }
    });
  }

  static async getPropertyById(id: string) {
    return await propertyRepository.findOne({
      where: { id },
      relations: ['host']
    });
  }

  static async getPropertiesByHost(hostId: string) {
    return await propertyRepository.find({
      where: { 
        host: { id: hostId }
      },
      relations: ['host'],
      order: { createdAt: "DESC" }
    });
  }

  static async getPropertiesByRentId(renterId: string) {
    try {
      const bookings = await bookingRepository.find({
        where: {
          renterId: renterId 
        },
        relations: ['property'],
        order: { createdAt: "DESC" }
      })

      return bookings; 
    } catch (error) {
      console.error('Error retrieving properties by renterId:', error);
      throw new Error('Failed to fetch properties');
    }
  }
  
}