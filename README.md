# ローカル開発手順

> **対象構成**  
> - Supabase CLI + Docker（Postgres / Studio などをローカル起動）  
> - React + Vite フロントエンドを Docker コンテナで実行  
> - Supabase スタックとフロント用コンテナを同じ Docker ネットワークで接続

---

## 0. 事前準備

| ツール            | 最低バージョン | インストール例                                   |
|-------------------|---------------|--------------------------------------------------|
| Docker Desktop    | 20.10 以上    | <https://docs.docker.com/get-docker/>            |
| Supabase CLI      | 1.168 以上    | `brew install supabase/tap/supabase`             |
---

## 1. リポジトリ取得
```bash
git clone https://github.com/your-org/your-repo.git
cd your-repo
```

## 2. Supabase 初期化 & 起動([SupabaseCLI](https://supabase.com/docs/guides/local-development/cli/getting-started) Install)

```bash
# プロジェクト直下で
supabase init       # supabase/config.toml と migrations/ が生成

# 既存 SQL を migrations/ に配置してから…
supabase start      # Postgres・Kong・Studio などを Docker で起動
```

ターミナルには以下のような情報が表示されます（抜粋）:

```bash
supabase start                                      
WARNING: analytics requires mounting default docker socket: /var/run/docker.sock
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
  S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: xxxxxxxxxxxxxxxxx
service_role key: xxxxxxxxxxxxxxxxx
   S3 Access Key: 625729a08b95bf1b7ff351a663f3a23c
   S3 Secret Key: 850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907
       S3 Region: local
```

## 3. 共有 Docker ネットワーク作成
```bash
docker network create supabase_network
```

Supabase スタックをそのネットワークで再起動:
```bash
export SUPABASE_DOCKER_NETWORK_NAME=supabase_network
supabase stop
supabase start
```

## 4. 環境変数を設定
プロジェクト直下に .env.local を作成:
```bash
touch .env.local
```

```dotenv
# Supabase
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxx
        
```

## 6. フロントを起動
```bash
docker compose up --build
```

ブラウザで http://localhost:5173 を開く