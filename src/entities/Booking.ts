import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate
} from "typeorm";
import { Property } from "./Property";
import { User } from "./User";

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELED = "canceled"
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id: string | undefined;

  @Column()
  propertyId: string | undefined;
  @Column()
  renterId: string | undefined;

  @Column("date")
  checkInDate: Date | undefined;

  @Column("date")
  checkOutDate: Date | undefined;

  @Column({
    type: "enum",
    enum: BookingStatus,
    default: BookingStatus.PENDING
  })
  status: BookingStatus | undefined;

  @Column('date',{ default: () => 'CURRENT_DATE' })
  createdAt: Date | undefined;

  @Column('date',{ default: () => 'CURRENT_DATE' })
  updatedAt: Date | undefined;

  @ManyToOne(() => Property, property => property.bookings)
  property: Property | undefined;

  @ManyToOne(() => User, user => user.bookings)
  renter: User | undefined;

  @BeforeInsert()
  @BeforeUpdate()
  validateDates() {
    if (!this.checkInDate || !this.checkOutDate || this.checkInDate >= this.checkOutDate) {
      throw new Error("Check-out date must be after check-in date");
    }
  }
}