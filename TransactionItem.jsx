import React from 'react';
import { motion } from 'framer-motion';
import { Users, Train, Car, Gift, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';

const categoryIcons = {
  carpool: Users,
  transit: Train,
  parking: Car,
  redemption: Gift,
  bonus: Sparkles,
};

export default function TransactionItem({ transaction, index }) {
  const Icon = categoryIcons[transaction.category] || Sparkles;
  const isEarned = transaction.type === 'earned';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 py-3"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        isEarned ? 'bg-green-50' : 'bg-slate-50'
      }`}>
        <Icon className={`w-5 h-5 ${isEarned ? 'text-green-600' : 'text-slate-500'}`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">
          {transaction.description}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {format(new Date(transaction.created_date), 'MMM d, h:mm a')}
        </p>
      </div>
      
      <div className="flex items-center gap-1">
        {isEarned ? (
          <ArrowUpRight className="w-4 h-4 text-green-500" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-slate-400" />
        )}
        <span className={`font-semibold ${
          isEarned ? 'text-green-600' : 'text-slate-600'
        }`}>
          {isEarned ? '+' : '-'}{transaction.points}
        </span>
      </div>
    </motion.div>
  );
}