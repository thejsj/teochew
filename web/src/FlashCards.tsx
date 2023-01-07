import { dictionary, DictionaryEntry  } from './dictionary';
import React, { useState } from 'react';
import { convertPemgImToIPA } from './lib/main';
import { Link, useLocation } from "wouter";
import { encode, decode } from 'punycode';

import { ChevronLeft, ChevronRight } from './Icons'

const shuffleArray = (array: any[]) => {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

}

const shuffledDictionary = shuffleArray(dictionary)

export interface FlashCardsProps {
  entry: DictionaryEntry,
  incrementIndex?: () => void
  decrementIndex?: () => void
}

const FlashCard = (props: FlashCardsProps) => {
  return (

    <div className="w-4/5 lg:w-3/5 lg:py-8 lg:pb-16 rounded-md">
      <div className={'flex flex-col items-center h-full border-2'}>

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
          <div className={'border-zinc-200 border-r p-6 flex justify-center items-center h-4 basis-3/6'} onClick={props.decrementIndex}>
            <ChevronLeft/>
          </div>
          <div className={'border-zinc-200 border-l p-6 flex justify-center items-center h-4 basis-3/6'} onClick={props.incrementIndex}>
            <ChevronRight/>
          </div>
        </div>
      )}
     </div>
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

export const FlashCards = () => {
  const [index, setIndex] = useState(0)

  const incrementIndex = () => {
    if (index >= (shuffledDictionary.length -1)) return

    setIndex(index + 1)
  }

  const decrementIndex = () => {
    if (index <= 0) return

    setIndex(index - 1)
  }

  return (
    <div className={'flex justify-center flex-col mt-6 lg:mt-12 mb-6'}>
      <div className={'flex justify-center flex-row pb-2 lg:pb-6 space-x-2.5'}>
        {/*<p className={'text-xl text-emerald-500'}>&#10004;</p>
        <p className={'text-xl text-rose-600'}>&#10006;</p>*/}
        <p className={'text-base lg:text-xl tracking-widest'}>{index + 1}/{shuffledDictionary.length}</p>
      </div>
      <div className="flex flex-row justify-center ">
        <FlashCard entry={shuffledDictionary[index]} incrementIndex={incrementIndex} decrementIndex={decrementIndex}/>
      </div>
    </div>
  )
}

export const FlashCardSingleCard = () => {
  const [location] = useLocation();
  let word = location.split("/")[2] || null
  word = (word && decode(word)) || null

  const entry = (word && dictionary.find(x => x.simplified === word)) || null
  console.log(entry)
  console.log(word)
  console.log(dictionary.map(x => x.simplified))

  return (
    <div className={'flex justify-center flex-col mt-6 lg:mt-12 mb-6'}>
      <div className="flex flex-row justify-center ">
        {!entry && <p>Not Found</p>}
        {entry && <FlashCard entry={entry}/>}
      </div>
    </div>
  )
}
