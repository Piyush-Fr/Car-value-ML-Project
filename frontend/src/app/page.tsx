'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import { BarChart3, Calculator, Info, CheckCircle, AlertCircle, Loader2, ArrowRightLeft, ChevronDown } from 'lucide-react';

const CustomSelect = ({ label, value, options, onChange }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`flex flex-col gap-2 relative group w-full ${isOpen ? 'z-50' : 'z-10'}`}>
      <label className="text-xs font-semibold text-[#8e9192] uppercase tracking-widest transition-colors">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between border-b border-[#262626] text-white py-2 cursor-pointer transition-colors hover:border-white group-hover:border-white"
      >
        <span className="text-lg">{value}</span>
        <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
            className="absolute top-full left-0 w-full mt-2 bg-[#1A1A1A] border border-[#262626] rounded-md shadow-2xl z-50 overflow-y-auto max-h-60"
          >
            {options.map((opt: string) => (
              <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`px-4 py-3 cursor-pointer hover:bg-[#333] transition-colors ${value === opt ? 'bg-[#2a2a2a] text-white' : 'text-[#8e9192]'}`}
              >
                {opt}
              </div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

const AnimatedNumber = ({ value, isFloat = false }: { value: string | number, isFloat?: boolean }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    if (!nodeRef.current) return;
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
    
    if (isNaN(numValue)) {
      nodeRef.current.textContent = String(value);
      return;
    }
    
    const controls = animate(0, numValue, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(v) {
        if (nodeRef.current) {
          nodeRef.current.textContent = isFloat ? v.toFixed(4) : Math.floor(v).toLocaleString();
        }
      }
    });
    return () => controls.stop();
  }, [value, isFloat]);
  
  return <span ref={nodeRef}>{value}</span>;
};

const CAR_MODELS = {"Audi": ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "R8", "RS3", "RS4", "RS5", "RS6", "RS7", "S3", "S4", "S5", "S8", "SQ5", "SQ7", "TT"], "VW": ["Amarok", "Arteon", "Beetle", "CC", "Caddy", "Caddy Life", "Caddy Maxi", "Caddy Maxi Life", "California", "Caravelle", "Eos", "Fox", "Golf", "Golf SV", "Jetta", "Passat", "Polo", "Scirocco", "Sharan", "Shuttle", "T-Cross", "T-Roc", "Tiguan", "Tiguan Allspace", "Touareg", "Touran", "Up"], "BMW": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "8 Series", "M2", "M3", "M4", "M5", "M6", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z3", "Z4", "i3", "i8"], "Ford": ["B-MAX", "C-MAX", "EcoSport", "Edge", "Escort", "Fiesta", "Focus", "Fusion", "Galaxy", "Grand C-MAX", "Grand Tourneo Connect", "KA", "Ka+", "Kuga", "Mondeo", "Mustang", "Puma", "Ranger", "S-MAX", "Streetka", "Tourneo Connect", "Tourneo Custom", "Transit Tourneo"], "Hyundai": ["Accent", "Amica", "Getz", "I10", "I20", "I30", "I40", "I800", "IX20", "IX35", "Ioniq", "Kona", "Santa Fe", "Terracan", "Tucson", "Veloster"], "Mercedes": ["180", "200", "220", "230", "A Class", "B Class", "C Class", "CL Class", "CLA Class", "CLC Class", "CLK", "CLS Class", "E Class", "G Class", "GL Class", "GLA Class", "GLB Class", "GLC Class", "GLE Class", "GLS Class", "M Class", "R Class", "S Class", "SL CLASS", "SLK", "V Class", "X-CLASS"], "Skoda": ["Citigo", "Fabia", "Kamiq", "Karoq", "Kodiaq", "Octavia", "Rapid", "Roomster", "Scala", "Superb", "Yeti", "Yeti Outdoor"], "Toyota": ["Auris", "Avensis", "Aygo", "C-HR", "Camry", "Corolla", "GT86", "Hilux", "IQ", "Land Cruiser", "PROACE VERSO", "Prius", "RAV4", "Supra", "Urban Cruiser", "Verso", "Verso-S", "Yaris"], "Vauxhall": ["Adam", "Agila", "Ampera", "Antara", "Astra", "Cascada", "Combo Life", "Corsa", "Crossland X", "GTC", "Grandland X", "Insignia", "Kadjar", "Meriva", "Mokka", "Mokka X", "Tigra", "Vectra", "Viva", "Vivaro", "Zafira", "Zafira Tourer"]};

export default function Home() {
  const [metrics, setMetrics] = useState({ R2: null, MAE: null, RMSE: null });
  const [price, setPrice] = useState('---,---');
  const [compPrice, setCompPrice] = useState({ Slot1: '---,---', Slot2: '---,---' });
  const [status, setStatus] = useState({ text: 'Awaiting parameters', icon: 'info' });

  // Inputs
  const [brand, setBrand] = useState('VW');
  const [carModel, setCarModel] = useState(CAR_MODELS.VW[0]);
  const [engine, setEngine] = useState('1.6');
  const [fuel, setFuel] = useState('Petrol');
  const [trans, setTrans] = useState('Manual');
  const [mileage, setMileage] = useState('30000');
  const [age, setAge] = useState('5');

  const [compBrand1, setCompBrand1] = useState('VW');
  const [compModel1, setCompModel1] = useState('Golf');
  const [compBrand2, setCompBrand2] = useState('Audi');
  const [compModel2, setCompModel2] = useState('A4');
  
  const [compEngine, setCompEngine] = useState('1.6');
  const [compFuel, setCompFuel] = useState('Petrol');
  const [compTrans, setCompTrans] = useState('Manual');
  const [compMileage, setCompMileage] = useState('30000');
  const [compAge, setCompAge] = useState('3');

  useEffect(() => {
    setCarModel((CAR_MODELS as any)[brand]?.[0] || '');
  }, [brand]);

  useEffect(() => {
    setCompModel1((CAR_MODELS as any)[compBrand1]?.[0] || '');
  }, [compBrand1]);

  useEffect(() => {
    setCompModel2((CAR_MODELS as any)[compBrand2]?.[0] || '');
  }, [compBrand2]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/metrics')
      .then(r => r.json())
      .then(data => setMetrics(data))
      .catch(e => console.error(e));
  }, []);

  const handleEstimate = async () => {
    setPrice('...');
    setStatus({ text: 'Computing...', icon: 'loader' });
    const payload = {
      brand, car_model: carModel, engine_size: engine, fuel_type: fuel, transmission: trans,
      mileage: parseFloat(mileage.replace(/,/g, '') || '30000'),
      car_age: parseFloat(age || '5')
    };

    try {
      const res = await fetch('http://127.0.0.1:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.prediction) {
        setPrice(data.prediction.toLocaleString());
        setStatus({ text: 'Computed', icon: 'check' });
      } else {
        setStatus({ text: data.error || 'Failed', icon: 'error' });
      }
    } catch (e) {
      setStatus({ text: 'Network Error', icon: 'error' });
    }
  };

  const handleCompare = async () => {
    setCompPrice({ Slot1: '...', Slot2: '...' });
    const payload = {
      brand1: compBrand1, model1: compModel1,
      brand2: compBrand2, model2: compModel2,
      engine_size: compEngine, fuel_type: compFuel, transmission: compTrans,
      mileage: parseFloat(compMileage.replace(/,/g, '') || '30000'),
      car_age: parseFloat(compAge || '3')
    };
    try {
      const res = await fetch('http://127.0.0.1:5000/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.Slot1 && data.Slot2) {
        setCompPrice({ Slot1: data.Slot1.toLocaleString(), Slot2: data.Slot2.toLocaleString() });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#e5e2e1] font-sans overflow-x-hidden">
      <header className="fixed top-0 w-full flex justify-between items-center px-8 md:px-16 py-4 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#262626]">
        <span className="text-2xl tracking-widest text-white font-light select-none">MONOVALUATION</span>
      </header>

      {/* Hero */}
      <motion.section initial="hidden" animate="visible" variants={fadeInUp} className="relative h-[60vh] w-full flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 flex justify-end">
          <div className="w-full md:w-[70%] h-full relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-transparent to-[#0A0A0A] z-10" />
            <video className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline>
              <source src="/bg_video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="max-w-7xl mx-auto w-full px-8 md:px-16 relative z-20">
          <h1 className="text-5xl md:text-7xl font-light text-white tracking-tighter mb-6">Used Car<br/>Valuation Engine</h1>
          <p className="text-lg text-[#c4c7c8] max-w-md">Advanced algorithmic assessment for premium automotive assets. Determine market value with uncompromising precision.</p>
        </div>
      </motion.section>

      {/* Metrics */}
      <section className="bg-[#0A0A0A] border-y border-[#262626] py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="flex items-center gap-4 mb-6">
            <BarChart3 className="text-white" />
            <h2 className="text-2xl font-light tracking-wide text-white">Model Performance Metrics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-[#111] border border-[#262626] rounded-xl p-6 shadow-xl">
              <p className="text-xs font-semibold text-[#8e9192] tracking-widest uppercase mb-2">R² Score (Variance)</p>
              <p className="text-4xl font-light text-white"><AnimatedNumber value={metrics.R2 || '--'} isFloat={true} /></p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-[#111] border border-[#262626] rounded-xl p-6 shadow-xl">
              <p className="text-xs font-semibold text-[#8e9192] tracking-widest uppercase mb-2">Mean Absolute Error</p>
              <p className="text-4xl font-light text-white">£<AnimatedNumber value={metrics.MAE || '--'} /></p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-[#111] border border-[#262626] rounded-xl p-6 shadow-xl">
              <p className="text-xs font-semibold text-[#8e9192] tracking-widest uppercase mb-2">Root Mean Squared Error</p>
              <p className="text-4xl font-light text-white">£<AnimatedNumber value={metrics.RMSE || '--'} /></p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Predictor */}
      <section className="bg-[#0A0A0A] py-20 relative z-20">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="flex items-center gap-4 mb-10">
            <Calculator className="text-white" />
            <h2 className="text-2xl font-light tracking-wide text-white">Single Vehicle Estimator</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            <div className="col-span-1 md:col-span-6 grid grid-cols-2 gap-8">
              {/* Inputs */}
              {[
                { label: 'Car Brand', val: brand, set: setBrand, opts: Object.keys(CAR_MODELS) },
                { label: 'Car Model', val: carModel, set: setCarModel, opts: (CAR_MODELS as any)[brand] || [] },
                { label: 'Engine Size (L)', val: engine, set: setEngine, opts: ['1.0', '1.2', '1.4', '1.5', '1.6', '2.0', '3.0'] },
                { label: 'Fuel Type', val: fuel, set: setFuel, opts: ['Petrol', 'Diesel', 'Hybrid', 'Other'] },
                { label: 'Transmission', val: trans, set: setTrans, opts: ['Manual', 'Automatic', 'Semi-Auto'] }
              ].map((input, i) => (
                <CustomSelect key={i} label={input.label} value={input.val} options={input.opts} onChange={input.set} />
              ))}
              <div className="flex flex-col gap-2 group">
                <label className="text-xs font-semibold text-[#8e9192] uppercase tracking-widest group-focus-within:text-white transition-colors">Mileage</label>
                <input value={mileage} onChange={e => setMileage(e.target.value)} className="bg-transparent border-0 border-b border-[#262626] text-white text-lg py-2 px-0 focus:ring-0 focus:border-white transition-colors outline-none" />
              </div>
              <div className="flex flex-col gap-2 group">
                <label className="text-xs font-semibold text-[#8e9192] uppercase tracking-widest group-focus-within:text-white transition-colors">Age (Years)</label>
                <input value={age} onChange={e => setAge(e.target.value)} className="bg-transparent border-0 border-b border-[#262626] text-white text-lg py-2 px-0 focus:ring-0 focus:border-white transition-colors outline-none" />
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} className="col-span-1 md:col-span-5 md:col-start-8 bg-[#1A1A1A] border border-[#262626] rounded-xl p-10 shadow-2xl flex flex-col items-center gap-10">
              <div className="flex flex-col items-center gap-4 w-full">
                <span className="text-xs font-semibold text-[#8e9192] tracking-[0.2em] uppercase">Estimated Value</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-light text-white tabular-nums"><AnimatedNumber value={price} /></span>
                  <span className="text-lg text-[#c4c7c8]">GBP</span>
                </div>
                <div className="w-full h-px bg-[#262626] my-2" />
                <span className="text-sm text-[#8e9192] flex items-center gap-2">
                  {status.icon === 'info' && <Info size={16} />}
                  {status.icon === 'loader' && <Loader2 size={16} className="animate-spin text-white" />}
                  {status.icon === 'check' && <CheckCircle size={16} className="text-green-400" />}
                  {status.icon === 'error' && <AlertCircle size={16} className="text-red-400" />}
                  {status.text}
                </span>
              </div>
              <button onClick={handleEstimate} className="w-full bg-white text-black text-xs font-bold py-4 px-6 rounded uppercase tracking-[0.15em] hover:bg-gray-200 transition-colors">Estimate Price</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-[#111] border-t border-[#262626] py-20 relative z-20">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="flex items-center gap-4 mb-12">
            <ArrowRightLeft className="text-white" />
            <h2 className="text-2xl font-light tracking-wide text-white">Brand Premium Comparison</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="col-span-1 md:col-span-4 bg-[#1A1A1A] border border-[#262626] rounded-xl p-8 shadow-2xl">
              <h3 className="text-xs font-bold text-white mb-6 border-b border-[#262626] pb-4 uppercase tracking-widest">Shared Specifications</h3>
              <div className="flex flex-col gap-6">
                {[
                  { label: 'Engine Size (L)', val: compEngine, set: setCompEngine, opts: ['1.0', '1.2', '1.4', '1.5', '1.6', '2.0', '3.0'] },
                  { label: 'Fuel Type', val: compFuel, set: setCompFuel, opts: ['Petrol', 'Diesel', 'Hybrid', 'Other'] },
                  { label: 'Transmission', val: compTrans, set: setCompTrans, opts: ['Manual', 'Automatic', 'Semi-Auto'] }
                ].map((input, i) => (
                  <CustomSelect key={i} label={input.label} value={input.val} options={input.opts} onChange={input.set} />
                ))}
                <div className="flex flex-col gap-2 group">
                  <label className="text-xs font-semibold text-[#8e9192] uppercase tracking-widest">Mileage</label>
                  <input value={compMileage} onChange={e => setCompMileage(e.target.value)} className="bg-transparent border-0 border-b border-[#262626] text-white py-2 px-0 focus:ring-0 outline-none" />
                </div>
                <div className="flex flex-col gap-2 group">
                  <label className="text-xs font-semibold text-[#8e9192] uppercase tracking-widest">Age (Years)</label>
                  <input value={compAge} onChange={e => setCompAge(e.target.value)} className="bg-transparent border-0 border-b border-[#262626] text-white py-2 px-0 focus:ring-0 outline-none" />
                </div>
              </div>
              <button onClick={handleCompare} className="mt-8 w-full bg-[#333] hover:bg-[#555] text-white text-xs font-bold py-4 rounded uppercase tracking-widest transition-colors">Run Comparison</button>
            </div>
            
            <div className="col-span-1 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div whileHover={{ y: -5 }} className="bg-[#1A1A1A] border-t-4 border-[#333] rounded-xl p-10 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                <h3 className="text-xl text-white mb-6 font-light tracking-widest uppercase">Slot 1</h3>
                <div className="w-full mb-4 max-w-[200px]">
                  <CustomSelect label="Brand" value={compBrand1} options={Object.keys(CAR_MODELS)} onChange={setCompBrand1} />
                </div>
                <div className="w-full mb-6 max-w-[200px]">
                  <CustomSelect label="Model" value={compModel1} options={(CAR_MODELS as any)[compBrand1] || []} onChange={setCompModel1} />
                </div>
                <span className="text-xs font-semibold text-[#8e9192] tracking-[0.2em] uppercase mb-2 z-10">{compBrand1} Value</span>
                <span className="text-5xl font-light text-white tabular-nums z-10"><AnimatedNumber value={compPrice.Slot1} /></span>
                <span className="text-sm text-[#8e9192] mt-2 z-10">GBP</span>
              </motion.div>
              
              <motion.div whileHover={{ y: -5 }} className="bg-[#1A1A1A] border-t-4 border-[#333] rounded-xl p-10 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                <h3 className="text-xl text-white mb-6 font-light tracking-widest uppercase">Slot 2</h3>
                <div className="w-full mb-4 max-w-[200px]">
                  <CustomSelect label="Brand" value={compBrand2} options={Object.keys(CAR_MODELS)} onChange={setCompBrand2} />
                </div>
                <div className="w-full mb-6 max-w-[200px]">
                  <CustomSelect label="Model" value={compModel2} options={(CAR_MODELS as any)[compBrand2] || []} onChange={setCompModel2} />
                </div>
                <span className="text-xs font-semibold text-[#8e9192] tracking-[0.2em] uppercase mb-2 z-10">{compBrand2} Value</span>
                <span className="text-5xl font-light text-white tabular-nums z-10"><AnimatedNumber value={compPrice.Slot2} /></span>
                <span className="text-sm text-[#8e9192] mt-2 z-10">GBP</span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
