import { Fraction, Unit } from "../types"
//fraction string, decimal value, commonFraction?
export const allFractions: Fraction[] = [
  { string: "", decimal: 0.0, common: true },
  { string: "1/64", decimal: 0.0156, common: false },
  { string: "1/48", decimal: 0.02083, common: false },
  { string: "1/32", decimal: 0.0313, common: false },
  { string: "3/64", decimal: 0.0469, common: false },
  { string: "1/16", decimal: 0.0625, common: false },
  { string: "5/64", decimal: 0.0781, common: false },
  { string: "3/32", decimal: 0.0938, common: false },
  { string: "1/10", decimal: 0.1, common: false },
  { string: "7/64", decimal: 0.1094, common: false },
  { string: "1/9", decimal: 0.1111, common: false },
  { string: "1/8", decimal: 0.125, common: false },
  { string: "9/64", decimal: 0.1406, common: false },
  { string: "5/32", decimal: 0.1563, common: false },
  { string: "1/6", decimal: 0.1667, common: false },
  { string: "11/64", decimal: 0.1718, common: false },
  { string: "3/16", decimal: 0.1875, common: false },
  { string: "1/5", decimal: 0.2, common: false },
  { string: "2/9", decimal: 0.2222, common: false },
  { string: "1/4", decimal: 0.25, common: true },
  { string: "5/16", decimal: 0.3125, common: false },
  { string: "1/3", decimal: 0.3333, common: true },
  { string: "3/8", decimal: 0.375, common: false },
  { string: "2/5", decimal: 0.4, common: false },
  { string: "7/16", decimal: 0.4375, common: false },
  { string: "4/9", decimal: 0.4444, common: false },
  { string: "1/2", decimal: 0.5, common: true },
  { string: "5/9", decimal: 0.5556, common: false },
  { string: "9/16", decimal: 0.5625, common: false },
  { string: "5/8", decimal: 0.625, common: false },
  { string: "2/3", decimal: 0.667, common: true },
  { string: "11/16", decimal: 0.6875, common: false },
  { string: "3/4", decimal: 0.75, common: true },
  { string: "7/9", decimal: 0.7778, common: false },
  { string: "13/16", decimal: 0.8125, common: false },
  { string: "5/6", decimal: 0.833, common: false },
  { string: "7/8", decimal: 0.875, common: false },
  { string: "8/9", decimal: 0.8889, common: false },
  { string: "15/16", decimal: 0.9375, common: false },
  // { string: "1", decimal: 1.0, common: true }
];

export const unitDict: { [unitName: string]: Unit } = {
  "drops": {
    name: "drops",
    normUnit: "mL",
    conversion: 0.0513429,
    output: "fraction",
    type: "US",
    singular: "drop",
    aka:[]
  },
  "smidges": {
    name: "smidges",
    normUnit: "mL",
    conversion: 0.115522,
    output: "fraction",
    type: "US",
    singular: "smidge",
    aka:[]
  },
  "pinches": {
    name: "pinches",
    normUnit: "mL",
    conversion: 0.231043,
    output: "fraction",
    type: "US",
    singular: "pinch",
    aka:[]
  },
  "dashes": {
    name: "dashes",
    normUnit: "mL",
    conversion: 0.462086,
    output: "fraction",
    type: "US",
    singular: "dash",
    aka: ["ds"]
  },
  "milliliters": {
    name: "milliliters",
    normUnit: "mL",
    conversion: 1,
    output: "decimal",
    type: "metric",
    singular: "milliliter",
    aka: ["ml", "mL"]
  },
  "teaspoons": {
    name: "teaspoons",
    normUnit: "mL",
    conversion: 4.92892,
    output: "fraction",
    type: "US",
    singular: "teaspoon",
    aka: ["t", "ts", "tsp", "tspn"]
  },
  "tablespoons": {
    name: "tablespoons",
    normUnit: "mL",
    conversion: 14.7868,
    output: "fraction",
    type: "US",
    singular: "tablespoon",
    aka: ["T", "TB", "Tb", "tb", "Tbl", "tbl", "Tbs", "tbs", "Tbsp", "tbsp",]
  },
  "fluid ounces": {
    name: "fluid ounces",
    normUnit: "mL",
    conversion: 29.5735,
    output: "fraction",
    type: "US",
    singular: "fluid ounce",
    aka: ["fluid oz", "fl oz", "oz fl"]

  },
  "cups": {
    name: "cups",
    normUnit: "mL",
    conversion: 236.588,
    output: "fraction",
    type: "US",
    singular: "cup",
    aka: ["c"]
  },
  "pints": {
    name: "pints",
    normUnit: "mL",
    conversion: 473.176,
    output: "fraction",
    type: "US",
    singular: "pint",
    aka: ["p", "pt"]
  },
  "quarts": {
    name: "quarts",
    normUnit: "mL",
    conversion: 946.353,
    output: "fraction",
    type: "US",
    singular: "quart",
    aka: ["q", "qt", "qts"]
  },
  "liters": {
    name: "liters",
    normUnit: "mL",
    conversion: 1000,
    output: "decimal",
    type: "metric",
    singular: "liter",
    aka: ["l", "lt", "ltr"]
  },
  "gallons": {
    name: "gallons",
    normUnit: "mL",
    conversion: 3785.41,
    output: "fraction",
    type: "US",
    singular: "gallon",
    aka: ["gl", "gal"]
  },
  "grams": {
    name: "grams",
    normUnit: "g",
    conversion: 1,
    output: "decimal",
    type: "metric",
    singular: "gram",
    aka: ["g", "gm"]
  },
  "ounces": {
    name: "ounces",
    normUnit: "g",
    conversion: 28.3495,
    output: "fraction",
    type: "US",
    singular: "ounce",
    aka: ["oz"]
  },
  "pounds": {
    name: "pounds",
    normUnit: "g",
    conversion: 453.592,
    output: "fraction",
    type: "US",
    singular: "pound",
    aka: ["lb", "lbs"]
  },
  "kilograms": {
    name: "kilograms",
    normUnit: "g",
    conversion: 1000,
    output: "decimal",
    type: "metric",
    singular: "kilogram",
    aka: ["kg", "kgs", "kilo"]
  },
}