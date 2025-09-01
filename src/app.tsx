import React from 'react';
import { Provider } from 'jotai';
import { ResourcePanel } from './components/panels/ResourcePanel';
import { ValidationPanel } from './components/panels/ValidationPanel';
import { ExportPanel } from './components/panels/ExportPanel';
import { PreviewCanvas } from './components/PreviewCanvas';

export const App: React.FC = () => (
  <Provider>
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ width: 200 }}>
        <ResourcePanel />
      </div>
      <div style={{ flex: 1 }}>
        <PreviewCanvas />
      </div>
      <div style={{ width: 300 }}>
        <ValidationPanel />
        <ExportPanel />
      </div>
    </div>
  </Provider>
);
