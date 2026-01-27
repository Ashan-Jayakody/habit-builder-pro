import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Sparkles, MapPin, Star, Zap, Mountain, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BucketListItem, BUCKET_CATEGORIES } from '@/lib/habitTypes';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface BucketListViewProps {
  items: BucketListItem[];
  onAddItem: (item: Omit<BucketListItem, 'id' | 'createdAt' | 'isCompleted'>) => void;
  onDeleteItem: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const categoryIcons = {
  travel: MapPin,
  experience: Sparkles,
  skill: Star,
  personal: Zap,
  adventure: Mountain,
  other: FileText,
};

export const BucketListView = ({
  items,
  onAddItem,
  onDeleteItem,
  onToggleComplete,
}: BucketListViewProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemEmoji, setNewItemEmoji] = useState('🌟');
  const [newItemCategory, setNewItemCategory] = useState<BucketListItem['category']>('experience');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    
    onAddItem({
      name: newItemName.trim(),
      emoji: newItemEmoji,
      category: newItemCategory,
      description: newItemDescription.trim() || undefined,
    });
    
    setNewItemName('');
    setNewItemEmoji('🌟');
    setNewItemCategory('experience');
    setNewItemDescription('');
    setIsDialogOpen(false);
  };

  const filteredItems = items.filter(item => {
    if (filter === 'pending') return !item.isCompleted;
    if (filter === 'completed') return item.isCompleted;
    return true;
  });

  const completedCount = items.filter(i => i.isCompleted).length;
  const pendingCount = items.filter(i => !i.isCompleted).length;

  const emojis = ['🌟', '🎯', '✈️', '🏔️', '🎭', '🎨', '🎵', '📚', '💪', '🌊', '🏆', '💎', '🚀', '🌈', '🎪', '🗺️'];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-2xl p-4 border border-border text-center">
          <p className="text-2xl font-bold text-primary">{items.length}</p>
          <p className="text-xs text-muted-foreground">Total Dreams</p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border text-center">
          <p className="text-2xl font-bold text-amber-500">{pendingCount}</p>
          <p className="text-xs text-muted-foreground">In Progress</p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border text-center">
          <p className="text-2xl font-bold text-emerald-500">{completedCount}</p>
          <p className="text-xs text-muted-foreground">Achieved</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-muted/50 rounded-xl">
        {(['all', 'pending', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
              filter === f
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {f === 'all' ? 'All' : f === 'pending' ? 'Dreams' : 'Achieved'}
          </button>
        ))}
      </div>

      {/* Add Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full gap-2 rounded-xl h-12" variant="outline">
            <Plus className="w-5 h-5" />
            Add to Bucket List
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{newItemEmoji}</span>
              Add a Dream
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="What's on your bucket list?"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="text-lg"
            />
            
            {/* Emoji Picker */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Pick an icon</p>
              <div className="flex flex-wrap gap-2">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setNewItemEmoji(emoji)}
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all",
                      newItemEmoji === emoji
                        ? "bg-primary/20 ring-2 ring-primary"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Picker */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Category</p>
              <div className="grid grid-cols-3 gap-2">
                {BUCKET_CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setNewItemCategory(cat.value)}
                    className={cn(
                      "p-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-all",
                      newItemCategory === cat.value
                        ? "bg-primary/20 ring-2 ring-primary text-primary"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    )}
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Description */}
            <Input
              placeholder="Add a note (optional)"
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
            />

            <Button onClick={handleAddItem} className="w-full" disabled={!newItemName.trim()}>
              Add to List
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {filter === 'completed' ? 'No dreams achieved yet' : 'Your bucket list is empty'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {filter === 'completed' 
              ? 'Keep working towards your dreams!' 
              : 'Start adding things you want to do in your lifetime'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const CategoryIcon = categoryIcons[item.category];
              const category = BUCKET_CATEGORIES.find(c => c.value === item.category);
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={cn(
                    "group relative rounded-2xl border p-4 transition-all",
                    item.isCompleted
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-card border-border hover:border-primary/30"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => onToggleComplete(item.id)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                        item.isCompleted
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-muted-foreground/30 hover:border-primary"
                      )}
                    >
                      {item.isCompleted && <Check className="w-4 h-4" />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.emoji}</span>
                        <h4 className={cn(
                          "font-semibold truncate",
                          item.isCompleted && "line-through text-muted-foreground"
                        )}>
                          {item.name}
                        </h4>
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                          "bg-muted text-muted-foreground"
                        )}>
                          <CategoryIcon className="w-3 h-3" />
                          {category?.name}
                        </span>
                        
                        {item.isCompleted && item.completedAt && (
                          <span className="text-xs text-emerald-600">
                            ✓ {format(new Date(item.completedAt), 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
