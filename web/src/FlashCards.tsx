import { dictionary, DictionaryEntry  } from './dictionary';
import React, { useState } from 'react';
import { convertPemgImToIPA } from './lib/main';


const shuffleArray = (array: any[]) => {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

}

const shuffledDictionary = shuffleArray(dictionary)

const FlashCard = (props: { entry: DictionaryEntry }) => {
  return (
    <div className="w-3/5 border-2 border-zing-400 px-12 py-8 pb-16 rounded-md">
      <div className={'flex justify-end flex-row h-6 mb-4'}>
        {props.entry.simplified !== '?' && <p className={'text-2xl'}>{props.entry.simplified}</p>}
        {props.entry.traditional && <p className={'text-2xl ml-6'}>{props.entry.traditional}</p>}
      </div>
      <p className={'text-4xl text-center mb-4'}>{props.entry.word}</p>
      <p className={'text-xl text-center'}>{convertPemgImToIPA(props.entry.word)}</p>
    </div>
  )
}

interface FlassCardOptionsProps {
  incrementIndex: () => void
  entry: DictionaryEntry
}

const FlassCardOptions = (props: FlassCardOptionsProps) => {
  const options = shuffleArray([props.entry.definition, 'mom', 'what you laughing at', 'godbless'])

  const handleOnClick = () => {
    props.incrementIndex()
  }

  return (
    <div className="flex flex-col justify-center mt-8 space-x-y.5">
      {options.map((option, index) => {
        return <button
          onClick={handleOnClick}
          className="text-xl text-center bg-sky-200 rounded-full p-6 w-80 mb-2 hover:bg-sky-300">{option}</button>
      })}
    </div>
  )
}

export const FlashCards = () => {
  const [index, setIndex] = useState(0)

  const incrementIndex = () => {
    setIndex(index + 1)
  }

  return (
    <div className={'flex justify-center flex-col mt-12 mb-6'}>
      <div className={'flex justify-center flex-row pb-6 space-x-2.5'}>
        <p className={'text-xl text-emerald-500'}>&#10004;</p>
        <p className={'text-xl text-rose-600'}>&#10006;</p>
        <p className={'text-xl tracking-widest'}>{index + 1}/{shuffledDictionary.length}</p>
      </div>
      <div className="flex flex-row justify-center ">
        <FlashCard entry={shuffledDictionary[index]}/>
      </div>
      <div className="flex flex-row justify-center ">
        <FlassCardOptions incrementIndex={incrementIndex} entry={shuffledDictionary[index]}/>
      </div>
    </div>
  )
}
