import React, { useState, useRef } from "react";
import { useVirtual } from "@tanstack/react-virtual";
import { useCombobox } from "downshift";
import classNames from "classnames";
import "./App.css";

import { PengImDictionary,  WordEntry } from './types'

const entries: WordEntry[] = [];
for (var entry of Object.keys(PengImDictionary)) {
  if (!entry.includes(" ")) {
    const characters = PengImDictionary[entry].definitions.join(' / ')
    entries.push({ word: entry, characters, definitions: entry });
  }
}

function estimateSize() {
  return 60;
}

function getBooksFilter(inputValue: string | undefined) {
  return function booksFilter(entry: WordEntry) {
    return (
      !inputValue ||
      entry.word?.toLowerCase().includes(inputValue) ||
      entry.characters?.toLowerCase().includes(inputValue)
    );
  };
}

interface AutomcompletionInputFieldPros {
  currentWord: string;
  setCurrentWord: (str: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;

}

export const AutomcompletionInputField = (
  props: AutomcompletionInputFieldPros
) => {
  const { currentWord, setCurrentWord } = props;
  const [items, setItems] = useState<WordEntry[]>(entries);

  const listRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef: listRef,
    estimateSize,
    overscan: 2,
  });

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({ items, inputValue: currentWord, onInputValueChange({ inputValue }) {
      setItems(entries.filter(getBooksFilter(inputValue)));
      setCurrentWord(inputValue || "");
    },
    itemToString(item) {
      return item && item.word ? item.word : "";
    },
    scrollIntoView() {},
    onHighlightedIndexChange({ highlightedIndex: number }) {
      rowVirtualizer.scrollToIndex(highlightedIndex);
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-1">
        <div className="flex shadow-sm bg-white gap-0.5">
          <input
            placeholder="Enter any word..."
            className="p-6 w-full text-3xl border-slate-300 border-2 rounded-lg"
            autoFocus
            ref={props.inputRef}
            {...getInputProps()}
          />
          {/*
          <button
            aria-label="toggle menu"
            className="px-2"
            type="button"
            {...getToggleButtonProps()}
          >
            {isOpen ? <>&#8593;</> : <>&#8595;</>}
          </button>
          */}
        </div>
      <ul
        {...getMenuProps({ref: listRef})}
        className="absolute z-40 mt-24 max-w-2xl md:w-2/3 p-0 w-full bg-white shadow-md max-h-80 overflow-scroll"
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
                key={items[virtualRow.index].word}
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
                <span>{items[virtualRow.index].word}</span>
                <span className="text-sm text-gray-700">
                  {items[virtualRow.index].characters}
                </span>
              </li>
            ))}
          </>
        )}
      </ul>
      </div>
    </div>
  )
};
