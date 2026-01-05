import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Habit, HabitStats } from '@/lib/habitTypes';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isAfter, isBefore, isEqual } from 'date-fns';
import { ChevronLeft, ChevronRight, Trophy, Target, Flame, TrendingUp, Award, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthlyReportProps {
  habits: Habit[];
  getHabitStats: (habit: Habit) => HabitStats;
  getMonthlyData: (habit: Habit, date: Date) => Array<{
    date: Date;
    dayNumber: string;
    isCompleted: boolean;
  }>;
}

export const MonthlyReport = ({ habits, getHabitStats, getMonthlyData }: MonthlyReportProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthlyStats = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start, end }).length;
    const today = new Date();
    const daysPassedInMonth = today < end ? 
      eachDayOfInterval({ start, end: today > start ? today : start }).length : 
      daysInMonth;

    const habitReports = habits.map(habit => {
      const monthlyData = getMonthlyData(habit, currentMonth);
      const completedDays = monthlyData.filter(d => d.isCompleted).length;
      const completionRate = daysPassedInMonth > 0 ? Math.round((completedDays / daysPassedInMonth) * 100) : 0;
      
      // Calculate best streak in this month
      let bestStreak = 0;
      let currentStreak = 0;
      monthlyData.forEach(day => {
        if (day.isCompleted) {
          currentStreak++;
          bestStreak = Math.max(bestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      });

      return {
        habit,
        completedDays,
        totalDays: daysPassedInMonth,
        completionRate,
        bestStreak,
        stats: getHabitStats(habit),
      };
    });

    // Overall stats
    const totalPossibleCompletions = habits.length * daysPassedInMonth;
    const totalActualCompletions = habitReports.reduce((sum, r) => sum + r.completedDays, 0);
    const overallCompletionRate = totalPossibleCompletions > 0 
      ? Math.round((totalActualCompletions / totalPossibleCompletions) * 100) 
      : 0;

    // Best performing habit
    const bestHabit = habitReports.length > 0 
      ? habitReports.reduce((best, curr) => curr.completionRate > best.completionRate ? curr : best)
      : null;

    // Habit needing most improvement
    const needsWork = habitReports.length > 0 
      ? habitReports.reduce((worst, curr) => curr.completionRate < worst.completionRate ? curr : worst)
      : null;

    // Perfect days (all habits completed)
    let perfectDays = 0;
    if (habits.length > 0) {
      const monthDays = eachDayOfInterval({ start, end: today < end ? today : end });
      perfectDays = monthDays.filter(day => {
        return habits.every(habit => {
          const dateStr = format(day, 'yyyy-MM-dd');
          return habit.completedDates.includes(dateStr);
        });
      }).length;
    }

    return {
      habitReports,
      overallCompletionRate,
      bestHabit,
      needsWork,
      perfectDays,
      daysPassedInMonth,
      totalCompletions: totalActualCompletions,
    };
  }, [habits, currentMonth, getMonthlyData, getHabitStats]);

  if (habits.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Month Navigation Header */}
      <Card className="shadow-card border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h2 className="text-xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
              <p className="text-sm text-muted-foreground">Monthly Progress Report</p>
            </div>
            <Button variant="ghost" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="shadow-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">{monthlyStats.overallCompletionRate}%</p>
            <p className="text-xs text-muted-foreground">Overall Rate</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-accent/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-accent" />
            </div>
            <p className="text-2xl font-bold">{monthlyStats.perfectDays}</p>
            <p className="text-xs text-muted-foreground">Perfect Days</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{monthlyStats.totalCompletions}</p>
            <p className="text-xs text-muted-foreground">Total Check-ins</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">{monthlyStats.daysPassedInMonth}</p>
            <p className="text-xs text-muted-foreground">Days Tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Highlights */}
      {(monthlyStats.bestHabit || monthlyStats.needsWork) && (
        <div className="grid md:grid-cols-2 gap-3">
          {monthlyStats.bestHabit && monthlyStats.bestHabit.completionRate > 0 && (
            <Card className="shadow-card border-border/50 bg-gradient-to-br from-green-500/5 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" 
                       style={{ backgroundColor: monthlyStats.bestHabit.habit.color + '20' }}>
                    {monthlyStats.bestHabit.habit.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-medium text-green-600">Best Performer</span>
                    </div>
                    <p className="font-semibold truncate">{monthlyStats.bestHabit.habit.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {monthlyStats.bestHabit.completionRate}% completion rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {monthlyStats.needsWork && monthlyStats.habitReports.length > 1 && 
           monthlyStats.needsWork.habit.id !== monthlyStats.bestHabit?.habit.id && (
            <Card className="shadow-card border-border/50 bg-gradient-to-br from-amber-500/5 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" 
                       style={{ backgroundColor: monthlyStats.needsWork.habit.color + '20' }}>
                    {monthlyStats.needsWork.habit.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-medium text-amber-600">Needs Focus</span>
                    </div>
                    <p className="font-semibold truncate">{monthlyStats.needsWork.habit.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {monthlyStats.needsWork.completionRate}% completion rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Individual Habit Reports */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Habit Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {monthlyStats.habitReports.map(({ habit, completedDays, totalDays, completionRate, bestStreak }) => (
            <div key={habit.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg flex-shrink-0">{habit.emoji}</span>
                  <span className="font-medium truncate">{habit.name}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <span className="font-semibold" style={{ color: habit.color }}>
                      {completedDays}/{totalDays}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">days</span>
                  </div>
                  {bestStreak > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Flame className="w-3 h-3 text-primary" />
                      <span>{bestStreak}</span>
                    </div>
                  )}
                </div>
              </div>
              <Progress 
                value={completionRate} 
                className="h-2"
                style={{ 
                  ['--progress-foreground' as string]: habit.color 
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
