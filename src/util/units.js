  //fraction string, decimal value, commonFraction?
  export const allFractions = [
    ["", 0.00, true],
    ["1/64", .0156, false],
    ["1/32", .0313, false],
    ["3/64", .0469, false],
    ["1/16", 0.0625, false],
    ["3/32", .0938, false],
    ["1/10", 0.1, false],
    ["7/64", .1094, false],
    ["1/9", 0.1111, false],
    ["1/8", 0.125, false],
    ["9/64", 0.1406, false],
    ["5/32", .1563, false],
    ["1/6", 0.1667, false],
    ["3/16", 0.1875, false],
    ["1/5", 0.2, false],
    ["2/9", 0.2222, false],
    ["1/4", 0.25, true],
    ["5/16", 0.3125, false],
    ["1/3", 0.3333, true],
    ["3/8", 0.375, false],
    ["2/5", 0.4, false],
    ["7/16", 0.4375, false],
    ["4/9", 0.4444, false],
    ["1/2", 0.5, true],
    ["5/9", 0.5556, false],
    ["9/16", 0.5625, false],
    ["5/8", 0.625, false],
    ["2/3", 0.667, true],
    ["11/16", 0.6875, false],
    ["3/4", 0.75, true],
    ["7/9", .7778, false],
    ["13/16", 0.8125, false],
    ["5/6", 0.833, false],
    ["7/8", 0.875, false],
    ["8/9", 0.8889, false],
    ["15/16", 0.9375, false],
  ]
  
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
      conversion: 1000,
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
  