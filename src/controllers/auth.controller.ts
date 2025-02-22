import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { User } from "../entities/User";

export class AuthController {
  static async googleCallback(req: Request, res: Response) {
    try {
      if (!req.user) {
        throw new Error('Authentication failed');
      }

      const token = AuthService.generateToken(req.user as User);
      // Redirect to client with token
      res.redirect(
        `${process.env.CLIENT_URL}/auth/callback?token=${token}`
      );
    } catch (error) {
      res.redirect(`${process.env.CLIENT_URL}/auth/error`);
    }
  }
}