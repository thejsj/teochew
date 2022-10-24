import * as cheerio from "cheerio";
import { readdirSync, readFileSync, writeFileSync } from "fs";

interface RomaniationEntry {
  pengIm: string;
  symbol: string;
  soundLink?: string;
}

interface Entry {
  simplifiedChar: string;
  traditionalChar: string;
  romanizations: RomaniationEntry[];
  definition: string | null;
}

const PATH = "./dist/word-definitions/";

const files = readdirSync(PATH);

const dictionary: Record<string, Entry> = {};

files.forEach((fileName: string) => {
  const file = readFileSync(`${PATH}/${fileName}`);
  const $ = cheerio.load(file.toString());

  // 1. Simplified + Traditional char
  const title = $("h2.simplifiedAndTraditional").first().text().trim();
  const chars = title.split("").filter((char) => /\p{Script=Han}/u.test(char));

  const simplifiedChar = chars[0];
  const traditionalChar = chars[1];

  /// 2. Get English definition
  let defIsNextEntry = false;
  let isDone = false; // TODO: Is there another way to do this?
  let definitionText: string | null = null;
  $(".charDefinition > div").each(function (i, elm) {
    if (isDone) return;
    if (defIsNextEntry) {
      definitionText = $(this).text().trim();
      isDone = true;
    }
    if ($(this).text().trim().includes("English Def")) {
      defIsNextEntry = true;
    }
  });

  const entry: Entry = {
    simplifiedChar: simplifiedChar,
    traditionalChar: traditionalChar,
    definition: definitionText || null,
    romanizations: [],
  };

  // 3. Get pengIm for word
  $(".charDefinition .region_pinyin_row").each(function (_, elm) {
    const link = $(this).find("a.change_region");
    if (!link.text().includes("TeoThew")) {
      return;
    }
    $(this)
      .find(".cz_pinyin_item")
      .each(function (_, wordEl) {
        const links = $(this).find("a");
        const firstLink = links.first();
        const parts = firstLink.text().trim().split(/\s+/g);

        const link = links[1]?.attributes?.find((x) => x.name === "href");

        // Get peng im for word
        // Get audio file for word
        // Get symbol for word
        entry.romanizations.push({
          pengIm: parts[0],
          symbol: parts[1],
          soundLink: link?.value,
        });
      });
  });
  dictionary[simplifiedChar] = entry;
});

writeFileSync(
  "./dist/romanizations.json",
  JSON.stringify(dictionary, null, "  ")
);
