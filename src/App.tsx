import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginForm from "./components/auth/LoginForm";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardStats from "./components/dashboard/DashboardStats";
import MRIUpload from "./components/upload/MRIUpload";

const queryClient = new QueryClient();

interface User {
  name: string;
  role: string;
  email: string;
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const DashboardPage = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your {user?.role} dashboard and recent activity.
        </p>
      </div>
      <DashboardStats userRole={user?.role || ''} />
    </div>
  );

  const UploadPage = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">MRI Scan Analysis</h1>
        <p className="text-muted-foreground">
          Upload MRI scans for AI-powered tumor detection and segmentation.
        </p>
      </div>
      <MRIUpload />
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {!user ? (
              <>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={
                  <DashboardLayout user={user} onLogout={handleLogout}>
                    <DashboardPage />
                  </DashboardLayout>
                } />
                <Route path="/upload" element={
                  <DashboardLayout user={user} onLogout={handleLogout}>
                    <UploadPage />
                  </DashboardLayout>
                } />
                <Route path="/analysis" element={
                  <DashboardLayout user={user} onLogout={handleLogout}>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold mb-4">Scan Analysis</h1>
                      <p className="text-muted-foreground">Analysis results and visualizations will appear here.</p>
                    </div>
                  </DashboardLayout>
                } />
                <Route path="/reports" element={
                  <DashboardLayout user={user} onLogout={handleLogout}>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold mb-4">Reports</h1>
                      <p className="text-muted-foreground">Generated reports and analysis summaries.</p>
                    </div>
                  </DashboardLayout>
                } />
                <Route path="/patients" element={
                  <DashboardLayout user={user} onLogout={handleLogout}>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold mb-4">Patient Management</h1>
                      <p className="text-muted-foreground">Patient records and case management.</p>
                    </div>
                  </DashboardLayout>
                } />
                <Route path="/settings" element={
                  <DashboardLayout user={user} onLogout={handleLogout}>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold mb-4">Settings</h1>
                      <p className="text-muted-foreground">Application preferences and configuration.</p>
                    </div>
                  </DashboardLayout>
                } />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;