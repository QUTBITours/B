import { collection, addDoc, updateDoc, doc, deleteDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  BaseService, 
  FlightBooking, 
  HotelReservation, 
  CarRental, 
  Visa, 
  ForeignExchange, 
  TourPackage, 
  TrainBooking, 
  Vajabhat 
} from '../types';

// Collection names
export const COLLECTIONS = {
  FLIGHT_BOOKING: 'flightBookings',
  HOTEL_RESERVATION: 'hotelReservations',
  CAR_RENTAL: 'carRentals',
  VISA: 'visas',
  FOREIGN_EXCHANGE: 'foreignExchanges',
  TOUR_PACKAGE: 'tourPackages',
  TRAIN_BOOKING: 'trainBookings',
  VAJABHAT: 'vajabhats',
};

// Add a new service entry
export const addService = async <T extends BaseService>(
  collectionName: string, 
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const timestamp = Date.now();
  const dataWithTimestamps = {
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  
  const docRef = await addDoc(collection(db, collectionName), dataWithTimestamps);
  return { ...dataWithTimestamps, id: docRef.id };
};

// Update an existing service entry
export const updateService = async <T extends BaseService>(
  collectionName: string, 
  id: string, 
  data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
) => {
  const dataWithTimestamp = {
    ...data,
    updatedAt: Date.now(),
  };
  
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, dataWithTimestamp);
  return dataWithTimestamp;
};

// Delete a service entry
export const deleteService = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
  return id;
};

// Format currency for display
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Calculate profit
export const calculateProfit = (customerQuote: number, supplierCost: number) => {
  return customerQuote - supplierCost;
};