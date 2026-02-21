
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  result: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  feedback: string;
  avatar: string;
}

export interface SiteData {
  hero: {
    name: string;
    title: string;
    description: string;
    cta: string;
  };
  about: {
    text: string;
    image: string;
    experience: string;
    skills: string[];
    usp: string;
    stats: { label: string; value: string }[];
  };
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
}

export interface ChartData {
  name: string;
  reach: number;
  engagement: number;
  conversions: number;
}
