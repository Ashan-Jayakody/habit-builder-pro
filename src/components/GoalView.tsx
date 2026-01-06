import { useState } from 'react';
import { Goal } from '@/lib/habitTypes';
import { format, differenceInDays, parseISO, addDays, isSameDay, isBefore, isAfter, startOfDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Footprints, Plus, Trash2, MessageSquare, CheckCircle2, ClipboardList, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface GoalViewProps {
  goals: Goal[];
  onAddGoal: (name: string, targetDate: Date) => void;
  onDeleteGoal: (id: string) => void;
  onToggleDay: (goalId: string, date: Date) => void;
  onAddLog: (goalId: string, date: Date, note: string) => void;
}

export const GoalView = ({ goals, onAddGoal, onDeleteGoal, onToggleDay, onAddLog }: GoalViewProps) => {
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');
  const [selectedDay, setSelectedDay] = useState<{ goalId: string; date: Date } | null>(null);
  const [logNote, setLogNote] = useState('');

  const handleAddGoal = () => {
    if (newGoalName && newGoalDate) {
      onAddGoal(newGoalName, new Date(newGoalDate));
      setNewGoalName('');
      setNewGoalDate('');
    }
  };

  const handleSaveLog = () => {
    if (selectedDay) {
      onAddLog(selectedDay.goalId, selectedDay.date, logNote);
      setSelectedDay(null);
      setLogNote('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Goals</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set a New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="goal-name">What is your goal?</Label>
                <Input
                  id="goal-name"
                  placeholder="e.g. Run a Marathon"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-date">Target Date</Label>
                <Input
                  id="goal-date"
                  type="date"
                  value={newGoalDate}
                  onChange={(e) => setNewGoalDate(e.target.value)}
                />
              </div>
              <Button onClick={handleAddGoal} className="w-full">Create Goal Path</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center text-muted-foreground">
            No goals set yet. Start your journey by adding a goal!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const startDate = parseISO(goal.createdAt);
            const targetDate = parseISO(goal.targetDate);
            const totalDays = differenceInDays(targetDate, startDate) + 1;
            const daysArr = Array.from({ length: Math.min(totalDays, 100) }, (_, i) => addDays(startDate, i));
            const isFullyCompleted = goal.completedDays.length >= totalDays;

            return (
              <Card key={goal.id} className={cn("overflow-hidden transition-all duration-500", isFullyCompleted && "ring-2 ring-primary border-primary shadow-lg shadow-primary/20")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    {isFullyCompleted ? <CheckCircle2 className="w-5 h-5 text-primary animate-bounce" /> : <Footprints className="w-5 h-5 text-primary" />}
                    {goal.name}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    {isFullyCompleted && (
                      <div className="flex items-center gap-1 mr-2 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                        <PartyPopper className="w-3 h-3" />
                        Completed!
                      </div>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                          <ClipboardList className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Goal Logs: {goal.name}</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[400px] mt-4 pr-4">
                          <div className="space-y-4">
                            {goal.logs.length === 0 ? (
                              <p className="text-center text-muted-foreground py-8">No logs added yet.</p>
                            ) : (
                              goal.logs
                                .sort((a, b) => b.date.localeCompare(a.date))
                                .map((log, idx) => (
                                  <div key={idx} className="border-l-2 border-primary pl-4 py-1">
                                    <p className="text-xs font-semibold text-muted-foreground">
                                      {format(parseISO(log.date), 'MMMM d, yyyy')}
                                    </p>
                                    <p className="text-sm mt-1">{log.note}</p>
                                  </div>
                                ))
                            )}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDeleteGoal(goal.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
                    <span>Target: {format(targetDate, 'MMM d, yyyy')}</span>
                    <span>{totalDays} day journey</span>
                  </div>

                  <div className="mb-6 space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Progress</span>
                      <span>{Math.round((goal.completedDays.length / totalDays) * 100)}%</span>
                    </div>
                    <Progress value={(goal.completedDays.length / totalDays) * 100} className="h-2" />
                  </div>
                  
                  <ScrollArea className="h-32 w-full rounded-md border p-4">
                    <AnimatePresence>
                      {isFullyCompleted && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10 p-4 text-center"
                        >
                          <div className="space-y-2">
                            <PartyPopper className="w-10 h-10 text-primary mx-auto" />
                            <h3 className="font-bold text-lg">Congratulations!</h3>
                            <p className="text-sm text-muted-foreground">You've reached your goal! Amazing work!</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex flex-wrap gap-4 justify-center">
                      {daysArr.map((day, idx) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const isCompleted = goal.completedDays.includes(dateStr);
                        const hasLog = goal.logs.some(l => l.date === dateStr);
                        const isFuture = isAfter(startOfDay(day), startOfDay(new Date()));
                        
                        return (
                          <div key={idx} className="flex flex-col items-center gap-1">
                            <button
                              disabled={isFuture}
                              onClick={() => onToggleDay(goal.id, day)}
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                !isFuture && "hover:scale-110",
                                isCompleted 
                                  ? "bg-primary text-primary-foreground shadow-lg" 
                                  : "bg-muted text-muted-foreground hover:bg-muted/80",
                                isFuture && "opacity-20 cursor-not-allowed grayscale"
                              )}
                            >
                              <Footprints className={cn("w-5 h-5", isCompleted ? "fill-current" : "")} />
                            </button>
                            <span className="text-[10px] text-muted-foreground">{format(day, 'MMM d')}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isFuture}
                              className={cn(
                                "h-6 w-6 mt-1", 
                                hasLog ? "text-primary" : "text-muted-foreground/30",
                                isFuture && "opacity-0 pointer-events-none"
                              )}
                              onClick={() => {
                                setSelectedDay({ goalId: goal.id, date: day });
                                const log = goal.logs.find(l => l.date === dateStr);
                                setLogNote(log?.note || '');
                              }}
                            >
                              <MessageSquare className="w-3 h-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!selectedDay} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Log for {selectedDay && format(selectedDay.date, 'MMMM d, yyyy')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>What did you do today towards this goal?</Label>
              <Textarea
                placeholder="Write your progress log..."
                value={logNote}
                onChange={(e) => setLogNote(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={handleSaveLog} className="w-full">Save Log</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
