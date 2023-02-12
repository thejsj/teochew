import { readFileSync, writeFileSync } from "fs";
import { Entry, EntryCustom, LookupEntry, PhoneticEntry, RomanizationEntry } from './types'

const WEB_PATH = "../web/src/"
const dictionaryStr = readFileSync(`${WEB_PATH}/dictionary.json`);

const dictionary : Record<string, Entry> = JSON.parse(dictionaryStr.toString())

const lookup : Record<string, Set<string>> = {}

Object.keys(dictionary).forEach((char: string) => {
  const entry : Entry = dictionary[char]
  if (!entry.definition) {
    return null
  }
  if (!lookup[entry.definition]) {
    lookup[entry.definition] = new Set<string>()
  }
  lookup[entry.definition].add(char)
})


const lookupResult : Record<string, LookupEntry> = {}
Object.keys(lookup).forEach((char: string) => {
  lookupResult[char] = {
    lookup: char,
    result: Array.from(lookup[char])
  }
})

writeFileSync(
  `${WEB_PATH}definition-lookup.json`,
  JSON.stringify(lookupResult, null, "  ")
)
