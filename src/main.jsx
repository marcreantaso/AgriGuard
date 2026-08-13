import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initPerformanceMonitoring } from './utils/performanceMonitor.js'
import { prefetchRoutes } from './utils/lazyLoad.js'

// Initialize performance monitoring in development
if (import.meta.env.DEV) {
    initPerformanceMonitoring();
    
    // Prefetch common routes on idle
    prefetchRoutes();
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
