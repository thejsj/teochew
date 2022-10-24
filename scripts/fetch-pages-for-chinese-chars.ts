import axios from "axios";
import { readFileSync, writeFileSync } from "fs";

function sleeper(ms: number) {
  return function (x: any) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms));
  };
}

const main = async function () {
  const instance = axios.create({
    withCredentials: true,
    baseURL: `https://www.mogher.com/`,
  });

  const NOT_FOUND: string[] = [];

  const allCharsJson = readFileSync("./dist/all_chars.json").toString();
  const allChars = JSON.parse(allCharsJson);

  for (var char of allChars) {
    const result = await instance.get(`/eng/${char}`);
    if (result.status === 200) {
      const response: string = result.data;
      // Not found
      if (response.includes("暂时未找到该汉字的解释")) {
        NOT_FOUND.push(char);
        console.warn(`char not found: ${char}`);
        continue;
      }

      writeFileSync(`./dist/word-definitions/${char}.html`, result.data);
      console.warn(`char saved: ${char}`);
    }
    await sleeper(100);
  }
};

main();
