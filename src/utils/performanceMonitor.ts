/**
 * Performance Monitoring & Analytics
 * Tracks key performance metrics for optimization
 */

export const performanceMonitor = {
    marks: {},
    measures: {},

    /**
     * Start measuring performance
     */
    start: (label) => {
        if (typeof window !== 'undefined' && window.performance) {
            window.performance.mark(`${label}-start`);
            performanceMonitor.marks[label] = Date.now();
        }
    },

    /**
     * End measuring and log duration
     */
    end: (label) => {
        if (typeof window !== 'undefined' && window.performance) {
            window.performance.mark(`${label}-end`);
            
            try {
                window.performance.measure(
                    label,
                    `${label}-start`,
                    `${label}-end`
                );
                
                const measure = window.performance.getEntriesByName(label)[0];
                const duration = measure?.duration || 0;
                
                if (duration > 100) {
                    console.warn(`⚠️ Performance: ${label} took ${duration.toFixed(2)}ms`);
                }
                
                return duration;
            } catch (error) {
                console.error('Performance measurement error:', error);
                return null;
            }
        }
    },

    /**
     * Log performance metric
     */
    log: (label, value, unit = 'ms') => {
        const isDev = import.meta.env.DEV;
        if (isDev) {
            console.log(`📊 ${label}: ${value}${unit}`);
        }
    },

    /**
     * Get Core Web Vitals
     */
    getVitals: async () => {
        if (typeof window === 'undefined') return null;

        return {
            // Largest Contentful Paint
            lcp: window.performance.getEntriesByName('largest-contentful-paint')[0]?.startTime || null,
            // First Input Delay (deprecated, using first interaction)
            fid: window.performance.getEntriesByType('first-input')[0]?.processingDuration || null,
            // Cumulative Layout Shift
            cls: calculateCLS(),
            // Time to First Byte
            ttfb: window.performance.timing.responseStart - window.performance.timing.navigationStart
        };
    },

    /**
     * Report performance metrics
     */
    report: () => {
        if (typeof window === 'undefined') return;

        const entries = window.performance.getEntries();
        const metrics = {
            navigation: entries.find(e => e.entryType === 'navigation'),
            resources: entries.filter(e => e.entryType === 'resource'),
            measures: entries.filter(e => e.entryType === 'measure')
        };

        console.group('📈 Performance Report');
        if (metrics.navigation) {
            console.log(`Page Load: ${metrics.navigation.loadEventEnd - metrics.navigation.navigationStart}ms`);
            console.log(`DOM Interactive: ${metrics.navigation.domInteractive - metrics.navigation.navigationStart}ms`);
            console.log(`DOM Complete: ${metrics.navigation.domComplete - metrics.navigation.navigationStart}ms`);
        }
        console.log(`Resources: ${metrics.resources.length} loaded`);
        console.log(`Total Resource Time: ${metrics.resources.reduce((sum, r) => sum + r.duration, 0).toFixed(2)}ms`);
        console.groupEnd();
    }
};

/**
 * Calculate Cumulative Layout Shift
 */
function calculateCLS() {
    if (typeof window === 'undefined') return 0;

    let clsValue = 0;
    const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
            }
        }
    });

    try {
        observer.observe({ type: 'layout-shift', buffered: true });
    } catch (error) {
        console.debug('CLS observer not supported');
    }

    return clsValue;
}

/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = () => {
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
        // Log when page loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                performanceMonitor.report();
            }, 0);
        });

        // Log Web Vitals
        if ('web-vital' in window) {
            performanceMonitor.getVitals().then(vitals => {
                console.log('🎯 Core Web Vitals:', vitals);
            });
        }
    }
};
