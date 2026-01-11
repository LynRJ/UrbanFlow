import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';
import NotificationBadge from '@/components/common/NotificationBadge';
import ParkingCard from '@/components/parking/ParkingCard';
import { 
  Bell, 
  Car, 
  Users, 
  Train, 
  Calendar, 
  MapPin,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (e) {
      // User not logged in
    }
  };

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => base44.entities.Notification.filter({ is_read: false }, '-created_date', 5),
  });

  const { data: activeParkings = [] } = useQuery({
    queryKey: ['active-parkings'],
    queryFn: () => base44.entities.ParkingSession.filter({ status: 'active' }, '-created_date', 3),
  });

  const quickActions = [
    { icon: Car, label: 'Find Parking', page: 'Parking', color: 'bg-amber-700' },
    { icon: Users, label: 'Carpool', page: 'Carpool', color: 'bg-amber-600' },
    { icon: Train, label: 'Transit', page: 'Transit', color: 'bg-amber-800' },
    { icon: Calendar, label: 'Events', page: 'Events', color: 'bg-amber-500' },
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 px-5 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-blue-200 text-sm">{greeting()}</p>
            <h1 className="text-2xl font-bold text-white">
              {user?.full_name || 'Welcome'}
            </h1>
          </div>
          <Link 
            to={createPageUrl('Notifications')}
            className="relative w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
          >
            <Bell className="w-6 h-6 text-white" />
            <NotificationBadge count={notifications.length} />
          </Link>
        </div>

        {/* Points banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-800" />
            </div>
            <div>
              <p className="text-amber-100 text-sm">Your Points</p>
              <p className="text-white text-xl font-bold">
                {user?.points_balance?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
          <Link 
            to={createPageUrl('Events')}
            className="flex items-center gap-1 text-white text-sm font-medium"
          >
            Events <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      <div className="px-5 -mt-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {quickActions.map((action, i) => (
            <Link key={action.page} to={createPageUrl(action.page)}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center gap-2"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-slate-600 text-center">
                  {action.label}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Active Parking Sessions */}
        {activeParkings.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Active Parking</h2>
              <Link 
                to={createPageUrl('Parking')}
                className="text-sm text-blue-600 font-medium flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {activeParkings.slice(0, 2).map((session, i) => (
                <ParkingCard 
                  key={session.id} 
                  session={session} 
                  index={i}
                  onExtend={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {/* Commute Suggestions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Your Commute</h2>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-amber-700" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">Dubai Marina → Downtown</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-500">20 min via Red Line</span>
                </div>
              </div>
              <Link 
                to={createPageUrl('Transit')}
                className="px-4 py-2 bg-amber-700 text-white rounded-xl text-sm font-medium"
              >
                Start
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Promo Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl p-5 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Earn 2x Points!</h3>
              <p className="text-white/80 text-sm">Use public transit this week</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Train className="w-8 h-8" />
            </div>
          </div>
        </motion.div>
      </div>

      <BottomNav activePage="Home" />
    </div>
  );
}