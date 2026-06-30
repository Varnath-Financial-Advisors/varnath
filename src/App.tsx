import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WhatsAppButton from "./components/WhatsAppButton";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy load pages with retry logic for dynamic import failures
const lazyWithRetry = (importFn: () => Promise<any>) =>
  lazy(() =>
    importFn().catch(() =>
      new Promise((resolve) => {
        setTimeout(() => resolve(importFn()), 1500);
      })
    )
  );

const Index = lazyWithRetry(() => import("./pages/Index"));
const KnowledgeBase = lazyWithRetry(() => import("./pages/KnowledgeBase"));
const ServicesPage = lazyWithRetry(() => import("./pages/ServicesPage"));
const AboutUs = lazyWithRetry(() => import("./pages/AboutUs"));
const Login = lazyWithRetry(() => import("./pages/Login"));
const Portal = lazyWithRetry(() => import("./pages/Portal"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <Portal />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <WhatsAppButton />
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
