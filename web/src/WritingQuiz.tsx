import { DictionaryEntry  } from './dictionary';
import React, { useRef, useState, createRef, useEffect } from 'react';
import { useLocation } from 'wouter'

const QuizCard = (props: { entry: DictionaryEntry }) => {
  return (
    <div className="w-4/5 lg:w-3/5 px-12 py-2 lg:py-8 lg:pb-16 rounded-md">
      <div className={'flex justify-center flex-row h-6 mb-2'}>
        {props.entry.simplified !== '?' && <p className={'text-base'}>{props.entry.simplified}</p>}
        {props.entry.traditional && <p className={'text-base ml-6'}>{props.entry.traditional}</p>}
      </div>
      <p className={'text-xl text-center mb-2'}>{props.entry.definition}</p>
    </div>
  )
}

interface QuizOptionsProps {
  incrementIndex: (incorrectDefinition: [DictionaryEntry, string] | null) => void;
  entry: DictionaryEntry
}

const QuizInputArea = (props: QuizOptionsProps) => {
  const word = props.entry.word.replace(/\([0-9]\)*/g, '')
  const [input, setInput] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [inputRefsArray, setInputRefsArray] = useState<React.RefObject<HTMLInputElement>[]>([]);

  useEffect(() => {
    setInput(Array.from('-'.repeat(word.length)))
    setInputRefsArray(Array.from({ length: word.length}, () => createRef<HTMLInputElement>()))
  }, [word])

  useEffect(() => {
    // focus the firs iput initially
    if (inputRefsArray?.[0]?.current) {
      inputRefsArray?.[0]?.current?.focus();
    }
  }, [inputRefsArray]);

  const handleKeyDown = (letter: string, index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    const char = String.fromCharCode(event.keyCode)
    if (char.match(/[a-zA-Z0-9]/g)) {
      const newInput = [...input]
      newInput[index] = String.fromCharCode(event.keyCode).toLowerCase()
      setInput(newInput)

      if (currentIndex === word.length - 1) {
        buttonRef?.current?.focus()
        return
      }

      setCurrentIndex(currentIndex + 1)

      // calculate the next input index, next input after the final input will be again the first input. you can change the logic here as per your needs
      const nextIndex = index < word.length - 1 ? index + 1 : 0;
      const nextInput : any = inputRefsArray?.[nextIndex]?.current;
      nextInput.focus();
      nextInput.select();
    }
  }

  const handleClick = () => {
    setCurrentIndex(0)
    if (input.join('').replace('ê', 'e') === word.replace('ê', 'e')) {
      props.incrementIndex(null)
    } else {
      props.incrementIndex([props.entry, input.join('')])
    }
    setInput(input.map(x => '-'))
    inputRefsArray[0]?.current?.focus();
  }


  const handleInputClick = (letter: string, index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div>
    <div className="flex flex-row justify-center mt-8 space-x-y.5 items-center gap-2">
      {word.split('').map((letter, index) => {
        return <input
          className={'text-base text-center w-10 border-2 border-rose-300 px-1 py-4 mb-2 gap-2 rounded-4'}
          ref={inputRefsArray[index]}
          key={index} type="text"
          onChange={(event) => {}}
          onKeyDown={handleKeyDown.bind(null, letter, index)}
          value={input[index] || ''}
          onClick={handleInputClick.bind(null, letter, index)}
          />
      })}
    </div>
    <div className="flex flex-row justify-center mt-4">
      <button
      ref={buttonRef}
      className={'border-2 bg-rose-100 border-rose-300 text-lg rounded-lg p-3'} onClick={handleClick}>
        Next
      </button>
    </div>
    </div>
  )
}

interface QuizWrongAnswerProps {
  wrongAnswer: [DictionaryEntry, string]
  nextCallback: () => void
}

const QuizWrongAnswer = (props: QuizWrongAnswerProps) => {
  const word = props.wrongAnswer[0].word.replace(/\([0-9]\)*/g, '')
  const answer = props.wrongAnswer[1]

  return (<div>
    <div className="flex flex-row justify-center mb-4 space-x-y.5 items-center gap-2">
      {word.split('').map((letter, index) => {
        const isWrongClass = word[index].replace('ê', 'e') !== answer[index].replace('ê', 'e') ? 'bg-green-100' : ''
        return <input
          className={`${isWrongClass} text-base text-center w-10 border-2 border-rose-300 px-1 py-4 mb-2 gap-2 rounded-4`}
          key={index} type="text"
          readOnly={true}
          value={letter}
          />
      })}
    </div>

    <div className="flex flex-row justify-center mb-4 space-x-y.5 items-center gap-2">
      {answer.split('').map((letter, index) => {
        const isWrongClass = word[index].replace('ê', 'e') !== answer[index].replace('ê', 'e') ? 'bg-rose-100' : ''
        return <input
          className={`${isWrongClass} text-base text-center w-10 border-2 border-rose-300 px-1 py-4 mb-2 gap-2 rounded-4`}
          key={index} type="text"
          readOnly={true}
          value={letter}
          />
      })}
    </div>

    <div className="flex flex-row justify-center">
      <button
      autoFocus={true}
      className={'border-2 bg-rose-100 border-rose-300 text-lg rounded-lg p-3'} onClick={props.nextCallback}>
        Next
      </button>
    </div>


  </div>)
}

export const WritingQuiz = (props: { dictionary: DictionaryEntry[] }) => {
  const [index, setIndex] = useState(0)
  const [,setLocation] = useLocation()
  const [showLastWrongAnswer, setShowLastWrongAnswer] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState<[DictionaryEntry, string][]>([])
  const count = Math.min(20, props.dictionary.length)

  const incrementIndex = (incorrectDefinition: [DictionaryEntry, string] | null) => {
    if (incorrectDefinition) {
      setWrongAnswers(wrongAnswers.concat([incorrectDefinition]))
      setShowLastWrongAnswer(true)
    } else {
      setIndex(index + 1)
      setShowLastWrongAnswer(false)
    }
  }

  if ((index === (count) && !showLastWrongAnswer) || index > (count)) {
    const totalCount = props.dictionary.length;
    const correctCount = props.dictionary.length - wrongAnswers.length;
    return (
      <div className={'flex flex-col justify-center items-center m-2'}>
        <h2 className={'text-2xl font-bold p-6'}>Finished!</h2>
        <p className={'mb-6 text-3xl tracking-wide'}>{correctCount} / {totalCount}</p>
        <p className={'mb-6'}>Wrong answers:</p>

        <ul>
          {wrongAnswers.map(x => {
            return <p>{x[1]} &#x2192; <span className={'font-bold'}>{x[0].word}</span> ({x[0].definition})</p>
          })}
        </ul>

        <button
          className="text-center bg-rose-200 rounded-full p-2 mt-6 w-80 mb-2 md:hover:bg-rose-300"
          onClick={() => { setLocation('/redirect/writing-quiz') }}>Restart</button>
      </div>
    )
  }

  return (
    <div className={'flex justify-center flex-col mt-6 lg:mt-12 mb-6'}>
      {!showLastWrongAnswer &&
        <div className="flex flex-row justify-center ">
          <QuizCard entry={props.dictionary[index]}/>
        </div>
      }

      <div className="flex flex-row justify-center ">
      {showLastWrongAnswer &&
        <QuizWrongAnswer
          wrongAnswer={wrongAnswers[wrongAnswers.length - 1]}
          nextCallback={() => { setIndex(index + 1); setShowLastWrongAnswer(false)}}
          />}

        {!showLastWrongAnswer && <QuizInputArea incrementIndex={incrementIndex} entry={props.dictionary[index]}/>}
      </div>
      <div className={'flex justify-center flex-row pb-2 lg:pb-6 space-x-2.5'}>
        {/*<p className={'text-xl text-emerald-500'}>&#10004;</p>
        <p className={'text-xl text-rose-600'}>&#10006;</p>*/}
        <p className={'text-base lg:text-md mt-4 text-gray-600 tracking-widest'}>{index + 1}/{count}</p>
      </div>
    </div>
  )
}
