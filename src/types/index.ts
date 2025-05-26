// Base service interface with common fields
export interface BaseService {
  id?: string;
  createdAt: number;
  updatedAt: number;
  customerQuote: number;
  supplierCost: number;
}

export interface FlightBooking extends BaseService {
  from: string;
  to: string;
  flightDate: string;
  sector: string;
  tourManagerCost: number;
  carCost: number;
}

export interface HotelReservation extends BaseService {
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface CarRental extends BaseService {
  destination: string;
  date: string;
  seaters: number;
}

export interface Visa extends BaseService {
  country: string;
  applicationDate: string;
}

export interface ForeignExchange extends BaseService {
  rate: number;
  currency: string;
}

export interface TourPackage extends BaseService {
  destination: string;
  startDate: string;
  endDate: string;
  flightCost: number;
  carCost: number;
  tourManagerCost: number;
  totalCost: number;
}

export interface TrainBooking extends BaseService {
  from: string;
  to: string;
  date: string;
}

export interface Vajabhat extends BaseService {
  amount: number;
  date: string;
}

export interface FinancialSummary {
  totalServices: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  serviceBreakdown: {
    [key: string]: {
      count: number;
      revenue: number;
      cost: number;
      profit: number;
    };
  };
}