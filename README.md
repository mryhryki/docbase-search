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
- `S3_BUCKET`: 「1. S3バケットの用意」で作成したS3バケットの名称。
- `DOCBASE_ACCESS_TOKEN`: DocBase のアクセストークン
    - [DocBase APIドキュメント](https://help.docbase.io/posts/45703#%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3) を参照してください 
    - スコープは「読み取り」だけでOKです。「書き込み」は不要です。
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
  - AWS の Lambda, API Gateway, CloudWatch などの設定を行う
- [Amazon S3](https://aws.amazon.com/jp/s3/)
  - DocBase の投稿などのデータを保存する
  - S3 Select を使って、保存されたデータ（`index.jsonl.gz`）から条件に合うデータを検索する

### S3バケット内の主な構成

- `docbase/(DOMAIN)/`: ドメインごとの投稿データを保持するプレフィックスです。
  - `docbase/(DOMAIN)/index.jsonl`: [JSON Lines](https://jsonlines.org/) 形式のファイルで、１行１投稿の単位で保持しています。
  - `docbase/(DOMAIN)/index.jsonl.gz`: 上記 `index.jsonl`のGzip版。読み取りバイト数を減らすため、こちらに S3 Select を実行して検索しています。
- `serverless/`: Serverless Framework のデプロイ時に使用するファイル置き場

### Lambda の役割

- `collect`: 日本時間で 02:00 に定期実行し、DocBase API 経由で全投稿データを取得します。
- `view`: API Gateway 経由でのリクエストを処理し、HTML を返却します。
