import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Car } from '../../features/inventory/types';
import '../../styles/GarageInNumbers.css';

type GarageInNumbersProps = {
  cars: Car[];
  loading?: boolean;
};

export default function GarageInNumbers({
  cars,
  loading = false,
}: GarageInNumbersProps) {
  const decades = new Set(
    cars.map((car) => Math.floor(car.year / 10) * 10),
  ).size;

  const marques = new Set(
    cars.map((car) => car.make.trim().toLowerCase()),
  ).size;

  const figures = [
    {
      value: loading ? '—' : String(cars.length).padStart(2, '0'),
      label: 'CURATED MACHINES',
      note: 'Each one selected for its character',
    },
    {
      value: loading ? '—' : String(decades).padStart(2, '0'),
      label: 'DECADES OF MOTORING',
      note: 'Distinct eras represented',
    },
    {
      value: loading ? '—' : String(marques).padStart(2, '0'),
      label: 'MARQUES IN THE GARAGE',
      note: 'Beyond one nameplate',
    },
  ];

  return (
    <section className="mg-numbers" aria-labelledby="mg-numbers-title">
      <div className="mg-numbers__heading">
        <p>
          <span /> A SMALL COLLECTION. A BIG MOTORING STORY.
        </p>
        <h2 id="mg-numbers-title">
          THE GARAGE
          <br />
          <em>AT A GLANCE.</em>
        </h2>
      </div>

      <div className="mg-numbers__grid">
        {figures.map((figure, index) => (
          <article className="mg-numbers__stat" key={figure.label}>
            <span className="mg-numbers__index">0{index + 1} / MG</span>
            <strong>{figure.value}</strong>
            <h3>{figure.label}</h3>
            <p>{figure.note}</p>
          </article>
        ))}
      </div>

      <Link className="mg-numbers__link" to="/inventory">
        STEP INSIDE THE COLLECTION <ArrowUpRight size={15} />
      </Link>

      <span className="mg-numbers__footnote">
        COUNTS BASED ON CURRENTLY LISTED INVENTORY
      </span>
    </section>
  );
}