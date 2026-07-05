import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

import { Location } from '../models/location';

interface PhotonFeature {
  properties: {
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface PhotonResponse {
  features: PhotonFeature[];
}

interface NominatimResponse {
  lat: string;

  lon: string;

  display_name: string;

  address: {
    village?: string;

    town?: string;

    city?: string;

    suburb?: string;

    county?: string;

    state_district?: string;

    state?: string;

    postcode?: string;

    country?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly photonUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) {}

  searchLocations(query: string): Observable<Location[]> {
    const url = `${this.photonUrl}?q=${encodeURIComponent(query)}&format=jsonv2&addressdetails=1&countrycodes=in&limit=8`;

    return this.http.get<NominatimResponse[]>(url).pipe(
      map((results) =>
        results.map((item) => {
          const placeName =
            item.address.village ||
            item.address.town ||
            item.address.city ||
            item.address.suburb ||
            item.display_name.split(',')[0];

          const address = [
            placeName,

            item.address.county,

            item.address.state_district,

            item.address.state,

            item.address.postcode,

            item.address.country,
          ]
            .filter(Boolean)
            .filter((v, i, a) => a.indexOf(v) == i)
            .join(', ');

          return {
            placeName,

            address,

            latitude: Number(item.lat),

            longitude: Number(item.lon),
          };
        }),
      ),
    );
  }
}
