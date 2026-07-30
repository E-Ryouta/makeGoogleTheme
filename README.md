# Theme Builder

画像と色を設定し、Chrome風プレビューを確認しながら、Google Chromeへ適用できるテーマZIPを作成するWebアプリです。ログインは不要で、選択した画像のデコード、色抽出、Canvas編集、ZIP生成はブラウザ内で行います。

## 主な機能

- フレーム、ツールバー、タブ、新しいタブの背景画像設定
- 背景画像の位置、繰り返し、拡大設定
- 複数画像を組み合わせる背景エディター
- Chromeの各部位の色設定とプレビュー
- Manifest V3形式のテーマZIP生成
- 日本語・英語表示
- Chromeへの適用・解除ガイド

## 画像の制限

ブラウザのメモリ枯渇を防ぐため、次の上限を設けています。

- 形式: JPEG、PNG、WebP
- ファイルサイズ: 10MB以下
- 最大辺: 8192px以下
- 最大画素数: 4000万画素以下
- 背景エディター: 最大20レイヤー

ファイルのMIMEタイプだけでなく、ファイルシグネチャとブラウザでのデコード結果も検証します。

## セットアップ

Node.js 22以上とnpmを使用します。

```bash
npm ci
npm run dev
```

## 開発コマンド

```bash
npm run dev
npm run lint
npm run format
npm run typecheck
npm test
npm run build
npm run preview
```

Pull Requestと`main`へのpushでは、GitHub Actionsがlint、型チェック、テスト、ビルドを実行します。

## Chromeへの適用

1. 生成したZIPを展開します。
2. Chromeで`chrome://extensions`を開きます。
3. デベロッパーモードを有効にします。
4. 「パッケージ化されていない拡張機能を読み込む」を選び、展開したフォルダーを指定します。

テーマはJavaScriptやHTMLを含まず、`manifest.json`とPNG画像だけで構成されます。

## プライバシー

選択した画像やテーマ内容は、テーマ生成のためにサーバーへアップロードしません。利用状況の計測にはVercel Analyticsを使用しているため、「外部通信が一切ない」という意味ではありません。

## 対応環境と既知の制限

- 作成と適用の主対象はGoogle Chromeです。
- プレビューはChromeの見た目を近似したもので、OSやChromeのバージョンにより実際の表示と差が出る場合があります。
- Chrome Web Storeへの自動公開は行いません。
- Undo / Redoと編集内容の自動保存は未実装です。
