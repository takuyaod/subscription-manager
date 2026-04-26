# Subscription Manager

個人用サブスクリプション管理Webアプリ。仕様の詳細は [docs/spec.md](docs/spec.md) を参照。

## Tech Stack

- **Framework**: Next.js (App Router) / React
- **DB**: Neon Postgres (Vercel統合) — 接続は `DATABASE_URL` 環境変数
- **ORM**: Drizzle ORM（Neon serverless driver と組み合わせて使用）
- **Deploy**: Vercel
- **Auth**: Cloudflare Access (Zero Trust) — アプリ側に認証コード不要

## 重要な実装ルール

**userId**: 全テーブルに持たせる。Cloudflare Access JWT (`CF-Access-JWT-Assertion` ヘッダー) の `sub` クレームを使用。サーバーサイドでは `getUserId()` ユーティリティで取得し、全クエリの WHERE 条件に含める。ローカル開発時はダミー固定値を使用。

**データ削除禁止**:
- サブスク解約 → `status: "cancelled"` で保持
- 住所削除 → `isActive: false` で保持

## データモデル概要

`PaymentMethod` / `Subscription` / `Address` の3テーブル。詳細なフィールド定義は [docs/spec.md](docs/spec.md) のデータモデルセクションを参照。

## ディレクトリ構成

[bulletproof-react](https://github.com/alan2207/bulletproof-react) の features ベース構成に従う。

```
src/
├── app/                  # Next.js App Router (pages・layouts のみ)
├── components/           # アプリ全体で共有するUIコンポーネント
├── hooks/                # アプリ全体で共有するカスタムフック
├── lib/                  # 外部ライブラリのセットアップ・DB クライアント等
├── types/                # アプリ全体の共通型定義
├── utils/                # 汎用ユーティリティ関数
└── features/             # 機能単位のモジュール
    └── [feature-name]/
        ├── api/          # APIリクエスト・Server Actions
        ├── components/   # フィーチャースコープのコンポーネント
        ├── hooks/        # フィーチャースコープのフック
        ├── stores/       # フィーチャーの状態管理
        ├── types/        # フィーチャーの型定義
        └── utils/        # フィーチャー固有のユーティリティ
```

**ルール**:
- 各フィーチャーは自己完結させ、フィーチャー間の直接 import は禁止（アプリレベルで合成する）
- フォルダは必要なものだけ作成する（全サブフォルダ必須ではない）
- barrel ファイル（index.ts）は使わず、各ファイルから直接 import する
