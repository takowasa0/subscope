# ユーチューブらくらく管理

YouTubeの登録チャンネルや高評価動画を、ジャンルごとに整理するMVPアプリです。

## 主な機能

- Google OAuth 2.0ログイン
- YouTube Data API v3による登録チャンネル取得
- 高評価動画取得
- 新着動画取得
- 自動ジャンル分類
- 手動ジャンル変更
- モード別ジャンル分類
- お気に入り
- 視聴済み/未視聴管理
- 分析
- ダークモード
- プライバシーポリシー/利用規約ページ

## ローカル起動

```powershell
C:\Users\daisuke\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m pip install -r requirements.txt
```

`.env.example` を `.env` にコピーして、Google OAuthの値を設定します。

```text
FLASK_SECRET_KEY=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_REDIRECT_URI=http://127.0.0.1:5000/auth/callback
APP_BASE_URL=http://127.0.0.1:5000
CONTACT_EMAIL=rukia5972@gmail.com
```

Flaskを起動します。

```powershell
C:\Users\daisuke\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe backend\app.py
```

ブラウザで開きます。

```text
http://127.0.0.1:5000
```

## Google Cloud設定

1. Google Cloud Consoleでプロジェクトを作成
2. YouTube Data API v3を有効化
3. Google Auth PlatformでOAuth同意画面を設定
4. OAuthクライアントIDを作成
5. アプリケーションの種類は「ウェブアプリケーション」
6. 承認済みのリダイレクトURIに以下を追加

```text
http://127.0.0.1:5000/auth/callback
```

本番では以下に差し替えます。

```text
承認済みの JavaScript 生成元:
https://subscope.org

承認済みのリダイレクト URI:
https://subscope.org/auth/callback
```

## 使用スコープ

```text
openid
email
profile
https://www.googleapis.com/auth/youtube.readonly
```

読み取り専用です。動画投稿、動画削除、コメント投稿、チャンネル操作は行いません。

## リリース前の注意

- Google OAuthクライアントシークレットは必ず再発行する
- `.env` を公開リポジトリに含めない
- `data/` とログファイルを公開リポジトリに含めない
- 本番はHTTPSで公開する
- OAuth同意画面にプライバシーポリシーと利用規約を設定する
- YouTube API Servicesのポリシーに沿って、スクレイピングや動画ダウンロードは行わない
- 今のJSON保存はMVP公開用。本格運用ではユーザー別DB保存へ移行する
- リリース前チェックリストは [docs/release-checklist.md](docs/release-checklist.md) を参照
- Render公開手順は [docs/deploy-render.md](docs/deploy-render.md) を参照

## 本番起動例

```bash
gunicorn wsgi:app
```

## 本番環境変数

```text
FLASK_SECRET_KEY=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_REDIRECT_URI=https://subscope.org/auth/callback
APP_BASE_URL=https://subscope.org
CONTACT_EMAIL=rukia5972@gmail.com
DATA_DIR=/opt/render/project/src/data
```

## 関連ページ

- [プライバシーポリシー](privacy.html)
- [利用規約](terms.html)
- [MVP設計](docs/mvp.md)
- [Google OAuthセットアップ](docs/google-oauth-setup.md)
- [Render公開手順](docs/deploy-render.md)

