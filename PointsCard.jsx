import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';

export default function PointsCard({ balance, totalEarned, nextRewardAt }) {
  const progress = nextRewardAt ? ((balance % nextRewardAt) / nextRewardAt) * 100 : 0;
  const pointsToNext = nextRewardAt ? nextRewardAt - (balance % nextRewardAt) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 p-6 text-white shadow-2xl shadow-amber-500/25"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="text-amber-100 text-sm font-medium">Reward Points</span>
        </div>
        
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-5xl font-bold tracking-tight">{balance?.toLocaleString() || 0}</span>
          <span className="text-amber-200 text-lg">pts</span>
        </div>
        
        <div className="flex items-center gap-2 text-amber-100 text-sm mb-4">
          <TrendingUp className="w-4 h-4" />
          <span>Total earned: {totalEarned?.toLocaleString() || 0} pts</span>
        </div>
        
        {nextRewardAt && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-amber-200">Next reward</span>
              <span className="text-white font-medium">{pointsToNext} pts away</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}