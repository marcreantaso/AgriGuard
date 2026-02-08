/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'agri-green': {
                    50: '#e8f5e9',
                    100: '#c8e6c9',
                    500: '#4caf50',
                    600: '#43a047',
                    700: '#388e3c', // darker for contrast
                },
                'agri-orange': {
                    50: '#fff3e0',
                    100: '#ffe0b2',
                    500: '#ff9800',
                    600: '#fb8c00',
                },
                'agri-dark': '#1a1a1a',
                'agri-gray': '#f5f5f5',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'scan': 'scan 2s linear infinite',
            },
            keyframes: {
                scan: {
                    '0%': { top: '0%' },
                    '100%': { top: '100%' },
                }
            }
        },
    },
    plugins: [],
}
