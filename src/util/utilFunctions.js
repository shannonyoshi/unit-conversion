import { unitDict, allFractions } from "./units";
//returns parsed amount in decimal or false if amount is unable to be parsed
export const validateAmount = (amount) => {
  if ( typeof amount === "number") {
    return amount
  }

  let amountArray = amount.split(" ").map((item) => item.trim());
  if (!amount.includes(".") && !amount.includes("/")) {
    const parsedWholeNum = parseInt(amountArray.join(""));
    // console.log("parsedWholeNum", parsedWholeNum);
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
  // console.log("in simpleConvert unitFrom", unitDict[unitFrom]);
  // console.log("in simpleConvert unitTo", unitDict[unitTo].type);
  if (unitDict[unitFrom].type === unitDict[unitTo].type) {
    return true;
  }
  return false;
};

export const checkPluralUnit = (amount, endUnitName) => {

  let returnString = endUnitName;
  if (amount <= 1) {
    returnString = unitDict[endUnitName].singular;
  }
  return returnString;
};

//returns tolerance of 2.5% in mLs
export const calcTolerancemLs = (amountInmLs) => {
  const upperLimitmLs = amountInmLs * 1.025 - amountInmLs;
  return upperLimitmLs;
};

export const findClosestFraction = (remainder) => {
  let closestFraction = allFractions.reduce((prev, curr) =>
    Math.abs(curr[1] - remainder) < Math.abs(prev[1] - remainder) ? curr : prev
  );
  return closestFraction;
};

export const getCommonFractions = () => {
  return allFractions.filter((fraction) => fraction[2] === true);
};

//removes first item in array, so commonFractionsindex] is 1 fraction lower than "fraction"
export const findClosestCommonFractions = (remainder) => {
  const commonFractions = getCommonFractions();
  if (remainder < commonFractions[0][1]) {
    return null;
  }
  let fractionsArray = commonFractions.splice(0, 1);
  return fractionsArray.reduce((result, fraction, index) => {
    if (commonFractions[index] <= remainder && fraction >= remainder) {
      result.push(commonFractions[index], fraction);
      
    }
    return result
  }, []);
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
