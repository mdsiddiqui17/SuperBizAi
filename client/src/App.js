import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Leads from './pages/Leads';
import Appointments from './pages/Appointments';
import ContentSetup from './pages/ContentSetup';
import GenerateContent from './pages/GenerateContent';
import AdCreator from './pages/AdCreator';
import Scheduler from './pages/Scheduler';
import ProductsPage from './pages/ProductsPage'; // ✅ NEW
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setIsLoggedIn(!!storedUser);
    setAuthLoading(false);
  }, []);

  if (authLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading application...</div>;
  }

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/leads"
          element={isLoggedIn ? <Leads /> : <Navigate to="/login" />}
        />
        <Route
          path="/appointments"
          element={isLoggedIn ? <Appointments /> : <Navigate to="/login" />}
        />
        <Route
          path="/content-setup"
          element={isLoggedIn ? <ContentSetup /> : <Navigate to="/login" />}
        />
        <Route
          path="/generate-content"
          element={isLoggedIn ? <GenerateContent /> : <Navigate to="/login" />}
        />
        <Route
          path="/create-ad"
          element={isLoggedIn ? <AdCreator /> : <Navigate to="/login" />}
        />
        <Route
          path="/scheduler"
          element={isLoggedIn ? <Scheduler /> : <Navigate to="/login" />}
        />
        <Route
          path="/products"
          element={isLoggedIn ? <ProductsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/account"
          element={isLoggedIn ? <div className="container"><h1>Account Settings</h1></div> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
