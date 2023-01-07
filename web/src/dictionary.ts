const dictionaryJSON = require("./dictionary.json");

export interface DictionaryEntry {
  word: string;
  pengIm: string;
  definition: string;
  simplified: string | null;
  traditional: string | null;
}

const checkWord = (word: any): string | null => {
  if (!word) return null;
  if (typeof word !== "string") return null;
  if (word.length === 0) return null;
  return word;
};

const dictionaryWithNull: (DictionaryEntry | null)[] = (
  dictionaryJSON as any[]
).map((entry): DictionaryEntry | null => {
  if (!entry) return null;
  const def = {
    word: checkWord(entry.word),
    pengIm: checkWord(entry.word),
    definition: checkWord(entry.definition),
    simplified: checkWord(entry.simplified),
    traditional: checkWord(entry.traditional),
  };
  if (!def.word) return null;
  if (!def.definition) return null;
  return def as DictionaryEntry;
});

export const dictionary: DictionaryEntry[] = dictionaryWithNull.filter(
  (x) => x !== null
) as DictionaryEntry[];
