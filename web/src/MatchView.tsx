import React, { useRef } from 'react';
import CheckIcon from '@heroicons/react/20/solid/CheckIcon'
import PlayIcon from '@heroicons/react/20/solid/PlayIcon'

import { CharacterEntry , RomaniationEntry} from './types'


interface RomanizationEntryViewProps {
  entry: RomaniationEntry
}

const RomanizationEntryView = (props: RomanizationEntryViewProps) => {
  const ref = useRef<HTMLAudioElement>(null)
  const romanization = props.entry

  const cssClass = romanization.verified  ? 'bg-green-100 border-green-300' : 'border-zinc-200'
  const buttonCssClass = romanization.verified  ? 'bg-green-300' : 'bg-zinc-200'
  const subButtonButtonCssClass = romanization.verified  ? 'text-green-600' : 'text-zing-600'

  const verifiedText = romanization.verified ? <div className={'grow flex justify-end'}><CheckIcon className={'h-6 w-6 mx-2 text-green-600 inline justify-self-start'}/></div> : null

  const handleClick = () => {
    ref?.current?.play()
  }

   return (
    <div className={`${cssClass} mt-4  border-2 p-4 rounded-lg flex flex-row items-center`}>
      {romanization.soundLink && (<span className={`${buttonCssClass} cursor-pointer rounded-full h-10 w-10 flex justify-center items-center mr-4`} onClick={handleClick}>
        <PlayIcon className={`${subButtonButtonCssClass} h-6 w-6 mx-2 inline`}/>
      </span>)}
      <span className="text-lg">{romanization.pengIm}</span>
      {verifiedText}

      <audio controls ref={ref} className={'hidden'}>
        <source src={`https://www.mogher.com/${romanization.soundLink}`} type="audio/mpeg"/>
      </audio>
    </div>
   )
}

interface MatchEntryViewProps {
  match: CharacterEntry
}


export const MatchEntryView = (props: MatchEntryViewProps) => {
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
              return <RomanizationEntryView key={romanization.pengIm} entry={romanization} />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
