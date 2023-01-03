import React, { useRef, useState, useMemo, useEffect } from 'react';
import { AutomcompletionInputField } from './AutomcompletionInputField'
import { convertPemgImToIPA } from './lib/main'

import { PengImDictionary, CharacterEntry , CharacterDictionary, RomaniationEntry} from './types'

import { useLocation } from "wouter";

interface MatchEntryViewProps {
  match: CharacterEntry
}

const MatchEntryView = (props: MatchEntryViewProps) => {
  const { match } = props;

  return (
    <div className="flex basis-5/12 p-10 rounded-md border-2 border-slate-300 bg-slate-50 flex-column align-top mb-8 mx-4">
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
      <div className="w-12 ml-4 justify-center place-content-center">
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

export const PhoneticDictionary = () => {
  const [location, setLocation] = useLocation();
  const word = location.split("/")[2] || null
  console.log('word', word)
  const [text, setText] = useState<string>(word || "")
  console.log('text', text)
  const inputEl = useRef(null);

  const matches = useMemo<CharacterEntry[]>(() => {
    const entry = PengImDictionary[text];
    if (!entry) {
      return []
    }
    const missing = entry.definitions.filter(x => !CharacterDictionary[x])
    const present = entry.definitions.filter(x => CharacterDictionary[x])
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
      console.log('setting location', text)
      setLocation(`/word/${text}`)
    }
    if (text.length === 0 && word !== null) {
      console.log('setting location to null', text, word)
      setLocation(`/`)
    }
  }, [text, setLocation, word])

  return (
    <div>
      <div className="flex justify-center mt-12 mb-6">
        <div className="px-12 max-w-3xl md:w-2/3">
          <AutomcompletionInputField currentWord={text} setCurrentWord={setText} inputRef={inputEl}/>
        </div>
      </div>

      <div className="flex justify-center my-2 mb-12">
        <div className="px-12 max-w-3xl md:w-2/3">
          <IPADisplay currentWord={text}/>
        </div>
      </div>

      <div className="px-12 flex justify-center">
        <div className="max-w-6xl md:w-full flex flex-wrap flex-row place-content-center">
          {matches.map((match, i) =>
            <MatchEntryView key={i} match={match}/>
          )}
        </div>
      </div>
    </div>
  )
}
