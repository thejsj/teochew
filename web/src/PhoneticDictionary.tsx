import React, { useRef, useState, useMemo, useEffect } from 'react';
import { AutomcompletionInputField } from './AutomcompletionInputField'
import { convertPemgImToIPA } from './lib/main'

import { PhoneticDictionary as phoneticDict, SearchEntry, CharacterEntry , CharacterDictionary } from './types'

import { MatchEntryView  } from './MatchView'

import { useLocation } from "wouter";

const entries: SearchEntry[] = [];
for (var entry of Object.keys(phoneticDict)) {
  if (!entry.includes(" ")) {
    const characters = phoneticDict[entry].result.join(' / ')
    entries.push({ queryTerm: entry, title: entry, subTitle: characters });
  }
}

function getPhoneticFilter(inputValue: string | undefined) {
  return function filter(entry: SearchEntry) {
    return (
      !inputValue ||
      entry.queryTerm?.toLowerCase().replace('ê', 'e').includes(inputValue) ||
      entry.subTitle?.toLowerCase().includes(inputValue)
    );
  };
}

interface IPADisplayProps {
  currentWord: string
}

const IPADisplay = (props: IPADisplayProps) => {
  const { currentWord } = props
  const [selectedClass, setSelectedClass] = useState("")
  const ipaWord = convertPemgImToIPA(currentWord)


  const handleClick = () => {
    navigator.clipboard.writeText(ipaWord);
    setSelectedClass("bg-amber-200")
  }

  useEffect(() => {
    if (selectedClass !== "") {
      setTimeout(() => {
        setSelectedClass("")
      }, 100)
    }
  }, [selectedClass, setSelectedClass])

  if (currentWord === '') {
    return null
  }

  // TODO: Add interactive syllable pronunciations
  return <>
    <div className={"flex flex-column items-center"}>
      <div className={'font-bold'}>IPA</div>
      <div className={'cursor-pointer ml-4 rounded-lg p-2 px-4 text-slate-600 w-full text-lg border-2 flex flex-column justify-between items-center duration-100 transition-colors select-none ' + selectedClass} onClick={handleClick}>
        <span>{ipaWord}</span>
        <button className={'pointer-events-none select-none'}>Copy</button>
      </div>
    </div>
  </>
}

export const PhoneticDictionary = () => {
  const [location, setLocation] = useLocation();
  const word = location.split("/")[2] || null
  const [text, setText] = useState<string>(word || "")
  const inputEl = useRef(null);

  const matches = useMemo<CharacterEntry[]>(() => {
    const entry = phoneticDict[text];
    if (!entry) {
      return []
    }
    const missing = entry.result.filter(x => !CharacterDictionary[x])
    const present = entry.result.filter(x => CharacterDictionary[x])
    console.warn('The following symbols are missing definitions', missing);
    return present.map(x => {
      return CharacterDictionary[x]
    })
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
      setLocation(`/word/${text}`)
    }
    if (text.length === 0 && word !== null) {
      setLocation(`/`)
    }
  }, [text, setLocation, word])

  return (
    <div>
      <div className="flex justify-center mt-12 mb-6">
        <div className="px-4 w-full md:w-2/3 md:max-w-3xl">
          <AutomcompletionInputField
            currentWord={text}
            setCurrentWord={setText}
            inputRef={inputEl}
            entries={entries}
            filter={getPhoneticFilter}
            itemToString={(x: SearchEntry) => x.title}
          sort={(a, b) => {
            return a.title.length > b.title.length ? 1 : -1
          }}
          />
        </div>
      </div>

      <div className="flex justify-center my-2 mb-12">
        <div className="px-4 w-full md:w-2/4 md:max-w-3xl">
          <IPADisplay currentWord={text}/>
        </div>
      </div>

      <div className="px-4 flex justify-center">
        <div className="max-w-6xl md:w-full flex flex-wrap flex-row place-content-center">
          {matches.map((match, i) =>
            <MatchEntryView key={i} match={match}/>
          )}
        </div>
      </div>
    </div>
  )
}
