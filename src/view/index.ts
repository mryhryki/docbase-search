import { buildHtml } from "./html";
import { DocBasePost } from "../common/post";
import { selectS3Object } from "../common/s3";
import { verifyBasicAuth } from "./basic_auth";

const splitChars = new RegExp("[ ]+");
const splitQuery = (query: string): string[] =>
  query.trim().normalize().split(splitChars).map((s) => s.trim()).filter((s) => s !== "");

export const handler = async (event: any): Promise<any> => {
  if (!verifyBasicAuth(event.headers.authorization)) {
    return {
      statusCode: 401,
      headers: {
        "Content-Type": "text/html;charset=utf-8",
        "WWW-Authenticate": "Basic realm=\"SECRET AREA\"",
      },
      body: "認証が必要です。",
    };
  }

  const query = event.queryStringParameters ?? {};
  const titleQuery: string = (query.title ?? "").trim();
  const bodyQuery: string = (query.body ?? "").trim();

  let posts: DocBasePost[] = [];
  if (titleQuery !== "" || bodyQuery !== "") {
    const whereQueries: string[] = [];
    if (titleQuery !== "") {
      splitQuery(titleQuery).forEach((tq) => {
        whereQueries.push(`s.title LIKE '%${tq}%'`);
      });
    }
    if (bodyQuery !== "") {
      splitQuery(bodyQuery).forEach((bq) => {
        whereQueries.push(`s.body LIKE '%${bq}%'`);
      });
    }
    posts = await selectS3Object(`Select s.* from S3Object s WHERE ${whereQueries.join(" AND ")}`);
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html;charset=utf-8",
    },
    body: buildHtml(titleQuery, bodyQuery, posts),
    isBase64Encoded: false,
  };
};
