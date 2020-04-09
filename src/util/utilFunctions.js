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

const checkPluralUnit = (amount, endUnitName) => {

  let returnString = endUnitName;
  if (amount <= 1) {
    returnString = unitDict[endUnitName].singular;
  }
  console.log(`CheckPlural amount(${amount}) returnString(${returnString}), endUnitName(${endUnitName})`)
  return returnString;
};

//performs simple conversion, returns string of converted amount + unit
export const convertSimple = (amount, startingUnitName, endUnitName) => {
  let startingUnit = unitDict[startingUnitName];
  let targetUnit = unitDict[endUnitName];
  const amountInmLs = amount * startingUnit.conversion;
  const targetUnitInDecimal = amountInmLs / targetUnit.conversion;
  const targetUnitInteger = Math.floor(targetUnitInDecimal);
  const decimalRemainder = targetUnitInDecimal - targetUnitInteger;

  //returns whole numbers + unit
  if (decimalRemainder <= 0.015) {
    let unitString = checkPluralUnit(targetUnitInteger, endUnitName);
    return `${targetUnitInteger} ${unitString}`;
  }
  //returns amount with 2 decimal places for unit types that commonly use decimal (mostly metric)
  if (targetUnit.output === "decimal") {
    let amountTo2Decimal = Math.floor(targetUnitInDecimal * 100) / 100;
    let unitString = checkPluralUnit(amountTo2Decimal);
    return `${amountTo2Decimal.toString(10)} ${unitString}`;
  }
  //ex. fraction = ["1/10", 0.1, false] means [fraction string, fraction in decimal, boolean if regular baking fraction]
  const fraction = findClosestFraction(decimalRemainder);

  //fraction[2] =true  means this is a common fraction used for baking
  if (fraction[2] === true) {
    if (targetUnitInteger === 0) {
      let unitString = checkPluralUnit(fraction[1], endUnitName);
      return `${fraction[0]} ${unitString}`;
    } else {
      return `${targetUnitInteger} ${fraction[0]} ${endUnitName}`;
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
      let unitString = checkPluralUnit(fraction[1], endUnitName);
      if (converted) {
        return `${fraction[0]} ${unitString} or ${converted}`;
      } else {
        return `${fraction[0]} ${unitString}`;
      }
    } else {
      if (converted) {
        return `${targetUnitInteger} ${fraction[0]} ${endUnitName} or ${targetUnitInteger} ${endUnitName} plus ${converted}`;
      } else {
        return `${targetUnitInteger} ${fraction[0]} ${endUnitName}`;
      }
    }
  }
};

//returns tolerance of 2.5% in mLs
const calcTolerancemLs = (amountInmLs) => {
  const upperLimitmLs = amountInmLs * 1.025 - amountInmLs;
  return upperLimitmLs;
};

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

      let closestCmnFracs = findClosestCommonFractions(mLs / unitmLs);
      if (closestCmnFracs) {
        let higher = closestCmnFracs[1][1] * unitmLs;
        if (higher - mLs <= mLsTolerance) {
          count = `${count} ${closestCmnFracs[1][0]}`;
          mLs = mLs - higher;
        } else {
          count = `${count} ${closestCmnFracs[0][0]}`;
          mLs = mLs - closestCmnFracs[0][1];
        }
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
    let unitString = checkPluralUnit(result[i][0], result[i][1]);
    resultingString = resultingString.concat(` ${result[i][0]} ${unitString},`);
  }
  return resultingString.slice(0, -1);
};

const findClosestFraction = (remainder) => {
  let closestFraction = allFractions.reduce((prev, curr) =>
    Math.abs(curr[1] - remainder) < Math.abs(prev[1] - remainder) ? curr : prev
  );
  return closestFraction;
};

const getCommonFractions = () => {
  return allFractions.filter((fraction) => fraction[2] === true);
};

//removes first item in array, so commonFractionsindex] is 1 fraction lower than "fraction"
const findClosestCommonFractions = (remainder) => {
  const commonFractions = getCommonFractions();
  if (remainder < commonFractions[0][1]) {
    return null;
  }
  let fractionsArray = commonFractions.splice(0, 1);
  return fractionsArray.reduce((result, fraction, index) => {
    if (commonFractions[index] <= remainder && fraction >= remainder) {
      result.push(commonFractions[index], fraction);
    }
  }, []);
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
