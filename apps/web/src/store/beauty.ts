import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BeautyEntry, BeautyProduct } from '@obraz/shared';
import { now, uid } from '../lib/uid';
import { LOCAL_USER_ID } from './profile';

interface BeautyState {
  entries: BeautyEntry[];
  products: BeautyProduct[];
  addEntry: (data: Omit<BeautyEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  removeEntry: (id: string) => void;
  addProduct: (data: Omit<BeautyProduct, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  removeProduct: (id: string) => void;
  toggleFinished: (id: string) => void;
}

export const useBeauty = create<BeautyState>()(
  persist(
    (set) => ({
      entries: [],
      products: [],
      addEntry: (data) =>
        set((s) => ({
          entries: [{ ...data, id: uid(), userId: LOCAL_USER_ID, createdAt: now(), updatedAt: now() }, ...s.entries],
        })),
      removeEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      addProduct: (data) =>
        set((s) => ({
          products: [{ ...data, id: uid(), userId: LOCAL_USER_ID, createdAt: now(), updatedAt: now() }, ...s.products],
        })),
      removeProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      toggleFinished: (id) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, finished: !p.finished, updatedAt: now() } : p)),
        })),
    }),
    { name: 'obraz.beauty' },
  ),
);
