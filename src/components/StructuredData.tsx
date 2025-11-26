import React from 'react';
import { Helmet } from 'react-helmet-async';

const StructuredData: React.FC = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Leonce Ouattara Studio",
    "alternateName": "LOS Group",
    "url": "https://leonceouattarastudiogroup.site",
    "logo": "https://leonceouattarastudiogroup.site/logo.png",
    "description": "Studio de développement web spécialisé dans la digitalisation des banques, assurances et institutions de microfinance en Afrique.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Abidjan",
      "addressCountry": "CI"
    },
    "sameAs": [
      // Ajouter vos réseaux sociaux ici
      // "https://www.linkedin.com/company/leonce-ouattara-studio",
      // "https://twitter.com/leonceouattara",
      // "https://www.facebook.com/leonceouattarastudio"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "contact@leonceouattarastudiogroup.site",
      "availableLanguage": ["fr", "en"]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Leonce Ouattara Studio",
    "url": "https://leonceouattarastudiogroup.site",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://leonceouattarastudiogroup.site/blog?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Leonce Ouattara Studio",
    "image": "https://leonceouattarastudiogroup.site/og-image.jpg",
    "url": "https://leonceouattarastudiogroup.site",
    "telephone": "+225-XX-XX-XX-XX", // Mettre votre numéro
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Abidjan",
      "addressCountry": "CI"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 5.316667,
      "longitude": -4.033333
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "18:00"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(professionalServiceSchema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
