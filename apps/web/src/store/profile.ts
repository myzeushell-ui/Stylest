import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SelfProfile } from '@obraz/shared';
import { now, uid } from '../lib/uid';

export const LOCAL_USER_ID = 'local-user';

// Профиль по умолчанию — «не знаю», чтобы человек заполнил онбординг.
const emptyProfile = (): SelfProfile => ({
  id: uid(),
  userId: LOCAL_USER_ID,
  createdAt: now(),
  updatedAt: now(),
  displayName: '',
  colorType: 'не знаю',
  bodyType: 'не знаю',
  skinType: 'нормальная',
  hairType: 'прямые',
  heightCm: 170,
  clothingSize: 'M',
  genderPresentation: 'нейтральная',
  monthlyBudgetRub: 5000,
  styleGoals: [],
  lifestyleTags: [],
});

interface ProfileState {
  profile: SelfProfile;
  /** Заполнен ли профиль (прошёл ли онбординг). */
  onboarded: boolean;
  update: (patch: Partial<SelfProfile>) => void;
  reset: () => void;
}

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      profile: emptyProfile(),
      onboarded: false,
      update: (patch) =>
        set((s) => ({
          profile: { ...s.profile, ...patch, updatedAt: now() },
          onboarded: true,
        })),
      reset: () => set({ profile: emptyProfile(), onboarded: false }),
    }),
    { name: 'obraz.profile' },
  ),
);
