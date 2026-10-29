import { ArrowRight, Heart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Car } from '../../features/inventory/types';
import '../../styles/SavedCarsPage.css';

type SavedCarsPageProps = {
  cars: Car[];
  savedIds: number[];
  onRemove: (id: number) => void;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);

export default function SavedCarsPage({
  cars,
  savedIds,
  onRemove,
}: SavedCarsPageProps) {
  const savedCars = savedIds
    .map((id) => cars.find((car) => car.id === id))
    .filter((car): car is Car => Boolean(car));

  return (
    <main className="mg-saved" aria-labelledby="mg-saved-title">
      <div className="mg-saved__topline">
        <span><i /> YOUR GARAGE / SAVED MACHINES</span>
        <span>COLLECTION FILE / 01</span>
      </div>

      <header className="mg-saved__heading">
        <div>
          <p>KEEP THE ONES THAT STAY WITH YOU</p>
          <h1 id="mg-saved-title">SAVED <em>CARS.</em></h1>
        </div>
        <span className="mg-saved__count" role="status" aria-live="polite" aria-atomic="true">
          {String(savedCars.length).padStart(2, '0')} IN YOUR LIST
        </span>
      </header>

      {savedCars.length === 0 ? (
        <div className="mg-saved__empty">
          <Heart size={28} strokeWidth={1.4} aria-hidden="true" />
          <h2>NOTHING PARKED HERE. YET.</h2>
          <p>
            Save a car from the collection and it’ll be waiting here when you
            return.
          </p>
          <Link to="/inventory">
            BROWSE THE COLLECTION <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="mg-saved__grid">
          {savedCars.map((car, index) => (
            <article className="mg-saved-card" key={car.id}>
              <Link
                className="mg-saved-card__image"
                to={`/inventory/${car.id}`}
              >
                <img
                  src={car.image}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  loading="lazy"
                />
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span>{car.tag}</span>
              </Link>

              <div className="mg-saved-card__body">
                <p>{car.year} <i>—</i> {car.make}</p>
                <div className="mg-saved-card__title">
                  <h2>{car.model}</h2>
                  <strong>{formatPrice(car.price)}</strong>
                </div>
                <span className="mg-saved-card__trim">{car.trim}</span>

                <div className="mg-saved-card__actions">
                  <Link to={`/inventory/${car.id}`}>
                    VIEW DETAILS <ArrowRight size={15} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onRemove(car.id)}
                    aria-label={`Remove ${car.year} ${car.make} ${car.model} from saved cars`}
                  >
                    <Trash2 size={15} /> REMOVE
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
