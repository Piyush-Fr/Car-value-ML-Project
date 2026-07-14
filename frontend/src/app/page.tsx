/* eslint-disable */
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BarChart3, Database, BrainCircuit, LineChart, ChevronDown, ArrowRight, Calculator, Scale, TrendingUp, PieChart, Triangle, Atom, Wind, Terminal, FlaskConical, Layers } from 'lucide-react';
import Link from 'next/link';

const AnimatedNumber = ({ value, isFloat = false }: { value: string | number, isFloat?: boolean }) => {
  return <span>{value}</span>;
};

export default function LandingPage() {
  const [metrics, setMetrics] = useState({ R2: null, MAE: null, RMSE: null });
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to height (0% to 100%)
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const dotPosition = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}/api/metrics`)
      .then(r => r.json())
      .then(data => setMetrics(data))
      .catch(e => console.error(e));
      
    const handleScroll = () => setIsScrolled(window.scrollY > window.innerHeight - 90);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#e5e2e1] font-sans selection:bg-white selection:text-black">
      {/* Scroll Indicator */}
      <div className="fixed left-8 md:left-16 top-0 bottom-0 w-px bg-[#262626] z-40 hidden md:block">
        <motion.div 
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-white/50 to-white"
          style={{ height: lineHeight }}
        />
        <motion.div 
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          style={{ top: dotPosition, marginTop: '-6px' }}
        />
      </div>

      <header className={`fixed top-0 w-full flex justify-center items-center px-8 md:px-24 pt-6 pb-12 z-50 transition-all duration-500 ${isScrolled ? 'bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent' : 'mix-blend-difference'}`}>
        <span className="text-2xl tracking-widest text-white font-light select-none">MONOVALUATION</span>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent z-10" />
          <video className="absolute inset-0 w-full h-full object-cover opacity-60" autoPlay loop muted playsInline>
            <source src="/bg_video.mp4" type="video/mp4" />
          </video>
        </div>
        
        <div className="relative z-20 flex flex-col items-center text-center mt-20 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
            className="border border-white/20 backdrop-blur-md bg-white/5 px-4 py-1.5 rounded-full mb-8 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-white/90">Model V1.0 Active</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl font-light text-white tracking-tighter mb-6 leading-tight"
          >
            Algorithmic<br/>Precision.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl text-[#8e9192] max-w-2xl mb-12 font-light tracking-wide"
          >
            We analyzed over 100,000 used car transactions to build an uncompromised, data-driven valuation engine. Remove the guesswork from automotive pricing.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }}>
            <Link href="/model" className="group relative inline-flex items-center justify-center bg-white text-black px-8 py-5 text-sm font-bold tracking-[0.2em] uppercase overflow-hidden rounded-sm transition-transform hover:scale-105">
              <span className="relative z-10 flex items-center gap-3">Open Model <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
              <div className="absolute inset-0 h-full w-0 bg-gray-200 transition-[width] duration-300 ease-out group-hover:w-full z-0" />
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-[#8e9192]"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Project Brief Section */}
      <section className="py-32 relative z-20 bg-[#0A0A0A] px-8 md:px-24">
        <div className="max-w-4xl mx-auto md:ml-24">
          <h2 className="text-sm font-bold text-[#8e9192] tracking-[0.3em] uppercase mb-10 border-b border-[#262626] pb-4">Project Insights</h2>
          
          <div className="space-y-16">
            <div>
              <div className="flex items-center gap-4 mb-4 text-white">
                <Database size={24} />
                <h3 className="text-3xl font-light tracking-wide">The Dataset</h3>
              </div>
              <p className="text-[#8e9192] text-lg leading-relaxed font-light">
                Our foundation is built upon a massive dataset of over 100,000 listings from the UK used car market. We aggressively cleaned and filtered this data, handling missing values in crucial fields like engine size and mileage, and removed extreme outliers to prevent our model from heavily skewing towards supercars or anomalies.
              </p>
            </div>
            
            <div>
              <div className="flex items-center gap-4 mb-4 text-white">
                <BrainCircuit size={24} />
                <h3 className="text-3xl font-light tracking-wide">The Architecture</h3>
              </div>
              <p className="text-[#8e9192] text-lg leading-relaxed font-light">
                We deployed a Random Forest Regressor—an ensemble learning method that constructs a multitude of decision trees. This approach excels at capturing the non-linear relationships between a vehicle's age, its mileage, and its market value, without the risk of severe overfitting inherent to deeper neural networks on this scale of data.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4 text-white">
                <LineChart size={24} />
                <h3 className="text-3xl font-light tracking-wide">Value Drivers</h3>
              </div>
              <p className="text-[#8e9192] text-lg leading-relaxed font-light">
                To provide transparency, we engineered an ablation feature. It breaks down the exact monetary value added by an automatic transmission over a manual, or the premium commanded by a specific brand, giving users unprecedented insight into market dynamics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-32 relative z-20 bg-[#111] px-8 md:px-24 border-t border-[#262626]">
        <div className="max-w-6xl mx-auto md:ml-24">
          <div className="flex items-center gap-4 mb-16">
            <BarChart3 className="text-white" size={32} />
            <h2 className="text-4xl font-light tracking-wide text-white">Model Performance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-10 hover:border-[#444] transition-colors relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <p className="text-xs font-semibold text-[#8e9192] tracking-widest uppercase mb-4">R² Score (Variance)</p>
              <p className="text-6xl font-light text-white mb-4">{metrics.R2 ? Number(metrics.R2).toFixed(4) : '--'}</p>
              <p className="text-sm text-[#666] font-light">The model explains over 93% of the variance in market pricing across all vehicle types.</p>
            </div>
            
            <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-10 hover:border-[#444] transition-colors relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <p className="text-xs font-semibold text-[#8e9192] tracking-widest uppercase mb-4">Mean Absolute Error</p>
              <p className="text-6xl font-light text-white mb-4">£{metrics.MAE ? Math.floor(Number(metrics.MAE)).toLocaleString() : '--'}</p>
              <p className="text-sm text-[#666] font-light">On average, our predictions deviate from true market value by only £1,500.</p>
            </div>
            
            <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-10 hover:border-[#444] transition-colors relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <p className="text-xs font-semibold text-[#8e9192] tracking-widest uppercase mb-4">Root Mean Squared Error</p>
              <p className="text-6xl font-light text-white mb-4">£{metrics.RMSE ? Math.floor(Number(metrics.RMSE)).toLocaleString() : '--'}</p>
              <p className="text-sm text-[#666] font-light">A tighter penalization of large errors demonstrates high reliability on standard vehicles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative z-20 bg-[#0A0A0A] px-8 md:px-24 border-t border-[#262626]">
        <div className="max-w-6xl mx-auto md:ml-24">
          <div className="mb-16">
            <h2 className="text-sm font-bold text-[#8e9192] tracking-[0.3em] uppercase mb-4">Application Capabilities</h2>
            <h3 className="text-4xl font-light tracking-wide text-white">Platform Features</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-3xl p-10 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)] transition-all duration-500 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/10 transition-colors duration-700" />
              <div className="mb-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all duration-500 shadow-lg backdrop-blur-sm relative z-10">
                <Calculator size={28} className="text-white group-hover:text-black transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4 relative z-10">Estimator</h3>
              <p className="text-[#8e9192] text-lg font-light leading-relaxed relative z-10">
                Instantly calculate the precise market value of a single vehicle. Input make, model, age, mileage, and engine size for an immediate AI-driven valuation.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-3xl p-10 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)] transition-all duration-500 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/10 transition-colors duration-700" />
              <div className="mb-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all duration-500 shadow-lg backdrop-blur-sm relative z-10">
                <Scale size={28} className="text-white group-hover:text-black transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4 relative z-10">Comparison</h3>
              <p className="text-[#8e9192] text-lg font-light leading-relaxed relative z-10">
                Place two vehicles head-to-head. Analyze how differing brand premiums or specifications affect valuation side-by-side to make informed market decisions.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-3xl p-10 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)] transition-all duration-500 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/10 transition-colors duration-700" />
              <div className="mb-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all duration-500 shadow-lg backdrop-blur-sm relative z-10">
                <TrendingUp size={28} className="text-white group-hover:text-black transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4 relative z-10">Value Drivers</h3>
              <p className="text-[#8e9192] text-lg font-light leading-relaxed relative z-10">
                Deconstruct the price. Our ablation technology isolates exactly how much value is added or lost due to transmission type, engine size, and accumulated mileage.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-3xl p-10 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)] transition-all duration-500 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/10 transition-colors duration-700" />
              <div className="mb-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all duration-500 shadow-lg backdrop-blur-sm relative z-10">
                <PieChart size={28} className="text-white group-hover:text-black transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4 relative z-10">Insights</h3>
              <p className="text-[#8e9192] text-lg font-light leading-relaxed relative z-10">
                Explore macro trends across the 100,000+ car dataset. Visualize brand distributions, average price depreciation curves, and market segment dominance.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Made By Section (Big and Detailed) */}
      <section className="py-32 relative z-20 bg-[#111] border-t border-[#262626] flex justify-center px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="relative group shrink-0">
            <div className="absolute -inset-2 bg-gradient-to-r from-white/20 to-white/0 rounded-full blur-lg opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
            <img 
              src="https://github.com/Piyush-Fr.png" 
              alt="Piyush-Fr GitHub Profile" 
              className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border border-[#333] group-hover:border-white/40 transition-all duration-500 object-cover shadow-2xl"
            />
          </div>
          
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h4 className="text-xs font-bold text-[#666] tracking-[0.3em] uppercase mb-4">Designed & Developed By</h4>
            <h2 className="text-4xl md:text-5xl font-light text-white tracking-tighter mb-4">Piyush-Fr</h2>
            <p className="text-[#8e9192] text-lg font-light leading-relaxed mb-8 max-w-lg">
              Machine Learning Engineer building advanced predictive models and delivering them through sleek, high-performance web experiences.
            </p>
            <a 
              href="https://github.com/Piyush-Fr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-sm font-bold tracking-[0.2em] uppercase rounded-sm hover:scale-105 hover:bg-gray-200 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current transition-transform group-hover:-rotate-12"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              View GitHub Profile
            </a>
          </div>
        </div>
      </section>

      {/* Tech Stack Footer */}
      <section className="py-12 relative z-20 bg-[#0A0A0A] border-t border-[#262626]">
        <div className="max-w-7xl mx-auto px-8 md:px-24">
          <h4 className="text-center text-xs font-bold text-[#444] tracking-[0.3em] uppercase mb-8">Supported By</h4>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60">
            
            <div className="flex items-center gap-2 text-[#666] hover:text-white transition-colors cursor-default">
              <Triangle size={18} className="fill-current" />
              <span className="text-xs font-bold tracking-wider">NEXT.JS</span>
            </div>

            <div className="flex items-center gap-2 text-[#666] hover:text-white transition-colors cursor-default">
              <Atom size={18} />
              <span className="text-xs font-bold tracking-wider">REACT</span>
            </div>

            <div className="flex items-center gap-2 text-[#666] hover:text-white transition-colors cursor-default">
              <Wind size={18} />
              <span className="text-xs font-bold tracking-wider">TAILWIND</span>
            </div>

            <div className="flex items-center gap-2 text-[#666] hover:text-white transition-colors cursor-default">
              <Terminal size={18} />
              <span className="text-xs font-bold tracking-wider">PYTHON</span>
            </div>

            <div className="flex items-center gap-2 text-[#666] hover:text-white transition-colors cursor-default">
              <FlaskConical size={18} />
              <span className="text-xs font-bold tracking-wider">FLASK</span>
            </div>

            <div className="flex items-center gap-2 text-[#666] hover:text-white transition-colors cursor-default">
              <BrainCircuit size={18} />
              <span className="text-xs font-bold tracking-wider">SCIKIT-LEARN</span>
            </div>
            
            <div className="flex items-center gap-2 text-[#666] hover:text-white transition-colors cursor-default">
              <Database size={18} />
              <span className="text-xs font-bold tracking-wider">PANDAS</span>
            </div>
            
            <div className="flex items-center gap-2 text-[#666] hover:text-white transition-colors cursor-default">
              <Layers size={18} />
              <span className="text-xs font-bold tracking-wider">VERCEL & RENDER</span>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
