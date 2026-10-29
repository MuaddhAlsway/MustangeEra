import { ArrowDownRight } from 'lucide-react';
import inventoryHero from '../../assets/Mustange01.webp';
import type { Car } from '../../features/inventory/types';
import '../../styles/InventoryPage.css';
import FeaturedCollection from '../Home/FeaturedCollection';
import { usePublicData } from '../../lib/publicContext';

type InventoryPageProps = {
  cars: Car[];
  loading: boolean;
  savedIds: number[];
  onToggleSaved: (id: number) => void;
  onSelectCar: (car: Car) => void;
};

export default function InventoryPage({
  cars,
  loading,
  savedIds,
  onToggleSaved,
  onSelectCar,
}: InventoryPageProps) {
  const hero=usePublicData().pages.inventory?.hero;
  return (
    <main className="mg-inventory-page">
      <header className="mg-inventory-hero">
        <div className="mg-inventory-hero__image" aria-hidden="true" style={{ backgroundImage: `url("${hero?.image||inventoryHero}")` }} />
       

        <div className="mg-inventory-hero__content">
          <p className="mg-inventory-hero__eyebrow">
            <span /> {hero?.eyebrow||'THE COLLECTION / INVENTORY'}
          </p>
          <h1>
            {hero?.title||'FIND YOUR'}
            <br />
            <em>{hero?.accent||'FOREVER CAR.'}</em>
          </h1>
          <p className="mg-inventory-hero__intro">
            {hero?.description||'Rare machines, considered carefully. Search the collection by marque, model, or year, then open a car to explore its details.'}
          </p>
          <a className="mg-inventory-hero__scroll" href="#inventory-list">
            BROWSE THE COLLECTION <ArrowDownRight size={18} aria-hidden="true" />
          </a>
        </div>

        <span className="mg-inventory-hero__serial">
          MG / INVENTORY
          <br />
          VOL. 01
        </span>
        <span className="mg-inventory-hero__count">
          {loading ? '—' : String(cars.length).padStart(2, '0')} MACHINES IN THE GARAGE
        </span>
      </header>

      <div id="inventory-list" className="mg-inventory-list">
        <FeaturedCollection
          cars={cars}
          loading={loading}
          savedIds={savedIds}
          onToggleSaved={onToggleSaved}
          onSelectCar={onSelectCar}
        />
      </div>
    </main>
  );
}

