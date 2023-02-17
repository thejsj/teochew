import React, { useRef, useState, useMemo, useEffect } from 'react';
import { AutomcompletionInputField } from './AutomcompletionInputField'

import { DefinitionLookupDictionary as dict, SearchEntry, CharacterEntry , CharacterDictionary } from './types'

import { useLocation } from "wouter";

import { MatchEntryView  } from './MatchView'

const entries: SearchEntry[] = [];
for (var key of Object.keys(dict)) {
  const entry = dict[key]
  if (entry.result.length === 0){
    continue
  }
  const definition = CharacterDictionary[entry.result[0]]
  const romanizations = definition.romanizations
  if (romanizations.length === 0) {
    continue
  }
  const title = romanizations.map(x => x.pengIm).join(', ')
  entries.push({ queryTerm: key + ' ' + title, title, subTitle: key });
}

function getDefinitionFilter(inputValue: string | undefined) {
  return function filter(entry: SearchEntry) {
    if (!inputValue) {
      return true
    }
    const terms = inputValue.split(' ')
    return terms.every((term: string) => {
      return entry.queryTerm?.toLowerCase().replace('ê', 'e').includes(term)
    })
  };
}

export const MainDictionary = () => {
  const [location, setLocation] = useLocation();
  const uriEncoded = location.split("/")[3] || null
  const word = uriEncoded  && decodeURI(uriEncoded)

  const [text, setText] = useState<string>(word || "")
  const inputEl = useRef(null);

  const matches = useMemo<CharacterEntry[]>(() => {
    const entry = dict[text];
    if (!entry) {
      return []
    }
    const present = entry.result.filter(x => CharacterDictionary[x])
    const entries : [CharacterEntry, string][] = present.map(x => {
      return [CharacterDictionary[x], x]
    })

    return entries.filter((tuple) => {
      const entry = tuple[0]
      const char = tuple[1]
      // Remove duplicates
      return char !== entry?.traditionalChar
    }).map(x => x[0])
  }, [text])

  useEffect(() => {
    const keyHandler = function (event: KeyboardEvent) {
      if (event.keyCode === 70 && (event.ctrlKey || event.shiftKey)) {
        (inputEl?.current as unknown as any)?.focus();
      }
    }
    document.body.addEventListener('keydown', keyHandler);
    return () => {
      document.body.removeEventListener('keydown', keyHandler);
    };
  }, [inputEl]);

  useEffect(() => {
    if (text !== "" && text !== word) {
      setLocation(`/dictionary/definition/${text}`)
    }
    if (text.length === 0 && word !== null) {
      setLocation(`/dictionary/`)
    }
  }, [text, setLocation, word])

  return (
    <div>
      <div className="flex justify-center mt-12 mb-6">
        <div className="px-4 w-full md:w-2/3 md:max-w-3xl">
          <AutomcompletionInputField
          currentWord={text} setCurrentWord={setText} inputRef={inputEl}
          filter={getDefinitionFilter}
          entries={entries}
          sort={(a, b) => {
            return a.subTitle.length > b.subTitle.length ? 1 : -1
          }}
          itemToString={(x: SearchEntry) => x.subTitle}
          />
        </div>
      </div>

      <div className="px-4 flex justify-center">
        <div className="max-w-6xl md:w-full flex flex-wrap flex-row place-content-center">
          {matches.map((match, i) =>
            <MatchEntryView key={match.simplifiedChar || match.definition} match={match}/>
          )}
        </div>
      </div>
    </div>
  )
}
