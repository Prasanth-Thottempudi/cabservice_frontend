export interface BookingRequest {
  customerName: string;
  mobileNumber: string;
  email: string;

  pickupLocation: string;
  pickupLatitude: number;
  pickupLongitude: number;

  dropLocation: string;
  dropLatitude: number;
  dropLongitude: number;

  vehicleId: string;

  tripType: string;

  journeyDate: string;

  distance: number;

  estimatedFare: number;

  specialInstructions?: string;
}
