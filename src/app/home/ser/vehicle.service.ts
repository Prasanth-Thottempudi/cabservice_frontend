import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vehicle } from '../models/vehicle';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private readonly vehicles: Vehicle[] = [
    {
      id: 1,
      name: 'Sedan Classic',
      image: 'assets/images/dezire.avif',
      capacity: 4,
      baseFare: 299,
      pricePerKm: 15,
      waitingCharge: 50,
      nightCharge: 80,
      airportCharge: 120,
    },
    {
      id: 2,
      name: 'Premium SUV',
      image: 'assets/images/dezire.avif',
      capacity: 6,
      baseFare: 399,
      pricePerKm: 20,
      waitingCharge: 60,
      nightCharge: 100,
      airportCharge: 150,
    },
    {
      id: 3,
      name: 'Luxury Sedan',
      image: 'assets/images/dezire.avif',
      capacity: 4,
      baseFare: 499,
      pricePerKm: 25,
      waitingCharge: 80,
      nightCharge: 120,
      airportCharge: 200,
    },
  ];

  getVehicles(): Observable<Vehicle[]> {
    return of(this.vehicles);
  }
}
