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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<{ goalId: string; date: Date } | null>(null);
  const [logNote, setLogNote] = useState('');

  const handleAddGoal = () => {
    if (newGoalName && newGoalDate) {
      onAddGoal(newGoalName, new Date(newGoalDate));
      setNewGoalName('');
      setNewGoalDate('');
      setIsAddDialogOpen(false);
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                  min={new Date().toISOString().split('T')[0]}
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

                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Journey Progress</span>
                      <span>{Math.round((goal.completedDays.length / totalDays) * 100)}%</span>
                    </div>
                    <Progress value={(goal.completedDays.length / totalDays) * 100} className="h-2" />
                  </div>
                  
                  <div className="relative w-full overflow-x-auto pb-8 pt-4 no-scrollbar">
                    <div 
                      className="relative h-[300px]" 
                      style={{ width: `${Math.max(600, daysArr.length * 60 + 100)}px` }}
                    >
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        viewBox={`0 0 ${Math.max(600, daysArr.length * 60 + 100)} 300`}
                        preserveAspectRatio="none"
                      >
                        <path
                          d={`M 50 150 ${daysArr.map((_, i) => {
                            const x = 50 + i * 60;
                            const y = 150 + Math.sin(i * 0.8) * 60;
                            return `L ${x} ${y}`;
                          }).join(' ')}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="text-muted/20"
                          strokeLinecap="round"
                          strokeJoin="round"
                        />
                        <motion.path
                          d={`M 50 150 ${daysArr.map((_, i) => {
                            const x = 50 + i * 60;
                            const y = 150 + Math.sin(i * 0.8) * 60;
                            return `L ${x} ${y}`;
                          }).join(' ')}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="text-primary"
                          strokeLinecap="round"
                          strokeJoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: goal.completedDays.length / totalDays }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                      </svg>

                      {daysArr.map((day, idx) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const isCompleted = goal.completedDays.includes(dateStr);
                        const isFuture = isAfter(startOfDay(day), startOfDay(new Date()));
                        const isToday = isSameDay(day, new Date());
                        const hasLog = goal.logs.some(l => l.date === dateStr);
                        
                        // Calculate position along the path (sine-like curve) with fixed spacing
                        const stepDistance = 60; // Constant distance between steps
                        const x = 50 + idx * stepDistance;
                        const y = 150 + Math.sin(idx * 0.8) * 60; // Winding effect based on index

                        return (
                          <div
                            key={idx}
                            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group"
                            style={{ left: `${x}px`, top: `${y}px` }}
                          >
                            <button
                              disabled={!isToday && !isFuture}
                              onClick={() => onToggleDay(goal.id, day)}
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all z-20",
                                (isToday || isFuture) && "hover:scale-125 hover:shadow-xl active:scale-95",
                                isCompleted 
                                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                                  : "bg-background border-2 border-muted text-muted-foreground",
                                isFuture && "opacity-40 border-dashed",
                                !isToday && !isFuture && "cursor-not-allowed opacity-60"
                              )}
                            >
                              <Footprints className={cn("w-5 h-5 transition-transform", isCompleted ? "scale-110" : "opacity-40")} />
                              
                              {/* Checkpoint indicator */}
                              {(idx % 5 === 0 || isToday) && (
                                <div className={cn(
                                  "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
                                  isToday ? "bg-primary animate-ping" : "bg-accent animate-pulse"
                                )} />
                              )}
                            </button>
                            
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-12 flex flex-col items-center z-30">
                              <span className="text-[10px] font-bold whitespace-nowrap bg-background/90 px-1.5 py-0.5 rounded shadow-sm border">
                                {format(day, 'MMM d')}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "h-8 w-8 mt-1 rounded-full bg-background shadow-sm border", 
                                  hasLog ? "text-primary border-primary/30" : "text-muted-foreground/30"
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDay({ goalId: goal.id, date: day });
                                  const log = goal.logs.find(l => l.date === dateStr);
                                  setLogNote(log?.note || '');
                                }}
                              >
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                            </div>

                            <AnimatePresence>
                              {isFullyCompleted && (
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -inset-4 pointer-events-none"
                                >
                                  <div className="w-full h-full bg-primary/5 rounded-full blur-xl" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
