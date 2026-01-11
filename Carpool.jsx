import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import BottomNav from '@/components/common/BottomNav';
import RideCard from '@/components/carpool/RideCard';
import DubaiCommunitySelect, { DUBAI_COMMUNITIES } from '@/components/common/DubaiCommunitySelect';
import { 
  Search, 
  MapPin, 
  Calendar,
  Users,
  Plus,
  Filter,
  ArrowRight,
  Check,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

export default function Carpool() {
  const [activeTab, setActiveTab] = useState('find'); // find, offer, myrides
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [filterCommunity, setFilterCommunity] = useState('');
  const [fromCommunity, setFromCommunity] = useState('');
  const [toCommunity, setToCommunity] = useState('');
  const queryClient = useQueryClient();

  const { data: allRides = [], isLoading } = useQuery({
    queryKey: ['available-rides'],
    queryFn: () => base44.entities.CarpoolRide.filter({ status: 'available' }, 'departure_time'),
  });

  // Filter rides by community
  const availableRides = filterCommunity 
    ? allRides.filter(ride => 
        ride.from_location?.toLowerCase().includes(filterCommunity.toLowerCase()) ||
        ride.to_location?.toLowerCase().includes(filterCommunity.toLowerCase())
      )
    : allRides;

  const { data: myRides = [] } = useQuery({
    queryKey: ['my-rides'],
    queryFn: async () => {
      const rides = await base44.entities.CarpoolRide.list('-created_date', 20);
      return rides;
    },
  });

  const bookMutation = useMutation({
    mutationFn: async (ride) => {
      await base44.entities.CarpoolRide.update(ride.id, {
        available_seats: ride.available_seats - 1,
        status: ride.available_seats <= 1 ? 'booked' : 'available',
      });
    },
    onSuccess: () => {
      setBookingSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['available-rides'] });
    },
  });

  const handleBook = (ride) => {
    setSelectedRide(ride);
    setShowBookingSheet(true);
    setBookingSuccess(false);
  };

  const confirmBooking = () => {
    if (selectedRide) {
      bookMutation.mutate(selectedRide);
    }
  };

  const closeSheet = () => {
    setShowBookingSheet(false);
    setSelectedRide(null);
    setBookingSuccess(false);
  };

  const getCommunityLabel = (value) => {
    return DUBAI_COMMUNITIES.find(c => c.value === value)?.label || value;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 px-5 pt-12 pb-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-white mb-4">Community Carpool</h1>
        
        {/* Community-based Search */}
        <div className="bg-white rounded-2xl p-4 shadow-lg space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="flex-1">
              <DubaiCommunitySelect
                value={fromCommunity}
                onChange={setFromCommunity}
                placeholder="From community"
              />
            </div>
          </div>
          <div className="border-t border-slate-100" />
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-600" />
            <div className="flex-1">
              <DubaiCommunitySelect
                value={toCommunity}
                onChange={setToCommunity}
                placeholder="To community"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full bg-slate-100 p-1 rounded-xl">
            <TabsTrigger 
              value="find" 
              className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Find a Ride
            </TabsTrigger>
            <TabsTrigger 
              value="offer"
              className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Offer a Ride
            </TabsTrigger>
            <TabsTrigger 
              value="myrides"
              className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              My Rides
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <AnimatePresence mode="wait">
          {activeTab === 'find' && (
            <motion.div
              key="find"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Available Rides</h2>
                <div className="w-48">
                  <DubaiCommunitySelect
                    value={filterCommunity}
                    onChange={setFilterCommunity}
                    placeholder="Filter by area"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
                      <div className="space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                        <div className="h-4 bg-slate-200 rounded w-1/2" />
                        <div className="h-10 bg-slate-200 rounded mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : availableRides.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">No rides available</p>
                  <p className="text-sm text-slate-400 mt-1">
                    {filterCommunity ? 'Try a different community' : 'Check back later or offer your own ride'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableRides.map((ride, i) => (
                    <RideCard
                      key={ride.id}
                      ride={ride}
                      onBook={handleBook}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'offer' && (
            <motion.div
              key="offer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-2xl p-5 border border-slate-100 space-y-4">
                <div>
                  <label className="text-sm text-slate-500 mb-2 block font-medium">From Community</label>
                  <DubaiCommunitySelect
                    value={fromCommunity}
                    onChange={setFromCommunity}
                    placeholder="Select pickup community"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-500 mb-2 block font-medium">To Community</label>
                  <DubaiCommunitySelect
                    value={toCommunity}
                    onChange={setToCommunity}
                    placeholder="Select destination community"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-500 mb-2 block font-medium">Date</label>
                    <Input type="date" className="rounded-xl" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-500 mb-2 block font-medium">Time</label>
                    <Input type="time" className="rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-500 mb-2 block font-medium">Seats</label>
                    <Input type="number" min="1" max="4" defaultValue="2" className="rounded-xl" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-500 mb-2 block font-medium">Price/seat (AED)</label>
                    <Input type="number" min="5" placeholder="AED" className="rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-500 mb-2 block font-medium">Vehicle Info</label>
                  <Input placeholder="e.g., Toyota Camry 2020" className="rounded-xl" />
                </div>
                <Button className="w-full h-14 rounded-2xl bg-amber-700 hover:bg-amber-800">
                  <Plus className="w-5 h-5 mr-2" />
                  Offer Ride
                </Button>
              </div>

              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                <p className="text-sm text-amber-800">
                  <strong>Community Guidelines:</strong> Share rides with neighbors for eco-friendly commuting. 
                  Earn points for every successful carpool!
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'myrides' && (
            <motion.div
              key="myrides"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {myRides.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">No rides yet</p>
                  <p className="text-sm text-slate-400 mt-1">Book or offer a ride to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRides.map((ride, i) => (
                    <motion.div
                      key={ride.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl p-4 border border-slate-100"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          ride.status === 'completed' ? 'bg-green-100 text-green-700' :
                          ride.status === 'booked' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {ride.status}
                        </span>
                        <span className="text-sm text-slate-500">
                          {format(new Date(ride.departure_time), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800 font-medium">{ride.from_location}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-800 font-medium">{ride.to_location}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Booking Sheet */}
      <Sheet open={showBookingSheet} onOpenChange={closeSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl px-6 pb-8">
          {!bookingSuccess ? (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-center">Confirm Booking</SheetTitle>
              </SheetHeader>
              {selectedRide && (
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="font-medium text-slate-800">{selectedRide.from_location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-amber-600" />
                      <span className="font-medium text-slate-800">{selectedRide.to_location}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {selectedRide.driver_name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{selectedRide.driver_name}</p>
                        <p className="text-sm text-slate-500">{selectedRide.vehicle_info}</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">AED {selectedRide.price_per_seat}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={closeSheet}
                      className="flex-1 h-14 rounded-2xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmBooking}
                      disabled={bookMutation.isPending}
                      className="flex-1 h-14 rounded-2xl bg-amber-700 hover:bg-amber-800"
                    >
                      {bookMutation.isPending ? 'Booking...' : 'Confirm'}
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Ride Booked!</h3>
              <p className="text-slate-500 mb-6">
                You'll receive a notification before departure
              </p>
              <Button
                onClick={closeSheet}
                className="w-full h-14 rounded-2xl bg-amber-700 hover:bg-amber-800"
              >
                Done
              </Button>
            </motion.div>
          )}
        </SheetContent>
      </Sheet>

      <BottomNav activePage="Carpool" />
    </div>
  );
}