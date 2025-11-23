
import React, { useState } from 'react';
import { Scroll } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ArrowRight, Download, ExternalLink, Star, MapPin, Mail, Phone, Linkedin } from 'lucide-react';
import { SERVICES, CERTIFICATIONS, TESTIMONIALS, LINKS } from '../constants';
import { GlassCard } from './GlassCard';
import { AnimatedMoon } from './AnimatedMoon';
import { TestimonialCarousel } from './TestimonialCarousel';

// --- SECTIONS ---

const HeroSection = () => (
  <section className="w-full h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-start px-6 lg:px-20 max-w-screen-xl mx-auto gap-8 lg:gap-16">
    
    {/* Left: Animated Moon Character */}
    <div className="flex-shrink-0 order-1 lg:order-none">
      <AnimatedMoon />
    </div>

    {/* Right: Text Content */}
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      className="max-w-3xl z-10 text-center lg:text-left"
    >
      <h2 className="text-gold-400 font-sans tracking-[0.2em] text-sm mb-4 uppercase">International Digital Strategist</h2>
      <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
        Shoeb Akhtar
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl backdrop-blur-sm mx-auto lg:mx-0">
        Worked with <span className="text-white font-bold">250+ clients</span>. Generated billions of views & massive sales using Performance Marketing, Content Marketing, Paid Ads, AI Agent Automation, Data Science & ML.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
        <a 
          href={LINKS.cv}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-black font-bold rounded-full transition-all hover:scale-105"
        >
          <Download size={18} /> View CV
        </a>
        <a 
          href={LINKS.work}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 px-8 py-4 border border-white/30 hover:bg-white/10 backdrop-blur-md text-white rounded-full transition-all hover:scale-105"
        >
          <ExternalLink size={18} /> My Work
        </a>
      </div>
    </motion.div>
  </section>
);

const ServicesSection = () => (
  <section className="w-full min-h-screen py-24 px-6 lg:px-20 max-w-screen-xl mx-auto">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-serif mb-16 text-center"
    >
      Strategic <span className="text-gold-400">Expertise</span>
    </motion.h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SERVICES.map((service, index) => (
        <GlassCard key={index} delay={index * 0.1}>
          <h3 className="text-2xl font-serif mb-3 text-white">{service.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
          <div className="mt-4 w-8 h-1 bg-gold-500 rounded-full" />
        </GlassCard>
      ))}
    </div>
  </section>
);

const CertificationsSection = () => (
  <section className="w-full py-24 px-6 lg:px-20">
    <div className="max-w-screen-xl mx-auto">
       <motion.h2 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-4xl md:text-5xl font-serif mb-16 text-center md:text-left"
      >
        Global <span className="text-gold-400">Certifications</span>
      </motion.h2>
      
      <div className="flex flex-wrap justify-center md:justify-start gap-4">
        {CERTIFICATIONS.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
            className="px-6 py-3 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md flex items-center gap-3 hover:border-gold-500/50 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span className="font-bold text-white">{cert.issuer}</span>
            <span className="text-gray-500 text-sm">| {cert.year}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ClientsSection = () => (
  <section className="w-full py-24 px-0 max-w-screen-2xl mx-auto overflow-hidden">
    <motion.h2 className="text-4xl md:text-5xl font-serif mb-16 text-center px-6">
      Success <span className="text-gold-400">Stories</span>
    </motion.h2>
    
    <TestimonialCarousel />
  </section>
);

const ContactSection = () => (
  <section className="w-full py-32 px-6 lg:px-20 flex items-center justify-center">
    <div className="max-w-4xl w-full relative">
      {/* Decorative Elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      
      <GlassCard className="text-center py-16">
        <h2 className="text-4xl md:text-6xl font-serif mb-6">Ready to <span className="text-gold-400">Scale?</span></h2>
        <p className="text-gray-400 mb-12 max-w-lg mx-auto">
          Let's build your next international success story. Available for high-ticket consulting and creative direction.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <a 
            href={LINKS.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-[#0077b5] hover:bg-[#006396] text-white rounded-xl transition-all"
          >
            <Linkedin size={20} /> LinkedIn
          </a>
          <a 
            href={LINKS.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#1da851] text-white rounded-xl transition-all"
          >
            <Phone size={20} /> WhatsApp
          </a>
           <a 
            href={`mailto:${LINKS.email}`}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all"
          >
            <Mail size={20} /> Email Me
          </a>
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-2 text-gray-500 text-sm">
          <MapPin size={14} />
          <span>Based in India • Operating Globally</span>
        </div>
      </GlassCard>
    </div>
  </section>
);

export const HTMLContent: React.FC = () => {
  return (
    <Scroll html style={{ width: '100%', height: '100%' }}>
      <main className="w-screen overflow-x-hidden">
        <HeroSection />
        <ServicesSection />
        <CertificationsSection />
        <ClientsSection />
        <ContactSection />
        
        {/* Footer */}
        <footer className="w-full py-8 text-center text-gray-600 text-sm relative z-10">
          <p>© {new Date().getFullYear()} Shoeb Akhtar. All Rights Reserved.</p>
        </footer>
      </main>
    </Scroll>
  );
};
