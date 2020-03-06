// const validateAmount = (setErrors, inputs) => {
//   let amount = inputs.amount.trim();
//   let amountArray = amount.split(" ").map(item => item.trim());
//   if (
//     amountArray.length > 2 ||
//     (amount.includes("/") && amount.includes("."))
//   ) {
//     setErrors({ ...errors, amount: true });
//     return false;
//   }
//   if (amount.includes("/")) {
//     // parses whole number
//     const parsed = parseInt(amountArray[0], 10);
//     if (isNaN(parsed)) {
//       setErrors({ ...errors, amount: true });
//       return false;
//     }
//     const fraction = amountArray[1];
//     if (fraction in commonFractions) {
//       const decimal = commonFractions[fraction];
//       return decimal + parsed;
//     } else {
//       let slashIndex = fraction.indexOf("/");
//       const dividend = parseInt(fraction.slice(0, slashIndex), 10);
//       const divisor = parseInt(fraction.slice(slashIndex + 1), 10);
//       if (isNaN(dividend) || isNaN(divisor)) {
//         setErrors({ ...errors, amount: true });
//         return false;
//       } else {
//         const quotient = Math.floor((dividend / divisor) * 10000) / 1000;
//         return parsed + quotient;
//       }
//     }
//   }
//   if (amount.includes(".")) {
//     const parsedFl = parseFloat(amount, 10);
//     if (isNaN(parsedFl)) {
//       setErrors({ ...errors, amount: true });
//       return false;
//     } else {
//       return parsedFl;
//     }
//   }

//   if (!amount.includes(".") && !amount.includes("/")) {
//     let parsingAmount = amount;
//     if (amountArray.length > 1) {
//       parsingAmount = amountArray.join("");
//     }
//     const parsedInt = parseInt(parsingAmount, 10);
//     if (isNaN(parsedInt)) {
//       setErrors({ ...errors, amount: true });
//       return false;
//     } else {
//       return parsedInt;
//     }
//   }
// };

export const convertSimple = (amount, currentUnit, targetUnit) => {
  const unitFrom = unitDict[currentUnit];
  const unitTo = unitDict[targetUnit];
  console.log("util unitFrom find conversion", unitFrom)
  const amountmLs = amount * unitFrom.conversion;
  console.log("amountMLs", amountmLs)
  const unitToAmount = amountmLs / unitTo.conversion;
  console.log("unitToAmount", unitToAmount)
  const remainder = unitToAmount - Math.floor(unitToAmount)
  // if (unitToAmount - Math.floor(unitToAmount === 0)) {
  //   console.log("unitToAmount", unitToAmount,"Math.floor(unitToAmount)", Math.floor(unitToAmount), "minus", unitToAmount-Math.floor(unitToAmount))
  //   console.log("should return a whole number", Math.round(unitToAmount))
  //   //checks for whole numbers
  //   return Math.round(unitToAmount);
  // }
  if (unitTo.output === "decimal") {
    let amountTo2Decimal = Math.floor(unitToAmount * 100) / 100;
    console.log("should return a decimal", amountTo2Decimal)
    return amountTo2Decimal;
  } else {
    //unitTo[output]=="fraction"
    // const dotPos = unitToAmount.indexOf(".");
    // const decimal = unitToAmount.slice(dotPos + 1);
    const fractionValues = Object.values(commonFractions);
    let closestFractionVal = fractionValues.reduce((prev, curr) => 
      Math.abs(curr - remainder) < Math.abs(prev -remainder) ? curr : prev
    );
    console.log("closest fraction value", closestFractionVal)
    //tolerance is +/-2.5%
    const lowAmountTolerance = remainder*.985
    const highAmountTolerance = remainder*1.025
    console.log("lowAmountTolerance", lowAmountTolerance, "highAmountTolerance", highAmountTolerance)
    console.log("should return true", lowAmountTolerance<=closestFractionVal && closestFractionVal<=highAmountTolerance)
    if (lowAmountTolerance<=closestFractionVal && closestFractionVal<=highAmountTolerance) {
      let closestFraction = Object.keys(commonFractions).find(key=> (commonFractions[key]===closestFractionVal))
      console.log('should return fraction', Math.floor(unitToAmount) + closestFraction)

      return Math.floor(unitToAmount) + closestFraction
    }


    //find closest fraction
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
  ounce: "weight",
  pound: "weight",
  gram: "weight",
  kilogram: "weight"
};
