import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import { AuthProvider } from "contexts/AuthContext";
import { LanguageProvider } from "contexts/LanguageContext";

// Import pages
import Login from "pages/login";
import Register from "pages/register";
import ForgotPassword from "pages/forgot-password";
import Dashboard from "pages/dashboard";
import AddTransaction from "pages/add-transaction";
import BudgetManagement from "pages/budget-management";
import Transactions from "pages/transactions";
import ReportsAnalytics from "pages/reports-analytics";
import FamilyMembersPage from "pages/family-members/FamilyMembersPage";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <LanguageProvider>
          <AuthProvider>
            <ScrollToTop />
            <RouterRoutes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/add-transaction" element={
                <ProtectedRoute>
                  <AddTransaction />
                </ProtectedRoute>
              } />
              <Route path="/budget-management" element={
                <ProtectedRoute>
                  <BudgetManagement />
                </ProtectedRoute>
              } />
              <Route path="/transactions" element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              } />
              <Route path="/reports-analytics" element={
                <ProtectedRoute>
                  <ReportsAnalytics />
                </ProtectedRoute>
              } />
              <Route path="/family-members" element={
                <ProtectedRoute>
                  <FamilyMembersPage />
                </ProtectedRoute>
              } />
              
              {/* 404 and redirects */}
              <Route path="*" element={<NotFound />} />
            </RouterRoutes>
          </AuthProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;