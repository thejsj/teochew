import { readFileSync, writeFileSync } from "fs";
import { Entry, EntryCustom, LookupEntry, RomanizationEntry } from './types'

const WEB_PATH = "../web/src/"
const dictionaryStr = readFileSync(`${WEB_PATH}/dictionary.json`);

const dictionary : Record<string, Entry> = JSON.parse(dictionaryStr.toString())

const phoneticDictionary : Record<string, LookupEntry> = {}
Object.keys(dictionary).forEach((char: string) => {
  const entry : Entry = dictionary[char]
  entry.romanizations.forEach((romanization: RomanizationEntry) => {
    if (!phoneticDictionary[romanization.pengIm]) {
      phoneticDictionary[romanization.pengIm] = {
        lookup: romanization.pengIm,
        result: []
      }
    }

    // Avoid having duplicates for entries
    if (char === entry.traditionalChar) {
      return
    }

    phoneticDictionary[romanization.pengIm].result.push(char)
  })
})

Object.keys(phoneticDictionary).forEach((pengIm: string) => {
  phoneticDictionary[pengIm].result = Array.from(new Set(phoneticDictionary[pengIm].result))
})

writeFileSync(
  `${WEB_PATH}phonetic-dictionary.json`,
  JSON.stringify(phoneticDictionary, null, "  ")
)
