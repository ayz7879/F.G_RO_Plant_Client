import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the service worker when new content is available
      injectRegister: 'auto',    // Automatically injects service worker registration
      manifest: {
        name: 'FG Ro Plant',      // Full name of your app
        short_name: 'FG App',    // Shorter name for your app
        description: 'A React app with PWA support',
        theme_color: '#ffffff',    // Theme color for your PWA
        background_color: '#ffffff', // Background color for your app
        display: 'standalone',     // Makes it behave like a native app
        start_url: '/',            // The initial URL when the app is opened
        icons: [
          {
            src: '/public/fg-logo.jpg', // Path to the icon (you'll need to create this)
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/public/fg-logo.jpg', // Path to the icon (you'll need to create this)
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: true, // Enable PWA features during development (optional)
      },
    }),
  ],
});

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
