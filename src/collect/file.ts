import path from "path";
import fs from "fs-extra";

export const writeFile = async (filePath: string, textContent: string): Promise<void> => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, textContent);
};

export const readFile = async (filePath: string): Promise<string> => {
  const buf = await fs.readFile(filePath);
  return buf.toString("utf-8");
};

export const appendLine = async (filePath: string, appendContent: string): Promise<void> => {
  await fs.appendFile(filePath, `${appendContent.trim()}\n`);
};

export const listJsonFilesInDir = async (dirPath: string): Promise<string[]> => {
  const list: string[] = [];
  for (const filePath of await fs.readdir(dirPath)) {
    if (filePath.endsWith(".json")) {
      list.push(`${dirPath}/${filePath}`);
    }
  }
  list.sort((f1, f2) => {
    const id1 = parseInt(f1.split("/").splice(-1, 1)[0].replace(".json", ""), 10);
    const id2 = parseInt(f2.split("/").splice(-1, 1)[0].replace(".json", ""), 10);
    return id2 - id1;
  });
  return list;
};
