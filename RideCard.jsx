import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function RideCard({ ride, onBook, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
    >
      {/* Route */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <div className="w-0.5 h-10 bg-slate-200" />
          <div className="w-3 h-3 rounded-full bg-blue-500" />
        </div>
        <div className="flex-1">
          <div className="mb-3">
            <p className="text-sm text-slate-400">From</p>
            <p className="font-medium text-slate-800">{ride.from_location}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">To</p>
            <p className="font-medium text-slate-800">{ride.to_location}</p>
          </div>
        </div>
      </div>

      {/* Driver info */}
      <div className="flex items-center gap-3 py-3 border-t border-slate-100">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {ride.driver_name?.[0]?.toUpperCase() || 'D'}
          </span>
        </div>
        <div className="flex-1">
          <p className="font-medium text-slate-800">{ride.driver_name}</p>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-slate-500">{ride.rating || '4.8'}</span>
            <span className="text-slate-300 mx-1">•</span>
            <span className="text-sm text-slate-500">{ride.vehicle_info}</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600">
              {format(new Date(ride.departure_time), 'h:mm a')}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600">
              {ride.available_seats} seats
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg text-slate-800">
            ${ride.price_per_seat}
          </span>
          <Button
            onClick={() => onBook(ride)}
            size="sm"
            className="rounded-xl bg-blue-600 hover:bg-blue-700"
          >
            Book
          </Button>
        </div>
      </div>
    </motion.div>
  );
}