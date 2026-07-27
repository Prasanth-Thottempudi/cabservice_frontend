export interface BookingResponse {
  bookingId: string;
  bookingNumber: string | null;

  customerName: string;
  mobileNumber: string;
  email: string;

  pickupLocation: string;
  dropLocation: string;

  tripType: string;

  journeyDate: string;

  distance: number;

  estimatedFare: number;

  status: string;

  message: string;
}
