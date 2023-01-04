import React from 'react';
import './App.css';

import { PhoneticDictionary } from './PhoneticDictionary'
import { Quiz } from './Quiz'
import { Link, Route,useRoute,  useLocation } from "wouter";


const MenuLink = (props: { href: string, children: JSX.Element | string}) => {
  const [isMatch] = useRoute(props.href);
  const [location] = useLocation();
  const isActive = isMatch || (location.includes('/word/') && props.href === '/')

  return (
    <Link href={props.href}>
      <a href={props.href} className={isActive ? "border-zing-300 border-b-2 text-zinc-500 ml-4 pb-px'" : "ml-4 pb-px'"}>{props.children}</a>
    </Link>
  );
}

function App() {
  return (
    <div className="app">
      <header className="app-header border-zinc-200  border-b-2">
        <a href="/">
          <h1 className={'text-xl p-4 border-zinc-200  border-r-2 inline-block'}>圆肚</h1>
        </a>

        <MenuLink href={'/'}>Phonetic Dictionary</MenuLink>
        <MenuLink href={'/quiz'}>Quiz</MenuLink>
      </header>
      <Route path="/"><PhoneticDictionary/></Route>
      <Route path="/word/:word"><PhoneticDictionary/></Route>
      <Route path="/quiz"><Quiz/></Route>
    </div>
  );
}

export default App;
