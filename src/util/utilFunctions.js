import { unitDict, allFractions } from "./units";
//returns parsed amount in decimal or false if amount is unable to be parsed
export const validateAmount = amount => {
  let amountArray = amount.split(" ").map(item => item.trim());
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

//performs simple conversion, returns string of converted amount + unit, warning if not accurate withing +/-2.5%
export const convertSimple = (amount, startingUnit, endUnit) => {
  startingUnit = unitDict[startingUnit];
  let targetUnit = unitDict[endUnit];
  let warning = null;
  const amountmLs = amount * startingUnit.conversion;
  const targetUnitInDecimal = amountmLs / targetUnit.conversion;
  const decimalRemainder =
    targetUnitInDecimal - Math.floor(targetUnitInDecimal);
  if (decimalRemainder <= 0.015) {
    //returns whole numbers + unit
    return [`${Math.floor(targetUnitInDecimal)} ${endUnit}`, warning];
  }
  if (targetUnit.output === "decimal") {
    //returns amount with max 2 decimal numbers
    let amountTo2Decimal = Math.floor(targetUnitInDecimal * 100) / 100;
    return [`${amountTo2Decimal.toString(10)} ${endUnit}`, warning];
  }
  //ex. fraction = ["1/10", 0.1, false]
  const fraction = findClosestFraction(decimalRemainder);
  console.log(`FRACTION: ${fraction} is true? ${fraction[2]}`);
  const targetUnitmLs = Math.floor(targetUnitInDecimal) + fraction[1];
  if (
    amountmLs * 0.985 <= targetUnitmLs &&
    targetUnitmLs <= amountmLs * 1.025
  ) {
    warning = "Warning: conversion is not accurate within +/-2.5%";
  }
  //true means this is a common fraction used for baking
  if (fraction[2] === true) {
    console.log("should return fraction here");
    return [
      `${Math.floor(targetUnitInDecimal)} ${fraction[0]} ${endUnit}`,
      warning
    ];
  } else {
    let remainingmLs = decimalRemainder * targetUnit.conversion;

    //START WORKING HERE, convertedRemainder needs work
    let converted = convertRemainder(remainingmLs, targetUnit.unit);
  }
  console.log("Nothing returned from convertSimple");
};

//temporarily exporting to test
export const convertRemainder = (remainingmLs, targetUnitType) => {
  console.log(
    `CONVERT Remainder: ${remainingmLs} targetUnitType: ${targetUnitType}`
  );
  let possibleUnits = findPossibleUnits(remainingmLs, targetUnitType)
  console.log(possibleUnits)
  let mLs = remainingmLs
  let result = []
  for (let i=0; i<possibleUnits.length; i++) {
    let unitmLs = possibleUnits[i][1]
    if (mLs >= unitmLs) {
      let count = 0
      while(mLs >=unitmLs) {
        count +=1
        mLs-=unitmLs
      }
      result.push([count, possibleUnits[i][0]])
    }
  }
  let resultingString = ""
  for(let i=0; i< result.length; i++) {
    resultingString=resultingString.concat(` ${result[i][0]} ${result[i][1]},`)
  }
  console.log("resultingString", resultingString)
  return resultingString.slice(0,-1)
};

const findClosestFraction = remainder => {
  let closestFraction = allFractions.reduce((prev, curr) =>
    Math.abs(curr[1] - remainder) < Math.abs(prev[1] - remainder) ? curr : prev
  );
  console.log("closestFraction in findClosestFraction", closestFraction);
  return closestFraction;
};


//returns array of units of same type that are smaller than remainingmLs, starting from largest unit
const findPossibleUnits = (remainingmLs, targetUnitType)=> {
  let possible = [];
  for (let [key, value] of Object.entries(unitDict)) {
    if (value.unit === targetUnitType && value.conversion <= remainingmLs) {
      possible.push([key, value.conversion]);
    }
  }
  return possible.reverse()
}


//trying a difference approach, saving this for convenience if it doesn't work
// export const convertRemainder = (remainingmLs, targetUnitType) => {
//   // console.log(
//   //   `CONVERT Remainder: ${remainingmLs} targetUnitType: ${targetUnitType}`
//   // );
//   let possibleUnits = findPossibleUnits(remainingmLs, targetUnitType)
  
//   // console.log("possibleUnits", possibleUnits);
//   let result = [];
//   //while mLs is greater than smallest unit (drop) conversion
//   let i = possibleUnits.length - 1;
//   while (remainingmLs > 0.0513429) {
//     console.log(
//       `first while loop, i=${i}, possibleUnits[i]: ${possibleUnits[i]}`
//     );
//     while (remainingmLs - possibleUnits[i][1] >= 0 && i>-1) {
//       if (result[-1][0]==possibleUnits[i][0])) {
//         result[possibleUnits[i][0]] += 1;
//       } else {
//         result[possibleUnits[i][0]] = 1;
//       }
//       remainingmLs -= possibleUnits[i][1];
    
//     i -= 1;
//   }
  
//   console.log("result: ", result);
//   return result
// };