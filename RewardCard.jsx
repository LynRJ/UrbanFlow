import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Fuel, Coffee, ShoppingBag, Ticket, Plane } from 'lucide-react';

const categoryIcons = {
  petrol: Fuel,
  cafe: Coffee,
  shopping: ShoppingBag,
  entertainment: Ticket,
  travel: Plane,
};

const categoryColors = {
  petrol: 'bg-orange-50 text-orange-600 border-orange-100',
  cafe: 'bg-amber-50 text-amber-600 border-amber-100',
  shopping: 'bg-pink-50 text-pink-600 border-pink-100',
  entertainment: 'bg-purple-50 text-purple-600 border-purple-100',
  travel: 'bg-sky-50 text-sky-600 border-sky-100',
};

export default function RewardCard({ reward, userPoints, onRedeem, index }) {
  const Icon = categoryIcons[reward.category] || ShoppingBag;
  const colorClass = categoryColors[reward.category] || categoryColors.shopping;
  const canRedeem = userPoints >= reward.points_required;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
    >
      <div className="flex gap-4">
        <div className={`w-14 h-14 rounded-xl ${colorClass} border flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-800 truncate">{reward.partner_name}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{reward.title}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-lg font-bold text-amber-700">{reward.discount_value}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <span className={`text-sm font-medium ${canRedeem ? 'text-green-600' : 'text-slate-400'}`}>
              {reward.points_required} pts
            </span>
            <Button
              size="sm"
              onClick={() => onRedeem(reward)}
              disabled={!canRedeem}
              className={`rounded-xl px-4 ${
                canRedeem 
                  ? 'bg-amber-700 hover:bg-amber-800 text-white' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Redeem
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}