import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Flame, Shield, Zap, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Habit } from '@/lib/habitTypes';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface MomentumBankProps {
  momentumPoints: number;
  currentStreak: number;
  freezePotential: number;
  freezesUsed: number;
  habits: Habit[];
  onUseFreeze: (habitId: string) => void;
}

export const MomentumBank = ({
  momentumPoints,
  currentStreak,
  freezePotential,
  freezesUsed,
  habits,
  onUseFreeze,
}: MomentumBankProps) => {
  const [showFreezeSelector, setShowFreezeSelector] = useState(false);
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate progress to next freeze (50 points)
  const pointsToNextFreeze = momentumPoints % 50;
  const progressToNextFreeze = (pointsToNextFreeze / 50) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50 shadow-2xl overflow-hidden">
        <CardContent className="p-5 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-xl" />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Momentum Bank</h3>
                <p className="text-xs text-slate-400">Save points to freeze your streak</p>
              </div>
            </div>
            <motion.div
              key={momentumPoints}
              initial={{ scale: 1.3, rotate: 10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xl font-bold text-amber-400">{momentumPoints}</span>
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="mb-5 relative z-10">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Progress to next freeze</span>
              <span>{pointsToNextFreeze}/50 pts</span>
            </div>
            <div className="relative">
              <Progress 
                value={progressToNextFreeze} 
                className="h-3 bg-slate-700/50 [&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-amber-400"
              />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-700 border-2 border-amber-500/50 flex items-center justify-center">
                <Shield className="w-3 h-3 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 relative z-10">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <Flame className={cn(
                  "w-4 h-4",
                  currentStreak > 0 ? "text-orange-400" : "text-slate-500"
                )} />
                <span className="text-xs text-slate-400">Streak</span>
              </div>
              <p className={cn(
                "text-2xl font-bold",
                currentStreak > 0 ? "text-orange-400" : "text-slate-500"
              )}>
                {currentStreak}
              </p>
              <p className="text-[10px] text-slate-500">days</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => freezePotential > 0 && setShowFreezeSelector(!showFreezeSelector)}
              className={cn(
                "p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm transition-all",
                freezePotential > 0 ? "cursor-pointer hover:bg-slate-700/60 ring-1 ring-emerald-500/20" : ""
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Shield className={cn(
                  "w-4 h-4",
                  freezePotential > 0 ? "text-emerald-400" : "text-slate-500"
                )} />
                <span className="text-xs text-slate-400">Freezes</span>
              </div>
              <p className={cn(
                "text-2xl font-bold",
                freezePotential > 0 ? "text-emerald-400" : "text-slate-500"
              )}>
                {freezePotential}
              </p>
              <p className="text-[10px] text-slate-500">available</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-slate-400">Used</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">
                {freezesUsed}
              </p>
              <p className="text-[10px] text-slate-500">freezes</p>
            </motion.div>
          </div>

          {/* Freeze Selector */}
          <AnimatePresence>
            {showFreezeSelector && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 relative z-10 overflow-hidden"
              >
                <div className="p-4 rounded-xl bg-slate-800/80 border border-emerald-500/30 backdrop-blur-md">
                  <h4 className="text-sm font-bold text-white mb-3">Choose habit to freeze for today</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {habits.map((habit) => {
                      const isFrozen = habit.frozenDates?.includes(todayStr);
                      return (
                        <button
                          key={habit.id}
                          disabled={isFrozen}
                          onClick={() => {
                            onUseFreeze(habit.id);
                            setShowFreezeSelector(false);
                          }}
                          className={cn(
                            "flex items-center justify-between p-2 rounded-lg transition-all",
                            isFrozen 
                              ? "bg-slate-700/50 opacity-50 cursor-not-allowed" 
                              : "bg-slate-700/80 hover:bg-slate-600 border border-slate-600/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{habit.emoji}</span>
                            <span className="text-sm font-medium text-white">{habit.name}</span>
                          </div>
                          {isFrozen ? (
                            <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold uppercase">
                              <Check className="w-3 h-3" />
                              Frozen
                            </div>
                          ) : (
                            <Shield className="w-4 h-4 text-emerald-500/50" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tip */}
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 relative z-10">
            <p className="text-xs text-slate-300">
              <span className="text-primary font-semibold">+10 pts</span> per habit completed • 
              <span className="text-amber-400 font-semibold"> 50 pts</span> = 1 streak freeze
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
