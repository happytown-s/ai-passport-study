# AIパスポート勉強アプリ - マネタイズ・マルチプラットフォーム化プラン（2026-05-02）

## 構成方針
- **1コードベース + Capacitor** でWeb/Android/iOS出し分け
- Web版は集客・体験版、アプリ版が本命の課金導線
- 現在の React + TypeScript + Vite 構成そのまま活用

## ディレクトリ構成案
```
src/
  core/              # 共通ロジック
  data/              # 問題・テキスト
  features/
    drill/
    exam/
    textbook/
    review/
    bookmark/
  billing/
    billing.web.ts       # Stripe / Gumroad / 無料デモ
    billing.ios.ts       # Apple In-App Purchase
    billing.android.ts   # Google Play Billing
  entitlement/
    accessControl.ts     # 共通ロック判定
```

## プラットフォーム別出し分け
| プラットフォーム | 配布 | 課金 | env |
|-----------------|------|------|-----|
| Web/PWA版 | Vercel | Stripe / Gumroad / 無料デモ | `.env.web` |
| Android版 | Google Play | Google Play Billing | `.env.android` |
| iOS版 | App Store | Apple In-App Purchase | `.env.ios` |

### npm scripts案
```json
{
  "scripts": {
    "build": "tsc -b && vite build",
    "build:web": "vite build --mode web",
    "build:android": "vite build --mode android && npx cap sync android",
    "build:ios": "vite build --mode ios && npx cap sync ios",
    "open:android": "npx cap open android",
    "open:ios": "npx cap open ios"
  }
}
```

### env分け
```
.env.web:      VITE_APP_PLATFORM=web, VITE_BILLING_PROVIDER=external
.env.android:  VITE_APP_PLATFORM=android, VITE_BILLING_PROVIDER=google_play
.env.ios:      VITE_APP_PLATFORM=ios, VITE_BILLING_PROVIDER=app_store
```

## 課金設計
### 重要：無料版/有料版を「別アプリ」にしない
- 1アプリ内でアプリ内課金で完全版アンロックがベスト
- Apple・Googleともに別Bundle IDでの配布は避けるよう推奨
- 審査・導線・レビューが安定する

### コンテンツ構成
| | 無料版 | 有料アンロック |
|--|--------|--------------|
| カテゴリ | 2カテゴリ（ai_basics, prompt_engineering） | 全7カテゴリ |
| 模試 | ✗ | 60問模試 |
| 復習 | 有料カテゴリ分のみ | 全復習 |
| Textbook | 有料カテゴリ分のみ | 全Textbook |
| ブックマーク | ○ | ○ |
| 価格 | 無料 | 買い切り 980円〜1,480円 |

### 課金ロジック共通化
```typescript
export const FREE_CATEGORY_IDS = ['ai_basics', 'prompt_engineering'];

export function canAccessCategory(categoryId: string, isPremium: boolean) {
  return isPremium || FREE_CATEGORY_IDS.includes(categoryId);
}

export function canAccessExam(isPremium: boolean) {
  return isPremium;
}

export type Entitlement = {
  isPremium: boolean;
  source: 'free' | 'web' | 'app_store' | 'google_play';
};
```
- 画面側に `isIOS` / `isAndroid` を散らばらせない
- 課金状態だけプラットフォーム別に取得、制限ロジックは共通

## 実装手順
1. **Capacitor導入** — `npx cap add android / ios`、`npx cap sync`
2. **Android/iOSでWeb版が動くか確認**
3. **FREE_CATEGORY_IDS + ロックUI実装**
4. **模試を有料ロック**
5. **Android: Google Play Billing 実装**
6. **iOS: In-App Purchase 実装**
7. **（オプション）有料コンテンツ保護のためAPI配信へ移行**

## モバイル版の強み
- スキマ時間で解く
- 間違いだけ復習
- ブックマークで直前確認
- 本番60問模試で仕上げ

## 現在のアプリ状態
- 全210問・7カテゴリ・模試・復習・用語集
- 全トピックに4セクション構成インフォグラフィック完備（2026-05-02完了）
- プロジェクト: `ai-passport-study/`
- リポジトリ: `https://github.com/happytown-s/ai-passport-study`
