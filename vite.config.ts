import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            '/api': 'http://localhost:3000'
        }
    },
    plugins: [
        react({
            // Enable automatic JSX runtime optimization
            jsxRuntime: 'automatic'
        }),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['logo.svg'],
            manifest: {
                name: 'AgriGuard',
                short_name: 'AgriGuard',
                description: 'AI-powered crop disease detection for Filipino farmers',
                theme_color: '#4CAF50',
                background_color: '#ffffff',
                display: 'standalone',
                icons: [
                    {
                        src: 'logo.svg',
                        sizes: '192x192',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
                    },
                    {
                        src: 'logo.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
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
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                    'vendor-ui': ['framer-motion', 'lucide-react', 'sonner'],
                    'vendor-utils': ['clsx', 'date-fns', 'tailwind-merge'],
                    'vendor-ml': ['@tensorflow/tfjs'],
                    'vendor-camera': ['react-webcam'],
                    // Email service
                    'vendor-email': ['@emailjs/browser']
                }
            }
        },
        // Minify and optimize
        minify: 'esbuild',
        // Target modern browsers
        target: 'esnext',
        // Increase chunk size limit for initial load
        chunkSizeWarningLimit: 1000,
        // Report compressed size
        reportCompressedSize: true
    },

    // Optimization
    optimizeDeps: {
        // Pre-bundle common dependencies
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            'framer-motion',
            'clsx'
        ],
        // Exclude files that shouldn't be pre-bundled
        exclude: ['@tensorflow/tfjs']
    },

})
