import { useState, useEffect } from 'react';
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
import { SettingsMenu } from '@/components/SettingsMenu';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, LayoutGrid, Calendar, FileText, Target, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoalView } from '@/components/GoalView';
import { Onboarding } from '@/components/Onboarding';
import { quotes } from '@/lib/quotes';
import { toast } from 'sonner';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('user_name'));
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem('user_name'));

  const [dailyQuote, setDailyQuote] = useState("");

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const quoteIndex = dayOfYear % quotes.length;
    setDailyQuote(quotes[quoteIndex]);
  }, []);

  const {
    habits,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    isHabitCompletedOnDate,
    getHabitStats,
    getWeeklyData,
    getMonthlyData,
    addNote,
    getNoteForDate,
    goals,
    addGoal,
    deleteGoal,
    toggleGoalDay,
    addGoalLog,
  } = useHabits();

  const handleOnboardingComplete = (name: string) => {
    localStorage.setItem('user_name', name);
    setUserName(name);
    setShowOnboarding(false);
  };

  const handleNameChange = (newName: string) => {
    localStorage.setItem('user_name', newName);
    setUserName(newName);
    toast.success('Name updated successfully!');
  };

  const handleResetAll = () => {
    localStorage.removeItem('habits-tracker-data');
    localStorage.removeItem('goals-tracker-data');
    window.location.reload();
  };

  const today = new Date();
  const completedToday = habits.filter(h => isHabitCompletedOnDate(h, today)).length;

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SettingsMenu
                userName={userName || 'User'}
                onNameChange={handleNameChange}
                onResetAll={handleResetAll}
                habits={habits}
                goals={goals}
              />
              <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserCircle className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-none">
                  Hi, {userName}
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(today, 'EEEE, MMMM d')}
                </p>
              </div>
            </div>
            <AddHabitDialog onAdd={addHabit} />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 shadow-lg transform hover:scale-[1.01] transition-transform duration-300">
          <p className="text-white text-lg font-bold text-center leading-relaxed drop-shadow-md italic">
            "{dailyQuote}"
          </p>
        </div>
      </div>

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
          <TabsList className="grid w-full grid-cols-5 h-11">
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
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Content */}
        {habits.length === 0 && viewMode !== 'goals' ? (
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
                    todayNote={getNoteForDate(habit, today)}
                    onToggle={() => toggleHabitCompletion(habit.id)}
                    onDelete={() => deleteHabit(habit.id)}
                    onSaveNote={(note) => addNote(habit.id, today, note)}
                  />
                ))}
              </div>
            )}

            {viewMode === 'week' && (
              <div className="space-y-6">
                <StatsOverview habits={habits} getHabitStats={getHabitStats} />
                <WeeklyProgress habits={habits} getWeeklyData={getWeeklyData} getNoteForDate={getNoteForDate} />
              </div>
            )}

            {viewMode === 'month' && (
              <div className="space-y-6">
                <StatsOverview habits={habits} getHabitStats={getHabitStats} />
                <MonthlyProgress habits={habits} getMonthlyData={getMonthlyData} getNoteForDate={getNoteForDate} />
              </div>
            )}

            {viewMode === 'report' && (
              <MonthlyReport 
                habits={habits} 
                getHabitStats={getHabitStats} 
                getMonthlyData={getMonthlyData} 
              />
            )}

            {viewMode === 'goals' && (
              <GoalView
                goals={goals}
                onAddGoal={addGoal}
                onDeleteGoal={deleteGoal}
                onToggleDay={toggleGoalDay}
                onAddLog={addGoalLog}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
