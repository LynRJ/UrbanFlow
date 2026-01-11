import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import BottomNav from '@/components/common/BottomNav';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Users,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';

const crowdColors = {
  low: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' },
  high: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  very_high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
};

export default function Events() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('date', 50),
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const selectedDateEvents = events.filter(event => 
    isSameDay(parseISO(event.date), selectedDate)
  );

  const handlePrevWeek = () => setWeekStart(addDays(weekStart, -7));
  const handleNextWeek = () => setWeekStart(addDays(weekStart, 7));

  const getEventsForDay = (day) => {
    return events.filter(event => isSameDay(parseISO(event.date), day));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 px-5 pt-12 pb-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-white mb-2">Dubai Events</h1>
        <p className="text-amber-100 text-sm">Plan ahead and avoid crowded areas</p>
      </div>

      <div className="px-5 py-6">
        {/* Week Calendar */}
        <div className="bg-white rounded-2xl border border-amber-100 p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">
              {format(weekStart, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrevWeek}
                className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center hover:bg-amber-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-amber-700" />
              </button>
              <button
                onClick={handleNextWeek}
                className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center hover:bg-amber-100 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-amber-700" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, i) => {
              const dayEvents = getEventsForDay(day);
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              const highestCrowd = dayEvents.length > 0 
                ? dayEvents.reduce((max, e) => {
                    const levels = ['low', 'medium', 'high', 'very_high'];
                    return levels.indexOf(e.expected_crowd) > levels.indexOf(max) ? e.expected_crowd : max;
                  }, 'low')
                : null;

              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                    isSelected 
                      ? 'bg-amber-700 text-white shadow-lg' 
                      : isToday
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs font-medium">{format(day, 'EEE')}</span>
                  <span className="text-lg font-bold">{format(day, 'd')}</span>
                  {highestCrowd && (
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      isSelected ? 'bg-white' : crowdColors[highestCrowd].dot
                    }`} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Events for Selected Date */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Events on {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                      <div className="h-3 bg-slate-200 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedDateEvents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl p-8 text-center border border-slate-100"
            >
              <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">No events scheduled</p>
              <p className="text-sm text-slate-400 mt-1">This day is clear for smooth commuting</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {selectedDateEvents.map((event, i) => {
                  const crowdStyle = crowdColors[event.expected_crowd];
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`bg-white rounded-2xl p-5 border ${crowdStyle.border} shadow-sm`}
                    >
                      <div className="flex gap-4">
                        <div className={`w-16 h-16 ${crowdStyle.bg} rounded-xl flex flex-col items-center justify-center flex-shrink-0`}>
                          <span className={`text-2xl font-bold ${crowdStyle.text}`}>
                            {format(parseISO(event.date), 'd')}
                          </span>
                          <span className={`text-xs ${crowdStyle.text}`}>
                            {format(parseISO(event.date), 'MMM')}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-slate-800">{event.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${crowdStyle.bg} ${crowdStyle.text}`}>
                              {event.expected_crowd.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Clock className="w-4 h-4" />
                              <span>{event.start_time} - {event.end_time}</span>
                            </div>
                          </div>

                          {event.affected_areas && event.affected_areas.length > 0 && (
                            <div className="mt-3 p-3 bg-amber-50 rounded-xl">
                              <div className="flex items-center gap-2 text-xs text-amber-800 mb-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span className="font-medium">Affected Areas</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {event.affected_areas.map((area, idx) => (
                                  <span key={idx} className="text-xs px-2 py-0.5 bg-white rounded-md text-amber-700">
                                    {area}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {event.description && (
                            <p className="text-sm text-slate-500 mt-3 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Crowded Areas Alert */}
        {selectedDateEvents.some(e => ['high', 'very_high'].includes(e.expected_crowd)) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-5 border border-orange-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">High Traffic Expected</h4>
                <p className="text-sm text-slate-600">
                  Plan your commute early or consider alternative routes. Public transport may experience delays.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <BottomNav activePage="Events" />
    </div>
  );
}