import { S3 } from "aws-sdk";
import { DocBasePost } from "./post";
import { getDocBaseDomain, getS3Bucket } from "./env";

export const s3 = new S3({ apiVersion: "2006-03-01" });
const S3Bucket: string = getS3Bucket();

export const selectS3Object = (expression: string): Promise<DocBasePost[]> => new Promise((resolve, reject) => {
  s3.selectObjectContent({
    Bucket: S3Bucket,
    Key: `docbase/${getDocBaseDomain()}/index.jsonl`,
    Expression: expression,
    ExpressionType: "SQL",
    InputSerialization: { "JSON": { "Type": "Lines" } },
    OutputSerialization: { "JSON": {} },
  }, (err, data) => {
    if (err != null) {
      return reject(err);
    }
    if (data.Payload == null) {
      return [];
    }
    // TODO: resolve type error
    const eventStream: any = data.Payload;
    const result: DocBasePost[] = [];
    let buffer: Buffer = Buffer.from([]);

    eventStream.on("data", (event) => {
      if (event.Records) {
        buffer = Buffer.concat([buffer, event.Records.Payload]);
        while (true) {
          const index = buffer.indexOf("\n");
          console.info("INDEX:", index);
          if (index === -1) {
            break;
          }
          const line = buffer.slice(0, index).toString("utf-8");
          if (line.trim() === "") {
            buffer = buffer.slice(index + 1);
            continue;
          }
          try {
            result.push(JSON.parse(line));
          } catch (err) {
            console.warn("JSON parse error:", line.substr(0, 100));
          }
          buffer = buffer.slice(index + 1);
        }
      } else if (event.Stats) {
        // handle Stats event
      } else if (event.Progress) {
        // handle Progress event
      } else if (event.Cont) {
        // handle Cont event
      } else if (event.End) {
        const line = buffer.toString("utf-8");
        if (line.trim() !== "") {
          try {
            result.push(JSON.parse(line));
          } catch (err) {
            console.warn("Last JSON parse error:", line);
          }
        }
        resolve(result);
      }
    });
    eventStream.on("error", console.error);
    eventStream.on("end", () => resolve(result));
  });
});

export const uploadFile = async (s3Key: string, body: S3.Body): Promise<void> => {
  await s3.putObject({
    Bucket: S3Bucket,
    Key: s3Key,
    Body: body,
  }).promise();
};
