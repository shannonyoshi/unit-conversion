import { unitDict, allFractions } from "./units";
//returns parsed amount in decimal or false if amount is unable to be parsed
export const validateAmount = (amount) => {
  //probably will never catch anything with this one
  let result = false;
  if (typeof amount === "number") {
    return amount;
  }
  //split amount on white space, then remove excess white space
  let amountArray = amount.split(" ").map((item) => item.trim());
  amountArray = amountArray.filter((item) => item !== "");
  //if whole number
  if (!amount.includes(".") && !amount.includes("/") && !amount.includes(",")) {
    const parsedWholeNum = parseInt(amountArray.join(""));
    // console.log("parsedWholeNum", parsedWholeNum);
    if (typeof parsedWholeNum == "number") {
      result = parsedWholeNum;
    }
  }
  //if amount is/has fraction
  if (amount.includes("/")) {
    result = validateFraction(amountArray);
  }
  if (
    (amount.includes(".") || amount.includes(",")) &&
    amountArray.length === 1
  ) {
    const parsedFl = parseFloat(amountArray[0], 10);
    if (typeof parsedFl === "number") {
      result = parsedFl;
    }
  }
  console.log("result", result);
  return result;
};

const validateFraction = (amountArray) => {
  let fracIndex = [];
  const fraction = amountArray.filter((string, index) => {
    if (string.includes("/")) {
      fracIndex.push(index);
      return true;
    }
  });
  //if one fraction was found
  if (fracIndex.length === 1) {
    fracIndex = fracIndex[0];
    let parsed = 0;
    // for numbers >1
    if (fracIndex > 0) {
      parsed = parseInt(amountArray.slice(0, fracIndex).join(""), 10);
    }
    const fracArray = fraction[0].split("/");
    const dividend = parseInt(fracArray[0], 10);
    const divisor = parseInt(fracArray[1], 10);
    if (
      typeof dividend == "number" &&
      typeof divisor == "number" &&
      typeof parsed == "number"
    ) {
      const quotient = Math.floor((dividend / divisor) * 1000) / 1000;
      return parsed + quotient;
    }
  }
  return false;
};

//checks if the conversion is weight=>weight or vol=>vol
export const checkIfSimple = (unitFrom, unitTo) => {
  if (unitDict[unitFrom].type === unitDict[unitTo].type) {
    return true;
  }
  return false;
};

export const checkPluralUnit = (amount, endUnitName) => {
  let returnString = endUnitName;
  if (0 < amount && amount <= 1) {
    returnString = unitDict[endUnitName].singular;
  }
  return returnString;
};

//returns tolerance in mLs of 2.5%
export const calcNormalizedTolerance = (normalizedAmount) => {
  const twoPointFivePercent = normalizedAmount * 1.025 - normalizedAmount;

  return twoPointFivePercent;
};

export const findClosestFraction = (remainder) => {
  let closestFraction = allFractions.reduce((prev, curr) =>
    Math.abs(curr[1] - remainder) < Math.abs(prev[1] - remainder) ? curr : prev
  );
  return closestFraction;
};

//returns "common fractions," including thirds when unit is tablespoon or smaller
export const getCommonFractions = (excludeThirds) => {
  if (excludeThirds) {
    let fractions = allFractions.filter(
      (fraction) => fraction[2] === true && fraction[0].split("/")[1] % 3 !== 0
    );
    return fractions;
  }

  return allFractions.filter((fraction) => fraction[2] === true);
};

//removes first item in array, so commonFractions[Index] is 1 fraction lower than "fraction"
export const findClosestCommonFractions = (decimal, excludeThirds = false) => {
  // console.log('findClosestCommonFraction')
  // console.log('decimal', decimal)
  const commonFractions = getCommonFractions(excludeThirds);
  // console.log('commonFractions[0][1]', commonFractions[0][1])
  if (decimal < commonFractions[0][1]) {
    // console.log('decimal < commonFractions[0[[1]', decimal < commonFractions[0][1])
    return null;
  }
  let fractionsArray = commonFractions.splice(0, 1);
  // console.log('fractionsArray', fractionsArray)
  let resultArray = fractionsArray.reduce((result, fraction, index) => {
    if (commonFractions[index] <= decimal && fraction >= decimal) {
      result.push(commonFractions[index], fraction);
    }
    return result;
  }, []);
  if (resultArray.length > 0) {
    return resultArray;
  } else {
    return null;
  }
};

//returns array of units of same type that are smaller than remainingmLs, starting from largest unit
export const findPossibleUnits = (remainingmLs, targetUnitType) => {
  let possible = [];
  for (let [key, value] of Object.entries(unitDict)) {
    if (value.unit === targetUnitType && value.conversion <= remainingmLs) {
      possible.push([key, value.conversion]);
    }
  }
  return possible.reverse();
};
