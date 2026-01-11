import { motion } from 'framer-motion';
import { Coins, Flame, Shield, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface MomentumBankProps {
  momentumPoints: number;
  currentStreak: number;
  freezePotential: number;
  freezesUsed: number;
}

export const MomentumBank = ({
  momentumPoints,
  currentStreak,
  freezePotential,
  freezesUsed,
}: MomentumBankProps) => {
  // Calculate progress to next freeze (50 points)
  const pointsToNextFreeze = momentumPoints % 50;
  const progressToNextFreeze = (pointsToNextFreeze / 50) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-gradient-to-br from-primary/90 via-primary to-primary/80 border-primary/20 shadow-2xl overflow-hidden">
        <CardContent className="p-5 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl" />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-accent to-accent/80 shadow-lg shadow-accent/30">
                <Coins className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary-foreground">Momentum Bank</h3>
                <p className="text-xs text-primary-foreground/70">Save points to freeze your streak</p>
              </div>
            </div>
            <motion.div
              key={momentumPoints}
              initial={{ scale: 1.3, rotate: 10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 border border-white/30"
            >
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-xl font-bold text-white">{momentumPoints}</span>
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="mb-5 relative z-10">
            <div className="flex justify-between text-xs text-primary-foreground/70 mb-2">
              <span>Progress to next freeze</span>
              <span>{pointsToNextFreeze}/50 pts</span>
            </div>
            <div className="relative">
              <Progress 
                value={progressToNextFreeze} 
                className="h-3 bg-white/20 [&>div]:bg-accent"
              />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary border-2 border-accent/50 flex items-center justify-center">
                <Shield className="w-3 h-3 text-accent" />
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 relative z-10">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <Flame className={cn(
                  "w-4 h-4",
                  currentStreak > 0 ? "text-accent" : "text-white/40"
                )} />
                <span className="text-xs text-white/60">Streak</span>
              </div>
              <p className={cn(
                "text-2xl font-bold",
                currentStreak > 0 ? "text-white" : "text-white/40"
              )}>
                {currentStreak}
              </p>
              <p className="text-[10px] text-white/40">days</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <Shield className={cn(
                  "w-4 h-4",
                  freezePotential > 0 ? "text-accent" : "text-white/40"
                )} />
                <span className="text-xs text-white/60">Freezes</span>
              </div>
              <p className={cn(
                "text-2xl font-bold",
                freezePotential > 0 ? "text-white" : "text-white/40"
              )}>
                {freezePotential}
              </p>
              <p className="text-[10px] text-white/40">available</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-xs text-white/60">Used</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {freezesUsed}
              </p>
              <p className="text-[10px] text-white/40">freezes</p>
            </motion.div>
          </div>

          {/* Tip */}
          <div className="mt-4 p-3 rounded-lg bg-white/10 border border-white/20 relative z-10">
            <p className="text-xs text-white/80">
              <span className="text-accent font-semibold">+10 pts</span> per habit completed • 
              <span className="text-accent font-semibold"> 50 pts</span> = 1 streak freeze
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
