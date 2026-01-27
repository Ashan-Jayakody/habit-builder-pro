import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Habit, HabitStats } from '@/lib/habitTypes';
import { Flame, Target, Trophy, CheckCircle, Info, Leaf, Sprout, TreeDeciduous } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatsOverviewProps {
  habits: Habit[];
  getHabitStats: (habit: Habit) => HabitStats;
}

export const StatsOverview = ({ habits, getHabitStats }: StatsOverviewProps) => {
  const [showGrowthInfo, setShowGrowthInfo] = useState(false);
  
  if (habits.length === 0) return null;

  const allStats = habits.map(h => getHabitStats(h));
  
  const totalCurrentStreak = Math.max(...allStats.map(s => s.currentStreak), 0);
  const longestStreak = Math.max(...allStats.map(s => s.longestStreak), 0);
  const avgCompletionRate = Math.round(
    allStats.reduce((acc, s) => acc + s.completionRate, 0) / allStats.length
  );
  const totalCompletions = allStats.reduce((acc, s) => acc + s.totalCompletions, 0);

  // Growth level logic based on best current streak
  const getGrowthStage = (streak: number) => {
    if (streak < 6) return { name: 'Seed', icon: Leaf, color: 'text-amber-600', range: '< 6 days' };
    if (streak <= 10) return { name: 'Sprout', icon: Sprout, color: 'text-emerald-500', range: '6-10 days' };
    return { name: 'Tree', icon: TreeDeciduous, color: 'text-green-700', range: '> 10 days' };
  };

  const currentStage = getGrowthStage(totalCurrentStreak);

  const stats = [
    {
      label: 'Growth Stage',
      value: currentStage.name,
      icon: currentStage.icon,
      color: currentStage.color,
      bgColor: 'bg-green-500/10',
      isGrowth: true,
    },
    {
      label: 'Best Streak',
      value: `${totalCurrentStreak} days`,
      icon: Flame,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      label: 'Longest Streak',
      value: `${longestStreak} days`,
      icon: Trophy,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      label: 'Avg. Completion',
      value: `${avgCompletionRate}%`,
      icon: Target,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="shadow-card border-border/50 relative overflow-visible">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                  {stat.isGrowth && (
                    <Popover open={showGrowthInfo} onOpenChange={setShowGrowthInfo}>
                      <PopoverTrigger asChild>
                        <button className="text-muted-foreground hover:text-primary transition-colors">
                          <Info className="w-3 h-3" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-0 border-none shadow-2xl" align="start">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-card rounded-xl border p-4 space-y-4"
                        >
                          <h4 className="font-bold text-sm flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-primary" />
                            Growth Journey
                          </h4>
                          <div className="space-y-3">
                            {[
                              { name: 'Seed', icon: Leaf, range: '< 6 days', color: 'text-amber-600', current: totalCurrentStreak < 6 },
                              { name: 'Sprout', icon: Sprout, range: '6-10 days', color: 'text-emerald-500', current: totalCurrentStreak >= 6 && totalCurrentStreak <= 10 },
                              { name: 'Tree', icon: TreeDeciduous, range: '> 10 days', color: 'text-green-700', current: totalCurrentStreak > 10 }
                            ].map((stage) => (
                              <div 
                                key={stage.name}
                                className={cn(
                                  "flex items-center justify-between p-2 rounded-lg transition-all",
                                  stage.current ? "bg-primary/10 ring-1 ring-primary/20" : "opacity-60"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <stage.icon className={cn("w-5 h-5", stage.color)} />
                                  <span className="text-xs font-semibold">{stage.name}</span>
                                </div>
                                <span className="text-[10px] font-medium text-muted-foreground">{stage.range}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-[10px] text-muted-foreground text-center">
                            Keep your streak alive to watch your garden grow!
                          </p>
                        </motion.div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                <p className="text-lg font-bold truncate">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
