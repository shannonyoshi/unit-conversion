import { postConversion } from "./crudFuncs";
import { unitDict } from "./units";
import {
  checkPluralUnit,
  calcNormalizedTolerance,
  findClosestFraction,
  findClosestCommonFractions,
  findPossibleUnits,
} from "./utilFunctions";

//performs simple conversion, returns string of converted amount + unit
export const convertSimple = (amount, startingUnitName, targetUnitName) => {
  let startingUnit = unitDict[startingUnitName];
  let targetUnit = unitDict[targetUnitName];
  const normalizedAmount = amount * startingUnit.conversion;
  const targetUnitInDecimal = normalizedAmount / targetUnit.conversion;
  const prettyConvertedString = prettifyRemainder(
    targetUnitInDecimal,
    startingUnitName,
    targetUnitName,
    targetUnit,
    normalizedAmount
  );
  return prettyConvertedString;
};
//receives the converted amount in decimal, and returns a human readable string with the converted amount and target unit
const prettifyRemainder = (
  targetUnitInDecimal,
  startingUnitName,
  targetUnitName,
  targetUnit,
  normalizedAmount
) => {
  const targetUnitInteger = Math.floor(targetUnitInDecimal);
  const decimalRemainder = targetUnitInDecimal - targetUnitInteger;

  //returns whole numbers (within buffer of |.015|) + unit
  if (decimalRemainder <= 0.015 || decimalRemainder >= 0.985) {
    let unitString = checkPluralUnit(targetUnitInteger, targetUnitName);
    return `${Math.round(targetUnitInDecimal)} ${unitString}`;
  }
  //returns rounded amount to 2 decimal places for unit types that commonly use decimal (mostly metric)
  if (targetUnit.output === "decimal") {
    let amountTo2Decimal = Math.floor(targetUnitInDecimal * 100) / 100;
    let unitString = checkPluralUnit(amountTo2Decimal, targetUnitName);
    return `${amountTo2Decimal.toString(10)} ${unitString}`;
  }
  //ex. fraction = ["1/10", 0.1, false] means [fraction string, fraction in decimal, boolean if regular baking fraction]
  const fraction = findClosestFraction(decimalRemainder);

  const divisor = fraction[0].split("/")[1];

  //excludeFrac returns true if fraction should not be used if unit us "US", unit is fluid ounce or smaller
  let excludeFrac =
    (targetUnit.unit === "US" &&
    targetUnit.conversion <= 29.5735 &&
    divisor % 3 === 0)
      ? true
      : false;
      
  //returns fractions that are common to baking if not a US unit too small for thirds, where this fraction is a third
  if (fraction[2] === true && excludeFrac === false) {
    console.log('finish conversion')
    if (targetUnitInteger === 0) {
      let unitString = checkPluralUnit(fraction[1], targetUnitName);
      return `${fraction[0]} ${unitString}`;
    } else {
      return `${targetUnitInteger} ${fraction[0]} ${targetUnitName}`;
    }
  } else {
    console.log('continue conversion with convertRemainder')
    //fraction found by findClosestFraction is not human readable
    let remainingmLs =
      normalizedAmount - targetUnitInteger * targetUnit.conversion;
    const normalizedTolerance = calcNormalizedTolerance(normalizedAmount);

    let converted = convertRemainder(
      remainingmLs,
      targetUnit.unit,
      normalizedTolerance,
      startingUnitName,
      targetUnitInDecimal
    );
    // console.log('converted', converted)
    if (targetUnitInteger === 0) {
      let unitString = checkPluralUnit(fraction[1], targetUnitName);
      if (converted) {
        return `${fraction[0]} ${unitString} or ${converted}`;
      } else {
        return `${fraction[0]} ${unitString}`;
      }
    } else {
      if (converted) {
        // console.log('converted', converted)
        return `${targetUnitInteger} ${fraction[0]} ${targetUnitName} or ${targetUnitInteger} ${targetUnitName} plus ${converted}`;
      } else {
        return `${targetUnitInteger} ${fraction[0]} ${targetUnitName}`;
      }
    }
  }
};
//convertRemainder is called when the closest fraction is not commonly used for baking
//returns a human readable alternative conversion string
const convertRemainder = (
  remainingmLs,
  targetUnitType,
  normalizedTolerance,
  startingUnitName,
  targetUnitInDecimal
) => {
  //Gets list of units of same type as target that are smaller than the remaining normalized amount
  let possibleUnits = findPossibleUnits(
    remainingmLs + normalizedTolerance,
    targetUnitType
  );
  // console.log('CONVERT REMAINDER')
  let mLs = remainingmLs;
  let result = [];
  //iterate over unit list, starting with the largest unit
  for (let i = 0; i < possibleUnits.length; i++) {
    let unitmLs = possibleUnits[i][1];
    //if the remaining amount(plus the tolerance) is greater than the current unit size
    if (mLs + normalizedTolerance >= unitmLs) {
      //calculate how many of that unit (+tolerance)
      let count = Math.floor((mLs + normalizedTolerance) / unitmLs);
      mLs = mLs - count * unitmLs;
      // Ensures that any US units of fluid ounce or smaller does not use thirds as fractions
      let excludeThirds =
        targetUnitType === "US" && unitmLs <= 29.5735 ? true : false;
      // console.log('excludeThirds', excludeThirds)
      let closestCmnFracs = findClosestCommonFractions(
        mLs / unitmLs,
        excludeThirds
      );
      // console.log('closestCmnFracs', closestCmnFracs)
      if (closestCmnFracs) {
        let higher = closestCmnFracs[1][1] * unitmLs;
        if (higher - mLs <= normalizedTolerance) {
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
    if (Math.abs(mLs) <= normalizedTolerance) {
      break;
    }
  }
  console.log('targetUnitInDecimal', targetUnitInDecimal)
  console.log('result', result)
  console.log('result.length', result.length)
  console.log('result[0][1]===startingUnitName', result[0][1]===startingUnitName)
  console.log('targetUnitInDecimal<1', targetUnitInDecimal<1)
  if (
    result.length === 1 &&
    result[0][1] === startingUnitName &&
    targetUnitInDecimal <= 1
  ) {
    // console.log('IF:')
    // console.log('result.length===1', result.length===1)

    return null;
  }
  let resultingString = "";
  for (let i = 0; i < result.length; i++) {
    let unitString = checkPluralUnit(result[i][0], result[i][1]);
    resultingString = resultingString.concat(` ${result[i][0]} ${unitString},`);
  }
  return resultingString.slice(0, -1);
};

export const convertComplex = async (inputs, isAmount) => {
  if (inputs.ingredientName.length === 0) {
    return {
      errorMessage:
        "Can't complete complex conversions (weight <=> volume) without an ingredient name",
    };
  }
  const complexIngr = {
    ingredientName: inputs.ingredientName,
    currentAmount: isAmount,
    currentUnit: inputs.unitFrom,
    altUnit: unitDict[inputs.unitFrom].type,
    altAmount: unitDict[inputs.unitFrom].conversion * isAmount,
    targetUnit: inputs.unitTo,
    targetConv: unitDict[inputs.unitTo].conversion,
  };
  const newIngredient = await postConversion(complexIngr);
  const formattedIngr = {
    amount: inputs.amount,
    unitFrom: inputs.unitFrom,
    unitTo: inputs.unitTo,
    ingredientName: inputs.ingredientName,
    convertedString: `${newIngredient.targetAmount} ${newIngredient.targetUnit} ${inputs.ingredientName}`,
  };
  return formattedIngr;
};
