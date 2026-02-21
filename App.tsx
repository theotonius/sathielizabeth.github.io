
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Facebook, Instagram, Linkedin, Twitter, 
  Sparkles, TrendingUp,
  Globe, Mail, BarChart, Target, Users, ShoppingBag, Quote, MessageSquare, Megaphone, Search, PenTool, Send, CheckCircle,
  Zap, Award, Smile, Star, Layout, FileText, Phone, MapPin, Camera, Video, Smartphone, Laptop, Cpu, Layers, PieChart,
  ChevronUp, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { INITIAL_DATA, MOCK_CHART_DATA } from './constants';
import { SiteData, Service, Project, Testimonial } from './types';
import { generateMarketingCopy } from './services/gemini';

// --- Icon Mapping ---
const IconMap: Record<string, React.ElementType> = {
  Megaphone, Search, PenTool, Globe, Mail, BarChart, Target, Users, ShoppingBag,
  Zap, Award, Smile, Star, Layout, FileText, Phone, MapPin, Camera, Video, 
  Smartphone, Laptop, Cpu, Layers, PieChart, TrendingUp
};

// --- Sub-components ---
const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed w-full z-50 glass top-0 left-0 border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-md">
              <TrendingUp size={20} className="md:w-6 md:h-6" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              MarketPro
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="#home" className="text-sm font-medium hover:text-indigo-600 transition-colors">Home</a>
            <a href="#services" className="text-sm font-medium hover:text-indigo-600 transition-colors">Services</a>
            <a href="#projects" className="text-sm font-medium hover:text-indigo-600 transition-colors">Projects</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-indigo-600 transition-colors">Testimonials</a>
            <a href="#about" className="text-sm font-medium hover:text-indigo-600 transition-colors">About</a>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden glass border-t border-slate-200 p-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <a href="#home" className="block px-4 py-3 hover:bg-indigo-50 rounded-xl font-medium" onClick={() => setIsOpen(false)}>Home</a>
          <a href="#services" className="block px-4 py-3 hover:bg-indigo-50 rounded-xl font-medium" onClick={() => setIsOpen(false)}>Services</a>
          <a href="#projects" className="block px-4 py-3 hover:bg-indigo-50 rounded-xl font-medium" onClick={() => setIsOpen(false)}>Projects</a>
          <a href="#testimonials" className="block px-4 py-3 hover:bg-indigo-50 rounded-xl font-medium" onClick={() => setIsOpen(false)}>Testimonials</a>
          <a href="#about" className="block px-4 py-3 hover:bg-indigo-50 rounded-xl font-medium" onClick={() => setIsOpen(false)}>About</a>
        </div>
      )}
    </nav>
  );
};

// --- Main App ---
export default function App() {
  const [data, setData] = useState<SiteData>(INITIAL_DATA);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'name') {
      if (!value.trim()) error = 'Name is required';
      else if (value.length < 2) error = 'Name must be at least 2 characters';
    }
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = 'Email is required';
      else if (!emailRegex.test(value)) error = 'Invalid email format';
    }
    if (name === 'message') {
      if (!value.trim()) error = 'Message is required';
      else if (value.length < 10) error = 'Message must be at least 10 characters';
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name as keyof typeof touched]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch data from server", error);
        // Fallback to localStorage if server fails
        const saved = localStorage.getItem('marketpro_data');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setData(prev => ({ ...INITIAL_DATA, ...parsed }));
          } catch (e) {}
        }
      }
    };
    fetchData();
  }, []);

  const updateData = async (newData: SiteData) => {
    setData(newData);
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
      localStorage.setItem('marketpro_data', JSON.stringify(newData));
    } catch (error) {
      console.error("Failed to save data to server", error);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields on submit
    const newErrors = { name: '', email: '', message: '' };
    let hasErrors = false;

    if (!formData.name.trim()) { newErrors.name = 'Name is required'; hasErrors = true; }
    if (!formData.email.trim()) { newErrors.email = 'Email is required'; hasErrors = true; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = 'Invalid email format'; hasErrors = true; }
    if (!formData.message.trim()) { newErrors.message = 'Message is required'; hasErrors = true; }

    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true });

    if (hasErrors) return;

    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTouched({ name: false, email: false, message: false });
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative pt-28 pb-12 md:pt-40 md:pb-24 px-4 overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          <div className="space-y-6 md:space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mx-auto md:mx-0 shadow-sm">
              <Sparkles size={14} />
              Digital Marketing Expert
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight text-slate-900">
              {data.hero?.title || "Welcome"}
            </h1>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-lg mx-auto md:mx-0 font-medium">
              {data.hero?.description || ""}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="#contact" className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 w-full sm:w-auto">
                {data.hero?.cta || "Get Started"}
                <TrendingUp size={20} />
              </a>
            </div>
          </div>
          
          <div className="relative mt-8 md:mt-0">
            <div className="absolute -top-10 -left-10 w-48 h-48 md:w-72 md:h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 md:w-72 md:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="relative glass p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-white/40">
              <div className="mb-4 md:mb-6">
                <h3 className="text-[10px] md:text-xs font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-slate-500">
                  <Globe className="text-indigo-600" size={16} /> Live Data Reach
                </h3>
                <div className="h-48 md:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={MOCK_CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#64748b'}} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                      <Bar dataKey="reach" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="conversions" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {(data.about?.stats || []).map((stat, i) => (
                  <div key={i} className="bg-white/60 backdrop-blur-sm p-3 md:p-4 rounded-xl md:rounded-2xl border border-white shadow-sm">
                    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</p>
                    <p className="text-xl md:text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-32 bg-white px-4 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900">Expert Services</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg font-medium px-4">Specialized digital marketing services to help your business grow.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {(data.services || []).map((service) => {
              const IconComp = IconMap[service.icon] || Megaphone;
              return (
                <div key={service.id} className="bg-slate-50 p-6 md:p-10 rounded-[2rem] border border-slate-200 group relative hover:-translate-y-2 transition-all duration-300 hover:shadow-xl flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                    <IconComp size={24} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-3 text-slate-900">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 md:py-32 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900">Featured Projects</h2>
            <p className="text-slate-600 text-base md:text-lg">We bring successful results for the brands we work with.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {(data.projects || []).map((project) => (
              <div key={project.id} className="overflow-hidden rounded-[2rem] md:rounded-[2.5rem] group shadow-lg relative aspect-video bg-slate-200">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent p-6 md:p-10 lg:p-12 flex flex-col justify-end">
                  <span className="text-indigo-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3">{project.category}</span>
                  <h3 className="text-white text-2xl md:text-3xl font-bold mb-3">{project.title}</h3>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-white/20">
                    <TrendingUp size={16} className="text-green-400" />
                    <span className="text-white font-medium text-xs md:text-sm">Outcome: {project.result}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-32 px-4 bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900">Client Stories</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg">Our clients' satisfaction is our main inspiration.</p>
          </div>
          
          <TestimonialSlider testimonials={data.testimonials || []} />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-100 rounded-2xl -z-10"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-100 rounded-full -z-10"></div>
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-50">
                <img 
                  src={data.about?.image} 
                  alt="Professional Portrait" 
                  className="w-full aspect-square md:aspect-[4/5] object-cover object-top"
                />
              </div>
              <div className="absolute bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                    <Award size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Experience</p>
                    <p className="text-lg font-bold text-slate-900">{data.about?.experience}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                  Crafting Digital <span className="text-indigo-600">Success Stories</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  {data.about?.text}
                </p>
              </div>

              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 text-indigo-100 group-hover:text-indigo-200 transition-colors">
                  <Zap size={48} />
                </div>
                <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Star size={16} /> Unique Selling Proposition
                </h3>
                <p className="text-slate-800 font-bold text-lg md:text-xl leading-snug relative z-10">
                  "{data.about?.usp}"
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Core Expertise</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(data.about?.skills || []).map((skill, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm hover:border-indigo-300 transition-colors">
                      <CheckCircle size={14} className="text-indigo-500" />
                      <span className="text-xs md:text-sm font-bold text-slate-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategy Section */}
      <section className="py-16 md:py-24 bg-indigo-600 text-white px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white opacity-5 skew-x-12 translate-x-20 hidden md:block"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Let's Scale Your Business</h2>
          <p className="text-lg md:text-xl text-indigo-100 mb-8 md:mb-12 max-w-2xl mx-auto">
            Discuss your growth strategy today. We are ready to give you the right guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            <a href="#contact" className="bg-white text-indigo-600 px-10 py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95 shadow-xl w-full sm:w-auto text-center">
              Book Strategy Call
            </a>
            <a 
              href="https://wa.me/+8801736590876" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-indigo-400 text-white px-10 py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-white/10 transition-all active:scale-95 w-full sm:w-auto text-center"
            >
              Contact WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer & Contact Form */}
      <footer id="contact" className="pt-16 pb-8 md:pt-24 md:pb-12 px-4 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6 text-center md:text-left">
              <div className="flex items-center gap-2 text-white justify-center md:justify-start">
                <TrendingUp size={28} className="text-indigo-500" />
                <span className="text-2xl font-bold tracking-tight">MarketPro</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                Your trusted digital marketing partner. We help grow your business through data and proper planning.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <a href="#" className="bg-slate-800 p-3 rounded-xl hover:text-white hover:bg-indigo-600 transition-all"><Facebook size={20} /></a>
                <a href="#" className="bg-slate-800 p-3 rounded-xl hover:text-white hover:bg-indigo-600 transition-all"><Instagram size={20} /></a>
                <a href="#" className="bg-slate-800 p-3 rounded-xl hover:text-white hover:bg-indigo-600 transition-all"><Linkedin size={20} /></a>
                <a href="#" className="bg-slate-800 p-3 rounded-xl hover:text-white hover:bg-indigo-600 transition-all"><Twitter size={20} /></a>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div className="lg:col-span-2">
              <h4 className="text-white font-bold mb-6 text-lg text-center md:text-left">Contact Us</h4>
              {formStatus === 'success' ? (
                <div className="bg-green-500/10 border border-green-500/50 rounded-[2rem] p-8 text-center animate-in zoom-in-95 duration-300">
                  <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                    <CheckCircle size={24} />
                  </div>
                  <h5 className="text-white font-bold mb-2">Message Received!</h5>
                  <p className="text-sm">We will contact you very soon.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">Full Name</label>
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      type="text" 
                      placeholder="Your Name" 
                      className={`w-full bg-slate-800/50 border ${touched.name && errors.name ? 'border-red-500' : 'border-slate-700/50'} rounded-xl px-5 py-3.5 text-sm focus:ring-2 ${touched.name && errors.name ? 'ring-red-500/50' : 'ring-indigo-500/50'} outline-none text-white placeholder:text-slate-600 transition-all`} 
                    />
                    {touched.name && errors.name && <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">Email Address</label>
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      type="email" 
                      placeholder="Your Email" 
                      className={`w-full bg-slate-800/50 border ${touched.email && errors.email ? 'border-red-500' : 'border-slate-700/50'} rounded-xl px-5 py-3.5 text-sm focus:ring-2 ${touched.email && errors.email ? 'ring-red-500/50' : 'ring-indigo-500/50'} outline-none text-white placeholder:text-slate-600 transition-all`} 
                    />
                    {touched.email && errors.email && <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.email}</p>}
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">Your Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      rows={3}
                      placeholder="Tell us about your project goals..." 
                      className={`w-full bg-slate-800/50 border ${touched.message && errors.message ? 'border-red-500' : 'border-slate-700/50'} rounded-xl px-5 py-3.5 text-sm focus:ring-2 ${touched.message && errors.message ? 'ring-red-500/50' : 'ring-indigo-500/50'} outline-none text-white placeholder:text-slate-600 transition-all resize-none`} 
                    />
                    {touched.message && errors.message && <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <button 
                      disabled={formStatus === 'submitting'}
                      type="submit" 
                      className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                      {formStatus === 'submitting' ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <><Send size={18} /> Send Message</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-slate-500">
              © 2026 Sathi Elizabeth Portfolio - All Rights Reserved.
            </p>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest">
              Developed by <span className="text-slate-400 font-bold">Sobuj Theotonius</span>
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Widget */}
      <WhatsAppWidget />
      
      {/* Scroll To Top Button */}
      <ScrollToTop />

      {/* Admin Panel Toggle (Simple secret: add ?admin=true to URL) */}
      {window.location.search.includes('admin=true') && (
        <AdminPanel data={data} onSave={updateData} />
      )}
    </div>
  );
}

function AdminPanel({ data, onSave }: { data: SiteData, onSave: (data: SiteData) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState(data);

  useEffect(() => {
    setEditData(data);
  }, [data]);

  const handleSave = () => {
    onSave(editData);
    setIsOpen(false);
    alert("Site updated successfully!");
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-[200] bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl border border-slate-700 hover:bg-slate-800 transition-all flex items-center gap-2"
      >
        <PenTool size={14} /> Admin Panel
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layout className="text-indigo-600" /> Site Editor
          </h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Hero Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 border-b border-indigo-100 pb-2">Hero Section</h3>
            <div className="grid gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Title</label>
                <input 
                  value={editData.hero?.title} 
                  onChange={e => setEditData({...editData, hero: {...editData.hero!, title: e.target.value}})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Description</label>
                <textarea 
                  value={editData.hero?.description} 
                  onChange={e => setEditData({...editData, hero: {...editData.hero!, description: e.target.value}})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 ring-indigo-500 outline-none h-24"
                />
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 border-b border-indigo-100 pb-2">About Section</h3>
            <div className="grid gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">About Text</label>
                <textarea 
                  value={editData.about?.text} 
                  onChange={e => setEditData({...editData, about: {...editData.about!, text: e.target.value}})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 ring-indigo-500 outline-none h-32"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Image URL</label>
                <input 
                  value={editData.about?.image} 
                  onChange={e => setEditData({...editData, about: {...editData.about!, image: e.target.value}})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 border-b border-indigo-100 pb-2">Services</h3>
            <div className="grid gap-6">
              {editData.services?.map((service, idx) => (
                <div key={service.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400">Service #{idx + 1}</span>
                  </div>
                  <input 
                    value={service.title} 
                    onChange={e => {
                      const newServices = [...editData.services!];
                      newServices[idx].title = e.target.value;
                      setEditData({...editData, services: newServices});
                    }}
                    placeholder="Title"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none"
                  />
                  <textarea 
                    value={service.description} 
                    onChange={e => {
                      const newServices = [...editData.services!];
                      newServices[idx].description = e.target.value;
                      setEditData({...editData, services: newServices});
                    }}
                    placeholder="Description"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none h-20"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 border-b border-indigo-100 pb-2">Projects</h3>
            <div className="grid gap-6">
              {editData.projects?.map((project, idx) => (
                <div key={project.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400">Project #{idx + 1}</span>
                  </div>
                  <input 
                    value={project.title} 
                    onChange={e => {
                      const newProjects = [...editData.projects!];
                      newProjects[idx].title = e.target.value;
                      setEditData({...editData, projects: newProjects});
                    }}
                    placeholder="Project Title"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none"
                  />
                  <input 
                    value={project.result} 
                    onChange={e => {
                      const newProjects = [...editData.projects!];
                      newProjects[idx].result = e.target.value;
                      setEditData({...editData, projects: newProjects});
                    }}
                    placeholder="Result (e.g. 5X Growth)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none"
                  />
                  <input 
                    value={project.image} 
                    onChange={e => {
                      const newProjects = [...editData.projects!];
                      newProjects[idx].image = e.target.value;
                      setEditData({...editData, projects: newProjects});
                    }}
                    placeholder="Image URL"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 border-b border-indigo-100 pb-2">Testimonials</h3>
            <div className="grid gap-6">
              {editData.testimonials?.map((testimonial, idx) => (
                <div key={testimonial.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400">Testimonial #{idx + 1}</span>
                  </div>
                  <input 
                    value={testimonial.name} 
                    onChange={e => {
                      const newTestimonials = [...editData.testimonials!];
                      newTestimonials[idx].name = e.target.value;
                      setEditData({...editData, testimonials: newTestimonials});
                    }}
                    placeholder="Client Name"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none"
                  />
                  <input 
                    value={testimonial.role} 
                    onChange={e => {
                      const newTestimonials = [...editData.testimonials!];
                      newTestimonials[idx].role = e.target.value;
                      setEditData({...editData, testimonials: newTestimonials});
                    }}
                    placeholder="Client Role"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none"
                  />
                  <textarea 
                    value={testimonial.feedback} 
                    onChange={e => {
                      const newTestimonials = [...editData.testimonials!];
                      newTestimonials[idx].feedback = e.target.value;
                      setEditData({...editData, testimonials: newTestimonials});
                    }}
                    placeholder="Feedback"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none h-20"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-4">
          <button 
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  if (!testimonials.length) return null;

  return (
    <div className="relative px-4 md:px-12">
      <div className="relative h-[400px] md:h-[350px] flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute w-full max-w-4xl"
          >
            <div className="bg-slate-50 p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-indigo-600/5">
                <Quote size={120} fill="currentColor" />
              </div>
              
              <div className="relative z-10">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                
                <p className="text-lg md:text-xl text-slate-700 leading-relaxed italic mb-10 font-medium">
                  "{testimonials[currentIndex].feedback}"
                </p>
                
                <div className="flex items-center gap-5">
                  <img 
                    src={testimonials[currentIndex].avatar} 
                    alt={testimonials[currentIndex].name} 
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-white shadow-lg object-cover" 
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base md:text-lg">{testimonials[currentIndex].name}</h4>
                    <p className="text-xs text-indigo-600 uppercase tracking-widest font-bold">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <button 
          onClick={prevSlide}
          className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-indigo-600' : 'bg-slate-300'}`}
            />
          ))}
        </div>
        <button 
          onClick={nextSlide}
          className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-90"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-20 right-4 md:bottom-28 md:right-8 z-[190] bg-white text-indigo-600 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg border border-slate-100 transition-all duration-300 hover:scale-110 active:scale-95 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp size={24} />
    </button>
  );
}

function WhatsAppWidget() {
  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[200]">
      <a 
        href="https://wa.me/+8801736590876" 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-[0_15px_30px_rgba(37,211,102,0.3)] hover:scale-110 transition-all hover:bg-[#128C7E] active:scale-95 group relative"
        title="Chat on WhatsApp"
      >
        <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-green-400 border-4 border-white rounded-full animate-pulse"></div>
        <MessageSquare size={28} />
      </a>
    </div>
  );
}
