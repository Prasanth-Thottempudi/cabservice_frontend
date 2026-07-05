import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Vehicle } from '../models/vehicle';


@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/vehicles`);
  }
}
