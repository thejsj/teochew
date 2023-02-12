const dictionaryJSON = require("./dictionary.custom.json");

export interface DictionaryEntry {
  word: string;
  pengIm: string;
  definition: string;
  simplified: string | null;
  traditional: string | null;
  wordGroup: string;
  dateAdded: string;
}

const checkWord = (word: any): string | null => {
  if (!word) return null;
  if (typeof word !== "string") return null;
  if (word.length === 0) return null;
  return word;
};

export const shuffleArray = (array: any[]) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

export const orderDictionaryAlphtabetically = (
  array: DictionaryEntry[]
): DictionaryEntry[] => {
  return array
    .map((value) => ({ value, sort: value.pengIm }))
    .sort((a, b) => {
      if (a.sort < b.sort) {
        return -1;
      }
      if (a.sort > b.sort) {
        return 1;
      }
      return 0;
    })
    .map(({ value }) => value);
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
    wordGroup: checkWord(entry.wordGroup),
    dateAdded: entry.dateAdded || "None",
  };
  if (!def.word) return null;
  if (!def.definition) return null;
  return def as DictionaryEntry;
});

export const dictionary: DictionaryEntry[] = dictionaryWithNull.filter(
  (x) => x !== null
) as DictionaryEntry[];
