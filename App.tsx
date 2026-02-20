
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Facebook, Instagram, Linkedin, Twitter, 
  Sparkles, TrendingUp,
  Globe, Mail, BarChart, Target, Users, ShoppingBag, Quote, MessageSquare, Megaphone, Search, PenTool, Send, CheckCircle,
  Zap, Award, Smile, Star, Layout, FileText, Phone, MapPin, Camera, Video, Smartphone, Laptop, Cpu, Layers, PieChart
} from 'lucide-react';
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

  useEffect(() => {
    const saved = localStorage.getItem('marketpro_data');
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        setData(prev => ({ ...INITIAL_DATA, ...parsed }));
      }
    } catch (e) {
      console.error("Critical error loading saved data.", e);
    }
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      setTimeout(() => setFormStatus('idle'), 3000);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative pt-24 pb-16 md:pt-40 md:pb-24 px-4 overflow-hidden bg-slate-50">
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
              <button className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 w-full sm:w-auto">
                {data.hero?.cta || "Get Started"}
                <TrendingUp size={20} />
              </button>
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
      <section id="services" className="py-20 md:py-32 bg-white px-4 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900">Expert Services</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg font-medium px-4">আপনার ব্যবসার উন্নতির জন্য বিশেষায়িত ডিজিটাল মার্কেটিং সেবাসমূহ।</p>
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
      <section id="projects" className="py-20 md:py-32 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900">Featured Projects</h2>
            <p className="text-slate-600 text-base md:text-lg">আমরা যেসব ব্র্যান্ডের জন্য সফল ফলাফল নিয়ে এসেছি।</p>
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
      <section id="testimonials" className="py-20 md:py-32 px-4 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900">Client Stories</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg">আমাদের ক্লায়েন্টদের সন্তুষ্টিই আমাদের প্রধান অনুপ্রেরণা।</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {(data.testimonials || []).map((testimonial) => (
              <div key={testimonial.id} className="bg-slate-50 p-6 md:p-10 rounded-[2rem] border border-slate-200 flex flex-col h-full relative group hover:border-indigo-200 transition-colors">
                <div className="text-indigo-600 mb-6">
                  <Quote size={36} fill="currentColor" className="opacity-10" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 leading-relaxed italic mb-8 text-sm md:text-base">"{testimonial.feedback}"</p>
                </div>
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-200">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-300 object-cover border-2 border-white shadow-md" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{testimonial.name}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-10 text-slate-900">About Me</h2>
          <div className="text-lg md:text-xl text-slate-600 leading-relaxed space-y-6 font-medium">
             <p className="px-2">{data.about?.text || ""}</p>
          </div>
        </div>
      </section>

      {/* Strategy Section */}
      <section className="py-16 md:py-24 bg-indigo-600 text-white px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white opacity-5 skew-x-12 translate-x-20 hidden md:block"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Let's Scale Your Business</h2>
          <p className="text-lg md:text-xl text-indigo-100 mb-8 md:mb-12 max-w-2xl mx-auto">
            আপনার গ্রোথ স্ট্রেটেজি নিয়ে আজই আলোচনা করুন। আমরা আপনাকে সঠিক দিকনির্দেশনা দিতে প্রস্তুত।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            <button className="bg-white text-indigo-600 px-10 py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95 shadow-xl w-full sm:w-auto">
              Book Strategy Call
            </button>
            <button className="bg-transparent border-2 border-indigo-400 text-white px-10 py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-white/10 transition-all active:scale-95 w-full sm:w-auto">
              Contact WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Footer & Contact Form */}
      <footer className="py-16 md:py-24 px-4 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6 text-center md:text-left">
              <div className="flex items-center gap-2 text-white justify-center md:justify-start">
                <TrendingUp size={28} className="text-indigo-500" />
                <span className="text-2xl font-bold tracking-tight">MarketPro</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                আপনার বিশ্বস্ত ডিজিটাল মার্কেটিং পার্টনার। আমরা ডেটা এবং সঠিক পরিকল্পনার মাধ্যমে আপনার ব্যবসাকে বড় করতে সাহায্য করি।
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
                  <p className="text-sm">আমরা খুব শীঘ্রই আপনার সাথে যোগাযোগ করবো।</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Your Name" 
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-5 py-3.5 text-sm focus:ring-2 ring-indigo-500/50 outline-none text-white placeholder:text-slate-600 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="Your Email" 
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-5 py-3.5 text-sm focus:ring-2 ring-indigo-500/50 outline-none text-white placeholder:text-slate-600 transition-all" 
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">Your Message</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Tell us about your project goals..." 
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-5 py-3.5 text-sm focus:ring-2 ring-indigo-500/50 outline-none text-white placeholder:text-slate-600 transition-all resize-none" 
                    />
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
              © 2024 MarketPro Portfolio - All Rights Reserved.
            </p>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest">
              Developed by <span className="text-slate-400 font-bold">Tanvir Ahmed</span>
            </p>
          </div>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <AIChatWidget />
    </div>
  );
}

function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "হ্যালো! আমি তানভীরের AI অ্যাসিস্ট্যান্ট। আমি আপনাকে ডিজিটাল মার্কেটিং নিয়ে কীভাবে সাহায্য করতে পারি?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const copy = await generateMarketingCopy(userMsg, "Marketing advice or strategy explanation");
      setMessages(prev => [...prev, { role: 'ai', text: copy || 'I processed your request, but could not generate a response.' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "An error occurred. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[200]">
      {isOpen ? (
        <div className="glass w-[calc(100vw-2rem)] sm:w-80 md:w-[400px] h-[500px] md:h-[550px] rounded-[2rem] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-white/40 animate-in zoom-in-95 duration-200 origin-bottom-right">
          <div className="bg-indigo-600 p-5 md:p-6 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <Sparkles size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs md:text-sm leading-none">Expert AI Assistant</span>
                <span className="text-[10px] opacity-70 mt-1">Always Active</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 bg-slate-50/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-800 border border-slate-100'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-[10px] md:text-xs text-indigo-500 font-bold animate-pulse px-2">
                <Sparkles size={14} /> AI is typing...
              </div>
            )}
          </div>
          <div className="p-4 md:p-6 bg-white border-t border-slate-100 flex gap-3">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask a marketing question..." 
              className="flex-1 bg-slate-50 border-none rounded-xl px-4 md:px-5 py-3 text-xs md:text-sm focus:ring-2 ring-indigo-500 outline-none shadow-inner transition-all" 
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 active:scale-90"
            >
              <MessageSquare size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:scale-110 transition-all hover:bg-indigo-700 active:scale-95 group relative"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-green-400 border-4 border-white rounded-full"></div>
          <MessageSquare size={28} />
        </button>
      )}
    </div>
  );
}
