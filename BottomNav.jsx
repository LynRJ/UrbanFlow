import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Users, Car, Train, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Home', page: 'Home' },
  { icon: Users, label: 'Carpool', page: 'Carpool' },
  { icon: Car, label: 'Parking', page: 'Parking' },
  { icon: Train, label: 'Transit', page: 'Transit' },
  { icon: Calendar, label: 'Events', page: 'Events' },
];

export default function BottomNav({ activePage }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 pb-6 pt-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activePage === item.page;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className="relative flex flex-col items-center py-2 px-4 min-w-[64px]"
            >
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -top-2 w-12 h-1 bg-amber-700 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-xl transition-colors ${
                  isActive ? 'bg-amber-50' : ''
                }`}
              >
                <Icon 
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-amber-700' : 'text-slate-400'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>
              <span className={`text-xs font-medium mt-0.5 transition-colors ${
                isActive ? 'text-amber-700' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}