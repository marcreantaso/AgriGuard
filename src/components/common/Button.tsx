import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    icon: Icon,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-agri-green-500 hover:bg-agri-green-600 text-white shadow-lg shadow-agri-green-500/30 focus:ring-agri-green-500",
        secondary: "bg-agri-orange-500 hover:bg-agri-orange-600 text-white shadow-lg shadow-agri-orange-500/30 focus:ring-agri-orange-500",
        outline: "border-2 border-agri-green-500 text-agri-green-500 hover:bg-agri-green-50 focus:ring-agri-green-500",
        ghost: "text-agri-dark hover:bg-agri-gray focus:ring-agri-dark",
        white: "bg-white text-agri-green-600 hover:bg-gray-50 shadow-md",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        icon: "p-3",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {Icon && <Icon className={cn("w-5 h-5", children ? "mr-2" : "")} />}
            {children}
        </motion.button>
    );
};

export default Button;
