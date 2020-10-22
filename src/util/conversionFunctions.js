import { postConversion } from "./crudFuncs";
import { unitDict } from "./units";
import {
  checkPluralUnit,
  calcNormalizedTolerance,
  filterFractions,
  findPossibleUnits,
} from "./utilFunctions";
//NOTE: 7 tablespoons to cups, uncomment later

//performs simple conversion, returns string of converted amount + unit
export const convertSimple = (amount, inputs) => {
  let startingUnit = unitDict[inputs.unitFrom];
  let targetUnit = unitDict[inputs.unitTo];
  const normalizedAmount = amount * startingUnit.conversion;
  const targetUnitInDecimal = normalizedAmount / targetUnit.conversion;
  const prettyConvertedString = prettifyRemainder(
    targetUnitInDecimal,
    inputs.unitTo,
    targetUnit,
    normalizedAmount
  );
  const convertedIngr = {
    amount: inputs.amount,
    unitFrom: inputs.unitFrom,
    unitTo: inputs.unitTo,
    ingredientName: inputs.ingredientName,
    convertedString: `${prettyConvertedString} ${inputs.ingredientName}`,
  };
  return convertedIngr;
};
//receives the converted amount in decimal, and returns a human readable string with the converted amount and target unit
const prettifyRemainder = (
  targetUnitInDecimal,
  targetUnitName,
  targetUnit,
  normalizedAmount
) => {
  const normalizedTolerance = calcNormalizedTolerance(normalizedAmount);
  const decimalTolerance = normalizedTolerance / targetUnit.conversion;
  let targetUnitInt = Math.floor(targetUnitInDecimal);
  const decimalRemainder = targetUnitInDecimal - targetUnitInt;

  //returns whole numbers within tolerance buffer
  //example return: 1 cup butter
  if (targetUnitInDecimal - targetUnitInt <= decimalTolerance) {
    let unitString = checkPluralUnit(targetUnitInt, targetUnitName);
    return `${targetUnitInt} ${unitString}`;
  }

  //returns rounded amount to 2 decimal places for unit types that commonly use decimal (mostly metric)
  //example return: .67 grams salt
  if (targetUnit.output === "decimal") {
    let amountTo2Decimal = Math.floor(targetUnitInDecimal * 100) / 100;
    let unitString = checkPluralUnit(amountTo2Decimal, targetUnitName);
    return `${amountTo2Decimal.toString(10)} ${unitString}`;
  }

  //ex. fraction = ["1/10", 0.1, false] means [fraction string, fraction in decimal, boolean if regular baking fraction]
  const fraction = filterFractions("allClosest", decimalRemainder);
  console.log("fraction", fraction);
  //returns fractions that are common if amount is within tolerance
  //example return: 2 1/2 cups milk
  let unitString = checkPluralUnit(targetUnitInt + fraction[1], targetUnitName);
  
  if (fraction[2] === true && (normalizedAmount-(targetUnitInt+fraction[1])*targetUnit.conversion)<=normalizedTolerance) {
    return `${targetUnitInt === [0] ? "" : targetUnitInt} ${
      fraction[0]
    } ${unitString}`;
  }

  //returns uncommon fraction && whole num, plus common fraction, with count 1-2 if one additional unit
  // example return: 1 6/32 cups or 1 cup, plus 2 tablespoons

  // let fractionString = `${targetUnitInt === 0 ? "" : targetUnitInt} ${
  //   fraction[0]
  // } ${unitString}`;
  // console.log('fractionString', fractionString)
  let normalizedRemainder =
    normalizedAmount - targetUnitInt * targetUnit.conversion;
  // const potentialFrac = checkCloseFracs(
  //   decimalRemainder,
  //   normalizedRemainder,
  //   targetUnit,
  //   normalizedTolerance,
  // );
  // // fraction value for 1 was added to the list of fractions, so need to check if that was the "fraction" returned
  // if (potentialFrac) {
  //   if (potentialFrac["frac"][1] === 1) {
  //     targetUnitInt += 1;
  //     potentialFrac["frac"][1] = 0;
  //   }
  //   let remainder =
  //     normalizedAmount -
  //     (targetUnitInt + potentialFrac["frac"][1]) * targetUnit.conversion;
  //     let plusMins = remainder >=0? "plus": "minus"

  //   let targetUnitAmount = `${targetUnitInt === 0 ? "" : targetUnitInt} ${
  //     potentialFrac["frac"][0]
  //   }`;
  //   unitString = checkPluralUnit(
  //     targetUnitInt + potentialFrac["frac"][1],
  //     targetUnitName
  //   );
  //   let secUnitString = checkPluralUnit(
  //     potentialFrac["count"],
  //     potentialFrac["unit"][0]
  //   );
  //   let secondary = `${potentialFrac["count"]} ${secUnitString}`;
  //   return `${fractionString} or ${targetUnitAmount} ${unitString}, ${plusMinus} ${secondary}`;
  // }
  // returns readable string of targetInt, uncommonFraction of targetUnit, + OR count, unit un   
  const commonFrac = filterFractions(
    "commonClosestLower",
    targetUnitInDecimal - targetUnitInt
  );
  normalizedRemainder =
    normalizedRemainder - commonFrac[1] * targetUnit.conversion;
  const possibleUnits = findPossibleUnits(
    normalizedRemainder,
    targetUnit.type,
    targetUnit.normUnit
  );

  let result = convertRecursive(
    normalizedTolerance,
    normalizedRemainder,
    possibleUnits
  );

  let returnString = `${targetUnitInt > 0 ? targetUnitInt : ""} ${
    fraction[0]
  } ${unitString} or ${targetUnitInt > 0 ? targetUnitInt : ""} ${
    commonFrac[1] > 0 ? commonFrac[0] : ""
  } ${unitString}${result.length > 0 ? ", plus" : ""}`;
  const lastI = result.length-1
  for (let i = 0; i < result.length; i++) {
    unitString=checkPluralUnit(result[i][0], result[i][1])
    returnString=returnString.concat(`${(i>0&&lastI>1)?",":""}${(i===lastI&&lastI>0)?" and ":" "}${result[i][0]} ${unitString}`)
  }
  return returnString
};

// checks if there is a close fraction that gets close to total amount with additional 1-2 of smaller unit
// if option is found, returns closest option with lower count
const checkCloseFracs = (
  decimalRemainder,
  normalizedRemainder,
  targetUnit,
  normalizedTolerance
) => {
  let closest2 = filterFractions("commonClosest2", decimalRemainder);
  let frac1Opt = checkFraction(
    closest2[0],
    normalizedRemainder,
    targetUnit,
    normalizedTolerance
  );
  let frac2Opt = checkFraction(
    closest2[1],
    normalizedRemainder,
    targetUnit,
    normalizedTolerance
  );
  let closest =
    frac1Opt && !frac2Opt ? frac1Opt : frac2Opt && !frac1Opt ? frac2Opt : null;
  if (frac1Opt && frac2Opt) {
    closest =
      frac1Opt["remainder"] < frac2Opt["remainder"] ? frac1Opt : frac2Opt;
    if (frac1Opt["remainder"] === frac2Opt["remainder"]) {
      closest = frac1Opt["count"] < frac2Opt["count"] ? frac1Opt : frac2Opt;
      if (frac1Opt["count"] === frac2Opt["count"]) {
        closest =
          frac1Opt["frac"][1] < frac2Opt["frac"][1] ? frac1Opt : frac2Opt;
      }
    }
  }
  return closest;
};

//if an adequate option is found, returns {unit, count, remainder, fraction}, else returns null
const checkFraction = (
  fraction,
  normalizedRemainder,
  targetUnit,
  normalizedTolerance
) => {
  normalizedRemainder = Math.abs(
    normalizedRemainder - fraction[1] * targetUnit.conversion
  );
  //example unit returnedL: [pluralUnitName, conversion]
  let possibleUnits = findPossibleUnits(
    normalizedRemainder + normalizedTolerance,
    targetUnit.type,
    targetUnit.normUnit
  );

  //checks if 1 or 2 of unit will get within tolerance, if so adds absolute val of remainder, count, unit
  let options = {};
  //keys for options are the absolute value of the remainder
  for (let i = 0; i < possibleUnits.length; i++) {
    let singleR = Math.abs(normalizedRemainder - possibleUnits[i][1]);
    let doubleR = Math.abs(normalizedRemainder - possibleUnits[i][1] * 2);
    // adds lower remainder to options, preference to lower count
    if (singleR<=doubleR){
      options[singleR] = { unit: possibleUnits[i], count: 1, remainder: singleR };
    } else {
      options[doubleR] = { unit: possibleUnits[i], count: 2, remainder: doubleR };
    }
  }
  //finds key to lowest remainder option
  let bestOptKey = Math.min(...Object.keys(options));
  if (bestOptKey <= normalizedTolerance) {
    options[bestOptKey]["frac"] = fraction;
    return options[bestOptKey];
  } else {
    return null;
  }
};

const convertRecursive = (
  normalizedTolerance,
  normalizedRemainder,
  possibleUnits,
  result = []
) => {
  if (normalizedRemainder <= normalizedTolerance) {
    return result;
  }

  const target = possibleUnits.shift();
  const decimal = normalizedRemainder / target[1];
  const count = Math.floor(decimal);
  normalizedRemainder = normalizedRemainder - count * target[1];
  if (count > 0) {
    result.push([count, target[0]]);
  }
  return convertRecursive(
    normalizedTolerance,
    normalizedRemainder,
    possibleUnits,
    result
  );
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
    altUnit: unitDict[inputs.unitFrom].normUnit,
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
