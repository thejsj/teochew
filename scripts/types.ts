export interface RomanizationEntry {
  pengIm: string;
  verified?: boolean;
  symbol?: string;
  soundLink?: string;
}

export interface Entry {
  simplifiedChar: string;
  traditionalChar: string;
  romanizations: RomanizationEntry[];
  definition: string | null;
}

export interface EntryCustom {
  word: string,
  definition: string,
  simplified: string,
  traditional: string,
  wordGroup: string,
  dateAdded: string,
}


export interface PhoneticEntry {
  pengIm: string
  definitions: string[]
}

export interface LookupEntry {
  lookup: string
  value?: string
  result: string[]
  verified?: string[]
}
