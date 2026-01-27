import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Trash2, CheckCircle2, Map as MapIcon, Mountain, ChevronRight } from 'lucide-react';
import { BucketListItem, BUCKET_CATEGORIES } from '@/lib/habitTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BucketListViewProps {
  items: BucketListItem[];
  onAddItem: (name: string, emoji: string, category: BucketListItem['category'], description?: string) => void;
  onDeleteItem: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const BucketListView = ({ items, onAddItem, onDeleteItem, onToggleComplete }: BucketListViewProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<BucketListItem['category']>('experience');
  const [newDescription, setNewDescription] = useState('');

  const completedCount = items.filter(i => i.isCompleted).length;

  const handleAdd = () => {
    if (!newName.trim()) return;
    const categoryEmoji = BUCKET_CATEGORIES.find(c => c.value === newCategory)?.emoji || '✨';
    onAddItem(newName, categoryEmoji, newCategory, newDescription);
    setNewName('');
    setNewDescription('');
    setIsAddOpen(false);
  };

  // Generate path points (Candy Crush style winding path)
  const getPathPoints = (count: number) => {
    const points = [];
    const stepX = 100;
    const baseY = 150;
    for (let i = 0; i < count; i++) {
      const x = 50 + i * stepX;
      const y = baseY + Math.sin(i * 0.8) * 40;
      points.push({ x, y });
    }
    return points;
  };

  const pathPoints = getPathPoints(items.length);
  const penguinTarget = pathPoints[completedCount - 1] || { x: 50, y: 150 };

  return (
    <div className="space-y-6">
      {/* Mountain Header */}
      <div className="relative h-72 w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155] border border-white/10 shadow-2xl">
        {/* Distant Mountains */}
        <div className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-center gap-1 opacity-40 grayscale-[0.2] pointer-events-none">
          <Mountain className="w-64 h-64 text-slate-400 -mb-20 -ml-20" />
          <Mountain className="w-96 h-96 text-slate-300 -mb-24" />
          <Mountain className="w-64 h-64 text-slate-400 -mb-20 -mr-20" />
        </div>

        {/* Snow Layer */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
        
        {/* Interactive Map Area */}
        <div className="absolute inset-0 overflow-x-auto no-scrollbar pt-8">
          <div 
            className="relative h-full"
            style={{ width: `${Math.max(window.innerWidth - 32, items.length * 100 + 200)}px` }}
          >
            {/* SVG Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d={`M 50 150 ${pathPoints.map(p => `L ${p.x} ${p.y}`).join(' ')}`}
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeDasharray="8 8"
                strokeLinecap="round"
                className="opacity-20"
              />
              <motion.path
                d={`M 50 150 ${pathPoints.slice(0, completedCount).map(p => `L ${p.x} ${p.y}`).join(' ')}`}
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                className="opacity-40"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
            </svg>

            {/* Penguin */}
            <motion.div
              animate={{ 
                x: penguinTarget.x - 24, 
                y: penguinTarget.y - 48,
                scale: [1, 1.05, 1] 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 50, 
                damping: 15,
                scale: { duration: 1, repeat: Infinity } 
              }}
              className="absolute z-20 pointer-events-none"
            >
              <div className="text-5xl filter drop-shadow-2xl">🐧</div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-black/30 blur-sm rounded-full" />
            </motion.div>

            {/* Checkpoints */}
            {items.map((item, idx) => {
              const pos = pathPoints[idx];
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggleComplete(item.id)}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all shadow-xl z-10",
                    item.isCompleted 
                      ? "bg-primary border-primary shadow-primary/40" 
                      : "bg-white/10 border-white/20 backdrop-blur-md"
                  )}
                  style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  {item.isCompleted && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-white rounded-full p-0.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary fill-primary" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* List Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 tracking-tight">
            BUCKET LIST
            <span className="text-xs font-bold bg-primary/20 text-primary px-2.5 py-1 rounded-full border border-primary/20">
              {completedCount}/{items.length}
            </span>
          </h2>
          <p className="text-sm text-muted-foreground font-medium opacity-70">Your journey towards the mountains of greatness</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="rounded-full h-12 w-12 shadow-xl hover-elevate active-elevate-2 bg-primary hover:bg-primary/90">
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Add to Bucket List</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">What's the goal?</label>
                <Input 
                  placeholder="e.g. See Northern Lights" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="rounded-xl h-12 bg-muted/50 border-none focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Category</label>
                <Select value={newCategory} onValueChange={(val: any) => setNewCategory(val)}>
                  <SelectTrigger className="rounded-xl h-12 bg-muted/50 border-none">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    {BUCKET_CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value} className="rounded-lg">
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{cat.emoji}</span>
                          <span className="font-medium">{cat.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Notes (optional)</label>
                <Input 
                  placeholder="Why is this important?" 
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="rounded-xl h-12 bg-muted/50 border-none"
                />
              </div>
              <Button className="w-full h-12 mt-4 rounded-xl font-bold text-base shadow-lg shadow-primary/20" onClick={handleAdd}>Add Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* List Items */}
      <div className="grid gap-3 pb-8">
        {items.length === 0 ? (
          <div className="text-center py-16 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
              <MapIcon className="w-8 h-8 text-muted-foreground opacity-30" />
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground font-bold">The map is empty</p>
              <p className="text-xs text-muted-foreground/60">Add your first dream to start the journey!</p>
            </div>
          </div>
        ) : (
          items.map((item) => (
            <motion.div
              layout
              key={item.id}
              className={cn(
                "group relative p-4 rounded-2xl border transition-all flex items-center justify-between overflow-hidden",
                item.isCompleted 
                  ? "bg-muted/30 border-muted/50 grayscale-[0.5]" 
                  : "bg-card border-border shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-0.5"
              )}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm transition-colors",
                  item.isCompleted ? "bg-muted" : "bg-primary/5 group-hover:bg-primary/10"
                )}>
                  {item.emoji}
                </div>
                <div className="min-w-0">
                  <h3 className={cn(
                    "font-bold truncate text-base tracking-tight",
                    item.isCompleted && "line-through text-muted-foreground"
                  )}>
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-1.5 py-0.5 rounded bg-primary/5">
                      {item.category}
                    </span>
                    {item.description && (
                      <span className="text-[10px] text-muted-foreground truncate max-w-[120px] font-medium opacity-60">
                        • {item.description}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onDeleteItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant={item.isCompleted ? "secondary" : "default"}
                  size="icon"
                  className={cn(
                    "rounded-full h-10 w-10 shrink-0 shadow-lg",
                    !item.isCompleted && "bg-primary shadow-primary/20"
                  )}
                  onClick={() => onToggleComplete(item.id)}
                >
                  {item.isCompleted ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
