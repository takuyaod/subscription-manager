# サブスク管理アプリ 仕様まとめ

## 概要

個人用のサブスクリプション管理Webアプリ。支払い元（カード・口座・デジタルウォレット等）と配送先住所を一元管理する。

---

## インフラ・技術スタック

| 項目 | 選定 |
|---|---|
| フレームワーク | Next.js (App Router) / React |
| データベース | Neon Postgres（Vercel統合） |
| ORM | Drizzle |
| デプロイ | Vercel |
| ドメイン管理 | Cloudflare |
| 認証 | Cloudflare Access（Zero Trust） |

### 認証方針

- Cloudflare Access でアプリの前段に認証を配置
- アプリ側に認証コードは不要
- 個人用のため自分の GitHub アカウントのみ許可（GitHub OAuth）
- 無料枠（最大50ユーザー）で対応可能

### データベース方針

- Vercel の Storage タブから Neon Postgres を作成
- 接続情報（`DATABASE_URL`）は Vercel が自動で環境変数にセット
- 無料枠: 0.5GB、プロジェクト停止なし

---

## データモデル

### ユーザー識別（userId）

> **[追記]** 将来的な拡張やデータの誤混入防止のため、全テーブルに `userId` を持たせる。
>
> - Cloudflare Access が付与する JWT（`CF-Access-JWT-Assertion` ヘッダー）の `sub` クレーム（UUID）を識別子として使用する
> - User テーブルは作成しない（認証は Cloudflare Access に委譲するため）
> - サーバーサイドでは `getUserId()` のようなユーティリティでヘッダーから `sub` を取り出し、全クエリの WHERE 条件に使う
> - ローカル開発時は Cloudflare Access を通らないため、`userId` をダミー固定値にするか開発環境用の分岐を設ける
> - CF Access の公開鍵は `https://<your-team>.cloudflareaccess.com/cdn-cgi/access/certs` から取得する

### PaymentMethod（支払い元）

```ts
PaymentMethod {
  id
  userId         // [追記] CF Access JWT の sub クレーム。全クエリの絞り込みに使用
  nickname       // "楽天カード", "Apple ID", "メイン口座", "PiTaPa" など
  type           // "credit" | "debit" | "bank" | "apple" | "google" | "linked" | "postpay" | "other"
                 //   credit   : クレジットカード
                 //   debit    : デビットカード
                 //   bank     : 銀行口座
                 //   apple    : Apple ID
                 //   google   : Google Pay
                 //   linked   : 付帯カード（ETCカード・EX-ICなど、親カードに紐付くもの）
                 //   postpay  : ポストペイ（PiTaPaなど後払い式）
                 //   other    : その他
  parentId?      // PaymentMethod.id（linked の場合、親カードを参照）
  bankAccountId? // PaymentMethod.id（credit / debit / postpay の引き落とし口座、type: "bank" を参照）
  expiryYear?    // credit / postpay / linked のときのみ使用
                 // linked の場合: 独自の有効期限があれば設定、なければ null（表示時は親カードの値を参照）
  expiryMonth?
  memo?
  createdAt
}
```

### Subscription（サブスクリプション）

```ts
Subscription {
  id
  userId           // [追記] CF Access JWT の sub クレーム。全クエリの絞り込みに使用
  name             // "Netflix", "BASE FOOD", "1Password" など
  amount
  currency         // デフォルト "JPY"
  cycle            // "monthly" | "yearly" | "once"
  cycleInterval    // number, default 1
                   // cycle: "monthly" + cycleInterval: 1 → 毎月
                   // cycle: "yearly"  + cycleInterval: 1 → 毎年
                   // cycle: "yearly"  + cycleInterval: 3 → 3年ごと（3年一括払いなど）
                   // cycle: "once" の場合は無視（不使用）
  billingDay       // 毎月何日（または毎年何月何日）。cycle: "once" の場合は null
  paymentMethodId  // PaymentMethod.id
  addressId?       // Address.id（物理配送がある場合のみ）
  isPhysical       // 物理配送の有無
  status           // "active" | "cancelled"
  startDate
  expiresAt?       // cycle: "once" のときのみ使用
                   // ライセンス・サービスの有効期限（期限なし買い切りは null）
  cancelledAt?
  memo?
  createdAt
}
```

### Address（住所）

```ts
Address {
  id
  userId         // [追記] CF Access JWT の sub クレーム。全クエリの絞り込みに使用
  label          // "自宅", "実家" など
  postalCode
  prefecture
  city
  street
  building?
  isActive       // false = 過去の住所（削除はしない）
  createdAt
}
```

### フィールド設計の補足

- `PaymentMethod.expiryYear/Month` はカード自体の有効期限（credit / postpay / linked が対象）
- `Subscription.cycle` + `Subscription.cycleInterval` でサブスクの請求周期を表現
  - この2つは別の概念のため、カードの有効期限とは分けて持つ
- `PaymentMethod.parentId` は付帯カードの親カードへの参照（linked のみ）
- `PaymentMethod.bankAccountId` は引き落とし口座への参照（credit / debit / postpay のみ）
- 関係の例: `三菱UFJ口座（bank）← 楽天カード（credit, bankAccountId）← ETCカード（linked, parentId）`

### cycle / cycleInterval の組み合わせ例

| サービス例 | cycle | cycleInterval | expiresAt |
|---|---|---|---|
| Netflix | monthly | 1 | null |
| iCloud+ | yearly | 1 | null |
| 1Password SourceNext 3年版 | yearly | 3 | null |
| 買い切りライセンス（期限あり） | once | - | 2027-03-31 |
| 買い切りライセンス（期限なし） | once | - | null |

---

## 機能要件

### ダッシュボード

- **月額換算合計** および **年間換算合計** の表示
  - 各サブスクを月額に正規化して合計する
  - 月額換算の計算式:
    - `cycle: "monthly"` → `amount ÷ cycleInterval`
    - `cycle: "yearly"`  → `amount ÷ (cycleInterval × 12)`
    - `cycle: "once"`    → 月額集計の対象外
  - 年間換算 = 月額合計 × 12
- **買い切り・一括払い一覧**（`cycle: "once"` のもの）を月額集計とは別セクションで表示
- アラート表示（ブラウザを開いたタイミングで確認できればOK）
  - カード有効期限が30日以内（credit / postpay / linked が対象）
  - サービス有効期限（`expiresAt`）が30日以内
  - 住所変更が未完了のサブスクあり

### サブスク管理

- CRUD
- 物理配送があるサブスクには住所を紐付け
- 解約済みサブスクは `status: cancelled` で履歴として保持（削除しない）

### 支払い元管理

- CRUD
- 対応する支払い元の種別: クレカ / デビット / 銀行口座 / Apple ID / Google Pay / 付帯カード / ポストペイ / その他
- 付帯カード（linked）は親カードに紐付く（ETCカード・EX-ICなど）。種別の区別は `nickname` / `memo` で管理
- 付帯カードの有効期限: 独自の期限があれば設定、なければ親カードの値を参照
- クレカ・デビット・ポストペイは引き落とし口座と紐付け可能（`bankAccountId` で銀行口座を参照）
- 銀行口座の詳細画面で「この口座から引き落とされるカード一覧」を表示
- 有効期限フィールドを持つ種別: credit / postpay / linked
- 有効期限アラートの対象: credit / postpay / linked

### 住所管理

- CRUD
- 住所は削除せず `isActive: false` で無効化（履歴保持）
- 引っ越しフロー
  1. 新住所を登録
  2. 旧住所を `isActive: false` にする
  3. 旧住所に紐付いているサブスク一覧を「変更未完了」として表示
  4. ユーザーが各サブスクの `addressId` を新住所に更新
  5. 全件更新完了で変更漏れなし状態に

---

## 画面構成

- ダッシュボード
- サブスク一覧 / 詳細・編集
- 支払い元一覧 / 詳細・編集
- 住所一覧 / 詳細・編集（引っ越しフロー含む）

---

## 非機能要件・制約

- 個人用途（自分のみ使用）
- カード番号などの機密情報は保持しない
- 通知はブラウザを開いたタイミングのアラート表示のみ（Push通知・メール通知は対象外）
- 複数通貨は将来対応とし、当初は JPY のみ