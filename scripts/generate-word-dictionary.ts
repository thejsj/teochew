import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const PATH = "./learn-teochew.github.io/pages/teochew_wiktionary_index/";

const definitionLineRegex = /^[\S ]* \| [\S ]* \| \| \|/g;

type Definition = string;

interface Entry {
  pengIm: string;
  IPA: string;
  definitions: Definition[];
}

const parseEntry = (line: string): Entry | null => {
  const parts = line.split("|");
  if (parts.length < 2) {
    console.warn("line returned null: ", line);
    return null;
  }

  return {
    pengIm: parts[0].trim(),
    IPA: parts[1].trim(),
    definitions: [],
  };
};

const parseDefinition = (line: string): Definition | null => {
  const parts = line.split("|");
  if (parts.length < 2) {
    console.warn("line returned null: ", line);
    return null;
  }

  const result = parts[2].match(/\[([^\]]*)/);
  if (result && result[1]) {
    return result[1];
  }
  return null;
};

const main = async () => {
  const files = readdirSync(PATH);

  const dictionary: Record<string, Entry> = {};

  files.forEach((fileName: string) => {
    if (fileName === "teochew_wiktionary_index.md") {
      return;
    }
    // These files are small enough to load them into memory
    const file = readFileSync(join(PATH, fileName)).toString();

    let isParserStarted = false;
    let currentEntry: Entry | null;
    file.split("\n").forEach((line: string) => {
      if (line[0] === "-") return;
      if (!isParserStarted) {
        if (line.match(definitionLineRegex)) {
          isParserStarted = true;
        } else {
          // Don't start parsing until we find a line
          return;
        }
      }

      if (line.match(definitionLineRegex)) {
        const entry = parseEntry(line);
        if (entry) {
          dictionary[entry.pengIm] = entry;
          currentEntry = entry;
        }
      }

      if (line[0] === "|" && currentEntry) {
        const definition = parseDefinition(line);
        if (definition) {
          currentEntry.definitions.push(definition);
        }
      }
    });
  });
  console.log(dictionary);
};

main();
