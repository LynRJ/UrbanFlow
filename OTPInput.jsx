import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function OTPInput({ value, onChange, length = 6 }) {
  const inputRefs = useRef([]);
  
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, digit) => {
    if (!/^[0-9]?$/.test(digit)) return;
    
    const newValue = value.split('');
    newValue[index] = digit;
    onChange(newValue.join(''));
    
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length).replace(/[^0-9]/g, '');
    onChange(pastedData);
    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }, (_, index) => (
        <motion.input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          className={`w-12 h-14 text-center text-2xl font-bold rounded-2xl border-2 transition-all duration-200 focus:outline-none ${
            value[index] 
              ? 'border-blue-500 bg-blue-50 text-blue-700' 
              : 'border-slate-200 bg-white text-slate-800 focus:border-blue-500 focus:bg-blue-50/50'
          }`}
        />
      ))}
    </div>
  );
}