
import { SiteData, ChartData } from './types';

export const INITIAL_DATA: SiteData = {
  hero: {
    name: "SathiEliza",
    title: "Digital Marketing Expert & Growth Hacker",
    description: "I help businesses thrive in the digital age. Using data-driven strategies and creative campaigns to connect your brand with the right audience.",
    cta: "Get Free Consultation"
  },
  about: {
    text: "Over the past 5 years, I've worked with diverse clients globally. My primary focus is to maximize your Return on Investment (ROI) through performance-driven marketing strategies that actually move the needle.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    experience: "5+ Years of Digital Marketing Excellence",
    skills: ["Google Ads", "Facebook Meta Ads", "SEO Optimization", "Content Strategy", "Email Automation", "Data Analytics"],
    usp: "I don't just run ads; I build high-converting ecosystems that turn clicks into loyal customers using advanced psychological triggers and data-backed insights.",
    stats: [
      { label: "Successful Projects", value: "150+" },
      { label: "Ad Spend Managed", value: "$500k+" },
      { label: "Satisfied Clients", value: "100+" },
      { label: "ROI Growth", value: "300%" }
    ]
  },
  services: [
    {
      id: "1",
      title: "Digital Marketing",
      description: "Comprehensive 360° digital strategies to build brand awareness and capture market share.",
      icon: "Globe"
    },
    {
      id: "2",
      title: "Email Marketing",
      description: "Automated, high-converting email funnels that nurture leads and drive consistent revenue.",
      icon: "Mail"
    },
    {
      id: "3",
      title: "Analytics",
      description: "In-depth data tracking and visualization to uncover growth opportunities and optimize spend.",
      icon: "BarChart"
    },
    {
      id: "4",
      title: "Lead Generation",
      description: "Fueling your sales pipeline with high-quality, verified leads ready to convert.",
      icon: "Target"
    },
    {
      id: "5",
      title: "Social Media Marketing (SMM)",
      description: "Building community and driving engagement across Facebook, Instagram, LinkedIn, and more.",
      icon: "Users"
    },
    {
      id: "6",
      title: "Ecommerce Growth Marketing",
      description: "Specialized scaling strategies for online stores to maximize ROAS and customer LTV.",
      icon: "ShoppingBag"
    }
  ],
  projects: [
    {
      id: "p1",
      title: "E-commerce Growth Campaign",
      category: "E-commerce",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
      result: "5X Revenue Growth"
    },
    {
      id: "p2",
      title: "B2B Lead Generation",
      category: "Lead Gen",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      result: "1000+ Verified Leads"
    },
    {
      id: "p3",
      title: "Real Estate PPC Strategy",
      category: "Google Ads",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      result: "40% Lower Cost Per Lead"
    },
    {
      id: "p4",
      title: "Fashion Brand SMM",
      category: "Social Media",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
      result: "250% Engagement Boost"
    }
  ],
  testimonials: [
    {
      id: "t1",
      name: "Sarah Jenkins",
      role: "CEO, GlowBeauty",
      feedback: "Tanvir completely transformed our online presence. Our conversion rate tripled within three months of working with him! His approach to data is truly unique.",
      avatar: "https://i.pravatar.cc/150?u=sarah"
    },
    {
      id: "t2",
      name: "Mark Thompson",
      role: "Marketing Director, TechFlow",
      feedback: "The level of insight provided through the analytics dashboards was a game-changer for our quarterly planning. We finally know where our money goes.",
      avatar: "https://i.pravatar.cc/150?u=mark"
    },
    {
      id: "t3",
      name: "Elena Rodriguez",
      role: "Founder, EcoStore",
      feedback: "Strategic, professional, and results-oriented. The lead generation campaign surpassed all our expectations. Tanvir is a true partner in our growth.",
      avatar: "https://i.pravatar.cc/150?u=elena"
    }
  ]
};

export const MOCK_CHART_DATA: ChartData[] = [
  { name: 'Jan', reach: 4000, engagement: 2400, conversions: 400 },
  { name: 'Feb', reach: 3000, engagement: 1398, conversions: 210 },
  { name: 'Mar', reach: 9800, engagement: 2000, conversions: 2290 },
  { name: 'Apr', reach: 3908, engagement: 2780, conversions: 2000 },
  { name: 'May', reach: 4800, engagement: 1890, conversions: 2181 },
  { name: 'Jun', reach: 3800, engagement: 2390, conversions: 2500 },
];
