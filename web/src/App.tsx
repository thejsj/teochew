import React, { useState, useMemo } from 'react';
import { AutomcompletionInputField } from './AutomcompletionInputField'
import './App.css';

import { PengImDictionary, CharacterEntry , CharacterDictionary, RomaniationEntry} from './types'

interface MatchEntryViewProps {
  match: CharacterEntry
}

const MatchEntryView = (props: MatchEntryViewProps) => {
  const { match } = props;
  console.log(match);

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

const Home = () => {
  const [text, setText] = useState<string>('')
  console.log(text);

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

  return (
    <div>
      <div className="flex justify-center my-24">
        <div className="px-12 max-w-3xl md:w-2/3">
          <AutomcompletionInputField currentWord={text} setCurrentWord={setText}/>
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

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>InDou / 圆肚</h1>
        <p>TeoChew Dictionary</p>
      </header>
      <Home/>
    </div>
  );
}

export default App;
