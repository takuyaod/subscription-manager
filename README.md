# subscription-manager

個人用サブスクリプション管理 Web アプリ。

## 構成

```
subscription-manager/
  app/          # Next.js プロジェクト
  docs/         # 仕様書
  CLAUDE.md     # AI コーディング設定
```

## 起動手順

```bash
cd app
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開く。

## 主なコマンド

| コマンド | 内容 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバー起動 |
| `npm run lint` | ESLint 実行 |
| `npm run format` | Prettier でフォーマット |

## 技術スタック

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **DB**: Neon Postgres + Drizzle ORM
- **Deploy**: Vercel
- **Auth**: Cloudflare Access

詳細は [docs/spec.md](docs/spec.md) を参照。

## データベース (Neon Postgres)

### ローカル開発のセットアップ

1. [Neon](https://neon.tech) でプロジェクトを作成し、接続文字列を取得する
2. `app/.env.example` を `app/.env.local` にコピーして `DATABASE_URL` を設定する

```bash
cp app/.env.example app/.env.local
# .env.local を編集して DATABASE_URL を設定
```

3. 接続確認

```bash
# 開発サーバーを起動して以下にアクセス
curl http://localhost:3000/api/health
```

### Drizzle コマンド

| コマンド | 内容 |
|---------|------|
| `npx drizzle-kit generate` | マイグレーションファイルの生成 |
| `npx drizzle-kit migrate` | マイグレーションの適用 |
| `npx drizzle-kit studio` | Drizzle Studio（GUI）の起動 |
