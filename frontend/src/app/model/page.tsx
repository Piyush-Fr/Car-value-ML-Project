/* eslint-disable */
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, animate, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, Calculator, Info, CheckCircle, AlertCircle, Loader2, ArrowRightLeft, ChevronDown } from 'lucide-react';
import carDefaultsData from '../../carDefaults.json';
import carEngineSizesData from '../../carEngineSizes.json';
const carEngineSizes: Record<string, string[]> = carEngineSizesData;
const carDefaults: Record<string, any> = carDefaultsData;

const CustomSelect = ({ label, value, options, onChange }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`flex flex-col gap-2 relative group w-full ${isOpen ? 'z-50' : 'z-10'}`}>
      <label className="text-sm font-semibold text-[#8e9192] uppercase tracking-widest transition-colors mix-blend-difference">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between border-b border-[#262626] text-white py-2 cursor-pointer transition-colors hover:border-white group-hover:border-white mix-blend-difference"
      >
        <span className="text-xl py-1">{value}</span>
        <ChevronDown size={22} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
            className="absolute top-full left-0 w-full mt-2 bg-[#0A0A0A] border border-[#262626] rounded-md shadow-2xl z-50 overflow-y-auto max-h-60"
          >
            {options.map((opt: string) => (
              <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`px-5 py-4 text-lg cursor-pointer hover:bg-[#1A1A1A] transition-colors ${value === opt ? 'bg-[#222] text-white' : 'text-[#8e9192]'}`}
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

  // Market Insights State
  const [marketData, setMarketData] = useState<any>(null);
  const [insightsBrand, setInsightsBrand] = useState('All Brands');
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}/api/market-data`)
      .then(r => r.json())
      .then(d => { if (!d.error) setMarketData(d); })
      .catch(e => console.error(e));
  }, []);

  const [metrics, setMetrics] = useState({ R2: null, MAE: null, RMSE: null });
  const [price, setPrice] = useState('---,---');
  const [compPrice, setCompPrice] = useState({ Slot1: '---,---', Slot2: '---,---' });
  const [status, setStatus] = useState({ text: 'Awaiting parameters', icon: 'info' });
  const [activeTab, setActiveTab] = useState('predictor'); // 'predictor', 'comparison', 'drivers'

  // Value Drivers State
  const [vdBrand, setVdBrand] = useState('Audi');
  const [vdModel, setVdModel] = useState('A4');
  const [vdEngine, setVdEngine] = useState('2.0');
  const [vdFuel, setVdFuel] = useState('Diesel');
  const [vdTrans, setVdTrans] = useState('Automatic');
  const [vdAge, setVdAge] = useState('3');
  const [vdMileage, setVdMileage] = useState('30000');
  const [vdData, setVdData] = useState<any>(null);
  const [vdStatus, setVdStatus] = useState({ text: 'Awaiting parameters', icon: 'info' });


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
  
  const [compEngine1, setCompEngine1] = useState('1.6');
  const [compFuel1, setCompFuel1] = useState('Petrol');
  const [compTrans1, setCompTrans1] = useState('Manual');
  const [compEngine2, setCompEngine2] = useState('1.6');
  const [compFuel2, setCompFuel2] = useState('Petrol');
  const [compTrans2, setCompTrans2] = useState('Manual');
  const [compMileage, setCompMileage] = useState('30000');
  const [compAge, setCompAge] = useState('3');

  useEffect(() => {
    const model = (CAR_MODELS as any)[brand]?.[0] || '';
    setCarModel(model);
    if (carDefaults[model]) {
      setEngine(String(carDefaults[model].engineSize));
      setFuel(carDefaults[model].fuelType);
      setTrans(carDefaults[model].transmission);
    }
  }, [brand]);

  useEffect(() => {
    if (carDefaults[carModel]) {
      setEngine(String(carDefaults[carModel].engineSize));
      setFuel(carDefaults[carModel].fuelType);
      setTrans(carDefaults[carModel].transmission);
    }
  }, [carModel]);

  useEffect(() => {
    const model = (CAR_MODELS as any)[compBrand1]?.[0] || '';
    setCompModel1(model);
    if (carDefaults[model]) {
      setCompEngine1(String(carDefaults[model].engineSize));
      setCompFuel1(carDefaults[model].fuelType);
      setCompTrans1(carDefaults[model].transmission);
    }
  }, [compBrand1]);

  useEffect(() => {
    if (carDefaults[compModel1]) {
      setCompEngine1(String(carDefaults[compModel1].engineSize));
      setCompFuel1(carDefaults[compModel1].fuelType);
      setCompTrans1(carDefaults[compModel1].transmission);
    }
  }, [compModel1]);

  useEffect(() => {
    const model = (CAR_MODELS as any)[compBrand2]?.[0] || '';
    setCompModel2(model);
    if (carDefaults[model]) {
      setCompEngine2(String(carDefaults[model].engineSize));
      setCompFuel2(carDefaults[model].fuelType);
      setCompTrans2(carDefaults[model].transmission);
    }
  }, [compBrand2]);

  useEffect(() => {
    if (carDefaults[compModel2]) {
      setCompEngine2(String(carDefaults[compModel2].engineSize));
      setCompFuel2(carDefaults[compModel2].fuelType);
      setCompTrans2(carDefaults[compModel2].transmission);
    }
  }, [compModel2]);

  
  useEffect(() => {
    const model = (CAR_MODELS as any)[vdBrand]?.[0] || '';
    setVdModel(model);
    if (carDefaults[model]) {
      setVdEngine(String(carDefaults[model].engineSize));
      setVdFuel(carDefaults[model].fuelType);
      setVdTrans(carDefaults[model].transmission);
    }
  }, [vdBrand]);

  useEffect(() => {
    if (carDefaults[vdModel]) {
      setVdEngine(String(carDefaults[vdModel].engineSize));
      setVdFuel(carDefaults[vdModel].fuelType);
      setVdTrans(carDefaults[vdModel].transmission);
    }
  }, [vdModel]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}/api/metrics`)
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}/api/predict`, {
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
      engine_size1: compEngine1, fuel_type1: compFuel1, transmission1: compTrans1,
      engine_size2: compEngine2, fuel_type2: compFuel2, transmission2: compTrans2,
      mileage: parseFloat(compMileage.replace(/,/g, '') || '30000'),
      car_age: parseFloat(compAge || '3')
    };
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}/api/compare`, {
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

  
  const handleValueDrivers = async () => {
    setVdData(null);
    setVdStatus({ text: 'Analyzing ablation...', icon: 'loader' });
    const payload = {
      brand: vdBrand, car_model: vdModel, engine_size: vdEngine, fuel_type: vdFuel, transmission: vdTrans,
      mileage: parseFloat(vdMileage.replace(/,/g, '') || '30000'),
      car_age: parseFloat(vdAge || '3')
    };
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}/api/value_drivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.drivers) {
        setVdData(data);
        setVdStatus({ text: 'Analysis complete', icon: 'check' });
      } else {
        setVdStatus({ text: data.error || 'Failed', icon: 'error' });
      }
    } catch (e) {
      setVdStatus({ text: 'Network Error', icon: 'error' });
    }
  };

  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#e5e2e1] font-sans overflow-x-hidden">
      <header className="fixed top-0 w-full flex flex-col lg:flex-row justify-between items-center px-0 lg:px-16 z-50 bg-[#0A0A0A] lg:bg-transparent lg:bg-gradient-to-b lg:from-[#0A0A0A] lg:via-[#0A0A0A]/90 lg:to-transparent pointer-events-none border-b border-[#262626] lg:border-none">
        <div className="w-full lg:w-1/3 flex justify-center lg:justify-start pointer-events-auto border-b border-[#1a1a1a] lg:border-none">
          <Link href="/" className="text-lg lg:text-2xl tracking-widest text-white font-light select-none hover:opacity-80 transition-opacity py-3 lg:py-4">MONOVALUATION</Link>
        </div>
        <div className="w-full lg:w-1/3 flex justify-start lg:justify-center gap-6 pointer-events-auto overflow-x-auto lg:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-6 lg:px-0 bg-[#0A0A0A] lg:bg-transparent">
          {[
            { id: 'predictor', label: 'Estimator' },
            { id: 'comparison', label: 'Comparison' },
            { id: 'drivers', label: 'Value Drivers' },
            { id: 'insights', label: 'Insights' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-3 lg:py-5 text-[11px] lg:text-sm font-semibold tracking-widest uppercase transition-colors relative whitespace-nowrap ${activeTab === tab.id ? 'text-white' : 'text-[#8e9192] hover:text-[#c4c7c8]'}`}>
              {tab.label}
              {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
            </button>
          ))}
        </div>
        <div className="hidden lg:block w-1/3"></div>
      </header>

      <div className="pt-[110px] lg:pt-[72px]">
      <AnimatePresence mode="wait">

      {activeTab === 'predictor' && (
      <motion.section key="predictor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="py-8 relative z-20">
        <div className="fixed inset-0 w-full h-screen overflow-hidden z-0 bg-[#0A0A0A]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent opacity-90" />
        </div>
        
        <div className="max-w-7xl mx-auto px-8 md:px-16 relative z-10">
          <div className="flex items-center gap-4 mb-6 mix-blend-difference">
            <Calculator size={32} className="text-white" />
            <h2 className="text-3xl font-light tracking-wide text-white">Single Vehicle Estimator</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="col-span-1 md:col-span-6 grid grid-cols-2 gap-8">
              {/* Inputs */}
              {[
                { label: 'Car Brand', val: brand, set: setBrand, opts: Object.keys(CAR_MODELS) },
                { label: 'Car Model', val: carModel, set: setCarModel, opts: (CAR_MODELS as any)[brand] || [] },
                { label: 'Engine Size (L)', val: engine, set: setEngine, opts: carEngineSizes[carModel] || ['1.0', '1.2', '1.4', '1.5', '1.6', '2.0', '3.0'] },
                { label: 'Fuel Type', val: fuel, set: setFuel, opts: ['Petrol', 'Diesel', 'Hybrid', 'Other'] },
                { label: 'Transmission', val: trans, set: setTrans, opts: ['Manual', 'Automatic', 'Semi-Auto'] }
              ].map((input, i) => (
                <CustomSelect key={i} label={input.label} value={input.val} options={input.opts} onChange={input.set} />
              ))}
              <div className="flex flex-col gap-4 group mt-2">
                <div className="flex justify-between items-center mix-blend-difference">
                  <label className="text-sm font-semibold text-[#8e9192] uppercase tracking-widest group-focus-within:text-white transition-colors">Mileage</label>
                  <span className="text-xl text-white font-light tabular-nums">{parseInt(mileage).toLocaleString()}</span>
                </div>
                <input type="range" min="0" max="250000" step="1000" value={mileage} onChange={e => setMileage(e.target.value)} className="w-full cursor-col-resize appearance-none bg-transparent outline-none transition-all focus:outline-none active:scale-105 disabled:pointer-events-none disabled:opacity-50 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-1 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-sm [&::-moz-range-track]:h-8 [&::-moz-range-track]:w-full [&::-moz-range-track]:rounded-xl [&::-moz-range-track]:border-0 [&::-moz-range-track]:bg-white/20 [&::-moz-range-track]:px-2 [&::-moz-range-track]:py-2 [&::-moz-range-track]:transition-all active:[&::-moz-range-track]:bg-white/30 [&::-webkit-slider-runnable-track]:h-8 [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:rounded-xl [&::-webkit-slider-runnable-track]:border-0 [&::-webkit-slider-runnable-track]:bg-white/20 [&::-webkit-slider-runnable-track]:px-2 [&::-webkit-slider-runnable-track]:py-2 active:[&::-webkit-slider-runnable-track]:bg-white/30 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-white mix-blend-difference" />
              </div>
              <div className="flex flex-col gap-4 group mt-2">
                <div className="flex justify-between items-center mix-blend-difference">
                  <label className="text-sm font-semibold text-[#8e9192] uppercase tracking-widest group-focus-within:text-white transition-colors">Age</label>
                  <span className="text-xl text-white font-light tabular-nums">{age} Years</span>
                </div>
                <input type="range" min="0" max="24" step="1" value={age} onChange={e => setAge(e.target.value)} className="w-full cursor-col-resize appearance-none bg-transparent outline-none transition-all focus:outline-none active:scale-105 disabled:pointer-events-none disabled:opacity-50 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-1 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-sm [&::-moz-range-track]:h-8 [&::-moz-range-track]:w-full [&::-moz-range-track]:rounded-xl [&::-moz-range-track]:border-0 [&::-moz-range-track]:bg-white/20 [&::-moz-range-track]:px-2 [&::-moz-range-track]:py-2 [&::-moz-range-track]:transition-all active:[&::-moz-range-track]:bg-white/30 [&::-webkit-slider-runnable-track]:h-8 [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:rounded-xl [&::-webkit-slider-runnable-track]:border-0 [&::-webkit-slider-runnable-track]:bg-white/20 [&::-webkit-slider-runnable-track]:px-2 [&::-webkit-slider-runnable-track]:py-2 active:[&::-webkit-slider-runnable-track]:bg-white/30 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-white mix-blend-difference" />
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} className="col-span-1 md:col-span-5 md:col-start-8 bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl flex flex-col items-center gap-8">
              <div className="flex flex-col items-center gap-4 w-full">
                <span className="text-sm font-semibold text-[#8e9192] tracking-[0.2em] uppercase">Estimated Value</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-light text-white tabular-nums"><AnimatedNumber value={price} /></span>
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
      </motion.section>

      )}

      {activeTab === 'comparison' && (
      <motion.section key="comparison" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="py-8 relative z-20">
        <div className="fixed inset-0 w-full h-screen overflow-hidden z-0 bg-[#0A0A0A]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent opacity-90" />
        </div>
        
        <div className="max-w-7xl mx-auto px-8 md:px-16 relative z-10">
          <div className="flex items-center gap-4 mb-6 mix-blend-difference">
            <ArrowRightLeft size={32} className="text-white" />
            <h2 className="text-3xl font-light tracking-wide text-white">Brand Premium Comparison</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="col-span-1 md:col-span-4 bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl">
              <h3 className="text-xs font-bold text-white mb-4 border-b border-[#262626] pb-3 uppercase tracking-widest">Shared Specifications</h3>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 group mt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-[#8e9192] uppercase tracking-widest group-focus-within:text-white transition-colors">Mileage</label>
                    <span className="text-xl text-white font-light tabular-nums">{parseInt(compMileage).toLocaleString()}</span>
                  </div>
                  <input type="range" min="0" max="250000" step="1000" value={compMileage} onChange={e => setCompMileage(e.target.value)} className="w-full cursor-col-resize appearance-none bg-transparent outline-none transition-all focus:outline-none active:scale-105 disabled:pointer-events-none disabled:opacity-50 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-1 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-sm [&::-moz-range-track]:h-8 [&::-moz-range-track]:w-full [&::-moz-range-track]:rounded-xl [&::-moz-range-track]:border-0 [&::-moz-range-track]:bg-white/20 [&::-moz-range-track]:px-2 [&::-moz-range-track]:py-2 [&::-moz-range-track]:transition-all active:[&::-moz-range-track]:bg-white/30 [&::-webkit-slider-runnable-track]:h-8 [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:rounded-xl [&::-webkit-slider-runnable-track]:border-0 [&::-webkit-slider-runnable-track]:bg-white/20 [&::-webkit-slider-runnable-track]:px-2 [&::-webkit-slider-runnable-track]:py-2 active:[&::-webkit-slider-runnable-track]:bg-white/30 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-white" />
                </div>
                <div className="flex flex-col gap-4 group mt-2">
                  <div className="flex justify-between items-center mix-blend-difference">
                    <label className="text-sm font-semibold text-[#8e9192] uppercase tracking-widest group-focus-within:text-white transition-colors">Age</label>
                    <span className="text-xl text-white font-light tabular-nums">{compAge} Years</span>
                  </div>
                  <input type="range" min="0" max="24" step="1" value={compAge} onChange={e => setCompAge(e.target.value)} className="w-full cursor-col-resize appearance-none bg-transparent outline-none transition-all focus:outline-none active:scale-105 disabled:pointer-events-none disabled:opacity-50 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-1 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-sm [&::-moz-range-track]:h-8 [&::-moz-range-track]:w-full [&::-moz-range-track]:rounded-xl [&::-moz-range-track]:border-0 [&::-moz-range-track]:bg-white/20 [&::-moz-range-track]:px-2 [&::-moz-range-track]:py-2 [&::-moz-range-track]:transition-all active:[&::-moz-range-track]:bg-white/30 [&::-webkit-slider-runnable-track]:h-8 [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:rounded-xl [&::-webkit-slider-runnable-track]:border-0 [&::-webkit-slider-runnable-track]:bg-white/20 [&::-webkit-slider-runnable-track]:px-2 [&::-webkit-slider-runnable-track]:py-2 active:[&::-webkit-slider-runnable-track]:bg-white/30 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-white mix-blend-difference" />
                </div>
              </div>
              <button onClick={handleCompare} className="mt-8 w-full bg-[#333] hover:bg-[#555] text-white text-xs font-bold py-5 text-sm rounded uppercase tracking-widest transition-colors">Run Comparison</button>
            </div>
            
            <div className="col-span-1 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div whileHover={{ y: -5 }} className="bg-[#0A0A0A]/40 backdrop-blur-xl border-t-4 border-white/20 rounded-xl p-6 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                <h3 className="text-xl text-white mb-6 font-light tracking-widest uppercase">Slot 1</h3>
                <div className="w-full mb-4 max-w-[200px]">
                  <CustomSelect label="Brand" value={compBrand1} options={Object.keys(CAR_MODELS)} onChange={setCompBrand1} />
                </div>
                <div className="w-full mb-6 max-w-[200px]">
                  <CustomSelect label="Model" value={compModel1} options={(CAR_MODELS as any)[compBrand1] || []} onChange={setCompModel1} />
                </div>
                <div className="w-full mb-2 max-w-[200px]">
                  <CustomSelect label="Engine (L)" value={compEngine1} options={carEngineSizes[compModel1] || ['1.0', '1.2', '1.4', '1.5', '1.6', '2.0', '2.2', '2.5', '3.0', '4.0', '5.0']} onChange={setCompEngine1} />
                </div>
                <div className="w-full mb-2 max-w-[200px]">
                  <CustomSelect label="Fuel" value={compFuel1} options={['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Other']} onChange={setCompFuel1} />
                </div>
                <div className="w-full mb-6 max-w-[200px]">
                  <CustomSelect label="Trans." value={compTrans1} options={['Manual', 'Automatic', 'Semi-Auto']} onChange={setCompTrans1} />
                </div>
                <span className="text-sm font-semibold text-[#8e9192] tracking-[0.2em] uppercase mb-2 z-10">{compBrand1} Value</span>
                <span className="text-7xl font-light text-white tabular-nums z-10"><AnimatedNumber value={compPrice.Slot1} /></span>
                <span className="text-xl text-[#8e9192] mt-4 z-10">GBP</span>
              </motion.div>
              
              <motion.div whileHover={{ y: -5 }} className="bg-[#0A0A0A]/40 backdrop-blur-xl border-t-4 border-white/20 rounded-xl p-6 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                <h3 className="text-xl text-white mb-6 font-light tracking-widest uppercase">Slot 2</h3>
                <div className="w-full mb-4 max-w-[200px]">
                  <CustomSelect label="Brand" value={compBrand2} options={Object.keys(CAR_MODELS)} onChange={setCompBrand2} />
                </div>
                <div className="w-full mb-6 max-w-[200px]">
                  <CustomSelect label="Model" value={compModel2} options={(CAR_MODELS as any)[compBrand2] || []} onChange={setCompModel2} />
                </div>
                <div className="w-full mb-2 max-w-[200px]">
                  <CustomSelect label="Engine (L)" value={compEngine2} options={carEngineSizes[compModel2] || ['1.0', '1.2', '1.4', '1.5', '1.6', '2.0', '2.2', '2.5', '3.0', '4.0', '5.0']} onChange={setCompEngine2} />
                </div>
                <div className="w-full mb-2 max-w-[200px]">
                  <CustomSelect label="Fuel" value={compFuel2} options={['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Other']} onChange={setCompFuel2} />
                </div>
                <div className="w-full mb-6 max-w-[200px]">
                  <CustomSelect label="Trans." value={compTrans2} options={['Manual', 'Automatic', 'Semi-Auto']} onChange={setCompTrans2} />
                </div>
                <span className="text-sm font-semibold text-[#8e9192] tracking-[0.2em] uppercase mb-2 z-10">{compBrand2} Value</span>
                <span className="text-7xl font-light text-white tabular-nums z-10"><AnimatedNumber value={compPrice.Slot2} /></span>
                <span className="text-xl text-[#8e9192] mt-4 z-10">GBP</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
      )}

      {activeTab === 'drivers' && (
      <motion.section key="drivers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="py-8 relative z-20">
        <div className="fixed inset-0 w-full h-screen overflow-hidden z-0 bg-[#0A0A0A]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent opacity-90" />
        </div>
        
        <div className="max-w-7xl mx-auto px-8 md:px-16 relative z-10">
          <div className="flex items-center gap-4 mb-6 mix-blend-difference">
            <BarChart3 size={32} className="text-white" />
            <h2 className="text-3xl font-light tracking-wide text-white">Value Drivers Analysis</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="col-span-1 md:col-span-4 bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl">
              <h3 className="text-xs font-bold text-white mb-4 border-b border-[#262626] pb-3 uppercase tracking-widest">Configuration</h3>
              <div className="flex flex-col gap-6">
                {[
                  { label: 'Brand', val: vdBrand, set: setVdBrand, opts: Object.keys(CAR_MODELS) },
                  { label: 'Model', val: vdModel, set: setVdModel, opts: (CAR_MODELS as any)[vdBrand] || [] },
                  { label: 'Engine (L)', val: vdEngine, set: setVdEngine, opts: carEngineSizes[vdModel] || ['1.0', '1.2', '1.4', '1.5', '1.6', '2.0', '3.0'] },
                  { label: 'Fuel', val: vdFuel, set: setVdFuel, opts: ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Other'] },
                  { label: 'Trans.', val: vdTrans, set: setVdTrans, opts: ['Manual', 'Automatic', 'Semi-Auto'] }
                ].map((input, i) => (
                  <CustomSelect key={i} label={input.label} value={input.val} options={input.opts} onChange={input.set} />
                ))}
                <div className="flex flex-col gap-4 group mt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-[#8e9192] uppercase tracking-widest group-focus-within:text-white transition-colors">Mileage</label>
                    <span className="text-xl text-white font-light tabular-nums">{parseInt(vdMileage).toLocaleString()}</span>
                  </div>
                  <input type="range" min="0" max="250000" step="1000" value={vdMileage} onChange={e => setVdMileage(e.target.value)} className="w-full cursor-col-resize appearance-none bg-transparent outline-none transition-all focus:outline-none active:scale-105 disabled:pointer-events-none disabled:opacity-50 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-1 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-sm [&::-moz-range-track]:h-8 [&::-moz-range-track]:w-full [&::-moz-range-track]:rounded-xl [&::-moz-range-track]:border-0 [&::-moz-range-track]:bg-white/20 [&::-moz-range-track]:px-2 [&::-moz-range-track]:py-2 [&::-moz-range-track]:transition-all active:[&::-moz-range-track]:bg-white/30 [&::-webkit-slider-runnable-track]:h-8 [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:rounded-xl [&::-webkit-slider-runnable-track]:border-0 [&::-webkit-slider-runnable-track]:bg-white/20 [&::-webkit-slider-runnable-track]:px-2 [&::-webkit-slider-runnable-track]:py-2 active:[&::-webkit-slider-runnable-track]:bg-white/30 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-white" />
                </div>
                <div className="flex flex-col gap-4 group mt-2">
                  <div className="flex justify-between items-center mix-blend-difference">
                    <label className="text-sm font-semibold text-[#8e9192] uppercase tracking-widest group-focus-within:text-white transition-colors">Age</label>
                    <span className="text-xl text-white font-light tabular-nums">{vdAge} Years</span>
                  </div>
                  <input type="range" min="0" max="24" step="1" value={vdAge} onChange={e => setVdAge(e.target.value)} className="w-full cursor-col-resize appearance-none bg-transparent outline-none transition-all focus:outline-none active:scale-105 disabled:pointer-events-none disabled:opacity-50 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-1 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-sm [&::-moz-range-track]:h-8 [&::-moz-range-track]:w-full [&::-moz-range-track]:rounded-xl [&::-moz-range-track]:border-0 [&::-moz-range-track]:bg-white/20 [&::-moz-range-track]:px-2 [&::-moz-range-track]:py-2 [&::-moz-range-track]:transition-all active:[&::-moz-range-track]:bg-white/30 [&::-webkit-slider-runnable-track]:h-8 [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:rounded-xl [&::-webkit-slider-runnable-track]:border-0 [&::-webkit-slider-runnable-track]:bg-white/20 [&::-webkit-slider-runnable-track]:px-2 [&::-webkit-slider-runnable-track]:py-2 active:[&::-webkit-slider-runnable-track]:bg-white/30 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-white mix-blend-difference" />
                </div>
              </div>
              <button onClick={handleValueDrivers} className="mt-8 w-full bg-[#333] hover:bg-[#555] text-white text-xs font-bold py-5 text-sm rounded uppercase tracking-widest transition-colors flex justify-center items-center gap-2">
                {vdStatus.icon === 'loader' && <Loader2 size={16} className="animate-spin text-white" />}
                Run Ablation
              </button>
            </div>
            
            <div className="col-span-1 md:col-span-8">
              {vdData ? (
                <div className="bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-8 text-xs font-bold text-[#8e9192] tracking-widest uppercase border-b border-[#262626] pb-4">
                    <span>Value Drivers</span>
                    <span>·</span>
                    <span>Why £{vdData.total_price.toLocaleString()}</span>
                    <span>·</span>
                    <span>Ablation</span>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    {vdData.drivers.map((driver: any, i: number) => {
                      const maxVal = Math.max(...vdData.drivers.map((d: any) => Math.abs(d.value)));
                      const width = `${(Math.abs(driver.value) / maxVal) * 100}%`;
                      const isPositive = driver.value >= 0;
                      return (
                        <div key={i} className="bg-[#222] border border-[#333] rounded-lg p-5 relative overflow-hidden group">
                          <div className="flex justify-between items-start mb-2 relative z-10">
                            <div>
                              <h4 className="text-white font-semibold text-lg">{driver.name}</h4>
                              <p className="text-sm text-[#8e9192]">{driver.description} lifts the estimate by £{Math.abs(driver.value).toLocaleString()}.</p>
                            </div>
                            <div className={`font-bold text-lg tabular-nums ${isPositive ? 'text-orange-400' : 'text-red-400'}`}>
                              {isPositive ? '+' : '-'}£{Math.abs(driver.value).toLocaleString()}
                            </div>
                          </div>
                          <div className="w-full h-1.5 bg-[#111] rounded-full mt-4 relative z-10 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} animate={{ width }} transition={{ duration: 1, delay: i * 0.1 }}
                              className={`h-full rounded-full ${isPositive ? 'bg-orange-400' : 'bg-red-400'}`} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-[#1A1A1A] border border-[#262626] border-dashed rounded-xl p-20 flex flex-col items-center justify-center text-center opacity-50">
                  <BarChart3 size={48} className="text-[#333] mb-4" />
                  <p className="text-lg text-[#8e9192]">Select configuration and run ablation to analyze value drivers.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>
      )}

      {activeTab === 'insights' && (
      <motion.section key="insights" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="py-8 relative z-20 min-h-screen">
        <div className="fixed inset-0 w-full h-screen overflow-hidden z-0 bg-[#0A0A0A]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent opacity-90" />
        </div>

        <div className="max-w-7xl mx-auto w-full px-8 md:px-16 relative z-10">
          {!marketData ? (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6">
              <Loader2 size={48} className="animate-spin text-white" />
              <p className="text-lg text-[#8e9192] tracking-widest uppercase font-semibold">Loading Market Data...</p>
            </div>
          ) : (
          <>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4 mix-blend-difference">
              <BarChart3 size={32} className="text-white" />
              <h2 className="text-3xl font-light tracking-wide text-white">Market Insights</h2>
            </div>
            <div className="w-56">
              <CustomSelect label="Brand" value={insightsBrand} options={['All Brands', ...(marketData?.brands || [])]} onChange={setInsightsBrand} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl flex flex-col gap-6">
              <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-[#8e9192]">Depreciation Curve • Median By Age</h3>
              <div className="h-80 w-full">
                {marketData?.data?.[insightsBrand] ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={marketData.data[insightsBrand].depreciation} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffffff" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={true} />
                      <XAxis dataKey="age" stroke="#8e9192" tick={{ fill: '#8e9192', fontSize: 12 }} label={{ value: 'Vehicle age (yrs)', position: 'bottom', fill: '#8e9192' }} />
                      <YAxis stroke="#8e9192" tickFormatter={(v) => `£${v/1000}k`} tick={{ fill: '#8e9192', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                        labelStyle={{ color: '#8e9192', marginBottom: '4px' }}
                        formatter={(value: any) => [`£${Number(value).toLocaleString()}`, 'Median Price']}
                        labelFormatter={(label) => `Age: ${label} years`}
                      />
                      <Area type="monotone" dataKey="median_price" stroke="#ffffff" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-[#8e9192]"><Loader2 className="animate-spin" /></div>
                )}
              </div>
            </div>

            <div className="bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl flex flex-col gap-6">
              <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-[#8e9192]">Price vs Odometer • Market Scatter</h3>
              <div className="h-80 w-full">
                {marketData?.data?.[insightsBrand] ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis type="number" dataKey="mileage" name="Mileage" stroke="#8e9192" tickFormatter={(v) => `${v/1000}k`} tick={{ fill: '#8e9192', fontSize: 12 }} domain={[0, 150000]} />
                      <YAxis type="number" dataKey="price" name="Price" stroke="#8e9192" tickFormatter={(v) => `£${v/1000}k`} tick={{ fill: '#8e9192', fontSize: 12 }} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#ffffff' }}
                      />
                      <Scatter name="Cars" data={marketData.data[insightsBrand].scatter} fill="#ffffff" fillOpacity={0.6} shape="circle" isAnimationActive={false} />
                    </ScatterChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-[#8e9192]"><Loader2 className="animate-spin" /></div>
                )}
              </div>
            </div>
          </div>
          </>
          )}
        </div>
      </motion.section>
      )}

      </AnimatePresence>
      </div>
    </div>
  );
}
