import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Sales from './pages/Sales';
import Appointments from './pages/Appointments';
import ContentSetup from './pages/ContentSetup';
// ❌ Removed old GenerateContent import
import ContentGeneratorTabs from './pages/ContentGeneratorTabs'; // ✅ New
import AdCreator from './pages/AdCreator';
import Scheduler from './pages/Scheduler';
import ProductsPage from './pages/ProductsPage';
import NotFound from './pages/NotFound';
import AccountSettings from './pages/AccountSettings';

// Productive Space Module
import ProductiveSpaceLayout from './modules/ProductiveSpace/ProductiveSpaceLayout';
import TasksPage from './modules/ProductiveSpace/pages/TasksPage';
import NotesPage from './modules/ProductiveSpace/pages/NotesPage';
import RemindersPage from './modules/ProductiveSpace/pages/RemindersPage';
import ContactsPage from './modules/ProductiveSpace/pages/ContactsPage';
import WorkspaceLinksPage from './modules/ProductiveSpace/pages/WorkspaceLinksPage';
import TemplatesPage from './modules/ProductiveSpace/pages/TemplatesPage';
import TemplateBuilderPage from './modules/ProductiveSpace/templateBuilder/pages/TemplateBuilderPage';

// Analytics
import AnalyticsPage from './modules/Analytics/pages/AnalyticsPage';

// Smart Forms
import SmartFormsPage from './modules/SmartForms/pages/SmartFormsPage';
import PublicFormPage from './modules/SmartForms/pages/PublicFormPage';

// Competitor Analysis
import CompetitorPage from './modules/CompetitorAnalysis/pages/CompetitorPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function ProtectedRoute({ children, isLoggedIn }) {
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setIsLoggedIn(!!storedUser);
    setAuthLoading(false);
  }, []);

  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        Loading application...
      </div>
    );
  }

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="colored" />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/forms/:formId" element={<PublicFormPage />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Sales />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/content-setup"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ContentSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generate-content"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ContentGeneratorTabs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-ad"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AdCreator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scheduler"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Scheduler />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AccountSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/smart-forms"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <SmartFormsPage />
            </ProtectedRoute>
          }
        />

        {/* Productive Space Routes */}
        <Route
          path="/productive"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ProductiveSpaceLayout />
            </ProtectedRoute>
          }
        >
          <Route path="tasks" element={<TasksPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="links" element={<WorkspaceLinksPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="templates/builder/:templateId" element={<TemplateBuilderPage />} />
        </Route>

        {/* Analytics */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* Competitor Analysis */}
        <Route
          path="/competitor-analysis"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <CompetitorPage />
            </ProtectedRoute>
          }
        />

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
