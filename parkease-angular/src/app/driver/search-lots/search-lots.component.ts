import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-lots',
  standalone: true,
  imports: [FormsModule, NgIf, MatIconModule],
  templateUrl: './search-lots.component.html'
})
export class SearchLotsComponent {
  lat: number | null = null;
  lng: number | null = null;
  radius: number = 5;
  locationError = '';
  locating = false;

  constructor(private router: Router) {}

  useMyLocation() {
    this.locating = true;
    this.locationError = '';

    if (!navigator.geolocation) {
      this.locationError = 'Geolocation not supported in this browser.';
      this.locating = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.lat = pos.coords.latitude;
        this.lng = pos.coords.longitude;
        this.locating = false;
      },
      () => {
        this.locationError = 'Could not get location. Please enter manually.';
        this.locating = false;
      }
    );
  }

  onSearch() {
    if (!this.lat || !this.lng) return;
    this.router.navigate(['/driver/nearby-lots'], {
      queryParams: { lat: this.lat, lng: this.lng, radius: this.radius }
    });
  }
}
