import React from 'react';
import { motion } from 'framer-motion';
import { Train, Bus, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

export default function TransitCard({ route, index }) {
  const Icon = route.type === 'metro' ? Train : Bus;
  const hasDelay = route.delay_minutes > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          route.type === 'metro' ? 'bg-purple-100' : 'bg-blue-100'
        }`}>
          <Icon className={`w-6 h-6 ${
            route.type === 'metro' ? 'text-purple-600' : 'text-blue-600'
          }`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
              route.type === 'metro' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {route.line}
            </span>
            {hasDelay && (
              <span className="flex items-center gap-1 text-orange-600 text-xs">
                <AlertTriangle className="w-3 h-3" />
                +{route.delay_minutes} min
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-slate-800 truncate">
              {route.from_station}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-sm font-medium text-slate-800 truncate">
              {route.to_station}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{route.duration}</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Next: {route.next_arrival}
          </p>
        </div>
      </div>
      
      {route.platform && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Platform <span className="font-semibold text-slate-700">{route.platform}</span>
          </span>
        </div>
      )}
    </motion.div>
  );
}