import React from 'react';
import { useAtom } from 'jotai';
import { themeStateAtom } from '../../../store/themeAtoms';
import { ThemeState, FileRef } from '../../../types';

export const ImageField: React.FC<{slot: keyof ThemeState['images']; label: string}> = ({ slot, label }) => {
  const [state, setState] = useAtom(themeStateAtom);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ref: FileRef = { id: slot, name: file.name, blob: file };
    setState({
      ...state,
      images: { ...state.images, [slot]: ref },
    });
  };

  return (
    <div>
      <label>
        {label}
        <input type="file" onChange={onChange} />
      </label>
    </div>
  );
};
