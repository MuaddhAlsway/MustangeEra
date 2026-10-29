import { lazy, Suspense } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Hero from '../common/Hero';
import FeaturedCollection from './FeaturedCollection';
import WhyMustangGarage from './WhyMustangGarage';
import JournalPreview from './JournalPreview';
import OwnerStories from './OwnerStories';
import PagePlaceholder from '../../pages/PagePlaceholder';
import GarageLoading from '../common/GarageLoading';
import type { Car } from '../../features/inventory/types';
import GarageInNumbers from './GarageInNumbers';
import FeaturedCarSpotlight from './FeaturedCarSpotlight';
import RecentlyViewedCars from './RecentlyViewedCars';
import useRecentlyViewedCars from '../../features/inventory/useRecentlyViewedCars';

const CarDetailsPage=lazy(()=>import('../inventory/CarDetailsPage'));
const InventoryPage=lazy(()=>import('../inventory/InventoryPage'));

type HomeProps = {
  cars: Car[];
  loading: boolean;
  savedIds: number[];
  onToggleSaved: (id: number) => void;
};

export default function Home({ cars, loading, savedIds, onToggleSaved }: HomeProps) {
  const navigate = useNavigate();
  const recentlyViewedCars = useRecentlyViewedCars(cars);
  const collection = (
    <FeaturedCollection
      cars={cars}
      loading={loading}
      savedIds={savedIds}
      onToggleSaved={onToggleSaved}
      onSelectCar={car => navigate(`/inventory/${car.id}`)}
    />
  );

  function askAboutCar(car: Car) {
    navigate(`/contact?car=${car.id}`);
  }

  return (
    <Routes>
      <Route
        index
        element={
          <main>
            <Hero />
            <FeaturedCarSpotlight car={cars[0]} loading={loading} />
            {collection}
            <RecentlyViewedCars cars={recentlyViewedCars.length ? recentlyViewedCars : cars.slice(0, 3)} loading={loading} isDemo={recentlyViewedCars.length === 0 && cars.length > 0} />
            <GarageInNumbers cars={cars} loading={loading} />
            <WhyMustangGarage />
            
            <JournalPreview />
            <OwnerStories />
          </main>
        }
      />
      <Route
        path="inventory"
        element={<Suspense fallback={<main className="mg-workspace-pending"><GarageLoading title="Opening the collection"/></main>}>
          <InventoryPage
            cars={cars}
            loading={loading}
            savedIds={savedIds}
            onToggleSaved={onToggleSaved}
            onSelectCar={car => navigate(`/inventory/${car.id}`)}
          />
        </Suspense>}
      />
      <Route
        path="inventory/:carId"
        element={<Suspense fallback={<main className="mg-workspace-pending"><GarageLoading title="Opening the machine file"/></main>}>{loading ? <main className="mg-api-state">Loading machine file…</main> :
          <CarDetailsPage
            cars={cars}
            savedIds={savedIds}
            onToggleSaved={onToggleSaved}
            onAskAboutCar={askAboutCar}
          />
        }</Suspense>}
      />
      <Route
        path="*"
        element={<PagePlaceholder title="Page not found" description="This road does not lead to a page. Explore the inventory to get back on track." />}
      />
    </Routes>
  );
}







