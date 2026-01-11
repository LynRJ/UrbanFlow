import React from 'react';
import { motion } from 'framer-motion';

export default function NotificationBadge({ count }) {
  if (!count || count <= 0) return null;
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center"
    >
      <span className="text-white text-[10px] font-bold px-1">
        {count > 99 ? '99+' : count}
      </span>
    </motion.div>
  );
}