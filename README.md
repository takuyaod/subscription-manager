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
