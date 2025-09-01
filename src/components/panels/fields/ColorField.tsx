import React from 'react';
import { useAtom } from 'jotai';
import { themeStateAtom } from '../../../store/themeAtoms';
import { ThemeState, RGB } from '../../../types';

function rgbToHex(rgb: RGB): string {
  return '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex: string): RGB {
  const v = hex.replace('#', '');
  return [parseInt(v.slice(0,2),16), parseInt(v.slice(2,4),16), parseInt(v.slice(4,6),16)];
}

export const ColorField: React.FC<{slot: keyof ThemeState['colors']; label: string}> = ({ slot, label }) => {
  const [state, setState] = useAtom(themeStateAtom);
  const current = state.colors[slot];
  const hex = current ? rgbToHex(current) : '#000000';

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rgb = hexToRgb(e.target.value);
    setState({
      ...state,
      colors: { ...state.colors, [slot]: rgb },
    });
  };

  return (
    <div>
      <label>
        {label}
        <input type="color" value={hex} onChange={onChange} />
      </label>
    </div>
  );
};
