import React, { useRef, useState, useMemo, useEffect } from 'react';
import { AutomcompletionInputField } from './AutomcompletionInputField'
import { convertPemgImToIPA } from './lib/main'

import { DefinitionLookupDictionary as dict, SearchEntry, CharacterEntry , CharacterDictionary, RomaniationEntry} from './types'

// import { useLocation } from "wouter";

interface MatchEntryViewProps {
  match: CharacterEntry
}

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
  const title = romanizations.map(x => x.pengIm).join(' ')
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

const MatchEntryView = (props: MatchEntryViewProps) => {
  const { match } = props;

  return (
    <div className="bg-slate-50 border-2 border-slate-300 mb-8 w-full p-4 rounded-md md:p-10 md:mx-8 block md:basis-5/12 ">
      <div className={'md:flex md:flex-column md:align-top'}>
        <div className="w-12 mr-4">
          <p className="text-4xl pt-2">{match.simplifiedChar}</p>
          <p className="text-xl mt-4 text-slate-400">{match.traditionalChar}</p>
        </div>

        <div className="grow">
          <p className="italic text-xl mb-4">{match.definition}</p>
          <div>
            {match.romanizations.map((romanization:RomaniationEntry) => {
             return (
              <div>
              <p className="text-sm">{romanization.pengIm}</p>
              <audio controls>
                <source src={`https://www.mogher.com/${romanization.soundLink}`} type="audio/mpeg"/>
              </audio>
              </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
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

export const MainDictionary = () => {
  // const [location] = useLocation();
  // const word = location.split("/")[2] || null
  const word = null
  const [text, setText] = useState<string>(word || "")
  const inputEl = useRef(null);

  const matches = useMemo<CharacterEntry[]>(() => {
    const entry = dict[text];
    if (!entry) {
      return []
    }
    const present = entry.result.filter(x => CharacterDictionary[x])
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

  // useEffect(() => {
    // if (text !== "" && text !== word) {
      // setLocation(`/word/${text}`)
    // }
    // if (text.length === 0 && word !== null) {
      // setLocation(`/`)
    // }
  // }, [text, setLocation, word])

  return (
    <div>
      <div className="flex justify-center mt-12 mb-6">
        <div className="px-4 w-full md:w-2/3 md:max-w-3xl">
          <AutomcompletionInputField
          currentWord={text} setCurrentWord={setText} inputRef={inputEl}
          filter={getDefinitionFilter}
          entries={entries}
          />
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
