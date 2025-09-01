import { ThemeState } from '../types';
import { contrastRatio } from './color';

export interface Issue {
  key: string;
  message: string;
}

export function validateTheme(state: ThemeState): Issue[] {
  const issues: Issue[] = [];
  if (!state.name) {
    issues.push({ key: 'name', message: 'name is required' });
  }
  if (!state.version) {
    issues.push({ key: 'version', message: 'version is required' });
  }

  const { colors } = state;
  if (colors.frame && colors.tab_background_text) {
    const ratio = contrastRatio(colors.frame, colors.tab_background_text);
    if (ratio < 4.5) {
      issues.push({ key: 'frame-tab_background_text', message: `low contrast ${ratio.toFixed(2)}` });
    }
  }

  if (colors.toolbar && colors.bookmark_text) {
    const ratio = contrastRatio(colors.toolbar, colors.bookmark_text);
    if (ratio < 4.5) {
      issues.push({ key: 'toolbar-bookmark_text', message: `low contrast ${ratio.toFixed(2)}` });
    }
  }

  const bg = state.images.theme_ntp_background;
  if (bg && bg.width && bg.width < 1920) {
    issues.push({ key: 'ntp_background_size', message: 'NTP background width < 1920px' });
  }

  return issues;
}
