import { useEffect } from 'react';
import { usePublishedBlogPosts } from '../admin/hooks/useBlogPosts';

/**
 * Composant Sitemap - Génère le sitemap.xml dynamiquement
 * Route: /sitemap.xml
 */
const Sitemap = () => {
  const { data: posts } = usePublishedBlogPosts();

  useEffect(() => {
    if (posts) {
      const baseUrl = window.location.origin;
      const currentDate = new Date().toISOString();

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Page d'accueil -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Page Blog Liste -->
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  ${posts
    .map(
      (post) => `
  <!-- Article: ${post.title} -->
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updated_at || post.published_at}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    ${
      post.featured_image
        ? `
    <image:image>
      <image:loc>${post.featured_image}</image:loc>
      <image:title>${post.title.replace(/[<>&'"]/g, '')}</image:title>
    </image:image>`
        : ''
    }
  </url>`
    )
    .join('')}

</urlset>`;

      // Créer un blob et télécharger
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      
      // Définir le type de contenu
      document.contentType = 'application/xml';
      
      // Remplacer le contenu de la page par le XML
      document.open();
      document.write(xml);
      document.close();
    }
  }, [posts]);

  return null;
};

export default Sitemap;
