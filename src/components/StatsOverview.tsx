import { Card, CardContent } from '@/components/ui/card';
import { Habit, HabitStats } from '@/lib/habitTypes';
import { Flame, Target, Trophy, CheckCircle } from 'lucide-react';

interface StatsOverviewProps {
  habits: Habit[];
  getHabitStats: (habit: Habit) => HabitStats;
}

export const StatsOverview = ({ habits, getHabitStats }: StatsOverviewProps) => {
  if (habits.length === 0) return null;

  const allStats = habits.map(h => getHabitStats(h));
  
  const totalCurrentStreak = Math.max(...allStats.map(s => s.currentStreak), 0);
  const longestStreak = Math.max(...allStats.map(s => s.longestStreak), 0);
  const avgCompletionRate = Math.round(
    allStats.reduce((acc, s) => acc + s.completionRate, 0) / allStats.length
  );
  const totalCompletions = allStats.reduce((acc, s) => acc + s.totalCompletions, 0);

  const stats = [
    {
      label: 'Best Current Streak',
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
    {
      label: 'Total Check-ins',
      value: totalCompletions.toString(),
      icon: CheckCircle,
      color: 'text-chart-5',
      bgColor: 'bg-chart-5/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="shadow-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
