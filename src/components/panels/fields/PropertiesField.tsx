import React from 'react';
import { useAtom } from 'jotai';
import { themeStateAtom } from '../../../store/themeAtoms';
import { ThemeState } from '../../../types';

export const PropertiesField: React.FC = () => {
  const [state, setState] = useAtom(themeStateAtom);

  const setProp = (key: keyof ThemeState['properties']) => (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setState({
      ...state,
      properties: { ...state.properties, [key]: e.target.value as any },
    });
  };

  return (
    <div>
      <label>
        Alignment
        <select
          value={state.properties.ntp_background_alignment || 'center'}
          onChange={setProp('ntp_background_alignment')}
        >
          <option value="left">left</option>
          <option value="right">right</option>
          <option value="top">top</option>
          <option value="bottom">bottom</option>
          <option value="center">center</option>
        </select>
      </label>
      <label>
        Repeat
        <select
          value={state.properties.ntp_background_repeat || 'no-repeat'}
          onChange={setProp('ntp_background_repeat')}
        >
          <option value="no-repeat">no-repeat</option>
          <option value="repeat">repeat</option>
          <option value="repeat-x">repeat-x</option>
          <option value="repeat-y">repeat-y</option>
        </select>
      </label>
      <label>
        Size
        <select
          value={state.properties.ntp_background_size || 'cover'}
          onChange={setProp('ntp_background_size')}
        >
          <option value="auto">auto</option>
          <option value="cover">cover</option>
          <option value="contain">contain</option>
        </select>
      </label>
    </div>
  );
};
