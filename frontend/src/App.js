import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TicketPage from './pages/TicketPage';
import GalleryPage from './pages/GalleryPage';
import TestAuthPage from './pages/TestAuthPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminRegisterPage from './pages/admin/AdminRegisterPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AddTrailerPage from './pages/AddTrailerPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          {/* Use Routes to conditionally render components */}
          <Routes>
            {/* Admin routes without header and footer */}
            <Route path="/admin/*" element={
              <div className="flex flex-col min-h-screen bg-gray-900">
                <main className="flex-grow">
                  <Routes>
                    <Route path="login" element={<AdminLoginPage />} />
                    <Route path="register" element={<AdminRegisterPage />} />
                    <Route path="dashboard" element={<AdminProtectedRoute><AdminDashboardPage /></AdminProtectedRoute>} />
                  </Routes>
                </main>
              </div>
            } />
          
          {/* Regular routes with header and footer */}
          <Route path="/*" element={
            <div className="flex flex-col min-h-screen bg-gray-900">
              <Header />
              <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route 
                path="/movie/:id" 
                element={
                  <ProtectedRoute>
                    <MovieDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route 
                path="/ticket/:id" 
                element={
                  <ProtectedRoute>
                    <TicketPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/test-auth" element={<TestAuthPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/movie/:id/add-trailer" element={<AddTrailerPage />} />
              {/* Admin routes moved to nested route structure above */}
            </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
