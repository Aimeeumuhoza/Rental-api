import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "./config/passport";
import authRoutes from "./routes/auth.routes";
import { AppDataSource } from "./config/ormconfig";
import dotenv from "dotenv";
import propertyRoutes from "./routes/property.routes";
import bookingRoutes from "./routes/booking.routes";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
// Database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
  });