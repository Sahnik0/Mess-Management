import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MarketDuty from './pages/MarketDuty';
import Expenses from './pages/Expenses';
import Contributions from './pages/Contributions';
import Layout from './components/Layout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="market-duty" element={<MarketDuty />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="contributions" element={<Contributions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
