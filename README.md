# Demo Coupon Web

スマホ／PC ブラウザのどちらでも動作するクーポン発行・利用デモアプリ（React + Vite + TypeScript + Tailwind CSS）。会員登録時に発行される Cookie で認証し、Express + lowdb の簡易 API サーバにデータを共有保存します。スマホ側ではクーポン QR をスキャンして利用し、PC の管理画面ではリアルタイムで履歴を確認できます。

## 機能概要

| 機能 | 画面 | 説明 |
|------|------|------|
| 会員登録 | `/register` | フォーム入力 → 110 桁 QR を生成・表示 |
| クーポン利用 | `/use` | ①会員QR → ②クーポンQR を連続スキャンし、対象会員・期限・上限を検証して利用回数を記録 |
| 管理画面 | `/admin/...` | 会員リスト / クーポン一覧・登録・詳細（QR 表示＋利用履歴） |

## クイックスタート

```bash
# 依存インストール
npm install

# API サーバ + Vite (HTTPS 対応) を並列起動
npm run dev:full
#   ├─ https://<PC_IP>:5173/  ← フロント (スマホ実機アクセス可)
#   └─ http://localhost:3001/api/** ← JSON API (Express+lowdb)
```

| スクリプト | 役割 |
|------------|------|
| `npm run dev` | Vite フロントのみ (HTTP) |
| `npm run serve:api` | API サーバのみ |
| `npm run dev:full` | API + Vite を並行起動 (`concurrently`) |

## システム構成図

```
スマホ/PC ブラウザ
      │ HTTPS (5173)
      ▼
   Vite + React
      │  /api (proxy)           ┌────────────┐
      ▼                        │  db.json   │
Express + lowdb (3001) ───────▶│  (lowdb)   │
                               └────────────┘
```

* 認証方式: 会員登録 or `/api/auth/login` 時に `memberId` Cookie (HttpOnly) を発行し、端末間で共有
* 上限・期限チェックなどはサーバで検証し 400 エラーを返却

## マルチデバイス動作確認フロー
1. スマホで会員登録 (`/register`) → Cookie 発行
2. PC で管理画面 (`/admin/coupons`) からクーポン発行
3. スマホ `/use` でクーポン QR を読み取り → 利用成功
4. PC 管理画面を開いたままでも SWR ポーリングで履歴がリアルタイム反映

## ローカル環境でスマホ実機テスト

```bash
npm install
npm run dev -- --host
```

## 開発サーバを HTTPS で起動 (スマホ実機テスト)

1. mkcert をインストール & ルート証明書を作成
   ```bash
   brew install mkcert
   mkcert -install
   ```
2. `cert/` に自己署名証明書を生成
   ```bash
   mkdir cert && cd cert
   mkcert -key-file server-key.pem -cert-file server-cert.pem <PC_IP>
   # ↑ IP は開発 PC の LAN IP に合わせて変更
   ```
3. ルートに戻り `npm run dev:full` を実行。
   Vite dev サーバが `https://192.168.1.171:5173` で起動し、スマホからアクセス可能になります。

> Vite は `cert/server-key.pem` & `server-cert.pem` が存在する場合のみ https オプションを自動適用するように `vite.config.ts` を設定済みです。

## 技術スタック
* Frontend: React 18 / Vite 5 / TypeScript 5
* UI: Tailwind CSS 3
* State & Data Fetch: SWR 2
* QR 生成: `react-qr-code`
* QR 読取: `@zxing/library` + `jsQR`（並列実行）
* 認証: Cookie (HttpOnly) + React Context
* API サーバ: Express 4 + lowdb (JSON)
* 同時起動ツール: `concurrently`
* 開発 HTTPS: mkcert + Vite built-in HTTPS

## フォルダ構成
```
src/
  components/      汎用 UI (QrScanner)
  pages/           画面 UI
  contexts/        認証コンテキスト
  lib/             SWR フック & API ヘルパー
  types.ts         型定義
server/
  server.js        Express + lowdb API サーバ
  db.json          JSON データストア
cert/              開発用自己署名証明書 (任意)
```

### ブラウザに "Your connection is not private" が表示された場合

自己署名証明書を使用しているため、初回アクセス時に警告ページが表示されることがあります。

| OS / ブラウザ | 対処手順 |
|--------------|-----------|
| **iOS Safari** | 1) 警告画面で「詳細を表示」→「このサイトを開く」<br/>2) ルート CA を端末にインストールしておくと再表示されなくなります。`mkcert -CAROOT` で表示される `rootCA.pem` を AirDrop/メールで送り、設定 > 一般 > プロファイル から信頼を ON にします。 |
| **Android Chrome** | 1) 警告画面で「詳細設定」→「192.168.x.x にアクセスする(安全ではありません)」をタップ<br/>2) または `chrome://flags/#allow-insecure-localhost` を Enabled にし、ローカル HTTP/HTTPS 警告を無視できます。 |
| **Desktop Chrome/Edge** | アドレスバーに `thisisunsafe` とタイプすると一時的にバイパス出来ます（文字入力フィールドは表示されませんが入力を検知します）。 |

開発専用環境でのみ使用し、本番環境では Let's Encrypt など公的 CA の証明書を利用してください。