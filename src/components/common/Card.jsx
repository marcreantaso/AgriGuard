import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = "", onClick, animate = true }) => {
    const Wrapper = animate ? motion.div : 'div';

    return (
        <Wrapper
            onClick={onClick}
            whileHover={animate && onClick ? { y: -4, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" } : {}}
            className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
        >
            {children}
        </Wrapper>
    );
};

export default Card;
