import {
  PosStoreLocation,
  PosCustomer,
  PosTransaction,
  PosRegisterShift
} from '@/types/pos';

export const POS_STORES: PosStoreLocation[] = [
  {
    id: 'LONDON_MAYFAIR',
    name: 'London Mayfair Trade Showroom & VIP Suite',
    city: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    operatingEntity: 'ARIEL_UK',
    currency: 'GBP',
    currencySymbol: '£',
    address: '14 Savile Row, Mayfair, London W1S 3JN',
    vatRate: 0.20,
    taxLabel: 'UK VAT (20%)',
    phone: '+44 20 7946 0921',
    manager: 'Eleanor Vance (Senior Showroom Director)',
  },
  {
    id: 'DHAKA_FLAGSHIP',
    name: 'Dhaka Executive Flagship Gallery & Sourcing Hub',
    city: 'Dhaka',
    country: 'Bangladesh',
    flag: '🇧🇩',
    operatingEntity: 'ARIEL_BD',
    currency: 'BDT',
    currencySymbol: '৳',
    address: 'House 30 (1st Floor), Road 07, Block C, Niketon, Gulshan-1, Dhaka-1212',
    vatRate: 0.05,
    taxLabel: 'NBR Retail VAT (5%)',
    phone: '+880 2410 811 91',
    manager: 'Syed Akramul Hassan (Managing Director)',
  },
  {
    id: 'NEW_YORK_5TH',
    name: 'New York Fifth Avenue Sourcing Gallery',
    city: 'New York',
    country: 'United States',
    flag: '🇺🇸',
    operatingEntity: 'ARIEL_USA',
    currency: 'USD',
    currencySymbol: '$',
    address: '590 Fifth Avenue, 18th Floor, New York, NY 10036',
    vatRate: 0.08875,
    taxLabel: 'NYC Combined Sales Tax (8.875%)',
    phone: '+1 212 555 0194',
    manager: 'Alexander Vance (VP North America Wholesale)',
  },
];

export const INITIAL_POS_CUSTOMERS: PosCustomer[] = [];

export const INITIAL_POS_TRANSACTIONS: PosTransaction[] = [];

export const INITIAL_REGISTER_SHIFTS: Record<string, PosRegisterShift> = {};
