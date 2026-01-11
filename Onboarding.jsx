import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import PhoneInput from '@/components/onboarding/PhoneInput';
import OTPInput from '@/components/onboarding/OTPInput';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Shield, Check } from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState('phone'); // phone, otp, name
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const auth = await base44.auth.isAuthenticated();
    setIsAuthenticated(auth);
    if (auth) {
      window.location.href = createPageUrl('Home');
    }
  };

  const handlePhoneSubmit = () => {
    if (phone.length >= 10) {
      setStep('otp');
      // Simulate OTP send
    }
  };

  const handleOTPSubmit = () => {
    if (otp.length === 6) {
      setStep('name');
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    // In a real app, this would trigger the actual login
    // For now, redirect to login
    base44.auth.redirectToLogin(createPageUrl('Home'));
  };

  const slideVariants = {
    enter: { x: 100, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header illustration */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700" />
        <motion.div 
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-20 bg-white/10 rounded-full blur-3xl" />
            <MapPin className="w-20 h-20 text-white/90" strokeWidth={1.5} />
          </div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-blue-50 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <AnimatePresence mode="wait">
          {step === 'phone' && (
            <motion.div
              key="phone"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome to MobiGo</h1>
                <p className="text-slate-500">Your smart mobility companion</p>
              </div>

              <div className="space-y-4">
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  selectedCode={countryCode}
                  onCodeChange={setCountryCode}
                />

                <Button
                  onClick={handlePhoneSubmit}
                  disabled={phone.length < 10}
                  className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold shadow-lg shadow-blue-500/25"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mt-8">
                <Shield className="w-4 h-4" />
                <span>Your phone number is used only for commute updates</span>
              </div>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div
              key="otp"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Verify your number</h1>
                <p className="text-slate-500">Enter the 6-digit code sent to</p>
                <p className="text-blue-600 font-medium">{countryCode} {phone}</p>
              </div>

              <OTPInput
                value={otp}
                onChange={setOtp}
                length={6}
              />

              <Button
                onClick={handleOTPSubmit}
                disabled={otp.length < 6}
                className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold shadow-lg shadow-blue-500/25"
              >
                Verify
                <Check className="w-5 h-5 ml-2" />
              </Button>

              <button
                onClick={() => setStep('phone')}
                className="w-full text-center text-blue-600 font-medium"
              >
                Change number
              </button>
            </motion.div>
          )}

          {step === 'name' && (
            <motion.div
              key="name"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">What's your name?</h1>
                <p className="text-slate-500">Let us personalize your experience</p>
              </div>

              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="h-14 rounded-2xl border-slate-200 text-lg px-5"
              />

              <Button
                onClick={handleComplete}
                disabled={name.length < 2 || loading}
                className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold shadow-lg shadow-blue-500/25"
              >
                {loading ? 'Setting up...' : 'Get Started'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {['phone', 'otp', 'name'].map((s, i) => (
            <motion.div
              key={s}
              animate={{
                width: step === s ? 24 : 8,
                backgroundColor: step === s ? '#2563eb' : '#e2e8f0',
              }}
              className="h-2 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}