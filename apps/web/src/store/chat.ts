import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatState {
  messages: ChatMsg[];
  push: (m: ChatMsg) => void;
  clear: () => void;
}

export const useChat = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      push: (m) => set((s) => ({ messages: [...s.messages, m] })),
      clear: () => set({ messages: [] }),
    }),
    { name: 'obraz.chat' },
  ),
);
