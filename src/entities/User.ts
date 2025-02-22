import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    OneToMany 
  } from "typeorm";  
  import { Booking } from "./Booking";  
//   import { UserRole } from "../enums/UserRole";  // Ensure this is correctly imported
  
  export enum UserRole {
    RENTER = 'RENTER',
    OWNER = 'OWNER',
    HOST = "HOST"
  }
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string | undefined;
  
    @Column({ type: "varchar", unique: true })
    email!: string;
  
    @Column({ type: "varchar" })
    name: string | undefined;
  
    @Column({
      type: "enum",
      enum: UserRole,
      default: UserRole.RENTER,
    })
    role: UserRole | undefined;
  
    @Column({ nullable: true, unique: true })
    googleId?: string;
  
    @CreateDateColumn()
    createdAt: Date | undefined;
  
    @OneToMany(() => Booking, (booking) => booking.renter)
    bookings: Booking[] | undefined;
  }
  