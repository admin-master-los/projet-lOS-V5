import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import BackgroundAnimation from './components/BackgroundAnimation';


// Composants SEO & Analytics
import SEO from './components/SEO';
import GoogleAnalytics from './components/GoogleAnalytics';
import StructuredData from './components/StructuredData';

// Composants de layout
import Header from './components/Header';
import Footer from './components/Footer';


// Composants de la page d'accueil
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Sectors from './components/Sectors';
import Portfolio from './components/Portfolio';
import WhyChooseUs from './components/WhyChooseUs';
import Process from './components/Process';
import Blog from './components/Blog';
import Contact from './components/Contact';
import ChatBot from './components/ChatBot';

// Pages
import AboutPage from './pages/AboutPage';
import BlogTech from './pages/BlogTech';
import BlogArticlePage from './pages/BlogArticlePage';
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';

// 🆕 Booking Public
import BookingPage from './pages/BookingPage';

// Route protégée pour l'admin
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        {/* Données structurées Schema.org (toutes les pages) */}
        <StructuredData />
        
        {/* Google Analytics (toutes les pages) */}
        <GoogleAnalytics />
        
        <Routes>
          {/* PAGE D'ACCUEIL */}
          <Route 
            path="/" 
            element={
              <>
                <SEO 
                  title="Leonce Ouattara Studio - Digitalisation Secteur Financier"
                  description="Studio de développement web spécialisé dans la digitalisation des banques, assurances et institutions de microfinance en Afrique. Expertise en solutions sur mesure, zéro papier."
                  keywords="développement web, digitalisation bancaire, fintech Afrique, transformation digitale, zéro papier, banque digitale, microfinance, Côte d'Ivoire"
                  url="https://leonceouattarastudiogroup.site"
                  image="https://leonceouattarastudiogroup.site/og-image.jpg"
                />
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
              </>
            } 
          />

          {/* PAGE À PROPOS */}
          <Route 
            path="/about" 
            element={
              <>
                <SEO 
                  title="À Propos - Notre Expertise en Digitalisation Financière"
                  description="Découvrez Leonce Ouattara Studio, votre partenaire de confiance pour la transformation digitale du secteur financier en Afrique. +10 ans d'expérience, solutions sur mesure, support 24/7."
                  keywords="expertise digitalisation, transformation digitale, développement web Afrique, fintech, agence web Côte d'Ivoire"
                  url="https://leonceouattarastudiogroup.site/about"
                  image="https://leonceouattarastudiogroup.site/og-image-about.jpg"
                />
                <Header />
                <AboutPage />
                <Footer />
              </>
            } 
          />

          {/* PAGE BLOG (LISTE) */}
          <Route 
            path="/blog" 
            element={
              <>
                <SEO 
                  title="Blog - Actualités & Conseils Digitalisation Financière"
                  description="Articles, guides et tendances sur la transformation digitale des banques, assurances et institutions financières en Afrique. Conseils d'experts, études de cas et best practices."
                  keywords="blog fintech, actualités digitalisation bancaire, transformation digitale Afrique, conseils développement web, études de cas"
                  url="https://leonceouattarastudiogroup.site/blog"
                  image="https://leonceouattarastudiogroup.site/og-image-blog.jpg"
                />
                <Header />
                <BlogTech />
                <Footer />
              </>
            } 
          />

          {/* PAGE ARTICLE DE BLOG (DYNAMIQUE) */}
          <Route 
            path="/blog/:slug" 
            element={
              <>
                {/* SEO sera personnalisé dans BlogPost.tsx avec les données de l'article */}
                <Header />
                <BlogArticlePage />
                <Footer />
              </>
            } 
          />

          {/* PAGE LOGIN ADMIN */}
          <Route 
            path="/admin/login" 
            element={
              <>
                <SEO 
                  title="Admin Login - Espace Administrateur"
                  description="Connexion à l'espace administrateur Leonce Ouattara Studio"
                  url="https://leonceouattarastudiogroup.site/admin/login"
                  robots="noindex, nofollow"
                />
                <Login />
              </>
            } 
          />

          {/* PAGE DASHBOARD ADMIN (PROTÉGÉE) */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <>
                  <SEO 
                    title="Dashboard Admin - Gestion du Site"
                    description="Tableau de bord administrateur Leonce Ouattara Studio"
                    url="https://leonceouattarastudiogroup.site/admin/dashboard"
                    robots="noindex, nofollow"
                  />
                  <Dashboard />
                </>
              </ProtectedRoute>
            } 
          />
          {/* PAGE DE PRISE DE RENDEZ VOUS */}
          <Route 
            path="/reserver" 
            element={
              <>
                <SEO 
                  title="Planifier un rendez vous - Notre Expertise en Digitalisation Financière"
                  description="Rencontrer Leonce Ouattara Studio, votre partenaire de confiance pour la transformation digitale du secteur financier en Afrique. +10 ans d'expérience, solutions sur mesure, support 24/7."
                  keywords="expertise digitalisation, transformation digitale, développement web Afrique, fintech, agence web Côte d'Ivoire"
                  url="https://leonceouattarastudiogroup.site/reserver"
                  image="https://leonceouattarastudiogroup.site/og-image-about.jpg"
                />
                <Header />
                <BookingPage />
                <Footer />
              </>
            } 
          />

          {/* ROUTE 404 - PAGE NON TROUVÉE */}
          <Route 
            path="*" 
            element={
              <>
                <SEO 
                  title="Page Non Trouvée - 404"
                  description="La page que vous recherchez n'existe pas"
                  url="https://leonceouattarastudiogroup.site/404"
                  robots="noindex, nofollow"
                />
                <Header />
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                  <div className="text-center px-4">
                    <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                    <p className="text-2xl text-gray-400 mb-8">Page non trouvée</p>
                    <a 
                      href="/" 
                      className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
                    >
                      Retour à l'accueil
                    </a>
                  </div>
                </div>
                <Footer />
              </>
            } 
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
