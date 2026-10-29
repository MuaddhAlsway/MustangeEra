import type { Car } from './types';
import collection01 from '../../assets/Collection010.webp'
import collection02 from '../../assets/Collection090.webp'
import collection03 from '../../assets/Collection030.webp'
import collection04 from '../../assets/collection040.webp'
import collection05 from '../../assets/Collection080.webp'
import collection06 from '../../assets/Collection060.webp'

export const mockInventory: Car[] = [
  {
    id: 1,
    year: 1969,
    make: 'Ford',
    model: 'Mustang Boss 429',
    trim: '429 V8 · 4-speed manual',
    price: 289000,
    miles: '28,400',
    power: '375 hp',
    type: 'Rare classic',
    color: 'Wimbledon White',
    image:
      collection01,
    tag: 'Rare find',
    location: 'Austin, TX',
    description:
      'A landmark homologation-era Mustang with a story as memorable as its unmistakable shape.',
  },
  {
    id: 2,
    year: 1967,
    make: 'Ford',
    model: 'Mustang Shelby GT500',
    trim: '428 Police Interceptor · 4-speed',
    price: 219000,
    miles: '36,100',
    power: '355 hp',
    type: 'Shelby classic',
    color: 'Nightmist Blue',
    image:
      collection02,
    tag: 'Collector pick',
    location: 'Nashville, TN',
    description:
      'A Shelby-era icon selected for its specification, presence, and documented provenance.',
  },
  {
    id: 3,
    year: 2022,
    make: 'Ford',
    model: 'Mustang Shelby GT500',
    trim: '5.2L Supercharged V8 · DCT',
    price: 97900,
    miles: '8,240',
    power: '760 hp',
    type: 'Modern',
    color: 'Carbonized Gray',
    image:
      collection03,
    tag: 'Low miles',
    location: 'Scottsdale, AZ',
    description:
      'A track-bred supercharged Mustang with modern performance and exceptionally low mileage.',
  },
  {
    id: 4,
    year: 1970,
    make: 'Plymouth',
    model: 'Hemi Cuda',
    trim: '426 Hemi · 4-speed manual',
    price: 1180000,
    miles: '19,700',
    power: '425 hp',
    type: 'Limited production',
    color: 'Lemon Twist',
    image:
      collection04,
    tag: 'Museum-grade',
    location: 'Charlotte, NC',
    description:
      'A defining American performance car. Verify production and provenance claims with records for each car.',
  },
  {
    id: 5,
    year: 2021,
    make: 'Chevrolet',
    model: 'Camaro ZL1',
    trim: '6.2L Supercharged V8 · 10-speed',
    price: 68900,
    miles: '14,320',
    power: '650 hp',
    type: 'Modern',
    color: 'Riverside Blue',
    image:
      collection05,
    tag: 'Driver favorite',
    location: 'Miami, FL',
    description:
      'Supercar pace with an American soundtrack and modern performance engineering.',
  },
  {
    id: 6,
    year: 1993,
    make: 'Jaguar',
    model: 'XJ220',
    trim: '3.5L Twin-Turbo V6 · 5-speed',
    price: 625000,
    miles: '7,860',
    power: '542 hp',
    type: 'Rare supercar',
    color: 'Le Mans Blue',
    image:
      collection06,
    tag: 'Rare find',
    location: 'Denver, CO',
    description:
      'A landmark early-1990s supercar representing the garage’s wider rare-car collection.',
  },
];
