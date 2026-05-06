import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ParkingLotService } from '../../core/services/parking-lot.service';
import { ParkingLot } from '../../shared/models/parking-lot.model';

@Component({
  selector: 'app-nearby-lots',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, MatIconModule],
  templateUrl: './nearby-lots.component.html'
})
export class NearbyLotsComponent implements OnInit {
  lots: ParkingLot[] = [];
  loading = true;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private lotService: ParkingLotService
  ) {}

  ngOnInit() {
    const lat    = Number(this.route.snapshot.queryParamMap.get('lat'));
    const lng    = Number(this.route.snapshot.queryParamMap.get('lng'));
    const radius = Number(this.route.snapshot.queryParamMap.get('radius') || 5);

    this.lotService.getNearbyLots(lat, lng, radius).subscribe({
      next: (data) => { this.lots = data; this.loading = false; },
      error: () => { this.errorMsg = 'Failed to fetch nearby lots.'; this.loading = false; }
    });
  }
}
