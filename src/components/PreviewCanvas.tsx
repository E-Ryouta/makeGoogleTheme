import React from 'react';
import { useAtom } from 'jotai';
import { themeStateAtom, selectedSlotAtom } from '../store/themeAtoms';
import { SlotKey, RGB } from '../types';
import { blobToObjectURL } from '../lib/file';

function rgbToCss(rgb?: RGB): string {
  return rgb ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` : 'transparent';
}

export const PreviewCanvas: React.FC = () => {
  const [state] = useAtom(themeStateAtom);
  const [selected, setSelected] = useAtom(selectedSlotAtom);

  const bgUrl = state.images.theme_ntp_background
    ? blobToObjectURL(state.images.theme_ntp_background.blob)
    : undefined;

  return (
    <div style={{ border: '1px solid #ccc', width: 600 }}>
      <div
        onClick={() => setSelected('frame')}
        style={{
          background: rgbToCss(state.colors.frame),
          padding: 4,
          border: selected === 'frame' ? '2px solid blue' : '2px solid transparent',
        }}
      >
        <div
          onClick={e => {
            e.stopPropagation();
            setSelected('toolbar');
          }}
          style={{
            background: rgbToCss(state.colors.toolbar),
            height: 40,
            border: selected === 'toolbar' ? '2px solid blue' : '2px solid transparent',
          }}
        ></div>
      </div>
      <div
        onClick={() => setSelected('ntp_background')}
        style={{
          backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
          backgroundSize: state.properties.ntp_background_size || 'cover',
          backgroundPosition: state._preview?.position || 'center',
          backgroundRepeat: state.properties.ntp_background_repeat || 'no-repeat',
          height: 200,
          border: selected === 'ntp_background' ? '2px solid blue' : '2px solid transparent',
        }}
      ></div>
    </div>
  );
};
