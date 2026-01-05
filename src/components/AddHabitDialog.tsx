import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { HABIT_COLORS, HABIT_EMOJIS } from '@/lib/habitTypes';
import { cn } from '@/lib/utils';

interface AddHabitDialogProps {
  onAdd: (habit: { name: string; emoji: string; color: string }) => void;
}

export const AddHabitDialog = ({ onAdd }: AddHabitDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(HABIT_EMOJIS[0]);
  const [color, setColor] = useState(HABIT_COLORS[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd({ name: name.trim(), emoji, color });
      setName('');
      setEmoji(HABIT_EMOJIS[0]);
      setColor(HABIT_COLORS[0].value);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-warm shadow-warm text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4 mr-2" />
          New Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              placeholder="e.g., Morning meditation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label>Choose an Emoji</Label>
            <div className="flex flex-wrap gap-2">
              {HABIT_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={cn(
                    "w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all",
                    emoji === e
                      ? "bg-secondary ring-2 ring-primary scale-110"
                      : "bg-muted hover:bg-secondary"
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {HABIT_COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all",
                    color === c.value && "ring-2 ring-offset-2 ring-foreground scale-110"
                  )}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 gradient-warm text-primary-foreground hover:opacity-90"
            >
              Create Habit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
