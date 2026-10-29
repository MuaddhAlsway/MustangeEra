import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './lib/Auth';
import { PublicDataProvider } from './lib/PublicData';
import App from './App.tsx'
import './styles/Typography.css'
import './styles/GarageImage.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider><PublicDataProvider><App /></PublicDataProvider></AuthProvider>
  </StrictMode>,
)
