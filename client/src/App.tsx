import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import Home from './components/Home/Home';
import { usePublicData } from './lib/publicContext';
import { AdminGuard, AuthPage, UserGuard } from './lib/Auth';
import GarageLoading from './components/common/GarageLoading';

const UserDashboard = lazy(() => import('./pages/account/UserDashboard'));
const AdminApp = lazy(() => import('./admin/AdminApp'));
const PrivacyPolicyPage = lazy(() => import('./pages/legal/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/legal/TermsPage'));
const JournalPage = lazy(() => import('./pages/journal/JournalPage'));
const JournalArticlePage = lazy(() => import('./pages/journal/JournalArticlePage'));
const About = lazy(() => import('./components/about/About'));
const SavedCarsPage = lazy(() => import('./components/inventory/SavedCarsPage'));
const ContactPage = lazy(() => import('./components/common/ContactPage'));

function PublicLayout({ savedCount }: { savedCount: number }) {
  return <><Navbar savedCount={savedCount} /><Outlet /><Footer /></>;
}
function App() {
  const {cars,loading,error}=usePublicData();
  const [saved, setSaved] = useState<number[]>([]);

  function toggleSaved(id: number) {
    setSaved(current => current.includes(id)
      ? current.filter(carId => carId !== id)
      : [...current, id]);
  }

  function removeSaved(id: number) {
    setSaved(current => current.filter(carId => carId !== id));
  }
  return (
    <BrowserRouter>
      <ScrollToTop />
      {error&&<div className="mg-api-banner" role="alert"><span className="mg-api-banner__mark" aria-hidden="true">!</span><div><strong>THE GARAGE CONNECTION IS INTERRUPTED</strong><p>Content could not load: {error} Please try again later.</p></div></div>}

      <Routes>
        <Route path="/sign-in/*" element={<AuthPage/>}/>
        <Route path="/sign-up/*" element={<AuthPage signup/>}/>
        <Route path="/admin/*" element={<Suspense fallback={<main className="mg-workspace-pending"><GarageLoading title="Opening the workspace"/></main>}><AdminGuard><AdminApp /></AdminGuard></Suspense>} />
        <Route element={<PublicLayout savedCount={cars.filter(car=>saved.includes(car.id)).length} />}>
        <Route path="/*" element={
          <Home cars={cars} loading={loading} savedIds={saved} onToggleSaved={toggleSaved} />
        } />
        <Route path="/account" element={<UserGuard><Suspense fallback={<main className="mg-workspace-pending"><GarageLoading title="Opening your garage"/></main>}><UserDashboard cars={cars} loading={loading} savedIds={saved} onRemove={removeSaved}/></Suspense></UserGuard>}/>
        <Route path="/dashboard" element={<Navigate to="/account" replace/>}/>
        <Route path="/journal" element={<Suspense fallback={<main className="mg-workspace-pending"><GarageLoading title="Opening the journal"/></main>}><JournalPage /></Suspense>} />
        <Route path="/journal/:slug" element={<Suspense fallback={<main className="mg-workspace-pending"><GarageLoading title="Opening the story"/></main>}><JournalArticlePage /></Suspense>} />
        <Route path="/saved" element={<Suspense fallback={<main className="mg-workspace-pending"><GarageLoading title="Opening saved machines"/></main>}><SavedCarsPage cars={cars} savedIds={saved} onRemove={removeSaved} /></Suspense>} />
        <Route path="/privacy" element={<Suspense fallback={<main className="mg-workspace-pending"><GarageLoading title="Opening the privacy draft"/></main>}><PrivacyPolicyPage /></Suspense>} />
        <Route path="/terms" element={<Suspense fallback={<main className="mg-workspace-pending"><GarageLoading title="Opening terms"/></main>}><TermsPage /></Suspense>} />
        <Route path="/about" element={<Suspense fallback={<main className="mg-workspace-pending"><GarageLoading title="Opening the garage story"/></main>}><About /></Suspense>} />
        <Route path="/contact" element={<Suspense fallback={<main className="mg-workspace-pending"><GarageLoading title="Opening contact"/></main>}><ContactPage /></Suspense>} />
        </Route>
      </Routes>


    </BrowserRouter>
  );
}

export default App;






