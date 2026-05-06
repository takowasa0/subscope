# Google OAuth / YouTube Data API セットアップ

## 目的

ユーチューブらくらく管理からGoogleログインを行い、YouTube Data API v3で登録チャンネル、高評価動画、新着動画の情報を取得できるようにします。

## 本番情報

```text
本番ドメイン:
https://subscope.org

問い合わせメール:
rukia5972@gmail.com

OAuthリダイレクトURI:
https://subscope.org/auth/callback
```

## 1. Google Cloud Consoleを開く

```text
https://console.cloud.google.com/
```

## 2. プロジェクトを作成

プロジェクト名の例:

```text
SubScope
```

## 3. YouTube Data API v3を有効化

1. APIとサービス
2. ライブラリ
3. `YouTube Data API v3` を検索
4. 有効にする

## 4. OAuth同意画面を設定

Google Auth PlatformでOAuth同意画面を設定します。

推奨設定:

```text
アプリ名:
ユーチューブらくらく管理

ユーザーサポートメール:
rukia5972@gmail.com

アプリのホームページ:
https://subscope.org

プライバシーポリシー:
https://subscope.org/privacy.html

利用規約:
https://subscope.org/terms.html

デベロッパーの連絡先:
rukia5972@gmail.com
```

## 5. スコープを追加

```text
openid
email
profile
https://www.googleapis.com/auth/youtube.readonly
```

`youtube.readonly` は読み取り専用です。動画投稿、削除、コメント投稿などの書き込み操作は行いません。

## 6. OAuthクライアントIDを作成

アプリケーションの種類:

```text
ウェブアプリケーション
```

名前:

```text
SubScope Web
```

承認済みのJavaScript生成元:

```text
https://subscope.org
```

承認済みのリダイレクトURI:

```text
https://subscope.org/auth/callback
```

ローカル確認も行う場合は追加:

```text
http://127.0.0.1:5000
http://127.0.0.1:5000/auth/callback
```

## 7. `.env` に設定

ローカル:

```text
FLASK_SECRET_KEY=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_REDIRECT_URI=http://127.0.0.1:5000/auth/callback
APP_BASE_URL=http://127.0.0.1:5000
CONTACT_EMAIL=rukia5972@gmail.com
```

本番:

```text
FLASK_SECRET_KEY=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_REDIRECT_URI=https://subscope.org/auth/callback
APP_BASE_URL=https://subscope.org
CONTACT_EMAIL=rukia5972@gmail.com
```

## 8. OAuth審査で説明する内容

- YouTube登録チャンネルと高評価動画をジャンルごとに整理するためにYouTube Data APIを利用する
- 利用するYouTubeスコープは読み取り専用
- 動画投稿、削除、コメント投稿などの書き込み操作は行わない
- YouTubeのパスワードや動画ファイルは取得しない
- ユーザーはGoogleアカウント設定からいつでもアクセス権を解除できる
- アプリ内にプライバシーポリシー、利用規約、データ削除導線がある

## 注意

- チャットや公開場所に貼ったOAuthクライアントシークレットは必ず再発行する
- `.env` は公開リポジトリに含めない
- 本番はHTTPS必須
- 初回公開前に、JSON保存からユーザー別DB保存へ移行する

