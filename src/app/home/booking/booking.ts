import {
  Component,
  OnInit,
  AfterViewInit,
  inject,
  PLATFORM_ID
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Vehicle } from '../models/vehicle';
import { BookingService } from '../ser/booking.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit, AfterViewInit {
  private platformId = inject(PLATFORM_ID);

  private L: any;

  private map: any;

  private pickupMarker: any;

  private destinationMarker: any;

  pickup = '';

  destination = '';

  

  tripType = 'ONE_WAY';

  travelDate = '';

  travelTime = '';

  passengers = 1;

  vehicles: Vehicle[] = [];

  selectedVehicle!: Vehicle;

  distance = 0;

  duration = 0;

  baseFare = 0;

  estimatedFare = 0;

  loading = false;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.L = await import('leaflet');

    setTimeout(() => {
      this.initializeMap();

      this.loadDemoLocations();
    });
  }

  // =============================
  // MAP
  // =============================

  private initializeMap(): void {
    const icon = this.L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

      iconSize: [25, 41],

      iconAnchor: [12, 41],
    });

    this.L.Marker.prototype.options.icon = icon;

    this.map = this.L.map('bookingMap', {
      zoomControl: true,
    }).setView([17.385044, 78.486671], 11);

    this.L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

      {
        maxZoom: 19,

        attribution: '&copy; OpenStreetMap',
      },
    ).addTo(this.map);
  }

  loadDemoLocations(): void {
    this.setPickupMarker(
      17.4435,

      78.3772,
    );

    this.setDestinationMarker(
      17.2403,

      78.4294,
    );
  }

  setPickupMarker(lat: number, lng: number): void {
    if (this.pickupMarker) {
      this.map.removeLayer(this.pickupMarker);
    }

    this.pickupMarker = this.L.marker([lat, lng])

      .addTo(this.map)

      .bindPopup('Pickup')

      .openPopup();

    this.fitMap();
  }

  setDestinationMarker(lat: number, lng: number): void {
    if (this.destinationMarker) {
      this.map.removeLayer(this.destinationMarker);
    }

    this.destinationMarker = this.L.marker([lat, lng])

      .addTo(this.map)

      .bindPopup('Destination');

    this.fitMap();
  }

  private fitMap(): void {
    if (!this.pickupMarker || !this.destinationMarker) {
      return;
    }

    const group = this.L.featureGroup([this.pickupMarker, this.destinationMarker]);

    this.map.fitBounds(group.getBounds().pad(0.3));
  }
  // =============================
  // VEHICLES
  // =============================

  loadVehicles(): void {
    this.bookingService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;

        if (vehicles.length > 0) {
          this.selectVehicle(vehicles[0]);
        }
      },

      error: (error) => {
        console.error('Failed to load vehicles', error);
      },
    });
  }

  selectVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;

    this.calculateFare();
  }

  // =============================
  // FARE CALCULATION
  // =============================

  calculateFare(): void {
    if (!this.selectedVehicle) {
      return;
    }

    /*
      Temporary values.

      Next step:
      Distance & Duration will come
      from OSRM Route API.
    */

    this.distance = 28;

    this.duration = 42;

    this.baseFare = this.selectedVehicle.baseFare;

    this.estimatedFare =
      this.selectedVehicle.baseFare + this.distance * this.selectedVehicle.pricePerKm;
  }

  // =============================
  // PASSENGERS
  // =============================

  increasePassengers(): void {
    if (this.passengers < 8) {
      this.passengers++;
    }
  }

  decreasePassengers(): void {
    if (this.passengers > 1) {
      this.passengers--;
    }
  }

  // =============================
  // BOOKING
  // =============================

  bookRide(): void {
    if (!this.pickup.trim()) {
      alert('Please enter pickup location.');

      return;
    }

    if (!this.destination.trim()) {
      alert('Please enter destination.');

      return;
    }

    if (!this.selectedVehicle) {
      alert('Please select a vehicle.');

      return;
    }

    const bookingRequest = {
      pickup: this.pickup,

      destination: this.destination,

      tripType: this.tripType,

      travelDate: this.travelDate,

      travelTime: this.travelTime,

      passengers: this.passengers,

      vehicleId: this.selectedVehicle.id,

      vehicleName: this.selectedVehicle.name,

      estimatedFare: this.estimatedFare,

      distance: this.distance,

      duration: this.duration,
    };

    console.log('Booking Request');

    console.table(bookingRequest);

    alert('Booking request submitted successfully.');
  }
}