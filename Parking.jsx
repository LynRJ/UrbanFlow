import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';
import ParkingCard from '@/components/parking/ParkingCard';
import { 
  MapPin, 
  Search, 
  Plus, 
  Clock, 
  X,
  Check,
  Car
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export default function Parking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showExtendSheet, setShowExtendSheet] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [extendHours, setExtendHours] = useState(1);
  const queryClient = useQueryClient();

  const { data: activeParkings = [], isLoading: activeLoading } = useQuery({
    queryKey: ['active-parkings'],
    queryFn: () => base44.entities.ParkingSession.filter({ status: 'active' }, '-created_date'),
  });

  const { data: pastParkings = [], isLoading: pastLoading } = useQuery({
    queryKey: ['past-parkings'],
    queryFn: () => base44.entities.ParkingSession.filter({ status: 'completed' }, '-created_date', 10),
  });

  const extendMutation = useMutation({
    mutationFn: async ({ session, hours }) => {
      const currentEnd = new Date(session.end_time);
      const newEnd = new Date(currentEnd.getTime() + hours * 60 * 60 * 1000);
      const additionalCost = hours * (session.hourly_rate || 2);
      
      await base44.entities.ParkingSession.update(session.id, {
        end_time: newEnd.toISOString(),
        total_cost: (session.total_cost || 0) + additionalCost,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-parkings'] });
      setShowExtendSheet(false);
      setSelectedSession(null);
    },
  });

  const handleExtend = (session) => {
    setSelectedSession(session);
    setExtendHours(1);
    setShowExtendSheet(true);
  };

  const confirmExtend = () => {
    if (selectedSession) {
      extendMutation.mutate({ session: selectedSession, hours: extendHours });
    }
  };

  // Nearby parking spots in Dubai
  const nearbySpots = [
    { id: 1, name: 'Dubai Mall Parking', distance: '0.3 km', available: 245, rate: 'AED 10/hr' },
    { id: 2, name: 'Mall of Emirates Garage', distance: '0.7 km', available: 156, rate: 'AED 8/hr' },
    { id: 3, name: 'Dubai Marina Mall', distance: '1.2 km', available: 89, rate: 'AED 12/hr' },
    { id: 4, name: 'City Walk Parking', distance: '1.5 km', available: 67, rate: 'AED 15/hr' },
    { id: 5, name: 'JBR Beach Parking', distance: '2.0 km', available: 34, rate: 'AED 20/hr' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 px-5 pt-12 pb-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-white mb-4">Parking</h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search parking spots..."
            className="pl-12 h-14 rounded-2xl border-0 bg-white shadow-lg"
          />
        </div>
      </div>

      <div className="px-5 py-6">
        {/* Active Parking Sessions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Active Sessions</h2>
          {activeLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                      <div className="h-3 bg-slate-200 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeParkings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl p-8 text-center border border-slate-100"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-slate-600 font-medium">No active parking</p>
              <p className="text-sm text-slate-400 mt-1">Start a new session below</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {activeParkings.map((session, i) => (
                <ParkingCard
                  key={session.id}
                  session={session}
                  index={i}
                  onExtend={handleExtend}
                />
              ))}
            </div>
          )}
        </div>

        {/* Nearby Parking */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Nearby Parking</h2>
          <div className="space-y-3">
            {nearbySpots.map((spot, i) => (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800">{spot.name}</h3>
                      <p className="text-sm text-slate-500">{spot.distance} away</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${spot.available > 100 ? 'text-green-600' : spot.available > 50 ? 'text-yellow-600' : 'text-orange-600'}`}>
                      {spot.available} spots
                    </p>
                    <p className="text-sm text-slate-500">{spot.rate}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Past Sessions */}
        {pastParkings.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent History</h2>
            <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
              {pastParkings.slice(0, 5).map((session, i) => (
                <div key={session.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{session.location_name}</p>
                      <p className="text-sm text-slate-500">{session.spot_id}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-slate-700">${session.total_cost?.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Extend Sheet */}
      <Sheet open={showExtendSheet} onOpenChange={setShowExtendSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl px-6 pb-8">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-center">Extend Parking</SheetTitle>
          </SheetHeader>
          {selectedSession && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500">Current spot</p>
                <p className="font-semibold text-slate-800">{selectedSession.spot_id}</p>
                <p className="text-sm text-slate-500">{selectedSession.location_name}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-3">Extend by</p>
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((hours) => (
                    <button
                      key={hours}
                      onClick={() => setExtendHours(hours)}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        extendHours === hours
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {hours}h
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Additional cost</span>
                  <span className="font-semibold text-slate-800">
                    ${(extendHours * (selectedSession.hourly_rate || 2)).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                onClick={confirmExtend}
                disabled={extendMutation.isPending}
                className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700"
              >
                {extendMutation.isPending ? 'Extending...' : `Extend by ${extendHours} hour${extendHours > 1 ? 's' : ''}`}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <BottomNav activePage="Parking" />
    </div>
  );
}