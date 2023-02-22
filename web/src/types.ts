import phoneticDictionaryJSON from "./phonetic-dictionary.json";
import definitionLookup from "./definition-lookup.json";
import romanizations from "./dictionary.json";

export const PhoneticDictionary = phoneticDictionaryJSON as unknown as Record<
  string,
  LookupEntry
>;

export const DefinitionLookupDictionary = definitionLookup as unknown as Record<
  string,
  LookupEntry
>;

export const CharacterDictionary = romanizations as unknown as Record<
  string,
  CharacterEntry
>;

export interface RomaniationEntry {
  pengIm: string;
  verified?: boolean;
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

export interface LookupEntry {
  lookup: string;
  result: string[];
  verified: string[];
}

export interface SearchEntry {
  queryTerm: string
  title: string;
  subTitle: string;
}

export type Definition = string;

export interface DictionaryEntry {
  pengIm: string;
  IPA: string;
  definitions: Definition[];
}
