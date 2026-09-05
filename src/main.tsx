import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initPerformanceMonitoring } from './utils/performanceMonitor'
import { prefetchRoutes } from './utils/lazyLoad'

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
