import axios from "axios";
import { existsSync, readFileSync, writeFileSync } from "fs";

function sleeper(ms: number) {
  return function (x: any) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms));
  };
}

function charPath(char: string) {
  return `./dist/word-definitions-v2/${char}.html`
}

const main = async function () {
  const instance = axios.create({
    withCredentials: true,
    baseURL: `https://www.mogher.com/`,
  });

  const NOT_FOUND: string[] = [];

  // const allCharsJson = readFileSync("./dist/all_chars.json").toString();
  // const allChars = JSON.parse(allCharsJson);
  const allUrls = readFileSync("./words.txt").toString().split('\n');

  console.log('Length: ', allUrls.length)
  for (var [i, url] of allUrls.entries()) {
    // const result = await instance.get(`/eng/${char}`);
    const char = decodeURI(url.split('/')[2])
    const doesExist = existsSync(charPath(char))

    if (!char) {
      console.log(`${i}: char is nill: ${url}`)
      continue;
    }

    if (doesExist) {
      console.log(`${i}: file exists: ${char}`)
      continue;
    }

    try {
      const result = await instance.get(url);
      if (result.status === 200) {
        const response: string = result.data;
        // Not found
        if (response.includes("暂时未找到该汉字的解释")) {
          NOT_FOUND.push(url);
          console.warn(`url not found: ${url}`);
          continue;
        }

        // writeFileSync(`./dist/word-definitions/${char}.html`, result.data);
        writeFileSync(`./dist/word-definitions-v2/${char}.html`, result.data);
        console.warn(`${i}: url saved: ${url}`);
      }
      await sleeper(50);
    } catch(err) {
      console.log('ERROR WITH URL: ' + url);
      // console.log(err)
    }
  }
};

main();
