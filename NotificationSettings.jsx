import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Car, 
  Users, 
  Train, 
  Gift, 
  Moon,
  Clock,
  Save,
  Check
} from 'lucide-react';

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    parking_alerts: true,
    carpool_alerts: true,
    transit_alerts: true,
    rewards_offers: true,
    dnd_start: '22:00',
    dnd_end: '07:00',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const user = await base44.auth.me();
      if (user?.notification_settings) {
        setSettings({ ...settings, ...user.notification_settings });
      }
    } catch (e) {}
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ notification_settings: settings });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const settingsList = [
    { key: 'parking_alerts', icon: Car, label: 'Parking Alerts', description: 'Get notified before your parking expires' },
    { key: 'carpool_alerts', icon: Users, label: 'Carpool Alerts', description: 'Ride confirmations and new matches' },
    { key: 'transit_alerts', icon: Train, label: 'Transit Alerts', description: 'Delays and platform changes' },
    { key: 'rewards_offers', icon: Gift, label: 'Rewards & Offers', description: 'Points earned and promotions' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 pt-12 pb-4 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link 
            to={createPageUrl('Notifications')}
            className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-xl font-bold text-slate-800">Notification Settings</h1>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Alert Settings */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Alert Types</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {settingsList.map((item, i) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{item.label}</p>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </div>
                </div>
                <Switch
                  checked={settings[item.key]}
                  onCheckedChange={() => toggleSetting(item.key)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Do Not Disturb */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <Moon className="w-5 h-5 text-slate-600" />
            <h2 className="font-semibold text-slate-800">Do Not Disturb</h2>
          </div>
          <div className="p-5">
            <p className="text-sm text-slate-500 mb-4">
              Silence notifications during these hours
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-slate-400 mb-1 block">From</label>
                <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-3">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <input
                    type="time"
                    value={settings.dnd_start}
                    onChange={(e) => setSettings(prev => ({ ...prev, dnd_start: e.target.value }))}
                    className="bg-transparent border-none text-slate-800 font-medium focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-400 mb-1 block">To</label>
                <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-3">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <input
                    type="time"
                    value={settings.dnd_end}
                    onChange={(e) => setSettings(prev => ({ ...prev, dnd_end: e.target.value }))}
                    className="bg-transparent border-none text-slate-800 font-medium focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saving}
          className={`w-full h-14 rounded-2xl text-white text-lg font-semibold shadow-lg transition-all ${
            saved 
              ? 'bg-green-600 hover:bg-green-700 shadow-green-500/25' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
          }`}
        >
          {saved ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Saved!
            </>
          ) : saving ? (
            'Saving...'
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      <BottomNav activePage="" />
    </div>
  );
}