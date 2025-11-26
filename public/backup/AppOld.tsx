import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import BackgroundAnimation from './components/BackgroundAnimation';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Sectors from './components/Sectors';
import Portfolio from './components/Portfolio';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';


// 🆕 Imports Admin
import { AuthProvider } from './admin/hooks/useAuth';
import { QueryProvider } from './admin/providers/QueryProvider';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/components/layout/AdminLayout';
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';

// 🆕 Navigation CRUD
import NavigationList from './admin/pages/navigation/NavigationList';
import NavigationCreate from './admin/pages/navigation/NavigationCreate';
import NavigationEdit from './admin/pages/navigation/NavigationEdit';

// 🆕 Services CRUD
import ServiceList from './admin/pages/services/ServiceList';
import ServiceCreate from './admin/pages/services/ServiceCreate';
import ServiceEdit from './admin/pages/services/ServiceEdit';

// 🆕 Sectors CRUD
import AdminSectors from './admin/pages/Sectors';

// 🆕 Projects CRUD
import Projects from './admin/pages/Projects';
import ProjectForm from './admin/pages/ProjectForm';

// 🆕 Blog CRUD
import BlogAdmin from './admin/pages/Blog';
import BlogForm from './admin/pages/BlogForm';
import BlogCategories from './admin/pages/BlogCategories';
import BlogCommentsAdmin from './admin/pages/BlogCommentsAdmin';

// 🆕 Meeting Management
import Meeting from './admin/pages/Meeting';

// 🆕 Analytics
import Analytics from './admin/pages/Analytics';

// 🆕 Contacts
import Contacts from './admin/pages/Contacts';

// 🆕 Newsletters
import Newsletters from './admin/pages/Newsletters';

// 🆕 Skills, Chatbot, Settings
import Skills from './admin/pages/Skills';
import Chatbot from './admin/pages/Chatbot';
import Settings from './admin/pages/Settings';

// 🆕 Booking Public
import BookingPage from './pages/BookingPage';

// 🆕 Blog Frontend Public
import BlogTech from './pages/BlogTech';
import BlogArticlePage from './pages/BlogArticlePage';
import Sitemap from './pages/Sitemap';
import ScrollToTop from './components/ScrollToTop';
import GoogleAnalytics from './components/GoogleAnalytics';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <GoogleAnalytics />
      <QueryProvider>
        <AuthProvider>
          <NotificationProvider>
            {/* Toast notifications */}
            <Toaster position="top-right" />

          <Routes>
            {/* Page principale */}
            <Route
              path="/"
              element={
                <div className="min-h-screen bg-[#0A0A0B] text-white overflow-x-hidden">
                  {/* Animated Background */}
                  <BackgroundAnimation />

                  {/* Main Content */}
                  <div className="relative z-10">
                    <Header />
                    <main>
                      <Hero />
                      <About />
                      <Services />
                      <Sectors />
                      <Portfolio />
                      <Blog />
                      <Contact />
                    </main>
                    <Footer />
                  </div>

                  {/* Floating ChatBot */}
                  <ChatBot />
                </div>
              }
            />

            {/* Page Blog Tech */}
            <Route path="/blog-tech" element={<BlogTech />} />
            
            {/* Routes Blog Public */}
            <Route path="/blog">
              <Route index element={<BlogTech />} />
              <Route path=":slug" element={<BlogArticlePage />} />
            </Route>
            
            {/* Sitemap XML */}
            <Route path="/sitemap.xml" element={<Sitemap />} />

            {/* 🆕 Page Booking Public */}
            <Route path="/reserver" element={<BookingPage />} />

            {/* 🆕 Routes Admin */}
            <Route path="/admin/login" element={<Login />} />
            
            {/* Admin routes avec layout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* Redirect /admin to /admin/dashboard */}
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              
              {/* Dashboard */}
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* 🆕 Navigation CRUD */}
              <Route path="navigation">
                <Route index element={<NavigationList />} />
                <Route path="create" element={<NavigationCreate />} />
                <Route path=":id/edit" element={<NavigationEdit />} />
              </Route>
              
              {/* 🆕 Services CRUD */}
              <Route path="services">
                <Route index element={<ServiceList />} />
                <Route path="create" element={<ServiceCreate />} />
                <Route path=":id/edit" element={<ServiceEdit />} />
              </Route>
              
              {/* 🆕 Sectors CRUD */}
              <Route path="sectors" element={<AdminSectors />} />
              
              {/* 🆕 Projects CRUD */}
              <Route path="projects">
                <Route index element={<Projects />} />
                <Route path="new" element={<ProjectForm />} />
                <Route path=":id/edit" element={<ProjectForm />} />
              </Route>
              
              {/* 🆕 Blog CRUD */}
              <Route path="blog">
                <Route index element={<BlogAdmin />} />
                <Route path="new" element={<BlogForm />} />
                <Route path=":id/edit" element={<BlogForm />} />
                <Route path="categories" element={<BlogCategories />} />
              </Route>
              
              {/* 🆕 Comments Management - Route dédiée */}
              <Route path="comments" element={<BlogCommentsAdmin />} />
              
              {/* 🆕 Meeting Management */}
              <Route path="meetings" element={<Meeting />} />
              
              {/* 🆕 Analytics */}
              <Route path="analytics" element={<Analytics />} />
              
              {/* 🆕 Contacts */}
              <Route path="contacts" element={<Contacts />} />
              
              {/* 🆕 Newsletters */}
              <Route path="newsletters" element={<Newsletters />} />
              
              {/* 🆕 Skills Management */}
              <Route path="skills" element={<Skills />} />
              
              {/* 🆕 Chatbot Management */}
              <Route path="chatbot" element={<Chatbot />} />
              
              {/* 🆕 Settings */}
              <Route path="settings" element={<Settings />} />
              
              {/* Autres routes admin seront ajoutées dans les prochaines phases */}
            </Route>
          </Routes>
          </NotificationProvider>
        </AuthProvider>
      </QueryProvider>
    </Router>
  );
}

export default App;
