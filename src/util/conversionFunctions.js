import { unitDict} from "./units";
import {checkPluralUnit, calcTolerancemLs, findClosestFraction, findClosestCommonFractions, findPossibleUnits} from "./utilFunctions"

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

  if (result.length === 1 && result[0][1] === startingUnitName) {
    return null;
  }
  let resultingString = "";
  for (let i = 0; i < result.length; i++) {
    let unitString = checkPluralUnit(result[i][0], result[i][1]);
    resultingString = resultingString.concat(` ${result[i][0]} ${unitString},`);
  }
  return resultingString.slice(0, -1);
};
