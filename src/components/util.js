const convertRemainder =(remainingmLs, targetUnitType)=> {
  let availableUnits = []
  for (let unit in unitDict) {
    if (unit.unit === targetUnitType && unit.conversion<=remainingmLs) {
      availableUnits.append([unit])
    }
  }
  console.log(availableUnits)
  // TODO: finish this
}


export const convertSimple = (amount, currentUnit, targetUnit) => {
  const unitFrom = unitDict[currentUnit];
  const unitTo = unitDict[targetUnit];
  const amountmLs = amount * unitFrom.conversion;
  const unitToAmount = amountmLs / unitTo.conversion;
  const remainder = unitToAmount - Math.floor(unitToAmount)
  if (unitTo.output === "decimal") {
    let amountTo2Decimal = Math.floor(unitToAmount * 100) / 100;
    return amountTo2Decimal.toString(10);
  } else {
    const fractionValues = Object.values(commonFractions);
    let closestFractionVal = fractionValues.reduce((prev, curr) => 
      Math.abs(curr - remainder) < Math.abs(prev -remainder) ? curr : prev
    );
    //tolerance is +/-2.5%
    const lowAmountTolerance = remainder*.985
    const highAmountTolerance = remainder*1.025
    if (lowAmountTolerance<=closestFractionVal && closestFractionVal<=highAmountTolerance) {
      let closestFraction = Object.keys(commonFractions).find(key=> (commonFractions[key]===closestFractionVal))
      return Math.floor(unitToAmount) + closestFraction
    } else {
      convertRemainder()
     //find largest unit that does not exceed remainder, until within 2.5%
     //get mLs left, remainder, then find largest smaller unit
    }
  }
  //if output is fraction,
  //if output is simple fraction, return fraction
  //otherwise calculate additional units (1 cup plus 2 tsp), return fraction, additional units fraction
  //handle output type: fraction vs decimal.
};

export const commonFractions = {
  "1/4": 0.25,
  "1/3": 0.333,
  "1/2": 0.5,
  "2/3": 0.667,
  "3/4": 0.75,
};


//unit: {type: mL or g, conversion: in mL/grams, output: fractions/decimal, unit:metric/US}
export const unitDict = {
  drop: {
    type: "mL",
    conversion: 0.0513429,
    output: "fraction",
    unit: "US"
  },
  smidge: {
    type: "mL",
    conversion: 0.115522,
    output: "fraction",
    unit: "US"
  },
  pinch: {
    type: "mL",
    conversion: 0.231043,
    output: "fraction",
    unit: "US"
  },
  dash: {
    type: "mL",
    conversion: 0.462086,
    output: "fraction",
    unit: "US"
  },
  teaspoon: {
    type: "mL",
    conversion: 4.92892,
    output: "fraction",
    unit: "US"
  },
  tablespoon: {
    type: "mL",
    conversion: 14.7868,
    output: "fraction",
    unit: "US"
  },
  "fluid ounce": {
    type: "mL",
    conversion: 29.5735,
    output: "fraction",
    unit: "US"
  },
  cup: {
    type: "mL",
    conversion: 236.588,
    output: "fraction",
    unit: "US"
  },
  pint: {
    type: "mL",
    conversion: 473.176,
    output: "fraction",
    unit: "US"
  },
  quart: {
    type: "mL",
    conversion: 946.353,
    output: "fraction",
    unit: "US"
  },
  gallon: {
    type: "mL",
    conversion: 3785.41,
    output: "fraction",
    unit: "US"
  },
  milliliter: {
    type: "mL",
    conversion: 1,
    output: "decimal",
    unit: "metric"
  },
  liter: {
    type: "mL",
    conversion: 29.5735,
    output: "decimal",
    unit: "metric"
  },
  ounce: {
    type: "g",
    conversion: 28.3495,
    output: "decimal",
    unit: "metric"
  },
  pound: {
    type: "g",
    conversion: 453.592,
    output: "decimal",
    unit: "metric"
  },
  gram: {
    type: "g",
    conversion: 1,
    output: "decimal",
    unit: "metric"
  },
  kilogram: {
    type: "g",
    conversion: 1000,
    output: "decimal",
    unit: "metric"
  }
};
