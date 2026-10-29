import { ArrowUpRight, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Car } from '../../features/inventory/types';
import GarageImage from '../common/GarageImage';
import '../../styles/RecentlyViewedCars.css';

type RecentlyViewedCarsProps = {
  cars: Car[];
  loading?: boolean;
  isDemo?: boolean;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);

export default function RecentlyViewedCars({
  cars,
  loading = false,
  isDemo = false,
}: RecentlyViewedCarsProps) {


  return (
    <section className="mg-recent" id="recently-viewed" aria-labelledby="mg-recent-title" aria-busy={loading}>
      <div className="mg-recent__heading">
        <div>
          <p>
            <Clock3 size={14} aria-hidden="true" /> {isDemo ? 'A PREVIEW OF YOUR GARAGE TRAIL' : 'BACK ON YOUR RADAR'}
          </p>
          <h2 id="mg-recent-title">
            RECENTLY <em>VIEWED.</em>
          </h2>
        </div>
        <span>{isDemo ? 'DEMO SELECTION' : 'YOUR LAST LOOKS'} / {String(cars.length).padStart(2, '0')}</span>
      </div>

      {loading ? (
        <div className="mg-recent__empty" role="status">
          <Clock3 size={24} aria-hidden="true" />
          <div><h3>Opening your recent history.</h3><p>Your last looks will appear here.</p></div>
        </div>
      ) : cars.length === 0 ? (
        <div className="mg-recent__empty">
          <Clock3 size={28} aria-hidden="true" />
          <div>
            <span>YOUR GARAGE TRAIL STARTS HERE</span>
            <h3>Something catch your eye?</h3>
            <p>Open a machine file to take a closer look. Your last three viewed cars will appear here when you return.</p>
          </div>
          <Link to="/inventory">EXPLORE THE COLLECTION <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      ) : (
      <div className="mg-recent__grid">
        {cars.map((car, index) => (
          <Link
            className="mg-recent__card"
            to={`/inventory/${car.id}`}
            key={car.id}
          >
            <div className="mg-recent__image">
              <GarageImage
                src={car.image}
                alt={`${car.year} ${car.make} ${car.model}`}
                loading="lazy"
              />
              <span>{String(index + 1).padStart(2, '0')}</span>
              <ArrowUpRight className="mg-recent__open" size={17} />
            </div>
            <div className="mg-recent__info">
              <p>
                {car.year} — {car.make}
              </p>
              <h3>{car.model}</h3>
              <div>
                <span>{car.tag}</span>
                <strong>{formatPrice(car.price)}</strong>
              </div>
            </div>
          </Link>
        ))}
      </div>
      )}
    </section>
  );
}


