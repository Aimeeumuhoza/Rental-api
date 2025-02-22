import express from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth.controller";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { 
    session: false,
    failureRedirect: "/auth/error" 
  }),
  AuthController.googleCallback
);

export default router;