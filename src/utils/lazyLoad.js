/**
 * Lazy loading utilities for routes and components
 * Reduces initial bundle size through code splitting
 */

import React, { Suspense, lazy } from 'react';

/**
 * Loading fallback component
 */
const LoadingFallback = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
        <div className="w-16 h-16 border-4 border-agri-green-100 border-t-agri-green-500 rounded-full animate-spin mb-4"></div>
        <p className="text-agri-green-600 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Loading...</p>
    </div>
);

/**
 * Lazy load a component with loading fallback
 */
export const lazyLoad = (importFunc, fallback = <LoadingFallback />) => {
    const Component = lazy(() =>
        importFunc().catch(err => {
            console.error('Failed to load component:', err);
            return { default: () => <div>Error loading component</div> };
        })
    );

    return (props) => (
        <Suspense fallback={fallback}>
            <Component {...props} />
        </Suspense>
    );
};

/**
 * Lazy load page components with route-based code splitting
 */
export const lazyPages = {
    Home: lazyLoad(() => import('../pages/Home')),
    Scan: lazyLoad(() => import('../pages/Scan')),
    Result: lazyLoad(() => import('../pages/Result')),
    History: lazyLoad(() => import('../pages/History')),
    FieldVisits: lazyLoad(() => import('../pages/FieldVisits')),
    Marketplace: lazyLoad(() => import('../pages/Marketplace')),
    MarketplaceDetail: lazyLoad(() => import('../pages/MarketplaceDetail')),
    Wallet: lazyLoad(() => import('../pages/Wallet')),
    SafetyLogs: lazyLoad(() => import('../pages/SafetyLogs')),
    Analytics: lazyLoad(() => import('../pages/Analytics')),
    Profile: lazyLoad(() => import('../pages/Profile')),
    More: lazyLoad(() => import('../pages/More')),
    Login: lazyLoad(() => import('../pages/Login'))
};

/**
 * Preload a lazy component (for performance hint)
 */
export const preloadComponent = async (importFunc) => {
    try {
        await importFunc();
    } catch (error) {
        console.warn('Failed to preload component:', error);
    }
};

/**
 * Prefetch routes on hover or navigation prediction
 */
export const prefetchRoutes = () => {
    // Prefetch common navigation paths
    const routesToPrefetch = [
        () => import('../pages/Scan'),
        () => import('../pages/History'),
        () => import('../pages/Marketplace')
    ];

    // Prefetch on idle
    if ('requestIdleCallback' in window) {
        routesToPrefetch.forEach(route => {
            requestIdleCallback(() => preloadComponent(route));
        });
    }
};

export default lazyPages;
