import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ParkingLotService } from '../../core/services/parking-lot.service';
import { SpotService } from '../../core/services/spot.service';
import { BookingService } from '../../core/services/booking.service';
import { PaymentService } from '../../core/services/payment.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { AuthService } from '../../core/services/auth.service';
import { ParkingLot } from '../../shared/models/parking-lot.model';
import { Spot } from '../../shared/models/spot.model';
import { Booking } from '../../shared/models/booking.model';
import { Vehicle } from '../../shared/models/vehicle.model';

@Component({
  selector: 'app-lot-detail',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, MatIconModule],
  templateUrl: './lot-detail.component.html'
})
export class LotDetailComponent implements OnInit {
  lot: ParkingLot | null = null;
  spots: Spot[] = [];
  allSpots: Spot[] = [];
  vehicles: Vehicle[] = [];
  loading = true;
  selectedSpot: Spot | null = null;
  showBookingForm = false;
  booking = { vehiclePlate: '', vehicleType: 'CAR', bookingType: 'PRE', startTime: '', endTime: '' };
  errorMsg = '';
  submitting = false;

  showPaymentForm = false;
  createdBooking: Booking | null = null;
  paymentMode = 'CARD';
  paymentSubmitting = false;
  paymentError = '';
  estimatedAmount = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lotService: ParkingLotService,
    private spotService: SpotService,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private vehicleService: VehicleService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const userId = this.authService.getUserId();

    this.lotService.getLotById(id).subscribe({
      next: (data) => { this.lot = data; this.loading = false; },
      error: () => { this.loading = false; }
    });

    this.refreshSpots(id);

    this.vehicleService.getMyVehicles(userId).subscribe({
      next: (data) => this.vehicles = data.filter(v => v.isActive !== false),
      error: () => {}
    });
  }

  refreshSpots(lotId?: number) {
    const id = lotId ?? Number(this.route.snapshot.paramMap.get('id'));
    this.spotService.getAvailableSpots(id).subscribe({
      next: (data) => this.spots = data,
      error: () => {}
    });
    this.spotService.getSpotsByLot(id).subscribe({
      next: (data) => {
        this.allSpots = data;
        // Sync lot entity counts so search results stay current
        this.lotService.syncSpotCount(id, data.length).subscribe({ error: () => {} });
      },
      error: () => {}
    });
  }

  selectVehicle(v: Vehicle) {
    this.booking.vehiclePlate = v.licensePlate;
    this.booking.vehicleType = v.vehicleType;
  }

  selectSpot(spot: Spot) {
    this.selectedSpot = spot;
    this.showBookingForm = true;
    this.showPaymentForm = false;
    this.errorMsg = '';
  }

  submitBooking() {
    if (!this.selectedSpot || !this.lot) return;
    if (!this.booking.vehiclePlate.trim()) {
      this.errorMsg = 'Please enter a vehicle plate or select a registered vehicle.';
      return;
    }
    if (!this.booking.startTime || !this.booking.endTime) {
      this.errorMsg = 'Please select start and end time.';
      return;
    }
    if (new Date(this.booking.endTime) <= new Date(this.booking.startTime)) {
      this.errorMsg = 'End time must be after start time.';
      return;
    }
    this.submitting = true;
    this.errorMsg = '';

    this.bookingService.createBooking({
      userId: this.authService.getUserId(),
      lotId: this.lot.lotId!,
      spotId: this.selectedSpot.spotId!,
      vehiclePlate: this.booking.vehiclePlate,
      vehicleType: this.booking.vehicleType,
      bookingType: this.booking.bookingType,
      startTime: this.booking.startTime,
      endTime: this.booking.endTime
    }).subscribe({
      next: (b) => {
        this.createdBooking = b;
        this.submitting = false;
        if (this.booking.bookingType === 'PRE') {
          this.estimatedAmount = this.calcAmount();
          this.showBookingForm = false;
          this.showPaymentForm = true;
        } else {
          this.router.navigate(['/driver/my-bookings']);
        }
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Booking failed. Spot may already be taken.';
        this.submitting = false;
      }
    });
  }

  submitPayment() {
    if (!this.createdBooking || !this.lot) return;
    this.paymentSubmitting = true;
    this.paymentError = '';

    const amount = this.createdBooking.totalAmount || this.estimatedAmount;
    const bookingId = this.createdBooking.bookingId!;

    this.paymentService.processPayment({
      bookingId,
      userId: this.authService.getUserId(),
      lotId: this.lot.lotId!,
      amount,
      mode: this.paymentMode
    }).subscribe({
      next: () => this.router.navigate(['/driver/my-bookings']),
      error: () => {
        // Payment failed — cancel the booking so the spot is freed
        this.bookingService.cancelBooking(bookingId).subscribe({
          next: () => {
            this.showPaymentForm = false;
            this.createdBooking = null;
            this.paymentError = '';
            this.errorMsg = 'Payment failed. Your booking has been cancelled and the spot is now free. Please try again.';
          },
          error: () => {
            this.paymentError = 'Payment failed. Please try again or cancel the booking manually from My Bookings.';
          }
        });
        this.paymentSubmitting = false;
      }
    });
  }

  cancelPayment() {
    this.router.navigate(['/driver/my-bookings']);
  }

  private calcAmount(): number {
    if (!this.selectedSpot || !this.booking.startTime || !this.booking.endTime) return 0;
    const start = new Date(this.booking.startTime).getTime();
    const end = new Date(this.booking.endTime).getTime();
    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    return hours * (this.selectedSpot.pricePerHour || 0);
  }
}
