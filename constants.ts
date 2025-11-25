
// Placeholder for the cinematic Dubai background
// In a real deployment, replace with a high-res optimized WebP
export const DUBAI_BG_URL = "https://images.unsplash.com/photo-1512453979798-5ea904ac22de?q=80&w=2000&auto=format&fit=crop";

// REPLACE: Update these paths with your actual local assets
// Currently pointing to a public Three.js example model to ensure the app loads without 404 errors
export const ROBOT_ASSETS = {
  // GLTF Models (Draco Compressed recommended)
  // Switched to GitHub Raw for better reliability/CORS handling than the website URL
  HIGH: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/RobotExpressive/RobotExpressive.glb', 
  MED: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
  LOW: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
  
  // Fallback Image (WebP)
  FALLBACK_IMAGE: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop'
};

export const MOON_ASSETS = {
  BASE: '/mnt/data/da5522d0-1409-45f0-85d3-f4319836fef9.png'
};

export const BEE_ASSETS = {
  HIGH: '/assets/bee/bee_high.glb',
  MED: '/assets/bee/bee_med.glb',
  LOW: '/assets/bee/bee_low.glb', 
  FALLBACK_SPRITE: '/mnt/data/da5522d0-1409-45f0-85d3-f4319836fef9.png'
};

export const BEE_CONFIG = {
  BOUNDS: { x: [-2.0, 2.0], y: [0.5, 2.5], z: [-1.0, 2.0] },
  SPEED_RANGE: [0.8, 1.5],
  WANDER_INTERVAL: [2000, 6000],
  AVOID_RADIUS_PX: 120,
  SCALE: 0.45 
};

export const LINKS = {
  linkedin: "https://www.linkedin.com/in/shoeb-akhtar-95ab742a5",
  whatsapp: "https://wa.me/919170533987",
  email: "shoebakhtar8199@gmail.com",
  cv: "https://www.canva.com/design/DAG5T6Zp_UI/rxnEJguU96a4vBfa44qy2w/view?utm_content=DAG5T6Zp_UI&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h5263c64652",
  work: "https://trendeditagency.my.canva.site/"
};

export const SERVICES = [
  {
    title: "Performance Marketing",
    description: "Data-driven campaigns designed to maximize ROI and conversion rates across all digital channels."
  },
  {
    title: "Content Marketing",
    description: "Strategic storytelling that builds brand authority and engages audiences on a global scale."
  },
  {
    title: "Paid Ads Ecosystems",
    description: "Precision targeting on Meta, Google, and LinkedIn to capture high-intent leads."
  },
  {
    title: "AI Agent Automation",
    description: "Deploying intelligent agents to automate customer service, outreach, and internal workflows."
  },
  {
    title: "Data Science & ML",
    description: "Predictive sales modeling and customer segmentation using advanced Machine Learning algorithms."
  },
  {
    title: "Lead Gen Systems",
    description: "Building automated funnels that nurture cold prospects into loyal high-ticket clients."
  }
];

export const CERTIFICATIONS = [
  { issuer: "Google", year: "Data Analytics Pro" },
  { issuer: "Meta", year: "Marketing Science" },
  { issuer: "Microsoft", year: "Azure AI Fundamentals" },
  { issuer: "Oracle", year: "Cloud Infrastructure" },
  { issuer: "IBM", year: "Data Science Professional" },
  { issuer: "Reliance", year: "Digital Strategy" }
];

export const TESTIMONIALS = [
  {
    name: "Sarah Jenkins",
    role: "CMO, Global Tech",
    text: "Shoeb's approach to performance marketing transformed our quarterly revenue. The ROI was immediate.",
    rating: 5,
    logo: ""
  },
  {
    name: "Ahmed Al-Fayed",
    role: "Founder, Dubai Real Estate",
    text: "World-class delivery. The AI automation systems saved us 40+ hours a week.",
    rating: 5,
    logo: ""
  },
  {
    name: "Rajiv Mehta",
    role: "Director, FinServ",
    text: "Exceptional grasp of Data Science applied to sales. Highly recommended for scaling businesses.",
    rating: 5,
    logo: ""
  },
  {
    name: "Elena Rossi",
    role: "VP Marketing, Luxe Fashion",
    text: "The strategic paid ads campaigns doubled our ROAS within two months. A true partner in growth.",
    rating: 5,
    logo: ""
  },
  {
    name: "David Chen",
    role: "CEO, TechStart",
    text: "Shoeb's predictive ML models helped us identify high-value clients we were previously missing.",
    rating: 5,
    logo: ""
  },
  {
    name: "Fatima Hassan",
    role: "Operations Lead, Logistics Co",
    text: "Automating our lead gen funnel saved our team countless hours. The system runs flawlessly.",
    rating: 5,
    logo: ""
  },
  {
    name: "James Wilson",
    role: "Founder, Wilson & Partners",
    text: "Professional, data-driven, and results-oriented. The best digital strategist we've worked with.",
    rating: 5,
    logo: ""
  },
  {
    name: "Maria Garcia",
    role: "Head of Growth, EduTech",
    text: "The content marketing strategy established us as thought leaders in a crowded market.",
    rating: 5,
    logo: ""
  },
  {
    name: "Omar Siddiqui",
    role: "Director, Creative Agency",
    text: "Shoeb brings a rare combination of creative flair and analytical rigor. Outstanding results.",
    rating: 5,
    logo: ""
  },
  {
    name: "Jennifer Lee",
    role: "SVP, Banking Corp",
    text: "His insights into customer segmentation allowed us to personalize our outreach effectively.",
    rating: 5,
    logo: ""
  },
  {
    name: "Michael Brown",
    role: "Owner, E-com Giant",
    text: "Scaled our ad spend 5x while maintaining profitability. The numbers speak for themselves.",
    rating: 5,
    logo: ""
  },
  {
    name: "Priya Patel",
    role: "CMO, Wellness Brand",
    text: "A seamless experience from strategy to execution. Our brand visibility has never been higher.",
    rating: 5,
    logo: ""
  },
  {
    name: "Thomas Anderson",
    role: "CTO, Software Solutions",
    text: "The AI agents deployed for customer support reduced ticket resolution time by 60%.",
    rating: 5,
    logo: ""
  },
  {
    name: "Sophie Martin",
    role: "Founder, Design Studio",
    text: "Shoeb understands the nuances of luxury marketing. Our high-ticket sales increased significantly.",
    rating: 5,
    logo: ""
  },
  {
    name: "Daniel Kim",
    role: "Director of Sales, AutoGroup",
    text: "The lead generation system delivers qualified prospects consistently. A game changer.",
    rating: 5,
    logo: ""
  }
];

export const CAROUSEL_CONFIG = {
  SPEED_PX_PER_SEC: 50,
  GAP_PX: 24,
  CARD_WIDTH_DESKTOP: 400,
  CARD_WIDTH_MOBILE: 300
};
