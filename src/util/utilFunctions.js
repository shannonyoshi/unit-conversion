import { unitDict, allFractions } from "./units";
//returns parsed amount in decimal or false if amount is unable to be parsed
export const validateAmount = (amount) => {
  let amountArray = amount.split(" ").map((item) => item.trim());
  if (!amount.includes(".") && !amount.includes("/")) {
    const parsedWholeNum = parseInt(amountArray.join(""));
    console.log("parsedWholeNum", parsedWholeNum);
    if (isNaN(parsedWholeNum)) {
      return false;
    } else {
      return parsedWholeNum;
    }
  }
  if (amount.includes("/")) {
    // parses whole number
    const parsed = parseInt(amountArray[0], 10);
    if (isNaN(parsed)) {
      return false;
    } else {
      const fraction = amountArray[1];
      let slashIndex = fraction.indexOf("/");
      const dividend = parseInt(fraction.slice(0, slashIndex), 10);
      const divisor = parseInt(fraction.slice(slashIndex + 1), 10);
      if (isNaN(dividend) || isNaN(divisor)) {
        return false;
      } else {
        const quotient = Math.floor((dividend / divisor) * 1000) / 1000;
        return parsed + quotient;
      }
    }
  }
  if (amount.includes(".") && amountArray.length === 1) {
    const parsedFl = parseFloat(amount, 10);
    if (isNaN(parsedFl)) {
      return false;
    } else {
      return parsedFl;
    }
  }
  return false;
};

//checks if the conversion is weight=>weight or vol=>vol
export const checkIfSimple = (unitFrom, unitTo) => {
  console.log("in simpleConvert unitFrom", unitDict[unitFrom]);
  console.log("in simpleConvert unitTo", unitDict[unitTo].type);
  if (unitDict[unitFrom].type === unitDict[unitTo].type) {
    return true;
  }
  return false;
};

//performs simple conversion, returns string of converted amount + unit
export const convertSimple = (amount, startingUnitName, endUnit) => {
  let startingUnit = unitDict[startingUnitName];
  let targetUnit = unitDict[endUnit];
  const amountInmLs = amount * startingUnit.conversion;
  const targetUnitInDecimal = amountInmLs / targetUnit.conversion;
  const targetUnitInteger = Math.floor(targetUnitInDecimal);
  const decimalRemainder = targetUnitInDecimal - targetUnitInteger;

  //returns whole numbers + unit
  if (decimalRemainder <= 0.015) {
    return `${Math.floor(targetUnitInDecimal)} ${endUnit}`;
  }
  //returns amount with 2 decimal places for unit types that commonly use decimal (mostly metric)
  if (targetUnit.output === "decimal") {
    let amountTo2Decimal = Math.floor(targetUnitInDecimal * 100) / 100;
    return `${amountTo2Decimal.toString(10)} ${endUnit}`;
  }
  //ex. fraction = ["1/10", 0.1, false] means [fraction string, fraction in decimal, boolean if regular baking fraction]
  const fraction = findClosestFraction(decimalRemainder);

  //fraction[2] =true  means this is a common fraction used for baking
  if (fraction[2] === true) {
    if (targetUnitInteger === 0) {
      return `${fraction[0]} ${endUnit}`;
    } else {
      return `${targetUnitInteger} ${fraction[0]} ${endUnit}`;
    }
  } else {
    let remainingmLs = amountInmLs - targetUnitInteger * targetUnit.conversion;
    const mLsTolerance = calcTolerancemLs(amountInmLs);

    let converted = convertRemainder(
      remainingmLs,
      targetUnit.unit,
      mLsTolerance,
      startingUnitName
    );
    if (targetUnitInteger === 0) {
      if (converted) {
        return `${fraction[0]} ${endUnit} or ${converted}`;
      } else {
        return `${fraction[0]} ${endUnit}`;
      }
    } else {
      if (converted) {
        return `${targetUnitInteger} ${fraction[0]} ${endUnit} or ${targetUnitInteger} ${endUnit} plus ${converted}`;
      } else {
        return `${targetUnitInteger} ${fraction[0]} ${endUnit}`;
      }
    }
  }
};

//returns tolerance of 2.5% in mLs
const calcTolerancemLs = (amountInmLs) => {
  const upperLimitmLs = amountInmLs * 1.025 - amountInmLs;
  return upperLimitmLs;
};

//temporarily exporting to test
const convertRemainder = (
  remainingmLs,
  targetUnitType,
  mLsTolerance,
  startingUnitName
) => {
  let possibleUnits = findPossibleUnits(remainingmLs, targetUnitType);
  let mLs = remainingmLs;
  let result = [];
  for (let i = 0; i < possibleUnits.length; i++) {
    let unitmLs = possibleUnits[i][1];
    if (mLs >= unitmLs) {
      let count = 0;
      while (mLs + mLsTolerance >= unitmLs) {
        count += 1;
        mLs -= unitmLs;
      }
      result.push([count, possibleUnits[i][0]]);
    }
    //ends loop if total amount is within +/- 2.5% of total
    if (Math.abs(mLs) <= mLsTolerance) {
      break;
    }
  }

  if (result.length === 1 && result[0][1] == startingUnitName) {
    return null;
  }
  let resultingString = "";
  for (let i = 0; i < result.length; i++) {
    resultingString = resultingString.concat(
      ` ${result[i][0]} ${result[i][1]},`
    );
  }
  return resultingString.slice(0, -1);
};

const findClosestFraction = (remainder) => {
  let closestFraction = allFractions.reduce((prev, curr) =>
    Math.abs(curr[1] - remainder) < Math.abs(prev[1] - remainder) ? curr : prev
  );
  return closestFraction;
};

//returns array of units of same type that are smaller than remainingmLs, starting from largest unit
const findPossibleUnits = (remainingmLs, targetUnitType) => {
  let possible = [];
  for (let [key, value] of Object.entries(unitDict)) {
    if (value.unit === targetUnitType && value.conversion <= remainingmLs) {
      possible.push([key, value.conversion]);
    }
  }
  return possible.reverse();
};
