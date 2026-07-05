import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

interface OsrmResponse {
  code: string;
  routes: Array<{ distance: number; duration: number }>;
}

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private readonly osrmBaseUrl = 'https://router.project-osrm.org';

  constructor(private http: HttpClient) {}

  calculateRoute(
    pickupLongitude: number,
    pickupLatitude: number,
    destinationLongitude: number,
    destinationLatitude: number,
  ): Observable<{ distance: number; duration: number }> {
    const coordinates = `${pickupLongitude},${pickupLatitude};${destinationLongitude},${destinationLatitude}`;
    const url = `${this.osrmBaseUrl}/route/v1/driving/${coordinates}?overview=false&alternatives=false`;

    return this.http.get<OsrmResponse>(url).pipe(
      map((response) => {
        if (response.code !== 'Ok' || !response.routes?.length) {
          throw new Error('Route calculation failed');
        }

        return {
          distance: response.routes[0].distance,
          duration: response.routes[0].duration,
        };
      }),
    );
  }
}
