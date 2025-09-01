import { atom } from 'jotai';
import { ThemeState, SlotKey } from '../types';

export const themeStateAtom = atom<ThemeState>({
  name: '',
  version: '1.0.0',
  images: {},
  colors: {},
  tints: {},
  properties: {},
});

export const selectedSlotAtom = atom<SlotKey | null>(null);
