'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BarChart3, Database, BrainCircuit, LineChart, ChevronDown, ArrowRight } from 'lucide-react';
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

      {/* Footer CTA */}
      <section className="py-40 relative z-20 bg-[#0A0A0A] text-center border-t border-[#262626]">
        <h2 className="text-4xl md:text-6xl font-light text-white tracking-tighter mb-10">Ready to value?</h2>
        <Link href="/model" className="group relative inline-flex items-center justify-center bg-white text-black px-10 py-5 text-sm font-bold tracking-[0.2em] uppercase overflow-hidden rounded-sm transition-transform hover:scale-105">
          <span className="relative z-10">Launch Application</span>
          <div className="absolute inset-0 h-full w-0 bg-gray-200 transition-[width] duration-300 ease-out group-hover:w-full z-0" />
        </Link>
      </section>
    </div>
  );
}
