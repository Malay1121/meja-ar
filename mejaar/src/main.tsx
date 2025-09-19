import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App.tsx';
import LandingPage from './components/LandingPage.tsx';
import './index.css';
import { getDefaultRestaurantId } from './data/restaurants';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/:restaurantId',
    element: <App />
  },
  {
    path: '/demo',
    element: <Navigate to={`/${getDefaultRestaurantId()}`} replace />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
