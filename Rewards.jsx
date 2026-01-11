import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';
import PointsCard from '@/components/rewards/PointsCard';
import RewardCard from '@/components/rewards/RewardCard';
import TransactionItem from '@/components/rewards/TransactionItem';
import { 
  ArrowLeft, 
  Fuel, 
  Coffee, 
  ShoppingBag, 
  Ticket, 
  Plane,
  History,
  Gift,
  X,
  Check,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const categories = [
  { id: 'all', label: 'All', icon: Gift },
  { id: 'petrol', label: 'Petrol', icon: Fuel },
  { id: 'cafe', label: 'Cafes', icon: Coffee },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'entertainment', label: 'Fun', icon: Ticket },
  { id: 'travel', label: 'Travel', icon: Plane },
];

export default function Rewards() {
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedReward, setSelectedReward] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('rewards'); // rewards, history
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (e) {}
  };

  const { data: rewards = [], isLoading: rewardsLoading } = useQuery({
    queryKey: ['rewards', selectedCategory],
    queryFn: () => {
      if (selectedCategory === 'all') {
        return base44.entities.Reward.filter({ is_active: true });
      }
      return base44.entities.Reward.filter({ category: selectedCategory, is_active: true });
    },
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.PointsTransaction.list('-created_date', 50),
  });

  const redeemMutation = useMutation({
    mutationFn: async (reward) => {
      // Create redemption transaction
      await base44.entities.PointsTransaction.create({
        type: 'redeemed',
        points: reward.points_required,
        category: 'redemption',
        description: `${reward.title} at ${reward.partner_name}`,
        partner_name: reward.partner_name,
      });
      // Update user points
      const newBalance = (user?.points_balance || 0) - reward.points_required;
      await base44.auth.updateMe({ points_balance: newBalance });
      return newBalance;
    },
    onSuccess: (newBalance) => {
      setUser(prev => ({ ...prev, points_balance: newBalance }));
      setRedeemSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const handleRedeem = (reward) => {
    setSelectedReward(reward);
    setShowConfirmation(true);
  };

  const confirmRedeem = () => {
    if (selectedReward) {
      redeemMutation.mutate(selectedReward);
    }
  };

  const closeSheet = () => {
    setShowConfirmation(false);
    setRedeemSuccess(false);
    setSelectedReward(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 sticky top-0 z-40 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-800">Rewards</h1>
          <button
            onClick={() => setActiveTab(activeTab === 'rewards' ? 'history' : 'rewards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'history' 
                ? 'bg-amber-100 text-amber-700' 
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <History className="w-4 h-4" />
            History
          </button>
        </div>
      </div>

      <div className="px-5 py-6">
        {/* Points Card */}
        <PointsCard
          balance={user?.points_balance || 0}
          totalEarned={user?.total_points_earned || 0}
          nextRewardAt={500}
        />

        <AnimatePresence mode="wait">
          {activeTab === 'rewards' ? (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto py-6 -mx-5 px-5 scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-amber-700 text-white shadow-lg shadow-amber-500/25'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Rewards Grid */}
              {rewardsLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-slate-200 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 rounded w-1/2" />
                          <div className="h-3 bg-slate-200 rounded w-3/4" />
                          <div className="h-8 bg-slate-200 rounded w-20 mt-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : rewards.length === 0 ? (
                <div className="text-center py-12">
                  <Gift className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No rewards in this category</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rewards.map((reward, i) => (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      userPoints={user?.points_balance || 0}
                      onRedeem={handleRedeem}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-6"
            >
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Transaction History</h2>
              {transactionsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 animate-pulse">
                      <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-1/2" />
                        <div className="h-3 bg-slate-200 rounded w-1/4" />
                      </div>
                      <div className="h-4 bg-slate-200 rounded w-16" />
                    </div>
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No transactions yet</p>
                  <p className="text-sm text-slate-400 mt-1">Start earning by using the app!</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 px-4">
                  {transactions.map((transaction, i) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Redemption Sheet */}
      <Sheet open={showConfirmation} onOpenChange={closeSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl px-6 pb-8">
          {!redeemSuccess ? (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-center">Confirm Redemption</SheetTitle>
              </SheetHeader>
              {selectedReward && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {selectedReward.partner_name}
                    </h3>
                    <p className="text-slate-500">{selectedReward.title}</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      {selectedReward.discount_value}
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Points required</span>
                      <span className="font-semibold text-slate-800">
                        {selectedReward.points_required} pts
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-slate-500">Your balance after</span>
                      <span className="font-semibold text-green-600">
                        {(user?.points_balance || 0) - selectedReward.points_required} pts
                      </span>
                    </div>
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
                      onClick={confirmRedeem}
                      disabled={redeemMutation.isPending}
                      className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700"
                    >
                      {redeemMutation.isPending ? 'Processing...' : 'Confirm'}
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
              <h3 className="text-xl font-bold text-slate-800 mb-2">Redemption Successful!</h3>
              <p className="text-slate-500 mb-6">
                Your voucher has been added to your account
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

      <BottomNav activePage="Rewards" />
    </div>
  );
}