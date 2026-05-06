import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BookingService } from '../../core/services/booking.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { Booking } from '../../shared/models/booking.model';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, SlicePipe, RouterLink, MatIconModule],
  templateUrl: './driver-dashboard.component.html'
})
export class DriverDashboardComponent implements OnInit {
  bookings: Booking[] = [];
  unreadCount = 0;
  displayName = '';
  loading = true;
  error = '';

  quickLinks = [
    { icon: 'manage_search',    title: 'Find Parking',  desc: 'Search nearby lots',          route: '/driver/search-lots' },
    { icon: 'document_scanner', title: 'My Bookings',   desc: 'View and manage bookings',    route: '/driver/my-bookings' },
    { icon: 'directions_car',   title: 'My Vehicles',   desc: 'Manage your vehicles',        route: '/driver/my-vehicles' },
    { icon: 'add_card',         title: 'Payments',      desc: 'View payment history',        route: '/driver/payments' }
  ];

  constructor(
    private bookingService: BookingService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.displayName = this.authService.getFullName() || this.authService.getEmail() || '';
    this.loadData();

    this.notificationService.getUnreadCount(this.authService.getUserId()).subscribe({
      next: res => this.unreadCount = res.unreadCount,
      error: () => {}
    });
  }

  loadData() {
    this.loading = true;
    this.error = '';
    const userId = this.authService.getUserId();
    this.bookingService.getMyBookings(userId).subscribe({
      next: (data) => {
        this.bookings = data.sort((a, b) => {
          const timeDiff = new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
          return timeDiff !== 0 ? timeDiff : (b.bookingId ?? 0) - (a.bookingId ?? 0);
        });
        this.loading = false;
      },
      error: () => { this.error = 'Failed to load. Please try again.'; this.loading = false; }
    });
  }

  get totalBookings()     { return this.bookings.length; }
  get activeBookings()    { return this.bookings.filter(b => b.status === 'RESERVED' || b.status === 'ACTIVE').length; }
  get completedBookings() { return this.bookings.filter(b => b.status === 'COMPLETED').length; }
}
