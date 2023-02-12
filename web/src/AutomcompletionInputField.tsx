import React, { useState, useRef } from "react";
import { useVirtual } from "@tanstack/react-virtual";
import { useCombobox } from "downshift";
import classNames from "classnames";
import "./App.css";

import {  SearchEntry } from './types'

function estimateSize() {
  return 60;
}

interface AutomcompletionInputFieldPros {
  currentWord: string;
  setCurrentWord: (str: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  entries: SearchEntry[]
  filter: (inputValue: string | undefined) => (entry: SearchEntry) => boolean
}

export const AutomcompletionInputField = (
  props: AutomcompletionInputFieldPros
) => {
  const { currentWord, setCurrentWord } = props;
  const entries = props.entries
  const [items, setItems] = useState<SearchEntry[]>(entries);

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
      const items = entries.filter(props.filter(inputValue)).sort((a, b) => {
        return a.subTitle.length > b.subTitle.length ? 1 : -1
      })
      setItems(items);
      setCurrentWord(inputValue?.toLowerCase() || "");
    },
    itemToString(item) {
      return item && item.queryTerm ? item.queryTerm : "";
    },
    scrollIntoView() {},
    onHighlightedIndexChange({ highlightedIndex: number }) {
      rowVirtualizer.scrollToIndex(highlightedIndex);
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-1">
        <div className="flex shadow-sm bg-white">
          <input
            placeholder="Enter any word..."
            className="p-6 w-full text-3xl border-slate-300 border-2 rounded-lg outline-rose-400"
            autoFocus
            autoCapitalize={"none"}
            ref={props.inputRef}
            {...getInputProps()}
          />
        </div>
      <ul
        {...getMenuProps({ref: listRef})}
        className="absolute z-40 mt-24 max-w-2xl md:w-2/3 p-0 w-full bg-white shadow-md max-h-80 overflow-y-scroll overflow-x-hidden"
      >
        {isOpen && (
          <>
            <li key="total-size" style={{height: rowVirtualizer.totalSize}} />
            {rowVirtualizer.virtualItems.map(virtualRow => {
              console.log(items[virtualRow.index])
              return (<li
                className={classNames(
                  highlightedIndex === virtualRow.index && 'bg-blue-300',
                  selectedItem === items[virtualRow.index] && 'font-bold',
                  'py-2 px-3 shadow-sm flex flex-col',
                )}
                key={items[virtualRow.index].queryTerm}
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
                  {items[virtualRow.index].subTitle}
                </span>
              </li>)
            })}
          </>
        )}
      </ul>
      </div>
    </div>
  )
};
