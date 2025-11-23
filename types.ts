import { ReactNode } from 'react';

export interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export interface ServiceCardProps {
  title: string;
  description: string;
  delay: number;
}

export interface ClientLogoProps {
  name: string;
  logoText: string; // Using text as placeholder for logos
}

export interface CertificationProps {
  issuer: string;
  year: string;
}

export interface TestimonialProps {
  name: string;
  role: string;
  text: string;
  rating: number;
}
