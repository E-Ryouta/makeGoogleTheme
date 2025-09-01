import React from 'react';
import { ImageField } from './fields/ImageField';
import { ColorField } from './fields/ColorField';
import { TintField } from './fields/TintField';
import { PropertiesField } from './fields/PropertiesField';

export const ResourcePanel: React.FC = () => (
  <div>
    <h2>Images</h2>
    <ImageField slot="theme_frame" label="Theme Frame" />
    <ImageField slot="theme_ntp_background" label="NTP Background" />
    <h2>Colors</h2>
    <ColorField slot="frame" label="Frame" />
    <ColorField slot="toolbar" label="Toolbar" />
    <ColorField slot="tab_background_text" label="Tab Text" />
    <ColorField slot="bookmark_text" label="Bookmark Text" />
    <ColorField slot="ntp_text" label="NTP Text" />
    <ColorField slot="ntp_link" label="NTP Link" />
    <h2>Tints</h2>
    <TintField slot="buttons" label="Buttons" />
    <h2>Properties</h2>
    <PropertiesField />
  </div>
);
