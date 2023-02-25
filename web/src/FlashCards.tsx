import { dictionary, DictionaryEntry  } from './dictionary';
import React, { useState } from 'react';
import { convertPemgImToIPA } from './lib/main';
import { Link, useLocation } from "wouter";
import { encode, decode } from 'punycode';
import { PhoneticDictionary as phoneticDict, CharacterEntry, CharacterDictionary } from './types'

import { ChevronLeft, ChevronRight } from './Icons'

const getHomopohnes = (entry: DictionaryEntry) : [string, CharacterEntry][] => {
  const syllables = entry.pengIm.split(/\d/g).filter(x => x.length > 0)
  if (syllables.length === 1) {
    const syl = syllables[0]
    const result = [...Array(8).keys()].reduce((memo: [string, CharacterEntry][], val) => {
      const tone = val + 1
      const pengIm = `${syl}${tone}`
      const homophones : [string, CharacterEntry][] | null = phoneticDict[pengIm]?.verified?.map((x : string) => {
        return [pengIm, CharacterDictionary[x]]
      })
      if (homophones) {
        return [...memo, ...homophones]
      }
      return memo
    }, [])
    return result.filter(x => x[1].simplifiedChar !== entry.simplified)
  }
  return phoneticDict[entry.pengIm]?.verified?.filter(x => x !== entry.simplified).map((x : string) => {
    return [entry.pengIm, CharacterDictionary[x]]
  }) || []
}

export interface FlashCardsProps {
  entry: DictionaryEntry,
  incrementIndex?: () => void
  decrementIndex?: () => void
}

const FlashCard = (props: FlashCardsProps) => {
    const homophones = getHomopohnes(props.entry)
    return (

    <div className="w-4/5 lg:w-3/5 lg:py-8 lg:pb-16 rounded-md">
      <div className={'flex flex-col items-center border-2'}>

        <div className={'flex flex-col items-center  grow px-12 py-6 overflow-hidden'}>
          <div className={'flex justify-center flex-row h-6 mb-8'}>
            {props.entry.simplified !== '?' && <p className={'text-2xl'}>{props.entry.simplified}</p>}
            {props.entry.traditional && <p className={'text-2xl ml-6'}>{props.entry.traditional}</p>}
          </div>
          <p className={'text-4xl text-center mb-4'}>{props.entry.word}</p>
          <p className={'text-xl text-center tracking-wider'}>{convertPemgImToIPA(props.entry.word)}</p>
        </div>


      <div className={'border-t-2 w-full'}>
        <p className={'text-2xl text-center p-6'}>{props.entry.definition}</p>
      </div>

      {props.decrementIndex && props.incrementIndex && (
        <div className={'flex flex-row items-center h-12 w-full overflow-hidden border-t-2'}>
          <button className={'border-zinc-200 md:hover:bg-zinc-100 border-r p-6 flex justify-center items-center h-4 basis-3/6'} onClick={props.decrementIndex}>
            <ChevronLeft/>
          </button>
          <button className={'border-zinc-200 md:hover:bg-zinc-100 border-l p-6 flex justify-center items-center h-4 basis-3/6'} onClick={props.incrementIndex}>
            <ChevronRight/>
          </button>
        </div>
      )}
     </div>

    {homophones.length > 0 &&
      <div className={'mt-2 text-md border-b-2'}>
      {homophones.length > 0 && homophones.map((homophone) => {
       return (<div className={'border-2 border-b-0 w-full flex flex-row overflow-x-auto flex-1'}>
        <div className={'flex flex-row min-w-min'}>
          <span className={'border-r-2 p-4'}>{homophone[1].simplifiedChar}</span>
          <span className={'border-r-2 p-4'}>{homophone[0]}</span>
          <span className={'grow p-4 whitespace-nowrap'}>{homophone[1].definition}</span>
        </div>
        </div>)
      })}
      </div>
    }

     {props.entry.simplified && props.entry.simplified !== "" && (
      <div className={'mt-2 text-sm align-right'}>
        <Link href={`/flash-card/${encode(props.entry.simplified)}`}>
          <a className={'text-rose-600'} target={'_blank'} rel="noreferrer" href={`/flash-card/${encode(props.entry.simplified)}`}>Share</a>
         </Link>
      </div>
     )}
    </div>
  )
}

export const FlashCards = (props: { dictionary: DictionaryEntry[] }) => {
  const dictionary = props.dictionary;
  const [index, setIndex] = useState(0)

  const incrementIndex = () => {
    if (index >= (dictionary.length -1)) {
      setIndex(0)
      return
    }

    setIndex(index + 1)
  }

  const decrementIndex = () => {
    if (index <= 0) {
      setIndex(dictionary.length - 1)
      return
    }

    setIndex(index - 1)
  }

  return (
    <div className={'flex justify-center flex-col mt-6 lg:mt-12 mb-6'}>
      <div className={'flex justify-center flex-row pb-2 lg:pb-6 space-x-2.5'}>
        {/*<p className={'text-xl text-emerald-500'}>&#10004;</p>
        <p className={'text-xl text-rose-600'}>&#10006;</p>*/}
        <p className={'text-base lg:text-xl tracking-widest'}>{index + 1}/{dictionary.length}</p>
      </div>
      <div className="flex flex-row justify-center ">
        <FlashCard entry={dictionary[index]} incrementIndex={incrementIndex} decrementIndex={decrementIndex}/>
      </div>
    </div>
  )
}

export const FlashCardSingleCard = () => {
  const [location] = useLocation();
  let word = location.split("/")[2] || null
  word = (word && decode(word)) || null

  const entry = (word && dictionary.find(x => x.simplified === word)) || null

  return (
    <div className={'flex justify-center flex-col mt-6 lg:mt-12 mb-6'}>
      <div className="flex flex-row justify-center ">
        {!entry && <p>Not Found</p>}
        {entry && <FlashCard entry={entry}/>}
      </div>
    </div>
  )
}
