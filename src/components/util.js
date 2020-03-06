const validateAmount = (setErrors, inputs) => {
  let amount = inputs.amount.trim();
  let amountArray = amount.split(" ").map(item => item.trim());
  if (
    amountArray.length > 2 ||
    (amount.includes("/") && amount.includes("."))
  ) {
    setErrors({ ...errors, amount: true });
    return false;
  }
  if (amount.includes("/")) {
    // parses whole number
    const parsed = parseInt(amountArray[0], 10);
    if (isNaN(parsed)) {
      setErrors({ ...errors, amount: true });
      return false;
    }
    const fraction = amountArray[1];
    if (fraction in commonFractions) {
      const decimal = commonFractions[fraction];
      return decimal + parsed;
    } else {
      let slashIndex = fraction.indexOf("/");
      const dividend = parseInt(fraction.slice(0, slashIndex), 10);
      const divisor = parseInt(fraction.slice(slashIndex + 1), 10);
      if (isNaN(dividend) || isNaN(divisor)) {
        setErrors({ ...errors, amount: true });
        return false;
      } else {
        const quotient = Math.floor((dividend / divisor) * 10000) / 1000;
        return parsed + quotient;
      }
    }
  }
  if (amount.includes(".")) {
    const parsedFl = parseFloat(amount, 10);
    if (isNaN(parsedFl)) {
      setErrors({ ...errors, amount: true });
      return false;
    } else {
      return parsedFl;
    }
  }

  if (!amount.includes(".") && !amount.includes("/")) {
    let parsingAmount = amount;
    if (amountArray.length > 1) {
      parsingAmount = amountArray.join("");
    }
    const parsedInt = parseInt(parsingAmount, 10);
    if (isNaN(parsedInt)) {
      setErrors({ ...errors, amount: true });
      return false;
    } else {
      return parsedInt;
    }
  }
};

export const convertSimple = (amount, currentUnit, targetUnit) => {
  const unitFrom = unitDict[currentUnit];
  const unitTo = unitDict[targetUnit];
  const amountmLs = amount * unitFrom[conversion];
  const unitToAmount = amountmLs / unitTo[conversion];
  if (unitToAmount - Math.floor(unitToAmount === 0)) {
    //checks for whole numbers
    return unitToAmount;
  }
  if (unitTo[output] === "decimal") {
    amountTo2Decimal = Math.floor(unitToAmount * 100) / 100;
    return amountTo2Decimal;
  } else {
    //unitTo[output]=="fraction"
    const dotPos = unitToAmount.indexOf(".");
    const decimal = unitToAmount.slice(dotPos + 1);
    const fractionValues = Object.values(commonFractions);
    let closestFractionVal = fractionValues.reduce((prev, curr) => {
      Math.abs(curr - decimal) < Math.abs(prev - goal) ? curr : prev;
    });

    //find closest fraction
  }
  //perform the mL conversion: amount*unitFrom mLs /unitTo
  //if output is decimal, return unit to 2 decimal points
  //if output is fraction,
  //if output is simple fraction, return fraction
  //otherwise calculate additional units (1 cup plus 2 tsp), return fraction, additional units fraction
  //handle output type: fraction vs decimal.
};

export const commonFractions = {
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
