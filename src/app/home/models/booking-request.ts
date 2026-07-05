export interface BookingRequest {
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  destinationAddress: string;
  destinationLatitude: number;
  destinationLongitude: number;
  travelDate: string;
  travelTime: string;
  tripType: string;
  vehicleId: number;
  vehicleName: string;
  distance: number;
  duration: number;
  estimatedFare: number;
  passengers: number;
}
