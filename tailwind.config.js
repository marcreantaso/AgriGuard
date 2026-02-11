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
                'agri-blue': {
                    50: '#e3f2fd',
                    100: '#bbdefb',
                    500: '#2196f3',
                    600: '#1e88e5',
                    700: '#1565c0',
                },
                'agri-red': {
                    50: '#ffebee',
                    100: '#ffcdd2',
                    500: '#f44336',
                    600: '#e53935',
                    700: '#c62828',
                },
                'agri-purple': {
                    50: '#f3e5f5',
                    100: '#e1bee7',
                    500: '#9c27b0',
                    600: '#8e24aa',
                    700: '#6a1b9a',
                },
                'agri-amber': {
                    50: '#fff8e1',
                    100: '#ffecb3',
                    500: '#ffc107',
                    600: '#ffb300',
                    700: '#ff8f00',
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
