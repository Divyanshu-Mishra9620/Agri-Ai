<<<<<<< HEAD
import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  padding = 'default',
  shadow = 'default',
  ...props 
}) {
  // Base styles for the card
  const baseStyles = 'relative overflow-hidden transition-all duration-300';
  
  // Variant styles
  const variants = {
    default: 'bg-white border border-gray-200',
    glass: 'bg-white/80 backdrop-blur-xl border border-white/20',
    gradient: 'bg-gradient-to-br from-white to-green-50/30 border border-green-100',
    dark: 'bg-gray-900 border border-gray-700 text-white',
    green: 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200',
    transparent: 'bg-transparent border-none'
  };
  
  // Padding options
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };
  
  // Shadow options
  const shadowStyles = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    default: 'shadow-lg hover:shadow-xl',
    lg: 'shadow-xl hover:shadow-2xl',
    xl: 'shadow-2xl hover:shadow-3xl'
  };
  
  // Hover effects
  const hoverStyles = hover 
    ? 'hover:scale-[1.02] hover:-translate-y-1 cursor-pointer' 
    : '';
  
  // Combine all styles
  const cardStyles = `
    ${baseStyles}
    ${variants[variant]}
    ${paddingStyles[padding]}
    ${shadowStyles[shadow]}
    ${hoverStyles}
    rounded-2xl
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <motion.div
      {...props}
      className={cardStyles}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 }
      } : {}}
    >
      {/* Optional decorative elements for farming theme */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Card content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// Optional: Export additional card components for specific use cases
export function FeatureCard({ icon, title, description, ...props }) {
  return (
    <Card variant="glass" shadow="lg" {...props}>
      <div className="text-center">
        <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
}

export function StatCard({ value, label, icon, ...props }) {
  return (
    <Card variant="gradient" shadow="lg" padding="lg" {...props}>
      <div className="text-center">
        {icon && (
          <div className="text-3xl mb-3">{icon}</div>
        )}
        <div className="text-4xl font-black text-green-700 mb-2 group-hover:scale-110 transition-transform duration-300">
          {value}
        </div>
        <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
          {label}
        </div>
      </div>
    </Card>
  );
}

export function ImageCard({ image, title, description, children, ...props }) {
  return (
    <Card variant="transparent" shadow="xl" padding="none" {...props}>
      <div className="relative overflow-hidden rounded-2xl">
        {image && (
          <div className="aspect-video overflow-hidden">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        )}
        <div className="p-6">
          {title && (
            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors duration-300">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-gray-600 leading-relaxed mb-4">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </Card>
  );
=======
export default function Card({ className = '', ...props }) {
  return <div {...props} className={`card p-6 rounded-2xl shadow-lg ${className}`} />;
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
}
