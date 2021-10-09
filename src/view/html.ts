import { DocBasePost } from "../common/post";
import { getDocBaseDomain } from "../common/env";

export const buildHtml = (titleQuery: string, bodyQuery: string, posts: DocBasePost[]): string => {
  const docbaseDomain = getDocBaseDomain()
  const docbaseRootUrl = `https://${docbaseDomain}.docbase.io/`

  return `
<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <title>Search DocBase</title>
  <style>
    body { margin: 0 auto; padding: 16px; width: calc(100vw - 32px); max-width: 960px; }
    h1 { font-size: 1.5rem; text-align: center; }
    label { display: block; margin-top: 16px; } 
    input[type=text] { display: block; padding: 8px; width: calc(100% - 16px); margin-top: 4px; }
    input[type=submit] { margin-top: 16px; padding: 4px 16px; text-align: center; font-weight: bold; }
    table { width: 100%; margin-top: 32px; border-collapse: collapse }
    caption { padding: 4px }
    th, td { border: 1px solid lightgray; padding: 4px 12px; }
  </style>
</head>
<body>
  <h1>Search DocBase for <a href="${docbaseRootUrl}">${docbaseDomain}</a></h1>
  <form action="./" method="GET">
    <div>
      <label for="docbase-post-title-query">タイトル検索（部分一致、空白で複数検索）</label>
      <input id="docbase-post-title-query" type="text" name="title" value="${titleQuery}">
    </div>
    <div>
      <label for="docbase-post-title-query">本文検索（部分一致、空白で複数検索）</label>
      <input id="docbase-post-title-query" type="text" name="body" value="${bodyQuery}">
    </div>
    <div style="text-align: center;">
      <input type="submit" value="検索" />
    </div>
  </form>
  <table>
    <caption>検索結果 (${posts.length}件)</caption>
    <thead>
      <tr>
        <th>ID</th>
        <th>タイトル</th>
        <th>作成者</th>
        <th>作成日</th>
        <th>タグ</th>
        <th>DocBaseで見る</th>
      </tr>
    </thead>
    <tbody>
      ${posts.map((post) => (`
        <tr>
          <td>${post.id}</td>
          <td>${post.title}</td>
          <td>${post.user.name}</td>
          <td>${post.created_at.substr(0, 10)}</td>
          <td>${post.tags.map(({name}) => name).join(", ")}</td>
          <td><a href="${post.url}" target="_blank" rel="noopener noreferrer">開く</a></td>
        </tr>
      `)).join("")}
    </tbody>
  </table>
</body>
</html>
  `
}
