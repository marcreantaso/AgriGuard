// vite.config.ts
import { defineConfig } from "file:///C:/Users/Malagad/Downloads/AgriGuard/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Malagad/Downloads/AgriGuard/node_modules/@vitejs/plugin-react/dist/index.js";
import { VitePWA } from "file:///C:/Users/Malagad/Downloads/AgriGuard/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:3000"
    }
  },
  plugins: [
    react({
      // Enable automatic JSX runtime optimization
      jsxRuntime: "automatic"
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.svg"],
      manifest: {
        name: "AgriGuard",
        short_name: "AgriGuard",
        description: "AI-powered crop disease detection for Filipino farmers",
        theme_color: "#4CAF50",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "logo.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any maskable"
          },
          {
            src: "logo.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      }
    })
  ],
  // Build optimization
  build: {
    // Code splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["framer-motion", "lucide-react", "sonner"],
          "vendor-utils": ["clsx", "date-fns", "tailwind-merge"],
          "vendor-ml": ["@tensorflow/tfjs"],
          "vendor-camera": ["react-webcam"],
          // Email service
          "vendor-email": ["@emailjs/browser"]
        }
      }
    },
    // Minify and optimize
    minify: "esbuild",
    // Target modern browsers
    target: "esnext",
    // Increase chunk size limit for initial load
    chunkSizeWarningLimit: 1e3,
    // Report compressed size
    reportCompressedSize: true
  },
  // Optimization
  optimizeDeps: {
    // Pre-bundle common dependencies
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "clsx"
    ],
    // Exclude files that shouldn't be pre-bundled
    exclude: ["@tensorflow/tfjs"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxNYWxhZ2FkXFxcXERvd25sb2Fkc1xcXFxBZ3JpR3VhcmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXE1hbGFnYWRcXFxcRG93bmxvYWRzXFxcXEFncmlHdWFyZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvTWFsYWdhZC9Eb3dubG9hZHMvQWdyaUd1YXJkL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgICAgICcvYXBpJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCdcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAgIHJlYWN0KHtcclxuICAgICAgICAgICAgLy8gRW5hYmxlIGF1dG9tYXRpYyBKU1ggcnVudGltZSBvcHRpbWl6YXRpb25cclxuICAgICAgICAgICAganN4UnVudGltZTogJ2F1dG9tYXRpYydcclxuICAgICAgICB9KSxcclxuICAgICAgICBWaXRlUFdBKHtcclxuICAgICAgICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXHJcbiAgICAgICAgICAgIGluY2x1ZGVBc3NldHM6IFsnbG9nby5zdmcnXSxcclxuICAgICAgICAgICAgbWFuaWZlc3Q6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdBZ3JpR3VhcmQnLFxyXG4gICAgICAgICAgICAgICAgc2hvcnRfbmFtZTogJ0FncmlHdWFyZCcsXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0FJLXBvd2VyZWQgY3JvcCBkaXNlYXNlIGRldGVjdGlvbiBmb3IgRmlsaXBpbm8gZmFybWVycycsXHJcbiAgICAgICAgICAgICAgICB0aGVtZV9jb2xvcjogJyM0Q0FGNTAnLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ3N0YW5kYWxvbmUnLFxyXG4gICAgICAgICAgICAgICAgaWNvbnM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogJ2xvZ28uc3ZnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3N2Zyt4bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwdXJwb3NlOiAnYW55IG1hc2thYmxlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmM6ICdsb2dvLnN2ZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9zdmcreG1sJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHVycG9zZTogJ2FueSBtYXNrYWJsZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgXSxcclxuICAgIFxyXG4gICAgLy8gQnVpbGQgb3B0aW1pemF0aW9uXHJcbiAgICBidWlsZDoge1xyXG4gICAgICAgIC8vIENvZGUgc3BsaXR0aW5nIHN0cmF0ZWd5XHJcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFZlbmRvciBjaHVua3MgZm9yIGJldHRlciBjYWNoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci1yZWFjdCc6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcclxuICAgICAgICAgICAgICAgICAgICAndmVuZG9yLXVpJzogWydmcmFtZXItbW90aW9uJywgJ2x1Y2lkZS1yZWFjdCcsICdzb25uZXInXSxcclxuICAgICAgICAgICAgICAgICAgICAndmVuZG9yLXV0aWxzJzogWydjbHN4JywgJ2RhdGUtZm5zJywgJ3RhaWx3aW5kLW1lcmdlJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci1tbCc6IFsnQHRlbnNvcmZsb3cvdGZqcyddLFxyXG4gICAgICAgICAgICAgICAgICAgICd2ZW5kb3ItY2FtZXJhJzogWydyZWFjdC13ZWJjYW0nXSxcclxuICAgICAgICAgICAgICAgICAgICAvLyBFbWFpbCBzZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci1lbWFpbCc6IFsnQGVtYWlsanMvYnJvd3NlciddXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIE1pbmlmeSBhbmQgb3B0aW1pemVcclxuICAgICAgICBtaW5pZnk6ICdlc2J1aWxkJyxcclxuICAgICAgICAvLyBUYXJnZXQgbW9kZXJuIGJyb3dzZXJzXHJcbiAgICAgICAgdGFyZ2V0OiAnZXNuZXh0JyxcclxuICAgICAgICAvLyBJbmNyZWFzZSBjaHVuayBzaXplIGxpbWl0IGZvciBpbml0aWFsIGxvYWRcclxuICAgICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXHJcbiAgICAgICAgLy8gUmVwb3J0IGNvbXByZXNzZWQgc2l6ZVxyXG4gICAgICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiB0cnVlXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIE9wdGltaXphdGlvblxyXG4gICAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgICAgLy8gUHJlLWJ1bmRsZSBjb21tb24gZGVwZW5kZW5jaWVzXHJcbiAgICAgICAgaW5jbHVkZTogW1xyXG4gICAgICAgICAgICAncmVhY3QnLFxyXG4gICAgICAgICAgICAncmVhY3QtZG9tJyxcclxuICAgICAgICAgICAgJ3JlYWN0LXJvdXRlci1kb20nLFxyXG4gICAgICAgICAgICAnZnJhbWVyLW1vdGlvbicsXHJcbiAgICAgICAgICAgICdjbHN4J1xyXG4gICAgICAgIF0sXHJcbiAgICAgICAgLy8gRXhjbHVkZSBmaWxlcyB0aGF0IHNob3VsZG4ndCBiZSBwcmUtYnVuZGxlZFxyXG4gICAgICAgIGV4Y2x1ZGU6IFsnQHRlbnNvcmZsb3cvdGZqcyddXHJcbiAgICB9LFxyXG5cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3UyxTQUFTLG9CQUFvQjtBQUNyVSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBR3hCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFFBQVE7QUFBQSxJQUNKLE9BQU87QUFBQSxNQUNILFFBQVE7QUFBQSxJQUNaO0FBQUEsRUFDSjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsTUFBTTtBQUFBO0FBQUEsTUFFRixZQUFZO0FBQUEsSUFDaEIsQ0FBQztBQUFBLElBQ0QsUUFBUTtBQUFBLE1BQ0osY0FBYztBQUFBLE1BQ2QsZUFBZSxDQUFDLFVBQVU7QUFBQSxNQUMxQixVQUFVO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsUUFDYixrQkFBa0I7QUFBQSxRQUNsQixTQUFTO0FBQUEsUUFDVCxPQUFPO0FBQUEsVUFDSDtBQUFBLFlBQ0ksS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFlBQ04sU0FBUztBQUFBLFVBQ2I7QUFBQSxVQUNBO0FBQUEsWUFDSSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsWUFDTixTQUFTO0FBQUEsVUFDYjtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQUEsSUFDSixDQUFDO0FBQUEsRUFDTDtBQUFBO0FBQUEsRUFHQSxPQUFPO0FBQUE7QUFBQSxJQUVILGVBQWU7QUFBQSxNQUNYLFFBQVE7QUFBQSxRQUNKLGNBQWM7QUFBQTtBQUFBLFVBRVYsZ0JBQWdCLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ3pELGFBQWEsQ0FBQyxpQkFBaUIsZ0JBQWdCLFFBQVE7QUFBQSxVQUN2RCxnQkFBZ0IsQ0FBQyxRQUFRLFlBQVksZ0JBQWdCO0FBQUEsVUFDckQsYUFBYSxDQUFDLGtCQUFrQjtBQUFBLFVBQ2hDLGlCQUFpQixDQUFDLGNBQWM7QUFBQTtBQUFBLFVBRWhDLGdCQUFnQixDQUFDLGtCQUFrQjtBQUFBLFFBQ3ZDO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQTtBQUFBLElBRUEsUUFBUTtBQUFBO0FBQUEsSUFFUixRQUFRO0FBQUE7QUFBQSxJQUVSLHVCQUF1QjtBQUFBO0FBQUEsSUFFdkIsc0JBQXNCO0FBQUEsRUFDMUI7QUFBQTtBQUFBLEVBR0EsY0FBYztBQUFBO0FBQUEsSUFFVixTQUFTO0FBQUEsTUFDTDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNKO0FBQUE7QUFBQSxJQUVBLFNBQVMsQ0FBQyxrQkFBa0I7QUFBQSxFQUNoQztBQUVKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
