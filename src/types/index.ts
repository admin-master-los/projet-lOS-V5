export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export interface Sector {
  id: string;
  title: string;
  description: string;
  services: string[];
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  results: string[];
  link: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}

export interface ContactForm {
  name: string;
  email: string;
  company: string;
  budget: string;
  project: string;
}
