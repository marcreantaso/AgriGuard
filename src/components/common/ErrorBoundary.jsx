import React from 'react';
import { AlertTriangle, Home } from 'lucide-react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center font-inter">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-24 h-24 bg-red-50 rounded-[40px] flex items-center justify-center text-red-500 mb-8 border border-red-100"
                    >
                        <AlertTriangle size={48} />
                    </motion.div>

                    <h1 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Something went wrong</h1>
                    <p className="text-gray-500 text-sm mb-12 leading-relaxed max-w-xs">
                        We encountered an unexpected error. Don't worry, your crops are safe. Please try refreshing or going back home.
                    </p>

                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex items-center gap-3 bg-agri-green-500 text-white font-black py-4 px-8 rounded-3xl shadow-lg shadow-agri-green-200 active:scale-95 transition-all"
                    >
                        <Home size={20} />
                        Back to Home
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
