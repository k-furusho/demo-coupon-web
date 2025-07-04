# Demo Coupon Web

スマホブラウザで動作するクーポン発行・利用デモアプリ（React + Vite + TypeScript + Tailwind CSS）。会員 QR → クーポン QR の連続スキャンで有効性判定を行い、localStorage に履歴を保存します。

## 機能概要

| 機能 | 画面 | 説明 |
|------|------|------|
| 会員登録 | `/register` | フォーム入力 → 110 桁 QR を生成・表示 |
| クーポン利用 | `/use` | ①会員QR → ②クーポンQR を連続スキャンし、対象会員・期限・上限を検証して利用回数を記録 |
| 管理画面 | `/admin/...` | 会員リスト / クーポン一覧・登録・詳細（QR 表示＋利用履歴） |

## ローカル環境でスマホ実機テスト

```bash
npm install
npm run dev -- --host
```

`vite` が LAN 内に公開されるので、同一 Wi-Fi のスマホで `http://<PC_IP>:5173/` を開いて操作できます。
  * 起動時にconsoleに出力される`NetWork: http://<PC_IP>:5173/`を開く
  * iOS Safari でカメラが動かない場合は自己署名 HTTPS を設定してください。
  * カメラ許可ポップアップが出ないときは、ブラウザ設定でサイトのカメラ権限を ON に。

## 技術スタック
* React 18 / Vite 5 / TypeScript 5
* Tailwind CSS 3
* QR 生成: `react-qr-code`
* QR 読取: `@zxing/library` + `jsQR`（並列実行）
* 永続化: localStorage ラッパー `LocalDB`

## フォルダ構成
```
src/
  components/      汎用 UI (QrScanner)
  pages/           画面 UI
  stores/          LocalDB ラッパー
  types.ts         型定義
```

## QR 読み取りトラブルシューティング

| 問題 | チェックポイント & 対策 |
|------|-------------------------|
| 情報量が多い (110 桁) | Version 4 (33×33) で十分。物理サイズ 3 cm 以上・余白 4 モジュール・高コントラストで印刷 |
| 機種差 (低解像度カメラ) | `getUserMedia` に `width: { ideal: 1280 }` を指定。暗所では LED/F キャン。|
| ブラウザ差異 | Chrome◎ / Safari△ (iOS <16) / Firefox△ 。オートフォーカス待ち (0.5 s delay) を実装済。|
| ネイティブ比性能 | Web は 1–2 s 遅れることがあるが Version 4 程度では実用レベル。|
| 失敗時フォールバック | 固定コード入力欄を常に表示し、スキャン失敗ストレスを削減。|