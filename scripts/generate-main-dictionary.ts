import { readFileSync, writeFileSync } from "fs";
import { Entry, EntryCustom } from './types'

const WEB_PATH = "../web/src/"
const DIST_PATH = "./dist"

const customDictionary = readFileSync(`${WEB_PATH}/dictionary.custom.json`);
const scrapedDictionary = readFileSync(`${DIST_PATH}/dictionary.scraped.json`);

const dictionary : Record<string, Entry> = JSON.parse(scrapedDictionary.toString())
const additions = JSON.parse(customDictionary.toString())

additions.forEach((entry: EntryCustom) => {
  const simplified = entry.simplified

  if (!simplified || simplified.length === 0) {
    return
  }

  if (dictionary[simplified]) {
    const romanizationPresent = dictionary[simplified].romanizations.find(x => x.pengIm === entry.word)

    // If the romanization is found, just leave it. The already existing
    // definitions tend to be a bit more complete than the ones I have.
    if (!romanizationPresent) {
      dictionary[simplified].romanizations.push({
        pengIm: entry.word,
        verified: true,
      })
      dictionary[simplified].definition = `${entry.definition}; ${dictionary[simplified].definition}`
    } else {
      romanizationPresent.verified = true
    }

    const definitions = entry.definition.match(/[A-z-]*/g)
    const currentDefinition = dictionary[simplified]?.definition
    if (definitions !== null && currentDefinition) {
      const filteredDefinitions = definitions.filter(x => x.length > 0)
      const definitionsPresent = filteredDefinitions.every(word => {
        return currentDefinition.includes(word)
      })
      if (!definitionsPresent) {
        dictionary[simplified].definition = `${entry.definition}; ${dictionary[simplified].definition}`
      }
    }


    return
  }

  dictionary[simplified] = {
    "simplifiedChar": entry.simplified,
    "traditionalChar": entry.traditional,
    "definition": entry.definition,
    "romanizations": [
      {
        "pengIm": entry.word,
        "verified": true,
        "symbol": ""
      }
    ]
  }

})

writeFileSync(
  `${WEB_PATH}/dictionary.json`,
  JSON.stringify(dictionary, null, "  ")
);
