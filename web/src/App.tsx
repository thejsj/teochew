import React, { useState, useRef } from 'react';
import { useVirtual } from '@tanstack/react-virtual';
import classNames from 'classnames';
import './App.css';

import { useCombobox } from 'downshift'
import romanizationsJSON from './romanizations.json';
import pengImDictionary from './pemg_im_dictionary.json';

console.log(romanizationsJSON);
console.log(pengImDictionary);

interface Book {
  id: string
  author: string
  title: string
}

function ComboBoxExample() {
  const books : Book[] = []
  for (var word of Object.keys(pengImDictionary)) {
    if (!word.includes(' ')) {
      books.push({ id: word, author: word, title: word })
    }
  }

  function estimateSize() {
    return 60
  }

  function getBooksFilter(inputValue: string | undefined) {
    return function booksFilter(book: Book) {
      return (
        !inputValue ||
        book.title?.toLowerCase().includes(inputValue) ||
        book.author.toLowerCase().includes(inputValue)
      )
    }
  }

  function ComboBox() {
    const [items, setItems] = useState<Book[]>(books)

    const listRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const rowVirtualizer = useVirtual({
      size: items.length,
      parentRef: listRef,
      estimateSize,
      overscan: 2,
    })


    const {
      isOpen,
      getToggleButtonProps,
      getLabelProps,
      getMenuProps,
      getInputProps,
      highlightedIndex,
      getItemProps,
      selectedItem,
    } = useCombobox({
      items,
      onInputValueChange({inputValue}) {
        console.log(inputValue)
        setItems(books.filter(getBooksFilter(inputValue)))

        if (!inputValue) {
          return;
        }
        const str : string = inputValue;

        if ((pengImDictionary as any)[str]) {

          const definition = (pengImDictionary as any)[str];
          console.log(definition);
          for (var def of definition.definitions) {
            console.log((romanizationsJSON as any)[def]);
          }

        } else {
          console.log('not found');
        }

      },
      itemToString(item) {
        return item && item.title ? item.title : ''
      },
      scrollIntoView() {},
      onHighlightedIndexChange({highlightedIndex: number }) {
        rowVirtualizer.scrollToIndex(highlightedIndex)
      },
    })

    return (
      <div>
        <div className="w-72 flex flex-col gap-1">
          <div className="flex shadow-sm bg-white gap-0.5">
            <input
              placeholder="Enter any word..."
              className="w-full p-1.5"
              {...getInputProps()}
            />
            <button
              aria-label="toggle menu"
              className="px-2"
              type="button"
              {...getToggleButtonProps()}
            >
              {isOpen ? <>&#8593;</> : <>&#8595;</>}
            </button>
          </div>
        </div>
        <ul
          {...getMenuProps({ref: listRef})}
          className="absolute p-0 w-72 bg-white shadow-md max-h-80 overflow-scroll"
        >
          {isOpen && (
            <>
              <li key="total-size" style={{height: rowVirtualizer.totalSize}} />
              {rowVirtualizer.virtualItems.map(virtualRow => (
                <li
                  className={classNames(
                    highlightedIndex === virtualRow.index && 'bg-blue-300',
                    selectedItem === items[virtualRow.index] && 'font-bold',
                    'py-2 px-3 shadow-sm flex flex-col',
                  )}
                  key={items[virtualRow.index].id}
                  {...getItemProps({
                    index: virtualRow.index,
                    item: items[virtualRow.index],
                  })}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <span>{items[virtualRow.index].title}</span>
                  <span className="text-sm text-gray-700">
                    {items[virtualRow.index].author}
                  </span>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    )
  }
  return <ComboBox />
}

const Home = () => {
  const [inputText, setInputText] = useState<string>('');
  console.log(inputText);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  }

  return (
    <div className="flex justify-center my-24">
      <div className="px-12 max-w-3xl md:w-2/3">
        <input className="p-4 w-full text-2xl border-slate-300 border-2 rounded-lg" type="text" maxLength={1000} value={inputText} onChange={handleOnChange}/>
        <ComboBoxExample/>
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
