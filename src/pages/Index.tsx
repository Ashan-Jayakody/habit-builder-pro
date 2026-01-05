import { useState } from 'react';
import { format } from 'date-fns';
import { useHabits } from '@/hooks/useHabits';
import { ViewMode } from '@/lib/habitTypes';
import { AddHabitDialog } from '@/components/AddHabitDialog';
import { HabitCard } from '@/components/HabitCard';
import { WeeklyProgress } from '@/components/WeeklyProgress';
import { MonthlyProgress } from '@/components/MonthlyProgress';
import { MonthlyReport } from '@/components/MonthlyReport';
import { StatsOverview } from '@/components/StatsOverview';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, LayoutGrid, Calendar, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const {
    habits,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    isHabitCompletedOnDate,
    getHabitStats,
    getWeeklyData,
    getMonthlyData,
  } = useHabits();

  const today = new Date();
  const completedToday = habits.filter(h => isHabitCompletedOnDate(h, today)).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                HabitFlow
              </h1>
              <p className="text-sm text-muted-foreground">
                {format(today, 'EEEE, MMMM d')}
              </p>
            </div>
            <AddHabitDialog onAdd={addHabit} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Progress Summary */}
        {habits.length > 0 && (
          <div className="p-4 rounded-2xl gradient-warm shadow-warm">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm opacity-90">Today's Progress</p>
                <p className="text-3xl font-bold">
                  {completedToday} / {habits.length}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl font-bold">
                  {habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* View Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList className="grid w-full grid-cols-4 h-11">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Today</span>
            </TabsTrigger>
            <TabsTrigger value="week" className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Week</span>
            </TabsTrigger>
            <TabsTrigger value="month" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Month</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Report</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Content */}
        {habits.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {viewMode === 'today' && (
              <div className="space-y-3">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    isCompletedToday={isHabitCompletedOnDate(habit, today)}
                    stats={getHabitStats(habit)}
                    onToggle={() => toggleHabitCompletion(habit.id)}
                    onDelete={() => deleteHabit(habit.id)}
                  />
                ))}
              </div>
            )}

            {viewMode === 'week' && (
              <div className="space-y-6">
                <StatsOverview habits={habits} getHabitStats={getHabitStats} />
                <WeeklyProgress habits={habits} getWeeklyData={getWeeklyData} />
              </div>
            )}

            {viewMode === 'month' && (
              <div className="space-y-6">
                <StatsOverview habits={habits} getHabitStats={getHabitStats} />
                <MonthlyProgress habits={habits} getMonthlyData={getMonthlyData} />
              </div>
            )}

            {viewMode === 'report' && (
              <MonthlyReport 
                habits={habits} 
                getHabitStats={getHabitStats} 
                getMonthlyData={getMonthlyData} 
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
