import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { 
  Menu, X, Facebook, Instagram, Linkedin, Twitter, 
  Sparkles, TrendingUp,
  Globe, Mail, BarChart, Target, Users, ShoppingBag, Quote, MessageSquare, PenTool, Send, CheckCircle,
  Zap, Star, Layout, ChevronUp, ChevronLeft, ChevronRight, LogOut, Home as HomeIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { INITIAL_DATA, MOCK_CHART_DATA } from './constants';
import { SiteData, Testimonial } from './types';

// --- Icon Mapping ---
const IconMap: Record<string, React.ElementType> = {
  Megaphone: TrendingUp, Search: TrendingUp, PenTool, Globe, Mail, BarChart, Target, Users, ShoppingBag,
  Zap, Star, Layout, TrendingUp
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
              SathiEliza
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('marketpro_token');
    if (token === 'demo-token-123') {
      setIsLoggedIn(true);
    }
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch data from server", error);
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
    } catch (error) {
      console.error("Failed to save data to server", error);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<MainSite data={data} />} />
      <Route 
        path="/admin" 
        element={
          isLoggedIn ? (
            <AdminDashboard data={data} onSave={updateData} onLogout={() => {
              localStorage.removeItem('marketpro_token');
              setIsLoggedIn(false);
            }} />
          ) : (
            <LoginPage onLogin={(token) => {
              localStorage.setItem('marketpro_token', token);
              setIsLoggedIn(true);
            }} />
          )
        } 
      />
    </Routes>
  );
}

function MainSite({ data }: { data: SiteData }) {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
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
              {data.hero?.title}
            </h1>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-lg mx-auto md:mx-0 font-medium">
              {data.hero?.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="#contact" className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 w-full sm:w-auto">
                {data.hero?.cta}
                <TrendingUp size={20} />
              </a>
            </div>
          </div>
          <div className="relative mt-8 md:mt-0">
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
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                      <Bar dataKey="reach" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="conversions" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {data.about?.stats?.map((stat, i) => (
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
            {data.services?.map((service) => {
              const IconComp = IconMap[service.icon] || TrendingUp;
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
            {data.projects?.map((project) => (
              <div key={project.id} className="overflow-hidden rounded-[2rem] md:rounded-[2.5rem] group shadow-lg relative aspect-video bg-slate-200">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent p-6 md:p-10 lg:p-12 flex flex-col justify-end">
                  <span className="text-indigo-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3">{project.category}</span>
                  <h3 className="text-white text-2xl md:text-3xl font-bold mb-3">{project.title}</h3>
                  <p className="text-slate-300 font-medium text-sm md:text-base">{project.result}</p>
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
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-50">
                <img src={data.about?.image} alt="Professional Portrait" className="w-full aspect-square md:aspect-[4/5] object-cover object-top" />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">{data.about?.experience}</h2>
              <p className="text-slate-600 leading-relaxed text-base md:text-lg">{data.about?.text}</p>
              <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                <p className="text-indigo-900 font-medium italic">"{data.about?.usp}"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <footer id="contact" className="pt-16 pb-8 md:pt-24 md:pb-12 px-4 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6 text-center md:text-left">
              <div className="flex items-center gap-2 text-white justify-center md:justify-start">
                <TrendingUp size={28} className="text-indigo-500" />
                <span className="text-2xl font-bold tracking-tight">SathiEliza</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                Your trusted digital marketing partner.
              </p>
            </div>
            <div className="hidden lg:block">
              <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>
                <li><Link to="/admin" className="hover:text-white transition-colors">Admin Login</Link></li>
              </ul>
            </div>
            <div className="lg:col-span-2">
              <h4 className="text-white font-bold mb-6 text-lg">Contact Us</h4>
              <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Name" className="bg-slate-800 border-none rounded-xl p-4 text-white outline-none" required />
                <input type="email" placeholder="Email" className="bg-slate-800 border-none rounded-xl p-4 text-white outline-none" required />
                <textarea placeholder="Message" className="bg-slate-800 border-none rounded-xl p-4 text-white outline-none sm:col-span-2 h-32" required></textarea>
                <button type="submit" className="bg-indigo-600 text-white p-4 rounded-xl font-bold sm:col-span-2 hover:bg-indigo-700 transition-all">
                  {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </footer>

      <WhatsAppWidget />
      <ScrollToTop />
    </div>
  );
}

function AdminDashboard({ data, onSave, onLogout }: { data: SiteData, onSave: (data: SiteData) => void, onLogout: () => void }) {
  const [editData, setEditData] = useState(data);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => { setEditData(data); }, [data]);

  const handleSave = () => { onSave(editData); alert("Site updated successfully!"); };

  const tabs = [
    { id: 'hero', label: 'Hero', icon: <Sparkles size={18} /> },
    { id: 'about', label: 'About', icon: <Users size={18} /> },
    { id: 'services', label: 'Services', icon: <Layout size={18} /> },
    { id: 'projects', label: 'Projects', icon: <ShoppingBag size={18} /> },
    { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col fixed h-full">
        <div className="p-6 flex items-center gap-3 text-white border-b border-slate-800">
          <TrendingUp size={20} className="text-indigo-500" />
          <span className="font-bold text-lg">SathiEliza Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800"><HomeIcon size={18} /> View Site</Link>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10"><LogOut size={18} /> Logout</button>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8 lg:p-12">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 capitalize">{activeTab} Management</h1>
            <button onClick={handleSave} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">Save Changes</button>
          </header>
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <input value={editData.hero?.title} onChange={e => setEditData({...editData, hero: {...editData.hero!, title: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" placeholder="Title" />
                <textarea value={editData.hero?.description} onChange={e => setEditData({...editData, hero: {...editData.hero!, description: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-32" placeholder="Description" />
              </div>
            )}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <textarea value={editData.about?.text} onChange={e => setEditData({...editData, about: {...editData.about!, text: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-40" placeholder="About Text" />
                <input value={editData.about?.image} onChange={e => setEditData({...editData, about: {...editData.about!, image: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" placeholder="Image URL" />
              </div>
            )}
            {/* Add other tabs similarly */}
            <p className="text-slate-400 text-sm italic">Editing {activeTab} section...</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    if (result.success) { onLogin(result.token); navigate('/admin'); }
    else { setError('Login failed'); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100">
        <div className="text-center mb-10">
          <div className="bg-indigo-600 text-white p-4 rounded-2xl inline-block mb-6"><TrendingUp size={32} /></div>
          <h2 className="text-3xl font-bold text-slate-900">Admin Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{error}</div>}
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4" placeholder="Username" required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4" placeholder="Password" required />
          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all">Sign In</button>
        </form>
      </div>
    </div>
  );
}

function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const nextSlide = () => { setDirection(1); setCurrentIndex((prev) => (prev + 1) % testimonials.length); };
  const prevSlide = () => { setDirection(-1); setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length); };
  if (!testimonials.length) return null;
  return (
    <div className="relative px-4 md:px-12">
      <div className="relative h-[400px] md:h-[350px] flex items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div key={currentIndex} custom={direction} initial={{ x: direction > 0 ? 1000 : -1000, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: direction < 0 ? 1000 : -1000, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="absolute w-full max-w-4xl">
            <div className="bg-slate-50 p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm relative">
              <p className="text-lg md:text-xl text-slate-700 italic mb-10">"{testimonials[currentIndex].feedback}"</p>
              <div className="flex items-center gap-5">
                <img src={testimonials[currentIndex].avatar} alt={testimonials[currentIndex].name} className="w-14 h-14 rounded-full border-4 border-white shadow-lg object-cover" />
                <div>
                  <h4 className="font-extrabold text-slate-900">{testimonials[currentIndex].name}</h4>
                  <p className="text-xs text-indigo-600 uppercase tracking-widest font-bold">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <button onClick={prevSlide} className="p-3 rounded-full bg-white border border-slate-200 hover:bg-indigo-600 hover:text-white transition-all"><ChevronLeft size={24} /></button>
        <button onClick={nextSlide} className="p-3 rounded-full bg-white border border-slate-200 hover:bg-indigo-600 hover:text-white transition-all"><ChevronRight size={24} /></button>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => { if (window.pageYOffset > 300) setIsVisible(true); else setIsVisible(false); };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-20 right-4 z-[190] bg-white text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-slate-100 transition-all ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <ChevronUp size={24} />
    </button>
  );
}

function WhatsAppWidget() {
  return (
    <div className="fixed bottom-4 right-4 z-[200]">
      <a href="https://wa.me/+8801736590876" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all">
        <MessageSquare size={28} />
      </a>
    </div>
  );
}
