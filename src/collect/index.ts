import { createGzip } from "zlib";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";

import { appendLine, listJsonFilesInDir, readFile, writeFile } from "./file";
import { fetchPosts } from "./docbase_api";
import { getDocBaseDomain } from "../common/env";
import { uploadFile } from "../common/s3";

const exportDirectoryBase = `/tmp/${getDocBaseDomain()}`;
const s3IndexFileKey = `docbase/${getDocBaseDomain()}/index.jsonl.gz`;
const indexFilePath = `${exportDirectoryBase}/index.jsonl`;
const indexFileGzPath = `${exportDirectoryBase}/index.jsonl.gz`;

const DocbaseLaunchedYear = 2015;
const CurrentYear = new Date().getFullYear();
const YearsLength = CurrentYear - DocbaseLaunchedYear + 1;
const SearchRangeList: [string, string][] = Array.from({ length: YearsLength })
  .map((_, i) => i + DocbaseLaunchedYear)
  .map((year) => ([`${year}-01-01`, `${year}-12-31`]));

export const handler = async (): Promise<unknown> => {
  // Fetch all DocBase posts
  for await (const [startDate, endDate] of SearchRangeList) {
    let page = 1;
    while (true) {
      console.log(`Range: ${startDate}~${endDate}, Page: ${page}`);
      const { posts, hasNext } = await fetchPosts(page++, startDate, endDate);
      await Promise.all(posts.map(async (post) => {
        await writeFile(`${exportDirectoryBase}/posts/${post.id}.json`, JSON.stringify(post));
      }));
      if (!hasNext) {
        break;
      }
    }
  }

  // Generate index file (JSON Lines: https://jsonlines.org/)
  const list = await listJsonFilesInDir(`${exportDirectoryBase}/posts`);
  await writeFile(indexFilePath, "");
  for await (const filePath of list) {
    const jsonText = await readFile(filePath);
    await appendLine(indexFilePath, jsonText);
  }

  // Compress Gzip
  const pipe = promisify(pipeline);
  const gzip = createGzip();
  const source = createReadStream(indexFilePath);
  const destination = createWriteStream(indexFileGzPath);
  await pipe(source, gzip, destination);

  // Upload S3
  await uploadFile(s3IndexFileKey, createReadStream(indexFilePath));
  await uploadFile(s3IndexFileKey, createReadStream(indexFileGzPath));
  return { success: true };
};
