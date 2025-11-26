import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Composants principaux
import BackgroundAnimation from './components/BackgroundAnimation';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Sectors from './components/Sectors';
import Portfolio from './components/Portfolio';
import WhyChooseUs from './components/WhyChooseUs';
import Process from './components/Process';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';

// Composants SEO & Analytics
import SEO from './components/SEO';
import GoogleAnalytics from './components/GoogleAnalytics';
import StructuredData from './components/StructuredData';

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
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <GoogleAnalytics />
        <StructuredData />
        
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
                      {/* SEO pour page d'accueil */}
                      <SEO 
                        title="Leonce Ouattara Studio - Digitalisation Secteur Financier en Afrique"
                        description="Expert en développement web pour banques, assurances et microfinance en Afrique. Solutions digitales sur mesure pour transformation zéro papier. Expertise fintech Côte d'Ivoire."
                        keywords="développement web, digitalisation bancaire, fintech Afrique, transformation digitale, banque numérique, assurance digitale, microfinance, Côte d'Ivoire, Abidjan, zéro papier"
                        url="https://leonceouattarastudiogroup.site"
                      />

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
                          <WhyChooseUs />
                          <Process />
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
                <Route 
                  path="/blog-tech" 
                  element={
                    <>
                      <SEO 
                        title="Blog Tech - Actualités & Conseils Digitalisation Bancaire"
                        description="Découvrez nos articles, guides et tendances sur la transformation digitale des banques, assurances et institutions financières en Afrique. Conseils d'experts fintech."
                        keywords="blog fintech, transformation digitale banque, conseils digitalisation, actualités fintech Afrique, guides développement web, tendances banking"
                        url="https://leonceouattarastudiogroup.site/blog-tech"
                      />
                      <BlogTech />
                    </>
                  } 
                />
                
                {/* Routes Blog Public */}
                <Route path="/blog">
                  <Route 
                    index 
                    element={
                      <>
                        <SEO 
                          title="Blog - Articles & Insights Transformation Digitale"
                          description="Explorez nos articles sur la digitalisation du secteur financier, les meilleures pratiques fintech et les innovations technologiques pour banques et assurances en Afrique."
                          keywords="articles fintech, blog transformation digitale, insights banking, innovation financière, digitalisation Afrique"
                          url="https://leonceouattarastudiogroup.site/blog"
                        />
                        <BlogTech />
                      </>
                    } 
                  />
                  <Route 
                    path=":slug" 
                    element={
                      <>
                        {/* SEO dynamique géré dans BlogArticlePage */}
                        <BlogArticlePage />
                      </>
                    } 
                  />
                </Route>
                
                {/* Sitemap XML */}
                <Route path="/sitemap.xml" element={<Sitemap />} />

                {/* 🆕 Page Booking Public */}
                <Route 
                  path="/reserver" 
                  element={
                    <>
                      <SEO 
                        title="Réserver une Consultation - Leonce Ouattara Studio"
                        description="Réservez un rendez-vous avec nos experts pour discuter de votre projet de digitalisation bancaire. Consultation gratuite pour banques, assurances et microfinance."
                        keywords="réservation consultation, rendez-vous digitalisation, consultation fintech, devis gratuit, booking"
                        url="https://leonceouattarastudiogroup.site/reserver"
                      />
                      <BookingPage />
                    </>
                  } 
                />

                {/* 🆕 Routes Admin - PAS de SEO */}
                <Route path="/admin/login" element={<Login />} />
                
                {/* Admin routes avec layout - PAS de SEO */}
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
    </HelmetProvider>
  );
}

export default App;
