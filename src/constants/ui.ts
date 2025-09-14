/**
 * UI関連の定数定義
 * Chromeブラウザのプレビューパネルで使用される寸法やレイアウトの定数
 */

/**
 * Chromeブラウザの各セクションの高さ（ピクセル）
 * Windows 100%スケーリング環境での近似値
 */
export const METRICS = {
  /** タブストリップの高さ */
  tabStrip: 50,
  /** ツールバーの高さ */
  toolbar: 44,
  /** ブックマークバーの高さ */
  bookmarks: 40,
} as const;

/**
 * プレビューキャンバスの基本サイズ
 * 1920x1080を基準として、親要素に合わせてスケールダウン
 */
export const CANVAS = {
  /** 基本幅（ピクセル） */
  BASE_WIDTH: 1920,
  /** 基本高さ（ピクセル） */
  BASE_HEIGHT: 1080,
} as const;

/**
 * タブのレイアウト関連定数
 */
export const TAB = {
  /** タブの基本幅（ピクセル） */
  WIDTH: 260,
} as const;

/**
 * 新規タブページ（NTP）のレイアウト定数
 */
export const NTP = {
  /** 最小高さ（ピクセル） */
  MIN_HEIGHT: 360,
  /** 検索ボックスの上端位置（NTP高さに対する割合） */
  SEARCH_TOP_RATIO: 0.2,
  /** ショートカットの上端位置（検索ボックスからのオフセット） */
  SHORTCUTS_OFFSET: 120,
} as const;

/**
 * アイコンのスタイル定数
 */
export const ICON = {
  /** デフォルトサイズ（ピクセル） */
  DEFAULT_SIZE: 22,
  /** 角丸の半径（ピクセル） */
  BORDER_RADIUS: 4,
  /** ツールバーアイコンのサイズ（ピクセル） */
  TOOLBAR_SIZE: 24,
  /** プロフィールアイコンのサイズ（ピクセル） */
  PROFILE_SIZE: 28,
  /** プロフィールアイコンの角丸半径（ピクセル） */
  PROFILE_BORDER_RADIUS: 14,
} as const;

/**
 * 検索ボックスのスタイル定数
 */
export const SEARCH_BOX = {
  /** 幅（ピクセル） */
  WIDTH: 640,
  /** 高さ（ピクセル） */
  HEIGHT: 48,
  /** 角丸の半径（ピクセル） */
  BORDER_RADIUS: 24,
  /** 最大幅（親要素に対する割合） */
  MAX_WIDTH_RATIO: 0.9,
} as const;

/**
 * ショートカットのスタイル定数
 */
export const SHORTCUT = {
  /** アイコンのサイズ（ピクセル） */
  ICON_SIZE: 44,
  /** アイコンの角丸半径（ピクセル） */
  ICON_BORDER_RADIUS: 22,
  /** 各ショートカットの幅（ピクセル） */
  WIDTH: 112,
  /** 表示するショートカットの数 */
  COUNT: 8,
} as const;
