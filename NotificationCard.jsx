import React from 'react';
import { motion } from 'framer-motion';
import { Car, Users, Train, Gift, Tag, AlertCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

const typeConfig = {
  parking: {
    icon: Car,
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-500',
    borderColor: 'border-l-orange-500',
  },
  carpool: {
    icon: Users,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
    borderColor: 'border-l-blue-500',
  },
  transit: {
    icon: Train,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-500',
    borderColor: 'border-l-purple-500',
  },
  reward: {
    icon: Gift,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500',
    borderColor: 'border-l-green-500',
  },
  promo: {
    icon: Tag,
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-500',
    borderColor: 'border-l-pink-500',
  },
};

export default function NotificationCard({ notification, index, onTap }) {
  const config = typeConfig[notification.type] || typeConfig.reward;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onTap?.(notification)}
      className={`relative bg-white rounded-2xl p-4 border border-slate-100 shadow-sm border-l-4 ${config.borderColor} ${
        !notification.is_read ? 'bg-slate-50/50' : ''
      }`}
    >
      <div className="flex gap-3">
        <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-slate-800 text-sm">{notification.title}</h4>
            {!notification.is_read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
            )}
          </div>
          <p className="text-slate-500 text-sm mt-1 line-clamp-2">{notification.message}</p>
          <p className="text-slate-400 text-xs mt-2">
            {formatDistanceToNow(new Date(notification.created_date), { addSuffix: true })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}