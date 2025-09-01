import React from 'react';
import { useAtom } from 'jotai';
import { themeStateAtom } from '../../../store/themeAtoms';
import { ThemeState, Tint } from '../../../types';

export const TintField: React.FC<{slot: keyof ThemeState['tints']; label: string}> = ({ slot, label }) => {
  const [state, setState] = useAtom(themeStateAtom);
  const current = state.tints[slot] || [0, 0, 0];

  const update = (index: number, value: number) => {
    const next: Tint = [...current] as Tint;
    next[index] = value;
    setState({
      ...state,
      tints: { ...state.tints, [slot]: next },
    });
  };

  return (
    <div>
      <label>{label}</label>
      <div>
        <input type="range" min={0} max={1} step={0.01} value={current[0]} onChange={e => update(0, parseFloat(e.target.value))} />
        <input type="range" min={0} max={1} step={0.01} value={current[1]} onChange={e => update(1, parseFloat(e.target.value))} />
        <input type="range" min={0} max={1} step={0.01} value={current[2]} onChange={e => update(2, parseFloat(e.target.value))} />
      </div>
    </div>
  );
};
