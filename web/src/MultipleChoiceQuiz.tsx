import { shuffleArray, DictionaryEntry } from './dictionary';
import React, { useState } from 'react';
import { convertPemgImToIPA } from './lib/main';
import { useLocation} from 'wouter'

const QuizCard = (props: { entry: DictionaryEntry }) => {
  return (
    <div className="w-4/5 lg:w-3/5 border-2 border-zing-400 px-12 py-6 pb-10 lg:py-8 lg:pb-16 rounded-md">
      <div className={'flex justify-center flex-row h-6 mb-8'}>
        {props.entry.simplified !== '?' && <p className={'text-2xl'}>{props.entry.simplified}</p>}
        {props.entry.traditional && <p className={'text-2xl ml-6'}>{props.entry.traditional}</p>}
      </div>
      <p className={'text-4xl text-center mb-4'}>{props.entry.word}</p>
      <p className={'text-xl text-center tracking-wider'}>{convertPemgImToIPA(props.entry.word)}</p>
    </div>
  )
}

const indexToLetterMap : { [key: number]: string } = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
}

interface QuizOptionsProps {
  incrementIndex: (incorrectDefinition: DictionaryEntry | null) => void;
  entry: DictionaryEntry
  allEntries: DictionaryEntry[]
}

const QuizOptions = (props: QuizOptionsProps) => {
  const allEntries = shuffleArray(props.allEntries);
  const shuffleIndex = Math.abs(Math.floor(Math.random() * allEntries.length) - 4)
  const shuffledOptions = shuffleArray(allEntries.slice(shuffleIndex, shuffleIndex + 4))
  const additionalOptions = shuffledOptions.slice(0, 4).map(x => x.definition)
  const unsortedOptions : string[] = [props.entry.definition]
      .concat(additionalOptions)
      .reduce((arr: string[], option: string) => {
        // Exclude all entries that already exist
        // Only handles 1 repeated entry
        if (!arr.includes(option)) {
          arr.push(option)
        }
        return arr
      }, [])
      .splice(0, 4)
  const options = shuffleArray(unsortedOptions)

  const handleOnClick = (option: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.entry.definition === option) {
      props.incrementIndex(null)
    } else {
      props.incrementIndex(props.entry)
    }
  }

  return (
    <div className="flex flex-col justify-center mt-8 space-x-y.5 w-4/5 items-center">
      {options.map((option, index) => {
        return <button
          key={option + index}
          onClick={handleOnClick.bind(null, option)}
          className="text-xl text-center border-2 border-rose-300 bg-rose-100 rounded-full p-4 w-full md:w-96 mb-2 md:hover:bg-rose-300 flex gap-2 align-left">
            <span className={'text-base rounded-full bg-rose-200 border border-rose-300 h-8 w-8 flex items-center justify-center'}>{indexToLetterMap[index]}</span>
            <span className={'overflow-hidden whitespace-nowrap text-ellipsis'}>{option}</span>
          </button>
      })}
    </div>
  )
}

export const MultipleChoiceQuiz = (props: { dictionary: DictionaryEntry[] }) => {
  const dictionary = props.dictionary
  const [index, setIndex] = useState(0)
  const [,setLocation] = useLocation()
  const [wrongAnswers, setWrongAnswers] = useState<DictionaryEntry[]>([])

  const incrementIndex = (incorrectDefinition: DictionaryEntry | null) => {
    setIndex(index + 1)
    if (incorrectDefinition) {
      setWrongAnswers(wrongAnswers.concat([incorrectDefinition]))
    }
  }

  if (index > dictionary.length - 1) {
    const totalCount = dictionary.length;
    const correctCount = dictionary.length - wrongAnswers.length;
    return (
      <div className={'flex flex-col justify-center items-center m-2'}>
        <h2 className={'text-2xl font-bold p-6'}>Finished!</h2>
        <p className={'mb-6 text-3xl tracking-wide'}>{correctCount} / {totalCount}</p>
        <p className={'mb-6'}>Wrong answers:</p>

        <ul>
          {wrongAnswers.map(x => {
            return <p key={x.word}><span className={'font-bold'}>{x.word}</span> &#x2192; {x.definition}</p>
          })}
        </ul>

        <button
          className="text-center bg-rose-200 rounded-full p-2 mt-6 w-80 mb-2 md:hover:bg-rose-300"
          onClick={() => { setLocation('/redirect/multiple-choice-quiz') }}>Restart</button>
      </div>
    )
  }

  const allEntries = [...dictionary]
  allEntries.splice(index, 1)

  return (
    <div className={'flex justify-center flex-col mt-6 lg:mt-12 mb-6'}>
      <div className={'flex justify-center flex-row pb-2 lg:pb-6 space-x-2.5'}>
        <p className={'text-base lg:text-xl tracking-widest'}>{index + 1}/{dictionary.length}</p>
      </div>
      <div className="flex flex-row justify-center ">
        <QuizCard entry={dictionary[index]}/>
      </div>
      <div className="flex flex-row justify-center ">
        <QuizOptions incrementIndex={incrementIndex} entry={dictionary[index]} allEntries={allEntries}/>
      </div>
    </div>
  )
}
