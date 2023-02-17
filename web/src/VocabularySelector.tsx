import { orderDictionaryAlphtabetically,  shuffleArray, dictionary as DEFAULT_DICTIONARY, DictionaryEntry } from './dictionary';
import React, { useState } from 'react';

const allCategories : string[] = Array.from(new Set(DEFAULT_DICTIONARY.map(x => x.wordGroup)))
const allDates : string[] = Array.from(new Set(DEFAULT_DICTIONARY.map(x => x.dateAdded)))

interface ButtonProps {
  i: number,
  text: string,
  onClick: (value: boolean) => void
}

const Button = (props: ButtonProps) => {
  const [active, setActive] = useState(false)

  const onClick = () => {
    setActive(!active)
    props.onClick(!active)
  }

  const activeClass = active ? 'bg-rose-300' : ''

  return <button
          onClick={onClick}
          className={`text-xl text-center border-2 border-rose-300 bg-rose-100 rounded-full p-4 w-full md:w-96 mb-2 md:hover:bg-rose-300 flex gap-2 align-left ${activeClass}`}>
            <span className={'text-base rounded-full bg-rose-200 border border-rose-300 h-8 w-8 flex items-center justify-center'}>{props.i + 1}</span>
            <span className={'overflow-hidden whitespace-nowrap text-ellipsis'}>{props.text}</span>
          </button>

}


interface VocabularySelectorProps {
  nextCompoent: (props: { dictionary: DictionaryEntry[] }) => JSX.Element
  shouldShuffle?: boolean
}

export const VocabularySelector = (props: VocabularySelectorProps) => {
  const [categories, setCategories] = useState<[string, boolean][]>(allCategories.map(x => [x, false]))
  const [dates, setDates] = useState<[string, boolean][]>(allDates.map(x => [x, false]))
  const [dictionary, setDictionary] = useState<DictionaryEntry[] | null>(null)


  const handleOnClick = function () {
    const finalCategories = categories.filter(x => x[1]).map(x => x[0])
    const finalDates = dates.filter(x => x[1]).map(x => x[0])

    const dictionary : DictionaryEntry[] = DEFAULT_DICTIONARY
      .filter(x => {
        const includesDate = finalDates.length > 0 ? finalDates.includes(x.dateAdded) : true
        const includesWorkdGroup = finalCategories.length > 0 ? finalCategories.includes(x.wordGroup) : true
        return includesDate && includesWorkdGroup
      })
    setDictionary(dictionary)
  }

  if (dictionary) {
    if (props.shouldShuffle) {
      return <props.nextCompoent dictionary={shuffleArray(dictionary)}/>
    }
    return <props.nextCompoent dictionary={orderDictionaryAlphtabetically(dictionary)}/>
  }

  return (<div className={'flex flex-col justify-center items-center m-2 py-6'}>
    <div className={'pb-6 w-full md:w-96 px-8 md:px-0'}>
      <h3 className={'mb-2'}>Categories</h3>
      {categories.map((entry, i) => {
        return <Button key={entry[0]} i={i} text={entry[0]} onClick={(value: boolean) => {
          const newCategories = [...categories]
          const ii = newCategories.findIndex(x => x[0] === entry[0])
          newCategories[ii][1] = value
          setCategories(newCategories)
        }}/>
      })}
      <h3 className={'mb-2'}>Dates</h3>
      {dates.map((entry, i) => {
        return <Button key={entry[0]} i={i} text={entry[0]} onClick={(value: boolean) => {
          const newDates = [...dates]
          const i = newDates.findIndex(x => x[0] === entry[0])
          newDates[i][1] = value
          setDates(newDates)
        }}/>
      })}

    <button onClick={handleOnClick} className={`mt-6 text-xl text-center border-2 border-rose-300 bg-rose-100 rounded-md p-4 w-full md:w-96 mb-2 md:hover:bg-rose-300 flex gap-2 align-left`}>Start</button>
    </div>
  </div>)
}
