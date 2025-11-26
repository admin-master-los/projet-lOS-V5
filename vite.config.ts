import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Analyser le bundle (générer stats.html)
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  
  build: {
    // Taille optimale des chunks
    chunkSizeWarningLimit: 1000,
    
    // Optimisations rollup
    rollupOptions: {
      output: {
        // Code splitting manuel
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'ui-vendor': ['lucide-react', 'react-hot-toast'],
          
          // Admin chunks
          'admin': [
            './src/admin/pages/Dashboard.tsx',
            './src/admin/pages/Login.tsx',
          ],
          'admin-meetings': [
            './src/admin/pages/Meeting.tsx',
            './src/admin/components/meetings/MeetingsList.tsx',
            './src/admin/components/meetings/MeetingsCalendar.tsx',
          ],
          'admin-analytics': [
            './src/admin/pages/Analytics.tsx',
          ],
          'admin-blog': [
            './src/admin/pages/Blog.tsx',
            './src/admin/pages/BlogForm.tsx',
          ],
        },
        
        // Noms de fichiers optimisés
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    
    // Minification avec esbuild (plus rapide que terser)
    minify: 'esbuild',
    
    // Options esbuild
    esbuild: {
      drop: ['console', 'debugger'], // Supprimer en prod
    },
    
    // Source maps en prod (désactiver pour prod finale)
    sourcemap: false,
  },
  
  // Optimisations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/supabase-js',
    ],
  },
  
  // Server config
  server: {
    port: 5173,
    strictPort: true,
    open: false,
  },
  
  // Preview config
  preview: {
    port: 4173,
    strictPort: true,
  },
});
