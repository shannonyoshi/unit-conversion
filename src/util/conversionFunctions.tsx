import { postConversion } from "./crudFuncs";
import {ComplexIngr, IngrInput, ConvIngr, Unit, NewIngr} from "../types"
import { unitDict } from "./units";
import {
  checkPluralUnit,
  calcNormalizedTolerance,
  filterFractions,
  findPossibleUnits,
} from "./utilFunctions";


//performs simple conversion, returns string of converted amount + unit
export const convertSimple = (amount:number, inputs:IngrInput):ConvIngr => {
  // console.log("convertSimple()");
  let targetUnit:Unit = unitDict[inputs.targetUnit];
  const normalizedAmount:number = amount * unitDict[inputs.currentUnit].conversion;
  const targetUnitInDecimal:number = normalizedAmount / targetUnit.conversion;
  const prettyConvertedString:string = prettifyRemainder(
    inputs.currentUnit,
    targetUnitInDecimal,
    inputs.targetUnit,
    normalizedAmount
  );
  const convertedIngr: ConvIngr = {
    amount: inputs.amount,
    currentUnit: inputs.currentUnit,
    targetUnit: inputs.targetUnit,
    ingredientName: inputs.name,
    convertedString: `${prettyConvertedString} ${inputs.name}`,
  };
  console.log("convertedIngr", convertedIngr);
  return convertedIngr;
};
// returns tuple for better error checking
export const convertComplex = async (inputs:IngrInput, isAmount:number) :ConvIngr |{errorMessage:string}=> {
  // console.log("convertComplex()");
  if (inputs.name.length === 0) {
    return {
      errorMessage:
        "Can't complete complex conversions (weight <=> volume) without an ingredient name",
    };
  }
  const complexIngr:ComplexIngr = {
    ingredientName: inputs.name,
    currentAmount: isAmount,
    currentUnit: inputs.currentUnit,
    altUnit: unitDict[inputs.currentUnit].normUnit,
    altAmount: unitDict[inputs.currentUnit].conversion * isAmount,
    targetUnit: inputs.targetUnit,
    targetConv: unitDict[inputs.targetUnit].conversion,
  };
  const newIngredient: ConvIntr| nulll = await postConversion(complexIngr);
  console.log("newIngredient", newIngredient);
  // TODO: should prettify converted string since only decimal is being returned
  const normalizedAmount:number = newIngredient.targetAmount * unitDict[inputs.targetUnit].conversion
  const prettyString:string = prettifyRemainder(inputs.currentUnit, newIngredient.targetAmount, inputs.targetUnit, normalizedAmount)
  console.log('prettyString', prettyString)
  const formattedIngr:ConvIngr = {
    amount: inputs.amount,
    currentUnit: inputs.currentUnit,
    targetUnit: inputs.targetUnit,
    ingredientName: inputs.name,
    convertedString: `${prettyString} ${inputs.name}`,
  };
  return formattedIngr;
};

//receives the converted amount in decimal, and returns a human readable string with the converted amount and target unit
const prettifyRemainder = (
  startingUnitName,
  targetUnitInDecimal,
  targetUnitName,
  normalizedAmount
) => {
  const targetUnit=unitDict[targetUnitName]
  const normalizedTolerance = calcNormalizedTolerance(normalizedAmount);
  const decimalTolerance = normalizedTolerance / targetUnit.conversion;
  let targetUnitInt = Math.floor(targetUnitInDecimal);
  let closestInt = Math.round(targetUnitInDecimal);
  const decimalRemainder = targetUnitInDecimal - targetUnitInt;

  //returns whole numbers within tolerance buffer
  //example return: 1 cup butter
  if (targetUnitInDecimal - targetUnitInt <= decimalTolerance) {
    return `${targetUnitInt} ${checkPluralUnit(targetUnitInt, targetUnitName)}`;
  }
  if (Math.abs(closestInt - targetUnitInDecimal) <= decimalTolerance) {
    return `${closestInt} ${checkPluralUnit(closestInt, targetUnitName)}`;
  }
  //if amount in target unit <1/64, so negligible
  if (targetUnitInDecimal <= 0.0155) {
    return `${targetUnitInDecimal.toFixed(
      5
    )} ${targetUnitName} (amount negligible)`;
  }

  //returns rounded amount to 2 decimal places for unit types that commonly use decimal (mostly metric)
  //example return: .67 grams salt
  if (targetUnit.output === "decimal") {
    let rounded = Math.floor(targetUnitInDecimal * 100) / 100;
    return `${rounded.toString(10)} ${checkPluralUnit(rounded, targetUnitName)}`;
  }

  //ex. fraction = ["1/10", 0.1, false] means [fraction string, fraction in decimal, boolean if regular baking fraction]
  const fraction = filterFractions("allClosest", decimalRemainder);
  // console.log("decimalRemainder", decimalRemainder);
  // console.log("fraction", fraction);

  //returns fraction if common and amount is within tolerance
  //example return: 2 1/2 cups milk
  let unitString = checkPluralUnit(targetUnitInt + fraction[1], targetUnitName);
  const currRemainder =
    normalizedAmount - (targetUnitInt + fraction[1]) * targetUnit.conversion;
  if (fraction[2] === true && currRemainder <= normalizedTolerance) {
    return `${targetUnitInt === 0 ? "" : targetUnitInt} ${
      fraction[0]
    } ${unitString}`;
  }
  //returns uncommon fraction and common fraction, with +/- 1-2 of smaller unit
  // example return: 1 6/32 cups or 1 cup, plus 2 tablespoons
  let fractionString = `${targetUnitInt === 0 ? "" : targetUnitInt+" "}${
    fraction[0]
  } ${unitString}`;
  // console.log("fractionString", fractionString);
  let normalizedRemainder =
    normalizedAmount - targetUnitInt * targetUnit.conversion;
  const potentialFracString = checkCloseFracs(
    targetUnitInDecimal,
    normalizedRemainder,
    targetUnitName,
    normalizedTolerance,
    startingUnitName
  );
  // console.log("potentialFracString", potentialFracString);

  if (potentialFracString) {
    // console.log("returning");
    return `${fractionString} ${potentialFracString}`;
  }

  // last resort, returns `${uncommonAmount} or ${commmonAmount} ${targetU}, plus ${list of counts and units}
  const commonFrac = filterFractions(
    "commonClosestLower",
    targetUnitInDecimal - targetUnitInt
  );
  normalizedRemainder =
    normalizedRemainder - commonFrac[1] * targetUnit.conversion;
  // console.log("LOOK HERE");
  const possibleU = findPossibleUnits(
    normalizedRemainder,
    targetUnit.type,
    targetUnit.normUnit,
    // startingUnitName
  );
  // console.log("possibleU", possibleU);
  // console.log("possibleU.length", possibleU.length);
  let result = convertRecursive(
    normalizedTolerance,
    normalizedRemainder,
    possibleU
  );
  
  // console.log("result", result);
  if (result.length===1&& result[0][1]===startingUnitName){
    return `${targetUnitInt>0? targetUnitInt+" ":""}${fraction[0]} ${unitString}`
  }
  let returnString = stringFromConvertRecursive(
    targetUnitInt,
    fraction,
    unitString,
    commonFrac,
    result
  );
  // console.log("convertRecursive");
  return returnString;
};

// returns readable string if there is a close fraction that gets close to total amount with additional 1-2 of smaller unit
// if option is found, returns closest option with lower count
const checkCloseFracs = (
  targetUnitInDecimal,
  normalizedRemainder,
  targetUnitName,
  normalizedTolerance,
  startingUnitName
) => {
  let targetUnit = unitDict[targetUnitName];
  let targetInt = Math.floor(targetUnitInDecimal);
  let decimalRemainder = targetUnitInDecimal - targetInt;
  let closest2 = filterFractions("commonClosest2", decimalRemainder);
  let frac1Opt = checkFraction(
    closest2[0],
    normalizedRemainder,
    targetUnit,
    normalizedTolerance,
    startingUnitName
  );
  console.log("frac1Opt", frac1Opt);
  let frac2Opt = checkFraction(
    closest2[1],
    normalizedRemainder,
    targetUnit,
    normalizedTolerance,
    startingUnitName
  );
  console.log("frac2Opt", frac2Opt);
  let closest =
    frac1Opt && !frac2Opt ? frac1Opt : frac2Opt && !frac1Opt ? frac2Opt : null;
  console.log("closest", closest);
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

  if (closest) {
    // fraction value for 1 was added to the list of fractions, so need adjust if that was the "fraction" returned
    if (closest["frac"][1] === 1) {
      targetInt += 1;
      closest["frac"][1] = 0;
    }
    let plusMinus =
      targetUnitInDecimal - targetInt - closest["frac"][1] >= 0
        ? "plus"
        : "minus";
    let unitString = checkPluralUnit(
      targetInt + closest["frac"][1],
      targetUnitName
    );
    let secondUnitString = checkPluralUnit(
      closest["count"],
      closest["unit"][0]
    );
    return `or ${targetInt > 0 ? targetInt : ""} ${
      closest["frac"][0]
    } ${unitString}, ${plusMinus} ${closest["count"]} ${secondUnitString}`;
  }

  return null;
};

//if an adequate option is found, returns {unit, count, remainder, fraction}, else returns null
const checkFraction = (
  fraction,
  normalizedRemainder,
  targetUnit,
  normalizedTolerance,
  startingUnitName
) => {
  normalizedRemainder = Math.abs(
    normalizedRemainder - fraction[1] * targetUnit.conversion
  );
  //example unit returned: [pluralUnitName, conversion]
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
    if (singleR <= doubleR) {
      options[singleR] = {
        unit: possibleUnits[i],
        count: 1,
        remainder: singleR,
      };
    } else {
      options[doubleR] = {
        unit: possibleUnits[i],
        count: 2,
        remainder: doubleR,
      };
    }
  }
  //finds key to lowest remainder option

  let bestOptKey = Math.min(...Object.keys(options));
  console.log("bestOptKey", bestOptKey);
  console.log('options[bestOptKey]["unit"]', options[bestOptKey]["unit"]);
  console.log("startingUnitName", startingUnitName);
  console.log(
    'options[bestOptKey]["unit"][0]===startingUnitName',
    options[bestOptKey]["unit"][0] === startingUnitName
  );
  if (
    bestOptKey <= normalizedTolerance &&
    options[bestOptKey]["unit"][0] !== startingUnitName
  ) {
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
  console.log("possibleUnits.length", possibleUnits.length);
  console.log("possibleUnits  in convert recursive", possibleUnits);
  console.log("possibleUnits[0]", possibleUnits[0]);
  if (normalizedRemainder <= normalizedTolerance) {
    return result;
  }

  const target = possibleUnits.shift();
  console.log("target", target);
  const decimal = normalizedRemainder / target[1];
  console.log("decimal", decimal);
  const count = Math.floor(decimal);
  console.log("count", count);
  normalizedRemainder = normalizedRemainder - count * target[1];
  console.log("normalizedRemainder", normalizedRemainder);
  if (count > 0) {
    result.push([count, target[0]]);
  }
  console.log("result", result);
  return convertRecursive(
    normalizedTolerance,
    normalizedRemainder,
    possibleUnits,
    result
  );
};

const stringFromConvertRecursive = (
  targetUnitInt,
  fraction,
  unitString,
  commonFrac,
  result
) => {
  let returnString = `${targetUnitInt > 0 ? targetUnitInt : ""} ${
    fraction[0]
  } ${unitString} or ${targetUnitInt > 0 ? targetUnitInt : ""} ${
    commonFrac[1] > 0 ? commonFrac[0] : ""
  } ${unitString}${result.length > 0 ? ", plus" : ""}`;
  const lastI = result.length - 1;
  for (let i = 0; i < result.length; i++) {
    unitString = checkPluralUnit(result[i][0], result[i][1]);
    returnString = returnString.concat(
      `${i > 0 && lastI > 1 ? "," : ""}${
        i === lastI && lastI > 0 ? " and " : " "
      }${result[i][0]} ${unitString}`
    );
  }
  return returnString;
};
