import React from 'react';
import './App.css';

import { PhoneticDictionary } from './PhoneticDictionary'
import { Quiz } from './Quiz'
import { Menu } from '@headlessui/react'
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

const popMenuLinks : Record<string, { label: string, component: JSX.Element }> = {
  '/': {
    label: 'Phonetic Dictionary',
    component: <PhoneticDictionary/>
  },
  '/quiz': {
    label: 'Quiz',
    component: <Quiz/>
  }
}

function HamburgerIcon() {
  return (
    <div className={'w-5 h-5'}>
    <svg viewBox="0 0 100 80" width="40" height="40" className={'w-full h-full fill-rose-300'}>
        <rect width="100" height="15"></rect>
        <rect y="30" width="100" height="15"></rect>
        <rect y="60" width="100" height="15"></rect>
    </svg>
    </div>
  )
}

function App() {
  return (
    <div className="app">
      <header className="app-header border-zinc-200 border-y-2 md:border-b-2 flex flex-row">
         <div className="flex-grow items-center">
            <a href="/">
              <h1 className={'text-xl p-4 border-zinc-200  border-r-2 inline-block text-rose-600'}>圆肚</h1>
            </a>
            <div className={'hidden md:block'}>
              {Object.keys(popMenuLinks).map((key) => {
                return <MenuLink href={key}>{popMenuLinks[key].label}</MenuLink>
              })}
            </div>
          </div>
          <Menu as="div" className="text-left md:hidden">
            <Menu.Button>
              <button className={'h-full p-4 my-1'}>
                <HamburgerIcon/>
              </button>
            </Menu.Button>
            <Menu.Items className="absolute right-2 mt-2 w-72 origin-top-right divide-y divide-gray-100 rounded-md bg-white border-2 focus:outline-none border-zinc-200">
            <div className="px-1 py-1 ">

                {Object.keys(popMenuLinks).map((key) => {
                return (<Menu.Item>
                  <Link href={key}>
                    <a className={'group flex w-full items-center rounded-md px-2 py-2 text-xl first:border-0 border-t-[1px] border-zinc-200'} href={key}>{popMenuLinks[key].label}</a>
                    </Link>
                  </Menu.Item>)
                })}
              </div>
            </Menu.Items>
          </Menu>
      </header>
      <Route path="/"><PhoneticDictionary/></Route>
      <Route path="/word/:word"><PhoneticDictionary/></Route>
      <Route path="/quiz"><Quiz/></Route>
    </div>
  );
}

export default App;
