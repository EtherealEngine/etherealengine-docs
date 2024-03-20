// @section Color Palette
const Color = {
  tailwind : {
    blue500    : "#3B82F6",
    pink300    : "#F9A8D4",
    pink400    : "#F472b6",
    teal300    : "#5EEAD4",
    green400   : "#4ade80",
    green500   : "#10b981",
    amber300   : "#FCD34D",
    amber500   : "#F59E0B",
    rose500    : "#F43F5E",
    neutral400 : "#A3A3A3",
  },
  font: {
    bright: "#F5F5F5",
  },
  bg: {
    dark: "#1F1F1F",
  }
}

// @section Ethereal Engine Code color theme
import type { PrismTheme } from 'prism-react-renderer'
export const ethereal = {
  dark: {
    plain: {
      color: Color.font.bright,
      backgroundColor: Color.bg.dark,
    },
    styles: [
      { types: ["keyword"],     style: { color: Color.tailwind.blue500, fontStyle: "italic", }},
      { types: ["variable"],    style: { color: Color.tailwind.blue500, fontStyle: "italic", }},
      { types: ["punctuation"], style: { color: Color.tailwind.pink300, }},
      { types: ["symbol"],      style: { color: Color.tailwind.pink300, }},
      { types: ["builtin"],     style: { color: Color.tailwind.pink400, }},
      { types: ["string"],      style: { color: Color.tailwind.amber300, }},
      { types: ["char"],        style: { color: Color.tailwind.amber300, }},
      { types: ["tag"],         style: { color: Color.tailwind.amber300, }},
      { types: ["selector"],    style: { color: Color.tailwind.amber300, }},
      { types: ["inserted"],    style: { color: Color.tailwind.teal300, }},
      { types: ["function"],    style: { color: Color.tailwind.green400, }},
      { types: ["comment"],     style: { color: Color.tailwind.neutral400, }},
      { types: ["prolog"],      style: { color: Color.tailwind.amber500, }},
      { types: ["constant"],    style: { color: Color.tailwind.amber500, }},
      /* @todo What are these used for? */
      { types: ["deleted"],   style: { color: "rgb(255, 85, 85)",   }},
      { types: ["changed"],   style: { color: "rgb(255, 184, 108)", }},
      { types: ["attr-name"], style: { color: "rgb(241, 250, 140)", }},
    ],
  } satisfies PrismTheme,
  /* @todo Light Mode
  light: {
  } satisfies PrismTheme,
  */
}

