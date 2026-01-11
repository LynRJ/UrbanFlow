import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import NotificationCard from '@/components/notifications/NotificationCard';
import BottomNav from '@/components/common/BottomNav';
import { ArrowLeft, Settings, Bell, BellOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Notifications() {
  const queryClient = useQueryClient();
  
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['all-notifications'],
    queryFn: () => base44.entities.Notification.list('-created_date', 50),
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.update(id, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    await Promise.all(unread.map(n => markReadMutation.mutateAsync(n.id)));
  };

  const handleNotificationTap = (notification) => {
    if (!notification.is_read) {
      markReadMutation.mutate(notification.id);
    }
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 pt-12 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to={createPageUrl('Home')}
              className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-slate-500">{unreadCount} unread</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllRead}
                className="text-blue-600"
              >
                <Check className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
            <Link 
              to={createPageUrl('NotificationSettings')}
              className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"
            >
              <Settings className="w-5 h-5 text-slate-600" />
            </Link>
          </div>
        </div>
      </div>

      <div className="px-5 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-3 bg-slate-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <BellOff className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">No notifications</h3>
            <p className="text-slate-500 text-sm text-center">
              You're all caught up! We'll notify you<br />when something important happens.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, i) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                index={i}
                onTap={handleNotificationTap}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav activePage="" />
    </div>
  );
}