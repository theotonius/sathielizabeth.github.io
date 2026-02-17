
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Facebook, Instagram, Linkedin, Twitter, 
  Settings, Save, Plus, Trash2, Sparkles, TrendingUp,
  Layout, MessageSquare, Briefcase, User, Megaphone, Search, PenTool,
  Globe, Mail, BarChart, Target, Users, ShoppingBag, Quote
} from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { INITIAL_DATA, MOCK_CHART_DATA } from './constants';
import { SiteData, Service, Project, Testimonial } from './types';
import { generateMarketingCopy, getSiteUpdateSuggestion } from './services/gemini';

// --- Sub-components ---

const IconMap: Record<string, React.ReactNode> = {
  Megaphone: <Megaphone className="w-6 h-6" />,
  Search: <Search className="w-6 h-6" />,
  PenTool: <PenTool className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />,
  Mail: <Mail className="w-6 h-6" />,
  BarChart: <BarChart className="w-6 h-6" />,
  Target: <Target className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  ShoppingBag: <ShoppingBag className="w-6 h-6" />,
};

const Navbar: React.FC<{ onAdminToggle: () => void }> = ({ onAdminToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed w-full z-50 glass top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              MarketPro
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-sm font-medium hover:text-indigo-600 transition-colors">Home</a>
            <a href="#services" className="text-sm font-medium hover:text-indigo-600 transition-colors">Services</a>
            <a href="#projects" className="text-sm font-medium hover:text-indigo-600 transition-colors">Projects</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-indigo-600 transition-colors">Testimonials</a>
            <a href="#about" className="text-sm font-medium hover:text-indigo-600 transition-colors">About</a>
            <button 
              onClick={onAdminToggle}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-all text-sm"
            >
              <Settings size={16} />
              Admin Mode
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden glass border-t border-slate-200 p-4 space-y-4">
          <a href="#home" className="block px-4 py-2 hover:bg-indigo-50 rounded">Home</a>
          <a href="#services" className="block px-4 py-2 hover:bg-indigo-50 rounded">Services</a>
          <a href="#projects" className="block px-4 py-2 hover:bg-indigo-50 rounded">Projects</a>
          <a href="#testimonials" className="block px-4 py-2 hover:bg-indigo-50 rounded">Testimonials</a>
          <button 
            onClick={() => { onAdminToggle(); setIsOpen(false); }}
            className="flex w-full items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            <Settings size={18} /> Admin Mode
          </button>
        </div>
      )}
    </nav>
  );
};

export default function App() {
  const [data, setData] = useState<SiteData>(INITIAL_DATA);
  const [isAdmin, setIsAdmin] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Load persisted data safely to prevent blank screen
  useEffect(() => {
    const saved = localStorage.getItem('marketpro_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved data with INITIAL_DATA to ensure all fields (like testimonials) exist
        setData({
          ...INITIAL_DATA,
          ...parsed,
          hero: { ...INITIAL_DATA.hero, ...parsed.hero },
          about: { ...INITIAL_DATA.about, ...parsed.about },
          // Ensure arrays are merged or defaulted correctly
          services: parsed.services?.length ? parsed.services : INITIAL_DATA.services,
          projects: parsed.projects?.length ? parsed.projects : INITIAL_DATA.projects,
          testimonials: parsed.testimonials?.length ? parsed.testimonials : INITIAL_DATA.testimonials,
        });
      } catch (e) {
        console.error("Failed to load saved data", e);
        // If parsing fails, stick with INITIAL_DATA
      }
    }
  }, []);

  const saveToStorage = (newData: SiteData) => {
    setData(newData);
    localStorage.setItem('marketpro_data', JSON.stringify(newData));
  };

  const handleUpdateHero = (field: keyof SiteData['hero'], value: string) => {
    const newData = { ...data, hero: { ...data.hero, [field]: value } };
    saveToStorage(newData);
  };

  const handleUpdateTestimonial = (id: string, field: keyof Testimonial, value: string) => {
    const newTestimonials = data.testimonials.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    );
    saveToStorage({ ...data, testimonials: newTestimonials });
  };

  const handleAiSuggestion = async (type: string) => {
    setAiLoading(true);
    const results = await getSiteUpdateSuggestion(data.hero, type);
    setSuggestions(results);
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar onAdminToggle={() => setIsAdmin(!isAdmin)} />

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} />
              Digital Marketing Specialist
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-slate-900">
              {isAdmin ? (
                <input 
                  type="text" 
                  value={data.hero.title} 
                  onChange={(e) => handleUpdateHero('title', e.target.value)}
                  className="w-full bg-slate-100 border-2 border-indigo-200 rounded-lg p-2 focus:border-indigo-600 outline-none"
                />
              ) : data.hero.title}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              {isAdmin ? (
                <textarea 
                  value={data.hero.description} 
                  onChange={(e) => handleUpdateHero('description', e.target.value)}
                  className="w-full h-32 bg-slate-100 border-2 border-indigo-100 p-2 rounded-lg focus:border-indigo-600 outline-none"
                />
              ) : data.hero.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
                {data.hero.cta}
                <TrendingUp size={20} />
              </button>
              {isAdmin && (
                <button 
                  onClick={() => handleAiSuggestion('hero')}
                  disabled={aiLoading}
                  className="bg-purple-100 text-purple-700 px-6 py-4 rounded-full font-bold hover:bg-purple-200 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles size={20} /> {aiLoading ? 'Generating...' : 'AI Suggestions'}
                </button>
              )}
            </div>
            
            {isAdmin && suggestions.length > 0 && (
              <div className="bg-white p-4 rounded-xl border-2 border-purple-200 shadow-xl mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <p className="font-bold text-purple-600 mb-2 flex items-center gap-2">
                  <Sparkles size={16} /> AI Suggested Headlines:
                </p>
                <div className="space-y-2">
                  {suggestions.map((s, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-all text-sm"
                      onClick={() => { handleUpdateHero('title', s); setSuggestions([]); }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="relative glass p-6 rounded-3xl shadow-2xl">
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-slate-500">
                  <Globe className="text-indigo-600" size={18} /> Performance Analytics
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={MOCK_CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="reach" fill="#6366f1" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="conversions" fill="#a855f7" radius={[6, 6, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {data.about.stats.map((stat, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-tighter">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white px-4 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900">Premium Solutions</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">আপনার ব্যবসার উন্নতির জন্য বিশেষায়িত ডিজিটাল মার্কেটিং সেবাসমূহ।</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {data.services?.map((service) => (
              <div key={service.id} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 group relative hover:-translate-y-2 transition-all duration-300">
                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  {IconMap[service.icon] || <Megaphone />}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {service.description}
                </p>
                {isAdmin && (
                  <button 
                    onClick={() => {
                      const newServices = data.services.filter(s => s.id !== service.id);
                      saveToStorage({ ...data, services: newServices });
                    }}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2 bg-white rounded-full shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900">Featured Projects</h2>
              <p className="text-slate-600 text-lg">আমরা যেসব ব্র্যান্ডের জন্য সফল ফলাফল নিয়ে এসেছি।</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {data.projects?.map((project) => (
              <div key={project.id} className="overflow-hidden rounded-[2.5rem] group shadow-xl relative aspect-video bg-slate-200">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-8 md:p-12 flex flex-col justify-end">
                  <span className="text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mb-3">{project.category}</span>
                  <h3 className="text-white text-3xl font-bold mb-3">{project.title}</h3>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-white/20">
                    <TrendingUp size={16} className="text-green-400" />
                    <span className="text-white font-medium text-sm">Outcome: {project.result}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900">Client Success Stories</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">আমাদের ক্লায়েন্টদের সন্তুষ্টিই আমাদের কাজের প্রধান অনুপ্রেরণা।</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {data.testimonials?.map((testimonial) => (
              <div key={testimonial.id} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 flex flex-col h-full relative group">
                <div className="text-indigo-600 mb-6">
                  <Quote size={40} fill="currentColor" className="opacity-10" />
                </div>
                <div className="flex-1">
                  {isAdmin ? (
                    <textarea 
                      value={testimonial.feedback}
                      onChange={(e) => handleUpdateTestimonial(testimonial.id, 'feedback', e.target.value)}
                      className="w-full bg-white border-2 border-indigo-100 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none h-32"
                    />
                  ) : (
                    <p className="text-slate-700 leading-relaxed italic mb-8">"{testimonial.feedback}"</p>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-200">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full bg-slate-300 object-cover border-2 border-white shadow-sm" />
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-slate-900">About Our Expert</h2>
          <div className="text-xl text-slate-600 leading-relaxed space-y-6">
            {isAdmin ? (
               <textarea 
               value={data.about.text} 
               onChange={(e) => saveToStorage({ ...data, about: { ...data.about, text: e.target.value } })}
               className="w-full h-40 bg-white border-2 border-indigo-100 p-4 rounded-2xl focus:border-indigo-600 outline-none shadow-sm"
             />
            ) : (
              <p>{data.about.text}</p>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-indigo-600 text-white px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white opacity-5 skew-x-12 translate-x-20"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to scale your business?</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            আপনার গ্রোথ স্ট্রেটেজি নিয়ে আজই আলোচনা করুন। আমরা আপনাকে সঠিক দিকনির্দেশনা দিতে প্রস্তুত।
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-white text-indigo-600 px-10 py-5 rounded-full font-bold text-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-1 active:scale-95">
              Book a Strategy Call
            </button>
            <button className="bg-transparent border-2 border-indigo-400 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
              Send Message on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
              <TrendingUp size={28} className="text-indigo-500" />
              <span className="text-2xl font-bold tracking-tight">MarketPro</span>
            </div>
            <p className="text-sm leading-relaxed">
              আপনার বিশ্বস্ত ডিজিটাল মার্কেটিং পার্টনার। আমরা ডেটা এবং সঠিক পরিকল্পনার মাধ্যমে আপনার ব্যবসাকে বড় করতে সাহায্য করি।
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-slate-800 p-3 rounded-xl hover:text-white hover:bg-slate-700 transition-all"><Facebook size={20} /></a>
              <a href="#" className="bg-slate-800 p-3 rounded-xl hover:text-white hover:bg-slate-700 transition-all"><Instagram size={20} /></a>
              <a href="#" className="bg-slate-800 p-3 rounded-xl hover:text-white hover:bg-slate-700 transition-all"><Linkedin size={20} /></a>
              <a href="#" className="bg-slate-800 p-3 rounded-xl hover:text-white hover:bg-slate-700 transition-all"><Twitter size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Premium Services</h4>
            <ul className="space-y-3 text-sm">
              <li>Email Marketing</li>
              <li>SEO & SEM</li>
              <li>SMM Strategy</li>
              <li>Ecommerce Growth</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Newsletter</h4>
            <p className="text-sm mb-6">Stay updated with marketing trends.</p>
            <div className="flex flex-col gap-3">
              <input type="email" placeholder="Email Address" className="bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 ring-indigo-500 outline-none w-full text-white" />
              <button className="bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/10">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-16 pt-8 text-center text-xs tracking-widest uppercase">
          © 2024 MarketPro - All Rights Reserved.
        </div>
      </footer>

      {/* Admin Info Bar */}
      {isAdmin && (
        <div className="fixed bottom-6 left-6 right-6 glass border-2 border-indigo-500 rounded-2xl p-4 z-[100] flex flex-wrap justify-between items-center animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-xl text-white shadow-lg shadow-indigo-200">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">Admin Editing Mode</p>
              <p className="text-xs text-slate-500 font-medium">আপনার পরিবর্তনগুলো অটোমেটিক সেভ হচ্ছে।</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAdmin(false)}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
          >
            Finish Editing
          </button>
        </div>
      )}

      {/* AI Chat Widget */}
      {!isAdmin && <AIChatWidget />}
    </div>
  );
}

function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "হ্যালো! আমি তানভীরের AI অ্যাসিস্ট্যান্ট। আমি আপনাকে কীভাবে সাহায্য করতে পারি?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    
    const copy = await generateMarketingCopy(userMsg, "Marketing advice or strategy explanation");
    setMessages(prev => [...prev, { role: 'ai', text: copy || '' }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      {isOpen ? (
        <div className="glass w-80 md:w-[400px] h-[550px] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-white/40 animate-in zoom-in-95 duration-200 origin-bottom-right">
          <div className="bg-indigo-600 p-6 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <Sparkles size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">Expert AI Assistant</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-800 shadow-sm border border-slate-100'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-xs text-indigo-400 font-bold animate-pulse">
                <Sparkles size={14} /> AI thinking...
              </div>
            )}
          </div>
          <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="আপনার প্রশ্নটি লিখুন..." 
              className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 ring-indigo-500 outline-none shadow-inner" 
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              <MessageSquare size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:scale-110 transition-all hover:bg-indigo-700 active:scale-95 group relative"
        >
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 border-4 border-slate-50 rounded-full"></div>
          <MessageSquare size={28} />
        </button>
      )}
    </div>
  );
}
