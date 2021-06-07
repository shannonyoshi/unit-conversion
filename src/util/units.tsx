import { Fraction, Unit } from "../types"
//fraction string, decimal value, commonFraction?
export const allFractions: Fraction[] = [
  { fraction: "", decimal: 0.0, common: true },
  { fraction: "1/64", decimal: 0.0156, common: false },
  { fraction: "1/48", decimal: 0.02083, common: false },
  { fraction: "1/32", decimal: 0.0313, common: false },
  { fraction: "3/64", decimal: 0.0469, common: false },
  { fraction: "1/16", decimal: 0.0625, common: false },
  { fraction: "5/64", decimal: 0.0781, common: false },
  { fraction: "3/32", decimal: 0.0938, common: false },
  { fraction: "1/10", decimal: 0.1, common: false },
  { fraction: "7/64", decimal: 0.1094, common: false },
  { fraction: "1/9", decimal: 0.1111, common: false },
  { fraction: "1/8", decimal: 0.125, common: false },
  { fraction: "9/64", decimal: 0.1406, common: false },
  { fraction: "5/32", decimal: 0.1563, common: false },
  { fraction: "1/6", decimal: 0.1667, common: false },
  { fraction: "11/64", decimal: 0.1718, common: false },
  { fraction: "3/16", decimal: 0.1875, common: false },
  { fraction: "1/5", decimal: 0.2, common: false },
  { fraction: "2/9", decimal: 0.2222, common: false },
  { fraction: "1/4", decimal: 0.25, common: true },
  { fraction: "5/16", decimal: 0.3125, common: false },
  { fraction: "1/3", decimal: 0.3333, common: true },
  { fraction: "3/8", decimal: 0.375, common: false },
  { fraction: "2/5", decimal: 0.4, common: false },
  { fraction: "7/16", decimal: 0.4375, common: false },
  { fraction: "4/9", decimal: 0.4444, common: false },
  { fraction: "1/2", decimal: 0.5, common: true },
  { fraction: "5/9", decimal: 0.5556, common: false },
  { fraction: "9/16", decimal: 0.5625, common: false },
  { fraction: "5/8", decimal: 0.625, common: false },
  { fraction: "2/3", decimal: 0.667, common: true },
  { fraction: "11/16", decimal: 0.6875, common: false },
  { fraction: "3/4", decimal: 0.75, common: true },
  { fraction: "7/9", decimal: 0.7778, common: false },
  { fraction: "13/16", decimal: 0.8125, common: false },
  { fraction: "5/6", decimal: 0.833, common: false },
  { fraction: "7/8", decimal: 0.875, common: false },
  { fraction: "8/9", decimal: 0.8889, common: false },
  { fraction: "15/16", decimal: 0.9375, common: false },
];

export const unitDict: {[unitName:string]:Unit} = {
  "drops":{
    name: "drops",
    normUnit: "mL",
    conversion: 0.0513429,
    output: "fraction",
    type: "US",
    singular: "drop",
  },
  "smidges":{
    name: "smidges",
    normUnit: "mL",
    conversion: 0.115522,
    output: "fraction",
    type: "US",
    singular: "smidge",
  },
  "pinches":{
    name: "pinches",
    normUnit: "mL",
    conversion: 0.231043,
    output: "fraction",
    type: "US",
    singular: "pinch",
  }, "dashes":{
    name: "dashes",
    normUnit: "mL",
    conversion: 0.462086,
    output: "fraction",
    type: "US",
    singular: "dash",
  },
  "milliliters":{
    name: "milliliters",
    normUnit: "mL",
    conversion: 1,
    output: "decimal",
    type: "metric",
    singular: "milliliter",
  },
  "teaspoons":{
    name: "teaspoons",
    normUnit: "mL",
    conversion: 4.92892,
    output: "fraction",
    type: "US",
    singular: "teaspoon",
  },
  "tablespoons":{
    name: "tablespoons",
    normUnit: "mL",
    conversion: 14.7868,
    output: "fraction",
    type: "US",
    singular: "tablespoon",
  },
  "fluid ounces":{
    name: "fluid ounces",
    normUnit: "mL",
    conversion: 29.5735,
    output: "fraction",
    type: "US",
    singular: "fluid ounce",
  },
  "cups":{
    name: "cups",
    normUnit: "mL",
    conversion: 236.588,
    output: "fraction",
    type: "US",
    singular: "cup",
  },
  "pints":{
    name: "pints",
    normUnit: "mL",
    conversion: 473.176,
    output: "fraction",
    type: "US",
    singular: "pint",
  },
  "quarts":{
    name: "quarts",
    normUnit: "mL",
    conversion: 946.353,
    output: "fraction",
    type: "US",
    singular: "quart",
  },
  "liters":{
    name: "liters",
    normUnit: "mL",
    conversion: 1000,
    output: "decimal",
    type: "metric",
    singular: "liter",
  },
  "gallons":{
    name: "gallons",
    normUnit: "mL",
    conversion: 3785.41,
    output: "fraction",
    type: "US",
    singular: "gallon",
  },
  "grams":{
    name: "grams",
    normUnit: "g",
    conversion: 1,
    output: "decimal",
    type: "metric",
    singular: "gram",
  },
  "ounces":{
    name: "ounces",
    normUnit: "g",
    conversion: 28.3495,
    output: "fraction",
    type: "US",
    singular: "ounce",
  },
  "pounds":{
    name: "pounds",
    normUnit: "g",
    conversion: 453.592,
    output: "fraction",
    type: "US",
    singular: "pound",
  },
  "kilograms":{
    name: "kilograms",
    normUnit: "g",
    conversion: 1000,
    output: "decimal",
    type: "metric",
    singular: "kilogram",
  },
}


//pluralUnit: {normUnit: mL or g, conversion: in mL/grams, output: fractions/decimal, type:metric/US}
// export const unitDict = {
//   drops: {
//     normUnit: "mL",
//     conversion: 0.0513429,
//     output: "fraction",
//     type: "US",
//     singular: "drop",
//   },
//   smidges: {
//     normUnit: "mL",
//     conversion: 0.115522,
//     output: "fraction",
//     type: "US",
//     singular: "smidge",
//   },
//   pinches: {
//     normUnit: "mL",
//     conversion: 0.231043,
//     output: "fraction",
//     type: "US",
//     singular: "pinch",
//   },
//   dashes: {
//     normUnit: "mL",
//     conversion: 0.462086,
//     output: "fraction",
//     type: "US",
//     singular: "dash",
//   },
//   milliliters: {
//     normUnit: "mL",
//     conversion: 1,
//     output: "decimal",
//     type: "metric",
//     singular: "milliliter",
//   },
//   teaspoons: {
//     normUnit: "mL",
//     conversion: 4.92892,
//     output: "fraction",
//     type: "US",
//     singular: "teaspoon",
//   },
//   tablespoons: {
//     normUnit: "mL",
//     conversion: 14.7868,
//     output: "fraction",
//     type: "US",
//     singular: "tablespoon",
//   },
//   "fluid ounces": {
//     normUnit: "mL",
//     conversion: 29.5735,
//     output: "fraction",
//     type: "US",
//     singular: "fluid ounce",
//   },
//   cups: {
//     normUnit: "mL",
//     conversion: 236.588,
//     output: "fraction",
//     type: "US",
//     singular: "cup",
//   },
//   pints: {
//     normUnit: "mL",
//     conversion: 473.176,
//     output: "fraction",
//     type: "US",
//     singular: "pint",
//   },
//   quarts: {
//     normUnit: "mL",
//     conversion: 946.353,
//     output: "fraction",
//     type: "US",
//     singular: "quart",
//   },
//   liters: {
//     normUnit: "mL",
//     conversion: 1000,
//     output: "decimal",
//     type: "metric",
//     singular: "liter",
//   },
//   gallons: {
//     normUnit: "mL",
//     conversion: 3785.41,
//     output: "fraction",
//     type: "US",
//     singular: "gallon",
//   },
//   grams: {
//     normUnit: "g",
//     conversion: 1,
//     output: "decimal",
//     type: "metric",
//     singular: "gram",
//   },
//   ounces: {
//     normUnit: "g",
//     conversion: 28.3495,
//     output: "fraction",
//     type: "US",
//     singular: "ounce",
//   },
//   pounds: {
//     normUnit: "g",
//     conversion: 453.592,
//     output: "fraction",
//     type: "US",
//     singular: "pound",
//   },
//   kilograms: {
//     normUnit: "g",
//     conversion: 1000,
//     output: "decimal",
//     type: "metric",
//     singular: "kilogram",
//   },
// };