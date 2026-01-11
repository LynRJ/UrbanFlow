import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, AlertCircle } from 'lucide-react';
import { format, differenceInMinutes, isPast } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function ParkingCard({ session, onExtend, index }) {
  const endTime = new Date(session.end_time);
  const now = new Date();
  const minutesLeft = differenceInMinutes(endTime, now);
  const isExpiringSoon = minutesLeft <= 15 && minutesLeft > 0;
  const isExpired = isPast(endTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-2xl p-5 border shadow-sm ${
        isExpired 
          ? 'border-red-200 bg-red-50/30' 
          : isExpiringSoon 
            ? 'border-orange-200 bg-orange-50/30' 
            : 'border-slate-100'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isExpired ? 'bg-red-100' : isExpiringSoon ? 'bg-orange-100' : 'bg-blue-100'
          }`}>
            <MapPin className={`w-6 h-6 ${
              isExpired ? 'text-red-600' : isExpiringSoon ? 'text-orange-600' : 'text-blue-600'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{session.spot_id}</h3>
            <p className="text-sm text-slate-500">{session.location_name}</p>
          </div>
        </div>
        
        {(isExpiringSoon || isExpired) && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <AlertCircle className={`w-5 h-5 ${isExpired ? 'text-red-500' : 'text-orange-500'}`} />
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-600">
          {format(new Date(session.start_time), 'h:mm a')} - {format(endTime, 'h:mm a')}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          {isExpired ? (
            <span className="text-red-600 font-semibold text-sm">Expired</span>
          ) : isExpiringSoon ? (
            <span className="text-orange-600 font-semibold text-sm">
              Expires in {minutesLeft} min
            </span>
          ) : (
            <span className="text-green-600 font-semibold text-sm">
              {minutesLeft} min remaining
            </span>
          )}
        </div>
        
        <Button
          onClick={() => onExtend(session)}
          size="sm"
          className={`rounded-xl px-4 ${
            isExpired 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-amber-700 hover:bg-amber-800'
          }`}
        >
          {isExpired ? 'Pay Fine' : 'Extend'}
        </Button>
      </div>
    </motion.div>
  );
}