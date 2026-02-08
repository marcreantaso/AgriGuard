import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'logo.svg'],
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
})
