
import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverEffect?: boolean;
  tabIndex?: number;
  role?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  hoverEffect = true,
  tabIndex,
  role
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      whileHover={hoverEffect ? { 
        scale: 1.02, 
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
      } : {}}
      className={`
        backdrop-blur-xl bg-white/[0.03] border border-white/[0.1] 
        rounded-2xl p-8 shadow-2xl relative overflow-hidden group
        ${className}
      `}
      tabIndex={tabIndex}
      role={role}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {children}
    </motion.div>
  );
};
