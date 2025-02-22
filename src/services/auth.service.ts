import { AppDataSource } from "../config/ormconfig";
import { User, UserRole } from "../entities/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userRepository = AppDataSource.getRepository(User);

export class AuthService {
  static async findUserById(id: string) {
    return await userRepository.findOne({ where: { id } });
  }

  static async findOrCreateGoogleUser(profile: any) {
    try {
      let user = await userRepository.findOne({ 
        where: { 
          email: profile.emails?.[0]?.value 
        }
      });

      if (!user) {
        user = userRepository.create({
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          googleId: profile.id,
          role: UserRole.RENTER // Default role
        });

        await userRepository.save(user);
      }

      return user;
    } catch (error) {
      throw new Error(`Error in findOrCreateGoogleUser: ${error}`);
    }
  }

  static generateToken(user: User) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role 
      }, 
      process.env.JWT_SECRET!, 
      { expiresIn: "1h" }
    );
  }
}
