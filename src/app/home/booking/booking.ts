import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { Location } from '../models/location';
import { RouteInfo } from '../models/route';
import { Vehicle } from '../models/vehicle';
import { BookingRequest } from '../models/booking-request';
import { BookingResponse } from '../models/booking-response';
import { BookingService } from '../ser/booking.service';
import { LocationService } from '../ser/location.service';
import { RouteService } from '../ser/route.service';
import { VehicleService } from '../ser/vehicle.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit, OnDestroy {
  @ViewChild('pickupContainer', { static: false }) pickupContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('destinationContainer', { static: false })
  destinationContainer?: ElementRef<HTMLDivElement>;

  pickupQuery = '';
  destinationQuery = '';

  pickupSuggestions: Location[] = [];
  destinationSuggestions: Location[] = [];

  pickupLoading = false;
  destinationLoading = false;

  showPickupSuggestions = false;
  showDestinationSuggestions = false;

  pickupActiveIndex = -1;
  destinationActiveIndex = -1;

  pickupSelected: Location | null = null;
  destinationSelected: Location | null = null;

  routeInfo: RouteInfo | null = null;
  routeError = '';

  tripType = 'ROUND_TRIP';
  travelDate = '';
  travelTime = '';
  passengers = 1;

  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;

  baseFare = 0;
  estimatedFare = 0;
  bookingLoading = false;
  bookingSuccessMessage = '';
  bookingErrorMessage = '';

  errors = {
    pickup: '',
    destination: '',
    travelDate: '',
    travelTime: '',
    passengers: '',
    vehicle: '',
    route: '',
  };
  private readonly pickupInput$ = new Subject<string>();
  private readonly destinationInput$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private locationService: LocationService,
    private routeService: RouteService,
    private vehicleService: VehicleService,
    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    this.initializeSearchStreams();
    this.loadVehicles();
  }

  private initializeSearchStreams(): void {
    this.pickupInput$
      .pipe(
        map((query) => query.trim()),
        tap((query) => {
          if (query.length < 2) {
            this.pickupSuggestions = [];
            this.showPickupSuggestions = false;
            this.pickupLoading = false;
            this.pickupActiveIndex = -1;
          }
        }),
        filter((query) => query.length >= 2),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          this.pickupLoading = true;
          this.showPickupSuggestions = true;
        }),
        switchMap((query) =>
          this.locationService.searchLocations(query).pipe(
            catchError(() => {
              this.pickupLoading = false;
              return of([] as Location[]);
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (results: Location[]) => {
          this.pickupLoading = false;
          this.pickupSuggestions = results;
          this.pickupActiveIndex = results.length > 0 ? 0 : -1;
        },
      });

    this.destinationInput$
      .pipe(
        map((query) => query.trim()),
        tap((query) => {
          if (query.length < 2) {
            this.destinationSuggestions = [];
            this.showDestinationSuggestions = false;
            this.destinationLoading = false;
            this.destinationActiveIndex = -1;
          }
        }),
        filter((query) => query.length >= 2),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          this.destinationLoading = true;
          this.showDestinationSuggestions = true;
        }),
        switchMap((query) =>
          this.locationService.searchLocations(query).pipe(
            catchError(() => {
              this.destinationLoading = false;
              return of([] as Location[]);
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (results: Location[]) => {
          this.destinationLoading = false;
          this.destinationSuggestions = results;
          this.destinationActiveIndex = results.length > 0 ? 0 : -1;
        },
      });
  }

  private loadVehicles(): void {
    this.vehicleService
      .getVehicles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vehicles: Vehicle[]) => {
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

  onPickupInput(value: string): void {
    this.pickupQuery = value;
    this.pickupSelected = null;
    this.pickupInput$.next(value);
  }

  onDestinationInput(value: string): void {
    this.destinationQuery = value;
    this.destinationSelected = null;
    this.destinationInput$.next(value);
  }

  onPickupFocus(): void {
    this.showPickupSuggestions = this.pickupSuggestions.length > 0;
  }

  onDestinationFocus(): void {
    this.showDestinationSuggestions = this.destinationSuggestions.length > 0;
  }

  selectPickupLocation(location: Location): void {
    console.log(location);
    this.pickupSelected = location;
    this.pickupQuery = location.address;
    this.showPickupSuggestions = false;
    this.pickupActiveIndex = -1;
    this.updateRoute();
  }
  test(location: Location): void {
    console.log('CLICK WORKING');
    console.log(location);
  }

  selectDestinationLocation(location: Location): void {
    this.destinationSelected = location;
    this.destinationQuery = location.address;
    this.showDestinationSuggestions = false;
    this.destinationActiveIndex = -1;
    this.updateRoute();
  }

  private updateRoute(): void {
    this.routeError = '';

    if (!this.pickupSelected || !this.destinationSelected) {
      this.routeInfo = null;
      this.estimatedFare = 0;
      return;
    }

    this.routeService
      .calculateRoute(
        this.pickupSelected.longitude,
        this.pickupSelected.latitude,
        this.destinationSelected.longitude,
        this.destinationSelected.latitude,
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (route: { distance: number; duration: number }) => {
          this.routeInfo = {
            distance: Number((route.distance / 1000).toFixed(1)),
            duration: Math.ceil(route.duration / 60),
          };
          this.calculateFare();
        },
        error: () => {
          this.routeInfo = null;
          this.routeError = 'Unable to calculate route. Please verify locations and retry.';
          this.estimatedFare = 0;
        },
      });
  }

  selectVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    this.baseFare = vehicle.baseFare;
    this.calculateFare();
  }

  calculateFare(): void {
    if (!this.selectedVehicle || !this.routeInfo) {
      this.estimatedFare = 0;
      return;
    }

    let distance = this.routeInfo.distance;

    if (this.tripType === 'ROUND_TRIP') {
      distance *= 2;
    }

    const distanceFare = distance * this.selectedVehicle.pricePerKm;

    this.estimatedFare = Math.round(this.selectedVehicle.baseFare + distanceFare);

    console.log('========== FARE ==========');
    console.log('Route Info:', this.routeInfo);
    console.log('Distance:', this.routeInfo?.distance);
    console.log('Display Distance:', this.displayDistance);
    console.log('Trip Type:', this.tripType);
    console.log('Price/KM:', this.selectedVehicle?.pricePerKm);
    console.log('Estimated:', this.estimatedFare);
  }

  onPickupKeydown(event: KeyboardEvent): void {
    this.navigateSuggestionList(event, 'pickup');
  }

  onDestinationKeydown(event: KeyboardEvent): void {
    this.navigateSuggestionList(event, 'destination');
  }

  private navigateSuggestionList(event: KeyboardEvent, type: 'pickup' | 'destination'): void {
    const suggestions = type === 'pickup' ? this.pickupSuggestions : this.destinationSuggestions;
    const activeIndex = type === 'pickup' ? this.pickupActiveIndex : this.destinationActiveIndex;

    if (!suggestions.length) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = Math.min(activeIndex + 1, suggestions.length - 1);
      if (type === 'pickup') {
        this.pickupActiveIndex = nextIndex;
      } else {
        this.destinationActiveIndex = nextIndex;
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const previousIndex = Math.max(activeIndex - 1, 0);
      if (type === 'pickup') {
        this.pickupActiveIndex = previousIndex;
      } else {
        this.destinationActiveIndex = previousIndex;
      }
      return;
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      const selectedLocation = suggestions[activeIndex];
      if (type === 'pickup') {
        this.selectPickupLocation(selectedLocation);
      } else {
        this.selectDestinationLocation(selectedLocation);
      }
      return;
    }

    if (event.key === 'Escape') {
      this.closeSuggestions();
    }
  }

  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent): void {
  //   const target = event.target as Node;
  //   const clickInsidePickup = this.pickupContainer?.nativeElement.contains(target);
  //   const clickInsideDestination = this.destinationContainer?.nativeElement.contains(target);

  //   if (!clickInsidePickup) {
  //     this.showPickupSuggestions = false;
  //   }

  //   if (!clickInsideDestination) {
  //     this.showDestinationSuggestions = false;
  //   }
  // }

  private closeSuggestions(): void {
    this.showPickupSuggestions = false;
    this.showDestinationSuggestions = false;
  }

  get displayDistance(): number {
    if (!this.routeInfo) {
      return 0;
    }

    return this.tripType === 'ROUND_TRIP'
      ? Number((this.routeInfo.distance * 2).toFixed(1))
      : this.routeInfo.distance;
  }

  get displayDuration(): number {
    if (!this.routeInfo) {
      return 0;
    }

    return this.tripType === 'ROUND_TRIP' ? this.routeInfo.duration * 2 : this.routeInfo.duration;
  }

  bookRide(): void {
    this.errors = {
      pickup: '',
      destination: '',
      travelDate: '',
      travelTime: '',
      passengers: '',
      vehicle: '',
      route: '',
    };
    this.bookingSuccessMessage = '';
    this.bookingErrorMessage = '';

    if (!this.pickupSelected) {
      this.errors.pickup = 'Please select a pickup address from the list.';
    }

    if (!this.destinationSelected) {
      this.errors.destination = 'Please select a destination address from the list.';
    }

    if (!this.selectedVehicle) {
      this.errors.vehicle = 'Please select a vehicle.';
    }

    if (!this.travelDate) {
      this.errors.travelDate = 'Please select a travel date.';
    }

    if (!this.travelTime) {
      this.errors.travelTime = 'Please select a travel time.';
    }

    if (this.passengers < 1) {
      this.errors.passengers = 'Please select the number of passengers.';
    }

    if (!this.routeInfo || this.displayDistance <= 0 || this.displayDuration <= 0) {
      this.errors.route = 'Distance and duration must be calculated before booking.';
    }

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    const bookingRequest: BookingRequest = {
      pickupAddress: this.pickupSelected!.address,
      pickupLatitude: this.pickupSelected!.latitude,
      pickupLongitude: this.pickupSelected!.longitude,
      destinationAddress: this.destinationSelected!.address,
      destinationLatitude: this.destinationSelected!.latitude,
      destinationLongitude: this.destinationSelected!.longitude,
      travelDate: this.travelDate,
      travelTime: this.travelTime,
      tripType: this.tripType,
      vehicleId: this.selectedVehicle!.id,
      vehicleName: this.selectedVehicle!.name,
      distance: this.displayDistance,
      duration: this.displayDuration,
      estimatedFare: this.estimatedFare,
      passengers: this.passengers,
    };

    this.bookingLoading = true;

    this.bookingService
      .bookRide(bookingRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: BookingResponse) => {
          this.bookingLoading = false;
          this.bookingSuccessMessage = response?.message ?? 'Booking Successful';
        },
        error: () => {
          this.bookingLoading = false;
          this.bookingErrorMessage = 'Unable to complete booking. Please try again later.';
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get formattedDuration(): string {
    const totalMinutes = this.displayDuration;

    if (totalMinutes <= 0) {
      return '-';
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes} mins`;
    }

    if (minutes === 0) {
      return `${hours} hrs`;
    }

    return `${hours} hrs ${minutes} mins`;
  }
}
