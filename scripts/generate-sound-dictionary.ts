import { readFileSync, writeFileSync } from "fs";
import { Entry, EntryCustom, LookupEntry, PhoneticEntry, RomanizationEntry } from './types'

const WEB_PATH = "../web/src/"
const dictionaryStr = readFileSync(`${WEB_PATH}/dictionary.json`);

const dictionary : Record<string, Entry> = JSON.parse(dictionaryStr.toString())

const soundFileLookup : Record<string, string> = {}
const lookup : Record<string, Set<string>> = {}
const verifiedLookup : Record<string, Set<string>> = {}

const lookupResult : Record<string, LookupEntry> = {}

Object.keys(dictionary).forEach((char: string) => {
  const entry : Entry = dictionary[char]

  const verifiedRomanizations : RomanizationEntry[] = entry.romanizations.filter(x => {
    return x.verified && x.soundLink
  })


  if (verifiedRomanizations.length > 0) {
    verifiedRomanizations.forEach(x => {
      if (x.pengIm === undefined) {
        return
      }
      const pengIm : string = x.pengIm
      soundFileLookup[pengIm] = x.soundLink || ''

      if (!lookup[pengIm]) {
        lookup[pengIm] = new Set<string>()
      }
      lookup[pengIm].add(char)

      if (x.verified) {
        if (!verifiedLookup[pengIm]) {
          verifiedLookup[pengIm] = new Set<string>()
        }
        verifiedLookup[pengIm].add(char)
      }
    })
  }
})

Object.keys(lookup).forEach(pengIm => {
  lookupResult[pengIm] = {
    lookup: pengIm,
    value: soundFileLookup[pengIm],
    result: Array.from(lookup[pengIm]),
    verified: Array.from(verifiedLookup[pengIm])
  }
})

writeFileSync(
  `${WEB_PATH}sound-dictionary.json`,
  JSON.stringify(lookupResult, null, "  ")
)
