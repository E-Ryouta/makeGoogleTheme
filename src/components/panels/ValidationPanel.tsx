import React from 'react';
import { useAtom } from 'jotai';
import { themeStateAtom, selectedSlotAtom } from '../../store/themeAtoms';
import { validateTheme } from '../../lib/validate';

export const ValidationPanel: React.FC = () => {
  const [state] = useAtom(themeStateAtom);
  const [, setSelected] = useAtom(selectedSlotAtom);
  const issues = validateTheme(state);
  return (
    <div>
      <h2>Issues</h2>
      <ul>
        {issues.map(i => (
          <li key={i.key}>
            <button onClick={() => setSelected(i.key as any)}>{i.message}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
