import { useState, useEffect } from 'react';
import { BucketListItem } from '@/lib/habitTypes';
import { format } from 'date-fns';

const STORAGE_KEY = 'bucket-list-data';

export const useBucketList = () => {
  const [items, setItems] = useState<BucketListItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<BucketListItem, 'id' | 'createdAt' | 'isCompleted'>) => {
    const newItem: BucketListItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      isCompleted: false,
    };
    setItems(prev => [...prev, newItem]);
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleComplete = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isCompleted: !item.isCompleted,
          completedAt: !item.isCompleted ? format(new Date(), 'yyyy-MM-dd') : undefined,
        };
      }
      return item;
    }));
  };

  const updateItem = (id: string, updates: Partial<BucketListItem>) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, ...updates };
      }
      return item;
    }));
  };

  const getCompletedCount = () => items.filter(i => i.isCompleted).length;
  const getPendingCount = () => items.filter(i => !i.isCompleted).length;

  return {
    items,
    addItem,
    deleteItem,
    toggleComplete,
    updateItem,
    getCompletedCount,
    getPendingCount,
  };
};
