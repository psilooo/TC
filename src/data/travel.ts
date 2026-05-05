// src/data/travel.ts — Travel & Hotels fixtures (matches mock 4)
import type { Kpi, TravelCheckIn, TravelIssue, TravelSegment, TravelTrip } from './types'

export const travelKpis: Kpi[] = [
  { icon: 'mso-flight_takeoff', label: 'Upcoming Travel Days', value: '14', sub: 'Next 30 days' },
  { icon: 'mso-flight', label: 'Flights Booked', value: '12', sub: 'Confirmed' },
  { icon: 'mso-hotel', label: 'Hotels Confirmed', value: '10', sub: 'All cities' },
  { icon: 'mso-warning', label: 'Travel Changes', value: '3', sub: 'Need review' },
]

export const travelSelectedId = 'sel'

export const travelSegments: TravelSegment[] = [
  {
    id: 't1',
    date: '2026-05-20',
    tripNumber: 'T-101',
    origin: 'ATL',
    destination: 'BNA',
    mode: 'Flight',
    hotel: 'Grand Hyatt Nashville',
    status: 'Confirmed',
    confirmation: 'DL-7820',
  },
  {
    id: 't2',
    date: '2026-05-21',
    tripNumber: 'T-102',
    origin: 'BNA',
    destination: 'ATL',
    mode: 'Flight',
    hotel: 'Tabernacle Suites',
    status: 'Confirmed',
    confirmation: 'DL-7821',
  },
  {
    id: 't3',
    date: '2026-05-22',
    tripNumber: 'T-103',
    origin: 'ATL',
    destination: 'MSY',
    mode: 'Flight',
    hotel: 'NOLA Garden Hotel',
    status: 'Confirmed',
    confirmation: 'DL-7842',
  },
  {
    id: 'sel',
    date: '2026-05-23',
    tripNumber: 'T-104',
    origin: 'MSY',
    destination: 'BHM',
    mode: 'Drive',
    hotel: 'Iron City Hotel',
    status: 'Pending',
    confirmation: '—',
    notes: 'Driver to confirm',
  },
  {
    id: 't5',
    date: '2026-05-24',
    tripNumber: 'T-105',
    origin: 'BHM',
    destination: 'CLT',
    mode: 'Flight',
    hotel: 'Charlotte Marriott',
    status: 'Confirmed',
    confirmation: 'DL-7861',
  },
  {
    id: 't6',
    date: '2026-05-25',
    tripNumber: 'T-106',
    origin: 'CLT',
    destination: 'RDU',
    mode: 'Drive',
    hotel: 'Raleigh Inn',
    status: 'Pending',
  },
]

export const travelSelectedTrip: TravelTrip = {
  id: 'sel',
  origin: { city: 'New Orleans, LA', airport: 'MSY', date: '2026-05-23' },
  destination: { city: 'Birmingham, AL', airport: 'BHM', date: '2026-05-23' },
  hotel: { name: 'Iron City Hotel', address: '513 22nd St S, Birmingham, AL', checkIn: 'May 23', checkOut: 'May 24' },
  confirmations: [
    { kind: 'Flight', code: 'DRV-NOLA-BHM' },
    { kind: 'Hotel', code: 'HYT-22189' },
    { kind: 'Ground', code: 'PICKUP-0830' },
  ],
  party: [
    { name: 'Jane Manager', role: 'Tour Manager' },
    { name: 'Derrick Johnson', role: 'Driver' },
    { name: 'Lou Carter', role: 'Production' },
    { name: 'Sam Reyes', role: 'Sound' },
    { name: 'Eli Park', role: 'Lighting' },
  ],
}

export const travelCheckIns: TravelCheckIn[] = [
  {
    id: 'c1',
    hotel: 'Grand Hyatt Nashville',
    city: 'Nashville, TN',
    arrival: '2026-05-20',
    departure: '2026-05-21',
    status: 'Confirmed',
  },
  {
    id: 'c2',
    hotel: 'Tabernacle Suites',
    city: 'Atlanta, GA',
    arrival: '2026-05-21',
    departure: '2026-05-22',
    status: 'Confirmed',
  },
  {
    id: 'c3',
    hotel: 'NOLA Garden Hotel',
    city: 'New Orleans, LA',
    arrival: '2026-05-22',
    departure: '2026-05-23',
    status: 'Confirmed',
  },
  {
    id: 'c4',
    hotel: 'Iron City Hotel',
    city: 'Birmingham, AL',
    arrival: '2026-05-23',
    departure: '2026-05-24',
    status: 'Pending',
  },
]

export const travelIssues: TravelIssue[] = [
  { id: 'ti1', title: 'Flight time changed', sub: 'NOLA → BHM · May 23', severity: 'High' },
  { id: 'ti2', title: 'Hotel oversold', sub: 'Iron City · May 23', severity: 'Medium' },
  { id: 'ti3', title: 'Driver confirmation pending', sub: 'NOLA pickup', severity: 'Low' },
]
