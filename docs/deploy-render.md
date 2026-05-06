# Renderで本番公開する手順

このアプリを `https://subscope.org` で開けるようにするための手順です。

## 本番設定

- 本番ドメイン: `subscope.org`
- 本番URL: `https://subscope.org`
- サポートメール: `rukia5972@gmail.com`
- OAuthリダイレクトURI: `https://subscope.org/auth/callback`

## 1. GitHubにコードを置く

RenderはGitHub/GitLab/Bitbucketのリポジトリと連携してデプロイします。

公開前に、以下は絶対にGitへ含めないでください。

- `.env`
- `data/`
- `*.log`
- Google OAuthの `client_secret`

このリポジトリでは `.gitignore` で除外済みです。

## 2. RenderでWeb Serviceを作る

Render Dashboardで以下を選びます。

```text
New
Web Service
Build and deploy from a Git repository
```

設定値は以下です。

```text
Language:
Python 3

Build Command:
pip install -r requirements.txt

Start Command:
gunicorn wsgi:app --bind 0.0.0.0:$PORT
```

`render.yaml` を使う場合は、Blueprintとして作成してもOKです。

## 3. 環境変数を設定する

RenderのEnvironmentに以下を設定します。

```text
FLASK_SECRET_KEY=長いランダム文字列
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_REDIRECT_URI=https://subscope.org/auth/callback
APP_BASE_URL=https://subscope.org
CONTACT_EMAIL=rukia5972@gmail.com
DATA_DIR=/opt/render/project/src/data
```

`FLASK_SECRET_KEY` はRenderの自動生成でもOKです。

## 4. 永続ディスクを設定する

現在のMVPはJSONファイル保存です。本番DBへ移行するまでの暫定対応として、RenderのPersistent Diskを使います。

```text
Mount Path:
/opt/render/project/src/data

Size:
1GB
```

注意: 本格リリース後にユーザー数が増える場合は、MySQLやPostgreSQLなどのDBへ移行してください。

## 5. Custom Domainを追加する

Renderの対象サービスで以下を開きます。

```text
Settings
Custom Domains
Add Custom Domain
subscope.org
```

Renderが表示するDNSレコードを、ドメイン管理画面に設定します。

よくある設定は以下です。

```text
subscope.org -> Renderが指定するA/ALIAS/ANAME相当
www.subscope.org -> Renderが指定するCNAME
```

正確な値はRender画面に出たものを優先してください。DNS反映には数分から数時間かかることがあります。

## 6. Google OAuthを本番URLに変更する

Google Cloud ConsoleのOAuthクライアントに追加します。

```text
承認済みのJavaScript生成元:
https://subscope.org

承認済みのリダイレクトURI:
https://subscope.org/auth/callback
```

ローカルでも使う場合は、以下も残します。

```text
http://127.0.0.1:5000
http://127.0.0.1:5000/auth/callback
```

## 7. 本番確認

以下が開けることを確認します。

```text
https://subscope.org/
https://subscope.org/privacy.html
https://subscope.org/terms.html
https://subscope.org/api/me
```

ログイン確認は以下です。

1. `https://subscope.org/` を開く
2. GoogleでYouTube連携
3. 同意画面を通過
4. アプリに戻る
5. チャンネル、新着、高評価が表示されることを確認

## 参考

- Render Flask公式ドキュメント: https://render.com/docs/deploy-flask
- Render Custom Domains公式ドキュメント: https://render.com/docs/custom-domains
- Render Persistent Disks公式ドキュメント: https://render.com/docs/disks
