import { Request, Response } from "express";
import { PropertyService } from "../services/property.service";
import { UserRole } from "../entities/User";
import cloudinary from "../helper/cloudinaryUpload";

export class PropertyController {
  static async createProperty(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }
      const result = await cloudinary.uploader.upload(req.file?.path ?? "")
     
      if (user.role !== UserRole.HOST) {
        res.status(403).json({ message: "Only hosts can create properties"});
        return;
      }
      const propertyData = {
        ...req.body,
        imageUrl:result.secure_url,
      };

      const property = await PropertyService.createProperty(propertyData, user.id);
      res.status(201).json(property);
    } catch (error) {
      console.log("error",error)
      // res.status(400).json({ message: (error as Error).message });
    }
  }

  static async updateProperty(req: Request, res: Response) : Promise<void> {
    try {
      const user = req.user as any;
      const { id } = req.params;

      if (user.role !== UserRole.HOST) {
        res.status(403).json({ message: "Only hosts can update properties" });
        return;
      }

      const property = await PropertyService.updateProperty(id, req.body, user.id);
      res.json(property);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async deleteProperty(req: Request, res: Response) : Promise<void> {
    try {
      const user = req.user as any;
      const { id } = req.params;

      if (user.role !== UserRole.HOST) {
        res.status(403).json({ message: "Only hosts can delete properties" });
        return;
      }

      await PropertyService.deleteProperty(id, user.id);
      res.json({ message: "Property deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async getAllProperties(req: Request, res: Response) {
    try {
      const properties = await PropertyService.getAllProperties();
      res.json(properties);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async getPropertyById(req: Request, res: Response) : Promise<void> {
    try {
      const { id } = req.params;
      const property = await PropertyService.getPropertyById(id);
      
      if (!property) {
        res.status(404).json({ message: "Property not found" });
        return;
      }
      
      res.json(property);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async getHostProperties(req: Request, res: Response) : Promise<void> {
    try {
      const user = req.user as any;
      
      if (user.role !== UserRole.HOST) {
        res.status(403).json({ message: "Access denied" });
        return;
      }

      const properties = await PropertyService.getPropertiesByHost(user.id);
      res.json(properties);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async getPropertiesByRent(req: Request, res: Response) : Promise<void> {
    try {
      const user = req.user as any;
      const properties = await PropertyService.getPropertiesByRentId(user.id);
      res.json(properties);
    } catch (error) {
      console.log("e",error)
      res.status(400).json({ message: (error as Error).message });
    }
  }
  
}

