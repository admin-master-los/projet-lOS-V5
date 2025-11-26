import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Leonce Ouattara Studio - Digitalisation Secteur Financier',
  description = 'Studio de développement web spécialisé dans la digitalisation des banques, assurances et institutions de microfinance en Afrique. Expertise en solutions sur mesure, zéro papier.',
  keywords = 'développement web, digitalisation, banque, assurance, microfinance, Côte d\'Ivoire, Afrique, fintech, transformation digitale, zéro papier',
  image = 'https://leonceouattarastudiogroup.site/og-image.jpg',
  url = 'https://leonceouattarastudiogroup.site',
  type = 'website'
}) => {
  const fullTitle = title.includes('Leonce Ouattara Studio') 
    ? title 
    : `${title} | Leonce Ouattara Studio`;

  return (
    <Helmet>
      {/* Meta Tags Basiques */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="google-site-verification" content="T2n8BFQ87jDP7vWoLCpYW5r9pfl98408gHhsnmadY_0" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Leonce Ouattara Studio" />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Autres Meta Tags */}
      <meta name="author" content="Leonce Ouattara Studio" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="French" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Liens Canoniques */}
      <link rel="canonical" href={url} />
      
      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Langue */}
      <html lang="fr" />
    </Helmet>
  );
};

export default SEO;
