import { postConversion } from "./crudFuncs";
import { unitDict } from "./units";
import {
  checkPluralUnit,
  calcNormalizedTolerance,
  filterFractions,
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
  const divisor = fraction[0].split("/")[1];
  //excludeFrac returns true if fraction should not be used if unit us "US", unit is fluid ounce or smaller
  let excludeFrac =
   ( targetUnit.type === "US" &&
    targetUnit.conversion <= 29.5735 &&
    divisor % 3 === 0)
      ? true
      : false;

  //returns fractions that are common to baking if not a US unit too small for thirds, where this fraction is a third
  //example return: 2 1/2 cups milk
  let unitString = checkPluralUnit(targetUnitInt + fraction[1], targetUnitName);
  if (fraction[2] === true && excludeFrac === false) {
    return `${targetUnitInt === [0] ? "" : targetUnitInt} ${
      fraction[0]
    } ${unitString}`;
  }

  //returns uncommon fraction && whole num, plus common fraction, with count 1-2 if one additional unit
  // example return: 1 3/32 cups or 1 cup, plus 1 tablespoon
  let fractionString = `${targetUnitInt === [0] ? "" : targetUnitInt} ${
    fraction[0]
  } ${unitString}`;
  let normalizedRemainder =
    normalizedAmount - targetUnitInt * targetUnit.conversion;
  const potentialFrac = checkCloseFracs(
    decimalRemainder,
    normalizedRemainder,
    targetUnit,
    normalizedTolerance
  );

  if (potentialFrac) {
    if (potentialFrac["frac"][1] === 1) {
      targetUnitInt += 1;
      potentialFrac["frac"][1] = 0;
    }
    let plusMinus = "minus";
    let remainder =
      normalizedAmount -
      (targetUnitInt + potentialFrac["frac"][1]) * targetUnit.conversion;
    console.log("remainder", remainder);
    if (remainder >= 0) {
      plusMinus = "plus";
    }
    let targetUnitAmount = `${targetUnitInt === 0 ? "" : targetUnitInt} ${
      potentialFrac["frac"][0]
    }`;
    unitString = checkPluralUnit(
      targetUnitInt + potentialFrac["frac"][1],
      targetUnitName
    );
    let secUnitString = checkPluralUnit(
      potentialFrac["count"],
      potentialFrac["unit"][0]
    );
    let secondary = `${potentialFrac["count"]} ${secUnitString}`;
    return `${fractionString} or ${targetUnitAmount} ${unitString}, ${plusMinus} ${secondary}`;
  }
  //returns a list of amounts/units to get to 

  let converted = convertRemainder(
    normalizedAmount,
    targetUnitInDecimal,
    startingUnitName,
    targetUnit
  );

  // let unitString = checkPluralUnit(targetUnitInt, targetUnitName);
  if (converted) {
    return `${targetUnitInt === 0 ? "" : targetUnitInt} ${
      fraction[0]
    } ${targetUnitName} or ${targetUnitInt} ${targetUnitName} plus ${converted}`;
  } else {
    return `${targetUnitInt === 0 ? "" : targetUnitInt} ${fraction[0]} ${targetUnitName}`;
  }
};

// checks if there is a close fraction that gets close to total amount with additional 1-2 of smaller unit
// if option is found, returns in
const checkCloseFracs = (
  decimalRemainder,
  normalizedRemainder,
  targetUnit,
  normalizedTolerance
) => {
  console.log("CheckCloseFracs");
  let closest2 = filterFractions("commonClosest2", decimalRemainder);
  let closest = null;
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
  console.log("frac1Opt", frac1Opt);
  console.log("frac2Opt", frac2Opt);
  if (frac1Opt && frac2Opt) {
    if (frac1Opt["remainder"] < frac2Opt["remainder"]) {
      closest = frac1Opt;
    }
    if (frac1Opt["remainder"] > frac2Opt["remainder"]) {
      closest = frac2Opt;
    }
    if (frac1Opt["remainder"] === frac2Opt["remainder"]) {
      if (frac1Opt["count"] < frac2Opt["count"]) {
        closest = frac1Opt;
      }
      if (frac1Opt["count"] > frac2Opt["count"]) {
        closest = frac2Opt;
      }
      if (frac1Opt["count"] === frac2Opt["count"]) {
        if (frac1Opt["frac"][1] < frac2Opt["frac"][1]) {
          closest = frac1Opt;
        } else {
          closest = frac2Opt;
        }
      }
    }
  }
  if (frac1Opt && !frac2Opt) {
    closest = frac1Opt;
  }
  if (!frac1Opt && frac2Opt) {
    closest = frac2Opt;
  }
  console.log("closest", closest);
  return closest;
};
//if an adequate option is found, returns {unit, count, remainder, fraction}, else returns null
const checkFraction = (
  fraction,
  normalizedRemainder,
  targetUnit,
  normalizedTolerance
) => {
  let potentialNormRemainder = Math.abs(
    normalizedRemainder - fraction[1] * targetUnit.conversion
  );
  //possibleUnits = [pluralUnitName, conversion]
  let possibleUnits = findPossibleUnits(
    potentialNormRemainder + normalizedTolerance,
    targetUnit.type,
    targetUnit.normUnit
  );

  //checks if 1 or 2 of unit will get within tolerance, if so adds absolute val of remainder, count, unit
  let options = {};
  //keys for options are the absolute value of the remainder
  for (let i = 0; i < possibleUnits.length; i++) {
    let singleR = Math.abs(potentialNormRemainder - possibleUnits[i][1]);
    let doubleR = Math.abs(potentialNormRemainder - possibleUnits[i][1] * 2);
    options[singleR] = { unit: possibleUnits[i], count: 1, remainder: singleR };
    options[doubleR] = { unit: possibleUnits[i], count: 2, remainder: doubleR };
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

//convertRemainder is called when the closest fraction is not commonly used for baking
//returns a human readable alternative conversion string
const convertRemainder = (
  normalizedAmount,
  targetUnitInDecimal,
  startingUnitName,
  targetUnit
) => {
  
  let remaining =
    normalizedAmount - Math.floor(targetUnitInDecimal) * targetUnit.conversion;
  console.log("remaining", remaining);
  const normalizedTolerance = calcNormalizedTolerance(normalizedAmount);
  //Gets array of units [name, normalizedUnit] of same type as target that are smaller than the remaining normalized amount
  let possibleUnits = findPossibleUnits(
    remaining + normalizedTolerance,
    targetUnit.type,
    targetUnit.normUnit
  );
  // console.log('CONVERT REMAINDER')

  let result = [];
  //iterate over unit list, starting with the largest unit
  let i = 0;
  while (i < possibleUnits.length && remaining >= normalizedTolerance) {
    let unitmLs = possibleUnits[i][1];
    if (remaining + normalizedTolerance >= unitmLs) {
      //count how many of current possible units, rounded down
      let count = Math.floor((remaining + normalizedTolerance) / unitmLs);
      // update remaining amount
      remaining = remaining - count * unitmLs;
      let filterType =
        (targetUnit.type === "US" && unitmLs <= 29.5735) ? "commonNoThirds" : "common";
      // array of close common fractions
      
      let commonFracs = filterFractions(filterType);

      // TODO:Come back to THIS
      console.log("commonFracs", commonFracs);
    }
    i += 1;
  }

  // for (let i = 0; i < possibleUnits.length; i++) {
  //   let unitmLs = possibleUnits[i][1];
  //   // if the remaining amount(plus the tolerance) is greater than the current unit size
  //   if (remaining + normalizedTolerance >= unitmLs) {
  //     // calculate how many of that unit (+tolerance)
  //     let count = Math.floor((remaining + normalizedTolerance) / unitmLs);
  //     remaining = remaining - count * unitmLs;

  //     // Ensures that any US units of fluid ounce or smaller does not use thirds as fractions
  //     let excludeThirds =
  //       (targetUnitType === "US" && unitmLs <= 29.5735)? true : false;
  //     // console.log('excludeThirds', excludeThirds)
  //     let closestCmnFracs = findClosestCommonFractions(
  //       remaining / unitmLs,
  //       excludeThirds
  //     );
  //     // console.log('closestCmnFracs', closestCmnFracs)
  //     if (closestCmnFracs) {
  //       let higher = closestCmnFracs[1][1] * unitmLs;
  //       if (higher - remaining <= normalizedTolerance) {
  //         count = `${count} ${closestCmnFracs[1][0]}`;
  //         remaining = remaining - higher;
  //       } else {
  //         count = `${count} ${closestCmnFracs[0][0]}`;
  //         remaining = remaining - closestCmnFracs[0][1];
  //       }
  //     }

  //     result.push([count, possibleUnits[i][0]]);
  //   }
  //   //ends loop if total amount is within +/- 2.5% of total
  //   if (remaining <= normalizedTolerance) {
  //     break;
  //   }
  // }
  // console.log('targetUnitInDecimal', targetUnitInDecimal)
  // console.log('result', result)
  // console.log('result.length', result.length)
  // console.log('result[0][1]===startingUnitName', result[0][1]===startingUnitName)
  // console.log('targetUnitInDecimal<1', targetUnitInDecimal<1)
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
