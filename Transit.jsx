import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import BottomNav from '@/components/common/BottomNav';
import LocationMap from '@/components/maps/LocationMap';
import { 
  Search, 
  MapPin, 
  Train, 
  Bus,
  Clock,
  Navigation,
  ArrowRight,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Dubai Metro stations
const DUBAI_METRO_STATIONS = {
  red_line: [
    'Rashidiya', 'Emirates', 'Airport Terminal 3', 'Airport Terminal 1',
    'GGICO', 'Deira City Centre', 'Al Rigga', 'Union', 'BurJuman',
    'Al Jafiliya', 'World Trade Centre', 'Emirates Towers', 'Financial Centre',
    'Burj Khalifa/Dubai Mall', 'Business Bay', 'Noor Bank', 'First Gulf Bank',
    'Mall of the Emirates', 'Sharaf DG', 'Dubai Internet City', 'Nakheel',
    'DAMAC Properties', 'Dubai Marina', 'Jumeirah Lakes Towers', 'Nakheel Harbour and Tower',
    'Ibn Battuta', 'Energy', 'Danube', 'UAE Exchange', 'Jebel Ali'
  ],
  green_line: [
    'Etisalat', 'Al Qusais', 'Dubai Airport Free Zone', 'Al Nahda',
    'Stadium', 'Al Qiyadah', 'Abu Hail', 'Abu Baker Al Siddique',
    'Salah Al Din', 'Union', 'BurJuman', 'Oud Metha', 'Dubai Healthcare City',
    'Al Jadaf', 'Creek', 'Al Ghubaiba', 'Al Fahidi', 'BurJuman', 'Oud Metha',
    'Dubai Healthcare City', 'Al Jadaf', 'Creek'
  ]
};

const POPULAR_LOCATIONS = [
  'Dubai Mall', 'Mall of the Emirates', 'Dubai Marina Mall', 'Ibn Battuta Mall',
  'Deira City Centre', 'Business Bay', 'JBR Beach', 'Burj Khalifa',
  'Dubai International Airport', 'Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah',
  'Jumeirah Beach', 'Dubai Creek', 'Gold Souk', 'Spice Souk'
];

export default function Transit() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (fromLocation && toLocation) {
      setShowResults(true);
    }
  };

  // Mock route results
  const routeResults = [
    {
      id: 1,
      type: 'metro',
      line: 'Red Line',
      from_station: fromLocation || 'Dubai Marina',
      to_station: toLocation || 'Burj Khalifa/Dubai Mall',
      duration: '18 min',
      next_arrival: '3 min',
      transfers: 0,
      platform: '2',
      price: 'AED 4',
    },
    {
      id: 2,
      type: 'bus',
      line: 'Bus 8',
      from_station: fromLocation || 'Dubai Marina',
      to_station: toLocation || 'Burj Khalifa/Dubai Mall',
      duration: '35 min',
      next_arrival: '7 min',
      transfers: 1,
      price: 'AED 3',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 px-5 pt-12 pb-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-white mb-4">Dubai Transit</h1>
        
        {/* Route Planner */}
        <div className="bg-white rounded-2xl p-5 shadow-lg space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-2 block font-medium">From</label>
            <Select value={fromLocation} onValueChange={setFromLocation}>
              <SelectTrigger className="rounded-xl border-slate-200">
                <SelectValue placeholder="Select starting point" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50">
                  Metro Stations
                </div>
                {DUBAI_METRO_STATIONS.red_line.slice(0, 10).map(station => (
                  <SelectItem key={station} value={station}>{station}</SelectItem>
                ))}
                <div className="px-2 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50">
                  Popular Locations
                </div>
                {POPULAR_LOCATIONS.slice(0, 8).map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-2 block font-medium">To</label>
            <Select value={toLocation} onValueChange={setToLocation}>
              <SelectTrigger className="rounded-xl border-slate-200">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50">
                  Metro Stations
                </div>
                {DUBAI_METRO_STATIONS.red_line.slice(10, 20).map(station => (
                  <SelectItem key={station} value={station}>{station}</SelectItem>
                ))}
                <div className="px-2 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50">
                  Popular Locations
                </div>
                {POPULAR_LOCATIONS.slice(8).map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 mb-2 block font-medium">Departure Time</label>
              <Input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="rounded-xl border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-2 block font-medium">Arrival Time</label>
              <Input
                type="time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="rounded-xl border-slate-200"
              />
            </div>
          </div>

          <Button 
            onClick={handleSearch}
            disabled={!fromLocation || !toLocation}
            className="w-full h-12 rounded-xl bg-amber-700 hover:bg-amber-800"
          >
            <Navigation className="w-5 h-5 mr-2" />
            Find Routes
          </Button>
        </div>
      </div>

      <div className="px-5 py-6">
        {/* Map */}
        {(fromLocation || toLocation) && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-600 mb-3">Route Map</h3>
            <LocationMap
              center={[25.2048, 55.2708]}
              zoom={11}
              markers={[
                fromLocation && { lat: 25.0772, lng: 55.1325, popup: fromLocation },
                toLocation && { lat: 25.1972, lng: 55.2744, popup: toLocation },
              ].filter(Boolean)}
              route={fromLocation && toLocation ? [
                [25.0772, 55.1325],
                [25.1972, 55.2744]
              ] : null}
              height="250px"
            />
          </div>
        )}

        {/* Route Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Available Routes</h3>
              <span className="text-sm text-slate-500">{routeResults.length} options</span>
            </div>

            <div className="space-y-4">
              {routeResults.map((route, i) => {
                const Icon = route.type === 'metro' ? Train : Bus;
                return (
                  <motion.div
                    key={route.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          route.type === 'metro' ? 'bg-red-100' : 'bg-amber-100'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            route.type === 'metro' ? 'text-red-600' : 'text-amber-700'
                          }`} />
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            route.type === 'metro' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {route.line}
                          </span>
                          {route.transfers > 0 && (
                            <p className="text-xs text-slate-500 mt-1">{route.transfers} transfer(s)</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-slate-800">{route.duration}</p>
                        <p className="text-xs text-slate-500">Next: {route.next_arrival}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm text-slate-700">{route.from_station}</span>
                      </div>
                      <div className="ml-1.5 border-l-2 border-dashed border-slate-200 h-6" />
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-amber-700" />
                        <span className="text-sm text-slate-700">{route.to_station}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-sm font-semibold text-amber-700">{route.price}</span>
                      {route.platform && (
                        <span className="text-xs text-slate-500">Platform {route.platform}</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Live Metro Status */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Metro Status</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="font-medium text-slate-800">Red Line</span>
                </div>
                <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                  On Time
                </span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-600" />
                  <span className="font-medium text-slate-800">Green Line</span>
                </div>
                <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                  On Time
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav activePage="Transit" />
    </div>
  );
}