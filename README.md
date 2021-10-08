# docbase-search
DocBase の投稿を収集し、検索用の画面を提供するプロジェクト

## Deploy

### 1. S3バケットの用意

### 2. serverless.yml の修正

```diff
  custom:
-    s3Bucket: "b24814e6-e8b8-48d0-b1d6-2fe41a11ed20"
+    s3Bucket: "YOUR-BUCKET-NAME"
```
