import pengImDictionary from "./pemg_im_dictionary.json";
import romanizations from "./romanizations.json";

export const PengImDictionary = pengImDictionary as unknown as Record<
  string,
  DictionaryEntry
>;

export const CharacterDictionary = romanizations as unknown as Record<
  string,
  CharacterEntry
>;

export interface RomaniationEntry {
  pengIm: string;
  symbol: string;
  soundLink?: string;
}

export interface CharacterEntry {
  simplifiedChar: string;
  traditionalChar: string;
  romanizations: RomaniationEntry[];
  definition: string | null;
}

export const Romanization = romanizations as unknown as Record<
  string,
  DictionaryEntry
>;

export interface DictionaryEntry {
  pengIm: string;
  IPA: string;
  definitions: Definition[];
}

export interface WordEntry {
  word: string;
  characters: string;
  definitions: string;
}

export type Definition = string;

export interface DictionaryEntry {
  pengIm: string;
  IPA: string;
  definitions: Definition[];
}
