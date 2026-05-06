# リリース前チェックリスト

## MVP公開範囲

- Googleログイン
- 登録チャンネル取得
- 自動ジャンル分類
- 手動ジャンル変更
- 新着動画
- 高評価動画
- お気に入り
- 視聴済み/未視聴
- モード別ジャンル分類
- 分析
- 設定

## リリース前に必ずやること

- [ ] Google OAuth クライアントシークレットを再発行する
- [x] 本番ドメインを決める: `subscope.org`
- [ ] HTTPSで公開する
- [ ] Google Cloud ConsoleのリダイレクトURIを `https://subscope.org/auth/callback` に変更する
- [ ] OAuth同意画面に本番アプリ名、ロゴ、プライバシーポリシー、利用規約を設定する
- [ ] YouTube Data API v3が有効になっていることを確認する
- [ ] テストユーザーでログイン、チャンネル取得、新着取得、高評価取得を確認する
- [x] `privacy.html` と `terms.html` の問い合わせ先を正式なメールアドレスに差し替える: `rukia5972@gmail.com`
- [ ] `.env` を本番用に設定する
- [ ] `.env`、`data/`、ログファイルを公開リポジトリに含めない
- [ ] 本番公開前に、JSON保存からユーザー別DB保存へ移行する

## OAuth審査で説明すること

- YouTube登録チャンネルと高評価動画をジャンルごとに整理するために `youtube.readonly` を利用する
- 動画投稿、削除、コメント投稿などの書き込み操作は行わない
- パスワードや動画ファイルは取得しない
- ユーザーはGoogleアカウント設定からいつでもアクセス権を解除できる
- アプリ内から保存データ削除とログアウトができる

## ローカル確認

```powershell
C:\Users\daisuke\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe backend\app.py
```

確認URL:

- `http://127.0.0.1:5000/`
- `http://127.0.0.1:5000/privacy.html`
- `http://127.0.0.1:5000/terms.html`

## 本番起動例

```bash
gunicorn wsgi:app
```

## 本番URL設定

Google Cloud Consoleに設定する値:

```text
承認済みの JavaScript 生成元:
https://subscope.org

承認済みのリダイレクト URI:
https://subscope.org/auth/callback
```

本番環境変数:

```text
GOOGLE_REDIRECT_URI=https://subscope.org/auth/callback
APP_BASE_URL=https://subscope.org
CONTACT_EMAIL=rukia5972@gmail.com
```

## 初回リリースではやらないこと

- Chrome拡張機能
- iOS/Androidネイティブアプリ
- 動画ダウンロード
- スクレイピング
- YouTubeへの書き込み操作

