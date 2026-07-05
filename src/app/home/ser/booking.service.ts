import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BookingRequest } from '../models/booking-request';
import { BookingResponse } from '../models/booking-response';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  bookRide(request: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.baseUrl}/bookings`, request);
  }
}
