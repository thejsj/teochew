import { readFileSync, writeFileSync } from "fs";
import { Entry, EntryCustom, PhoneticEntry, RomanizationEntry } from './types'

const WEB_PATH = "../web/src/"
const dictionaryStr = readFileSync(`${WEB_PATH}/dictionary.json`);

const dictionary : Record<string, Entry> = JSON.parse(dictionaryStr.toString())

const phoneticDictionary : Record<string, PhoneticEntry> = {}
Object.keys(dictionary).forEach((char: string) => {
  const entry : Entry = dictionary[char]
  entry.romanizations.forEach((romanization: RomanizationEntry) => {
    if (!phoneticDictionary[romanization.pengIm]) {
      phoneticDictionary[romanization.pengIm] = {
        pengIm: romanization.pengIm,
        definitions: []
      }
    }

    // Avoid having duplicates for entries
    if (char === entry.traditionalChar) {
      return
    }

    phoneticDictionary[romanization.pengIm].definitions.push(char)
  })
})


Object.keys(phoneticDictionary).forEach((pengIm: string) => {
  phoneticDictionary[pengIm].definitions = Array.from(new Set(phoneticDictionary[pengIm].definitions))
})

console.log(`${WEB_PATH}phonetic-dictionary.json`)
writeFileSync(
  `${WEB_PATH}phonetic-dictionary.json`,
  JSON.stringify(phoneticDictionary, null, "  ")
)
