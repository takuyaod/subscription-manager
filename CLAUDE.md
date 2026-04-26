# Subscription Manager

個人用サブスクリプション管理Webアプリ。仕様の詳細は [docs/spec.md](docs/spec.md) を参照。

## Tech Stack

- **Framework**: Next.js (App Router) / React
- **DB**: Neon Postgres (Vercel統合) — 接続は `DATABASE_URL` 環境変数
- **ORM**: Drizzle または Prisma（未確定）
- **Deploy**: Vercel
- **Auth**: Cloudflare Access (Zero Trust) — アプリ側に認証コード不要

## 重要な実装ルール

**userId**: 全テーブルに持たせる。Cloudflare Access JWT (`CF-Access-JWT-Assertion` ヘッダー) の `sub` クレームを使用。サーバーサイドでは `getUserId()` ユーティリティで取得し、全クエリの WHERE 条件に含める。ローカル開発時はダミー固定値を使用。

**データ削除禁止**:
- サブスク解約 → `status: "cancelled"` で保持
- 住所削除 → `isActive: false` で保持

## データモデル概要

`PaymentMethod` / `Subscription` / `Address` の3テーブル。詳細なフィールド定義は [docs/spec.md](docs/spec.md) のデータモデルセクションを参照。
