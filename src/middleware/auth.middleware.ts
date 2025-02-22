import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateJWT = (req: Request, res: Response, next: NextFunction):void => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    // console.log("token",token)
    if (!token) {
       res.status(401).json({ message: "Authentication token missing" });
       return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // console.log("req.user",req.user)
    req.user = decoded;
    next();
  } catch (error) {
     res.status(403).json({ message: "Invalid or expired token" });
     return
  }
};
