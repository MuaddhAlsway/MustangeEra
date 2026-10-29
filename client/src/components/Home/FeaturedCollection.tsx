import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Car } from '../../features/inventory/types';
import '../../styles/FeaturedCollection.css';

type FeaturedCollectionProps = {
  cars: Car[];
  loading?: boolean;
  savedIds: number[];
  onToggleSaved: (id: number) => void;
  onSelectCar: (car: Car) => void;
};

const money = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

export default function FeaturedCollection({
  cars,
  loading = false,
  savedIds = [],
  onToggleSaved,
  onSelectCar,
}: FeaturedCollectionProps) {
  const [search, setSearch] = useState('');
  const [make, setMake] = useState('All marques');
  const [era, setEra] = useState('All eras');
  const [sort, setSort] = useState('Curated');

  const makes = useMemo(
    () => ['All marques', ...new Set(cars.map(car => car.make))],
    [cars],
  );

  const filteredCars = useMemo(() => {
    const term = search.trim().toLowerCase();

    const result = cars.filter(car => {
      const searchableText =
        `${car.year} ${car.make} ${car.model} ${car.trim} ${car.type}`.toLowerCase();

      const matchesSearch = !term || searchableText.includes(term);
      const matchesMake = make === 'All marques' || car.make === make;
      const matchesEra =
        era === 'All eras' ||
        (era === 'Classic' ? car.year < 1990 : car.year >= 1990);

      return matchesSearch && matchesMake && matchesEra;
    });

    if (sort === 'Price: low to high') {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === 'Price: high to low') {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === 'Newest first') {
      result.sort((a, b) => b.year - a.year);
    }

    return result;
  }, [cars, search, make, era, sort]);

  return (
    <section
      className="mg-collection"
      id="inventory"
      aria-labelledby="mg-collection-title"
    >
      <div className="mg-collection__topline">
        <span>
          <i /> THE MUSTANG GARAGE SELECTION
        </span>
        <span>CURATED MACHINES / VOL. 01</span>
      </div>

      <div className="mg-collection__heading">
        <div>
          <p className="mg-collection__eyebrow">
            RARE BY NATURE. READY FOR THE ROAD.
          </p>
          <h2 id="mg-collection-title">
            <span>The Mustang Garage</span>
            <em>Selection.</em>
          </h2>
        </div>

        <p className="mg-collection__intro">
          Icons, oddities, and the machines that refuse to blend in. Every car
          here has a story worth knowing.
        </p>
      </div>

      <div className="mg-collection__toolbar" role="group" aria-label="Collection filters">
        <label className="mg-collection__search">
          <span className="mg-collection__field-label">SEARCH THE COLLECTION</span>
          <span className="mg-collection__search-control">
            <Search size={18} aria-hidden="true" />
            <input type="search" aria-label="Search by marque, model, or year"
              value={search} onChange={event => setSearch(event.target.value)}
              placeholder="Marque, model, year…" />
          </span>
        </label>
        <div className="mg-collection__filters">
          <label className="mg-collection__filter-field">
            <span className="mg-collection__field-label">01 / MARQUE</span>
            <select aria-label="Filter by make" value={make} onChange={event => setMake(event.target.value)}>
              {makes.map(item => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="mg-collection__filter-field">
            <span className="mg-collection__field-label">02 / ERA</span>
            <select aria-label="Filter by era" value={era} onChange={event => setEra(event.target.value)}>
              <option>All eras</option><option>Classic</option><option>Modern</option>
            </select>
          </label>
          <label className="mg-collection__filter-field">
            <span className="mg-collection__field-label"><SlidersHorizontal size={12} aria-hidden="true" /> SORT BY</span>
            <select aria-label="Sort collection" value={sort} onChange={event => setSort(event.target.value)}>
              <option>Curated</option><option>Newest first</option>
              <option>Price: low to high</option><option>Price: high to low</option>
            </select>
          </label>
        </div>
      </div>
      <div className="mg-collection__status">
        <span>
          {loading
            ? 'OPENING THE GARAGE…'
            : `${String(filteredCars.length).padStart(2, '0')} DISTINCTIVE MACHINES`}
        </span>
        <span>EVERY ONE EARNED ITS PLACE</span>
      </div>

      <div className="mg-collection__grid">
        {loading && (
          <div className="mg-collection__empty">Loading the collection…</div>
        )}

        {!loading &&
          filteredCars.map((car, index) => {
            const saved = savedIds.includes(car.id);

            return (
              <article
                className={`mg-car-card${index === 0 ? ' mg-car-card--lead' : ''}`}
                key={car.id}
              >
                <button
                  className="mg-car-card__photo"
                  type="button"
                  onClick={() => onSelectCar(car)}
                  aria-label={`View ${car.year} ${car.make} ${car.model}`}
                >
                  <img
                    src={car.image}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    loading={index > 2 ? 'lazy' : 'eager'}
                  />
                  <span className="mg-car-card__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="mg-car-card__tag">{car.tag}</span>
                  <span className="mg-car-card__view">
                    VIEW MACHINE <ArrowUpRight size={15} />
                  </span>
                </button>

                <div className="mg-car-card__body">
                  <div className="mg-car-card__title-row">
                    <div>
                      <p className="mg-car-card__year">
                        {car.year} <i>—</i> {car.make}
                      </p>
                      <h3><Link to={`/inventory/${car.id}`}>{car.model}</Link></h3>
                    </div>

                    <button
                      className={`mg-car-card__save${saved ? ' is-saved' : ''}`}
                      type="button"
                      aria-label={
                        saved ? 'Remove from saved cars' : 'Save car'
                      }
                      aria-pressed={saved}
                      onClick={() => onToggleSaved(car.id)}
                    >
                      <Heart
                        size={17}
                        fill={saved ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>

                  <p className="mg-car-card__trim">{car.trim}</p>

                  <div className="mg-car-card__specs">
                    <span>{car.miles} MI</span>
                    <i />
                    <span>{car.power}</span>
                    <i />
                    <span>{car.type}</span>
                  </div>

                  <div className="mg-car-card__bottom">
                    <strong>{money(car.price)}</strong>
                    <button
                      type="button"
                      onClick={() => onSelectCar(car)}
                      aria-label={`View details for ${car.model}`}
                    >
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

        {!loading && filteredCars.length === 0 && (
          <div className="mg-collection__empty">
            {cars.length === 0
              ? 'The collection has no published machines yet. Please check back soon.'
              : 'No machines match those filters. Try another search.'}
          </div>
        )}
      </div>

      <div className="mg-collection__footer">
        <span>COLLECT BROADLY. CURATE STRICTLY.</span>
        <Link to="/about">
          OUR STANDARD <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

