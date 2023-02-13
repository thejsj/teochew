import React from 'react';
import './App.css';

import { PhoneticDictionary } from './PhoneticDictionary'
import { MultipleChoiceQuiz } from './MultipleChoiceQuiz'
import { MainDictionary } from './MainDictionary'
import { WritingQuiz } from './WritingQuiz'
import { FlashCards, FlashCardSingleCard  } from './FlashCards'
import { Menu } from '@headlessui/react'
import { HamburgerIcon } from './Icons'
import { Link, Route,useRoute,  useLocation, Redirect } from "wouter";
import { VocabularySelector } from './VocabularySelector';

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

const popMenuLinks : Record<string, { label: string, component: JSX.Element }> = {
  '/': {
    label: 'Phonetic Dictionary',
    component: <PhoneticDictionary/>
  },
  '/dictionary': {
    label: 'Dictionary',
    component: <MainDictionary />
  },
  '/multiple-choice-quiz': {
    label: 'Multiple Choice Quiz',
    component: <VocabularySelector nextCompoent={MultipleChoiceQuiz} shouldShuffle={true}/>
  },
  '/writing-quiz': {
    label: 'Writing Quiz',
    component: <VocabularySelector nextCompoent={WritingQuiz} shouldShuffle={true}/>
  },
  '/flash-cards': {
    label: 'Flash Cards',
    component: <VocabularySelector nextCompoent={FlashCards}/>
  }
}

function App() {
  return (
    <div className="app" key={'main'}>
      <header className="app-header border-zinc-200 border-y-2 md:border-b-2 flex flex-row">
         <div className="flex-grow items-center">
            <a href="/">
              <h1 className={'text-xl p-4 border-zinc-200  border-r-2 inline-block text-rose-600'}>圆肚</h1>
            </a>
            <div className={'hidden md:inline'}>
              {Object.keys(popMenuLinks).map((key) => {
                return <MenuLink href={key} key={key}>{popMenuLinks[key].label}</MenuLink>
              })}
            </div>
          </div>
          <Menu as="div" className="text-left md:hidden">
            <Menu.Button>
              <div className={'h-full p-4 my-1'}>
                <HamburgerIcon/>
              </div>
            </Menu.Button>
            <Menu.Items className="absolute right-2 mt-2 w-72 origin-top-right divide-y divide-gray-100 rounded-md bg-white border-2 focus:outline-none border-zinc-200">
            <div className="px-1 py-1 ">

                {Object.keys(popMenuLinks).map((key) => {
                return (<Menu.Item key={key}>
                  <Link href={key}>
                    <a className={'group flex w-full items-center rounded-md px-2 py-2 text-xl first:border-0 border-t-[1px] border-zinc-200'} href={key}>{popMenuLinks[key].label}</a>
                    </Link>
                  </Menu.Item>)
                })}
              </div>
            </Menu.Items>
          </Menu>
      </header>
      <Route path="/" key={'/'}><PhoneticDictionary/></Route>
      <Route path="/word/:word" key={'word'}><PhoneticDictionary/></Route>
      <Route path="/dictionary/definition/:definition" key={'definition'}><MainDictionary/></Route>

      {Object.keys(popMenuLinks).map((key) => {
        if (key === '/') return null
        return <Route path={key} key={key}>{popMenuLinks[key].component}</Route>
      })}
      <Route path="/flash-card/:word" key={'flash-card'}><FlashCardSingleCard/></Route>

      <Route path="/redirect/multiple-choice-quiz" key={'redirect/multiple-choice-quiz'}>
        <Redirect to={'/multiple-choice-quiz'}/>
      </Route>
      <Route path="/redirect/writing-quiz" key={'redirect/writing-quiz'}>
        <Redirect to={'/writing-quiz'}/>
      </Route>
    </div>
  );
}

export default App;
