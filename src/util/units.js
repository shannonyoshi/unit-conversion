

export const commonFractions = {
    "1/4": 0.25,
    "1/3": 0.333,
    "1/2": 0.5,
    "2/3": 0.667,
    "3/4": 0.75
  };
  
  export const uncommonFractions = {
    "1/16": 0.0625,
    "1/10": 0.1,
    "1/8": 0.125,
    "1/6": 0.1667,
    "3/16": 0.1875,
    "1/5": 0.2,
    "1/4": 0.25,
    "5/16": 0.3125,
    "1/3": 0.333,
    "3/8": 0.375,
    "2/5": 0.4,
    "7/16": 0.4375,
    "1/2": 0.5,
    "9/16": 0.5625,
    "5/8": 0.625,
    "2/3": 0.667,
    "11/16": 0.6875,
    "3/4": 0.75,
    "13/16": 0.8125,
    "5/6": 0.833,
    "7/8": 0.875,
    "15/16": 0.9375
  };
  
  //unit: {type: mL or g, conversion: in mL/grams, output: fractions/decimal, unit:metric/US}
  export const unitDict = {
    "drop(s)": {
      type: "mL",
      conversion: 0.0513429,
      output: "fraction",
      unit: "US"
    },
    "smidge(s)": {
      type: "mL",
      conversion: 0.115522,
      output: "fraction",
      unit: "US"
    },
    "pinch(es)": {
      type: "mL",
      conversion: 0.231043,
      output: "fraction",
      unit: "US"
    },
    "dash(es)": {
      type: "mL",
      conversion: 0.462086,
      output: "fraction",
      unit: "US"
    },
    "teaspoon(s)": {
      type: "mL",
      conversion: 4.92892,
      output: "fraction",
      unit: "US"
    },
    "tablespoon(s)": {
      type: "mL",
      conversion: 14.7868,
      output: "fraction",
      unit: "US"
    },
    "fluid ounce(s)": {
      type: "mL",
      conversion: 29.5735,
      output: "fraction",
      unit: "US"
    },
    "cup(s)": {
      type: "mL",
      conversion: 236.588,
      output: "fraction",
      unit: "US"
    },
    "pint(s)": {
      type: "mL",
      conversion: 473.176,
      output: "fraction",
      unit: "US"
    },
    "quart(s)": {
      type: "mL",
      conversion: 946.353,
      output: "fraction",
      unit: "US"
    },
    "gallon(s)": {
      type: "mL",
      conversion: 3785.41,
      output: "fraction",
      unit: "US"
    },
    "milliliter(s)": {
      type: "mL",
      conversion: 1,
      output: "decimal",
      unit: "metric"
    },
    "liter(s)": {
      type: "mL",
      conversion: 29.5735,
      output: "decimal",
      unit: "metric"
    },
    "ounce(s)": {
      type: "g",
      conversion: 28.3495,
      output: "decimal",
      unit: "metric"
    },
    "pound(s)": {
      type: "g",
      conversion: 453.592,
      output: "decimal",
      unit: "metric"
    },
    "gram(s)": {
      type: "g",
      conversion: 1,
      output: "decimal",
      unit: "metric"
    },
    "kilogram(s)": {
      type: "g",
      conversion: 1000,
      output: "decimal",
      unit: "metric"
    }
  };
  