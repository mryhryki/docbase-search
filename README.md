# docbase-search
DocBase の投稿を収集し、検索用の画面を提供するプロジェクト

## Deploy

### 1. S3バケットの用意

Serverless Framework と DocBase の情報を置くための S3 バケットを作成します。

### 2. .env の設置

`.env.template` を `.env` にコピーします。

```shell
$ cp .env.template .env
```

`.env` のそれぞれの環境変数の値を適切な値に変更してください

- `SERVERLESS_STAGE`: 環境名。(e.g. `prod`, `dev` など)
- `SERVERLESS_S3_BUCKET`: 「1. S3バケットの用意」で作成したS3バケットの名称。
- `DOCBASE_DOMAIN`: DocBase のドメイン名。`https://XXXXX.docbase.io` なら `XXXXX` の部分。

### 3. デプロイ

AWSアクセスキーを環境変数などに設定した状態で、以下のコマンドを実行します。

```shell
$ npm install    # 初回のみでOK
$ npm run deploy # Serverless Framework でのデプロイ実行
```

## Design

このサービスは、主にAWSを使ってサーバーレスな構成で作られています。

### 使用している主な技術、サービスなど

- [Serverless Framework](https://www.serverless.com/)
  - AWS の Lambda, API Gateway, CloudWatch などの設定を行うため
- [Amazon S3](https://aws.amazon.com/jp/s3/)
  - DocBase の投稿などのデータを保存するため

### S3バケット

- `docbase/(DOMAIN)/`: 
- `serverless/`: Serverless Framework のデプロイ時に使用するファイル置き場

