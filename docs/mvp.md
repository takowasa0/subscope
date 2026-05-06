# SubScope MVP設計

## MVPの目的

YouTubeの登録チャンネルが増えたユーザーに対して、登録チャンネルを自動取得し、ジャンルごとに整理できる状態を最短で作る。

## MVPで作る範囲

1. Googleログイン
2. YouTubeアカウント連携
3. 登録チャンネル取得
4. チャンネル名・説明文による自動ジャンル分類
5. ジャンル別チャンネル一覧
6. ジャンルの手動変更
7. YouTubeへの遷移

## MVPでは後回しにする範囲

1. 視聴履歴の取得
2. 高度なAI分類
3. プッシュ通知
4. iOS / Androidネイティブ化
5. 課金
6. チーム共有

## 使用するGoogle / YouTube API

### OAuth

Google OAuth 2.0のWebサーバー向け認可コードフローを使う。

### Scope

```text
openid
email
profile
https://www.googleapis.com/auth/youtube.readonly
```

`youtube.readonly` は、ユーザーのYouTube情報を読み取るためのスコープ。MVPでは書き込み権限を要求しない。

### YouTube Data API

登録チャンネル取得には `subscriptions.list` を使う。

```text
GET https://www.googleapis.com/youtube/v3/subscriptions
part=snippet,contentDetails
mine=true
maxResults=50
```

`nextPageToken` がある場合はページングして全件取得する。

## 画面フロー

1. 初回アクセス
2. GoogleでYouTube連携
3. Google OAuth同意画面
4. Flask `/auth/callback`
5. アクセストークン取得
6. YouTube Data APIで登録チャンネル取得
7. チャンネル一覧へ表示

## データ項目

### Channel

```json
{
  "id": "YouTubeチャンネルID",
  "youtubeChannelId": "YouTubeチャンネルID",
  "name": "チャンネル名",
  "description": "説明文",
  "thumbnailUrl": "サムネイルURL",
  "genre": "it",
  "confidence": 92,
  "tags": [],
  "memo": "",
  "favorite": false,
  "lastViewed": null,
  "clicks": 0,
  "minutes": 0
}
```

## ジャンル分類

MVPではキーワードベースで分類する。

分類に使う情報:

1. チャンネル名
2. チャンネル説明文
3. タグ

判定例:

| ジャンル | キーワード例 |
| --- | --- |
| IT | tech, ai, code, python, react, 開発 |
| NBA | nba, basket, lakers, warriors |
| 音楽 | music, piano, guitar, lofi |
| 学習 | study, english, 勉強, 講座, 資格 |
| 料理 | cook, recipe, 料理, レシピ |
| ニュース | news, 経済, 政治, 速報 |
| 暮らし | vlog, 暮らし, 旅行, 生活 |

手動変更されたジャンルは信頼度 `100%` として扱う。

## セキュリティ方針

1. YouTubeパスワードは保存しない
2. OAuthの `state` を使ってCSRF対策する
3. 本番はHTTPS必須
4. 必要最小限のスコープだけ要求する
5. アクセストークン、リフレッシュトークンは本番DBでは暗号化して保存する
6. `.env` やクライアントシークレットはGit管理しない
7. Google OAuth審査に備えてプライバシーポリシーとデータ削除導線を用意する

## ローカル起動

1. `.env.example` を `.env` にコピー
2. Google Cloud ConsoleでOAuthクライアントを作成
3. 承認済みリダイレクトURIに追加

```text
http://127.0.0.1:5000/auth/callback
```

4. 依存関係をインストール

```bash
pip install -r requirements.txt
```

5. Flaskを起動

```bash
python backend/app.py
```

6. ブラウザで開く

```text
http://127.0.0.1:5000
```
