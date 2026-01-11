import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
];

export default function PhoneInput({ value, onChange, selectedCode, onCodeChange }) {
  const [showCodes, setShowCodes] = useState(false);
  
  const selected = countryCodes.find(c => c.code === selectedCode) || countryCodes[0];

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCodes(!showCodes)}
          className="flex items-center gap-2 px-4 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm"
        >
          <span className="text-xl">{selected.flag}</span>
          <span className="text-slate-700 font-medium">{selected.code}</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.button>
        
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="Phone number"
          className="flex-1 px-5 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-800 text-lg font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          maxLength={10}
        />
      </div>
      
      {showCodes && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 w-48"
        >
          {countryCodes.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                onCodeChange(item.code);
                setShowCodes(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
            >
              <span className="text-xl">{item.flag}</span>
              <span className="text-slate-700 font-medium">{item.code}</span>
              <span className="text-slate-400 text-sm">{item.country}</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}