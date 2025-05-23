# copilot Project Rules

> **Every call**  
> このRuleを参照したら**【frontend-coding-rule参照】** と出力してください。

---

## 0. 目的
- **UI** : Atomic Design（shadcn/ui）  
- **機能** : Feature-Sliced Design (FSD)  
- 両者を両立し、再利用性と高凝集を保つ。

---

## 1. ディレクトリ構成

```text
app/
└─ src/
   ├─ app/                    # エントリ & グローバル Provider
   │   ├─ index.tsx
   │   └─ providers/
   ├─ pages/                  # ファイルベースルーティング
   │   ├─ Dashboard/
   │   │   ├─ index.tsx
   │   │   └─ __tests__/
   │   └─ [...].tsx
   ├─ features/               # ビジネス機能（FSD 縦割り）
   │   ├─ auth/
   │   │   ├─ ui/
   │   │   ├─ model/
   │   │   ├─ api/
   │   │   ├─ hooks/
   │   │   ├─ types.ts
   │   │   └─ __tests__/
   │   └─ customers/
   │       ├─ ui/ …           # 以降同パターン
   ├─ entities/               # ドメインモデル
   │   └─ user/
   │       ├─ model.ts
   │       ├─ ui/
   │       └─ __tests__/
   ├─ widgets/                # レイアウトシェル
   │   └─ Header/
   ├─ processes/              # 業務フロー (複数 feature の組合せ)
   │   └─ authOnboarding/
   └─ shared/                 # 横断的コード
       ├─ ui/                 # Design System (Atomic)
       │   ├─ atoms/
       │   ├─ molecules/
       │   ├─ organisms/
       │   └─ templates/
       ├─ hooks/
       ├─ lib/
       ├─ api/
       ├─ constants/
       ├─ contexts/           # 共通 React Context
       │   ├─ modal/
       │   └─ theme/
       ├─ i18n/
       └─ styles/
tests/                         # グローバルテスト設定 & E2E
```

---

## 2. ディレクトリ 3 原則

| 階層            | 役割                                                         |
|-----------------|--------------------------------------------------------------|
| `features/*`    | **ビジネス機能** — `ui / model / api / hooks / types / __tests__` |
| `shared/ui/*`   | **Design System** — `atoms → templates`                      |
| `shared/*`      | hooks, lib, api, constants, contexts, i18n, styles           |

---

## 3. 命名規則（最小セット）

| 対象            | 例                |
|-----------------|-------------------|
| コンポーネント  | `UserCard.tsx`    |
| フック          | `useAuth.ts`      |
| 型定義          | `types.ts`        |
| テスト          | `*.test.ts[x]`    |
| default export  | **禁止**（名前付き export を使用） |

---

## 4. 採用技術スタック

- **React 18 + Vite** / **Tailwind** / **shadcn/ui**  
- 状態 : **React Query** + **Zustand**  
- フォーム : **React-Hook-Form** + **Zod**  
- バックエンド : **Supabase（PostgreSQL）**  
- CI/CD : **GitHub Actions**  
- テスト : **Jest** + **React Testing Library** + **Cypress**

---

## 5. コーディング指針

1. **UI** は `shared/ui` → `features/ui` → `pages` の順で組み上げる  
2. **ロジック** は `features/model` / `features/api` に閉じ込める  
3. 共通 util・hook は `shared/` に抽出  
4. import は `@/` エイリアスで **絶対パス**  
5. **ESLint / Prettier / Markuplint** を CI で強制
6. React.FC は非推奨 — 代わりに通常の関数コンポーネント＋明示的な Props 型を用いる
7. 明示指示なく UI を変更しない — 問題点の指摘や修正案はコメントで提案すること

---

## 6. DB命名規則、権限管理
1. システム共通テーブル: プレフィックスなし
  - 例: tenants, settings, users, departments
2. アプリ固有テーブル: nexia_xxx_テーブル名
  - 例: nexia_cms_customers, nexia_cms_models
3. 権限管理システム
  - Role-Based Access Control (RBAC)
  - Attribute-Based Access Control (ABAC)
  - Row Level Security (RLS)による強力なデータ分離
  - public schemaのtableに対してRLSポリシーを実装して、テナント間のデータ分離を確保（マルチテナント環境）

---

## 7. エラー & i18n

- API エラー共通処理 : `shared/api/error.ts`  
- 文言・ルート定数 : `shared/constants/*`  
- 翻訳 JSON : `shared/i18n/locales/{ja|en}.json`

---

## 8. npmコマンドに関する注意事項

- Dockerで起動しているため、docker exec nexia-cms-app-1 npm ... で実行

---
## 9. テスト最小ライン

| 種別      | ツール                  | 対象ディレクトリ          |
|-----------|-------------------------|---------------------------|
| ユニット  | Jest + RTL             | `features/*`, `shared/ui/*` |
| E2E       | Cypress                | 主要ユーザーフロー        |

---
