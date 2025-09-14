/**
 * プレビューパネル内のコンポーネントで使用する共通の型定義
 */

export type ColorProps = {
  /** フレームの色 */
  frameColor: string;
  /** ツールバーの色 */
  toolbarColor: string;
  /** ブックマークテキストの色 */
  bookmarkTextColor: string;
  /** NTP背景の色 */
  ntpBackgroundColor: string;
  /** NTPテキストの色 */
  ntpTextColor: string;
  /** NTPリンクの色 */
  ntpLinkColor: string;
  /** オムニボックス背景の色 */
  omniboxBackgroundColor: string;
  /** オムニボックステキストの色 */
  omniboxTextColor: string;
  /** ツールバーテキストの色 */
  toolbarTextColor: string;
  /** ツールバーアイコンの色 */
  toolbarIconColor: string;
  /** ボタン背景の色 */
  buttonBackgroundColor: string;
};

export type ImageProps = {
  /** フレーム背景画像のURL */
  frameBgUrl?: string;
  /** ツールバー背景画像のURL */
  toolbarBgUrl?: string;
  /** タブ背景画像のURL */
  tabBgUrl?: string;
  /** NTP背景画像のURL */
  ntpBgUrl?: string;
};

export type TabData = {
  /** タブのテキスト */
  text: string;
  /** アクティブかどうか */
  isActive: boolean;
  /** 背景画像のオフセット（非アクティブタブ用） */
  backgroundOffset?: number;
};
