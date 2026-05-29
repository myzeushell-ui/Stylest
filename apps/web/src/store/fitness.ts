import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ActivityLog, FitnessGoal } from '@obraz/shared';
import { now, uid } from '../lib/uid';
import { LOCAL_USER_ID } from './profile';

interface FitnessState {
  goals: FitnessGoal[];
  logs: ActivityLog[];
  addGoal: (data: Omit<FitnessGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'done'>) => void;
  toggleGoal: (id: string) => void;
  removeGoal: (id: string) => void;
  addLog: (data: Omit<ActivityLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  removeLog: (id: string) => void;
}

export const useFitness = create<FitnessState>()(
  persist(
    (set) => ({
      goals: [],
      logs: [],
      addGoal: (data) =>
        set((s) => ({
          goals: [{ ...data, done: false, id: uid(), userId: LOCAL_USER_ID, createdAt: now(), updatedAt: now() }, ...s.goals],
        })),
      toggleGoal: (id) =>
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, done: !g.done, updatedAt: now() } : g)) })),
      removeGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),
      addLog: (data) =>
        set((s) => ({
          logs: [{ ...data, id: uid(), userId: LOCAL_USER_ID, createdAt: now(), updatedAt: now() }, ...s.logs],
        })),
      removeLog: (id) => set((s) => ({ logs: s.logs.filter((l) => l.id !== id) })),
    }),
    { name: 'obraz.fitness' },
  ),
);
