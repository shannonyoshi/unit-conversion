import { postConversion } from "./crudFuncs";
import { ComplexIngr, IngrInput, ConvIngr, Unit, AddedIngr, Fraction, Error } from "../types"
import { unitDict } from "./units";
import {
  checkPluralUnit,
  calcNormalizedTolerance,
  filterFractions,
  findPossibleUnits,
  validateAmount,
  checkIfSimple,
  roundTo
} from "./utilFunctions";


// TODO: getting inconsistent results for 47 teaspoons to cups, sometimes getting "0 cup or 1 cup, minus 1 teaspoon", sometimes getting "15/16 cup or 1 cup, minus 1 teaspoon"

// used in a few funcs below
type FracOption = { unit: string, count: number, remainder: number, frac?: Fraction }


export const formConversion = async (inputs: IngrInput): Promise<[ConvIngr | null, Error | null]> => {
  if (inputs.name && inputs.name.length > 0) {
    return [null, { name: "General", message: "Sorry, try again later" }]
  }
  const isAmount: number | null = validateAmount(inputs.currentAmount)
  if (!isAmount) {
    return [null, { name: "Amount", message: "Unable to validate amount, either use decimal (1.5) or fraction (1 1/2) amounts" }]
  }
  const isSimple: boolean = checkIfSimple(inputs.currentUnit, inputs.targetUnit)
  // let converted: ConvIngr | null
  if (isSimple) {
    return [convertSimple(isAmount, inputs), null]
  }
  else {
    if (inputs.ingredientName.length === 0) {
      // form button should be disabled when not enough info, so this should not be needed
      return [null, { name: "Ingredient Name", message: "Ingredient name needed for complex conversion" }]
    }
    return await convertComplex(inputs, isAmount)
  }
}

//performs simple conversion, returns string of converted amount + unit
export const convertSimple = (isAmount: number, inputs: IngrInput): ConvIngr => {
  let targetUnit: Unit = unitDict[inputs.targetUnit];
  // amount in grams or mLs
  const normalizedAmount: number = isAmount * unitDict[inputs.currentUnit].conversion;
  const convertedInDecimal: number = normalizedAmount / targetUnit.conversion;
  const prettyConvertedString: string = prettifyRemainder(
    inputs.currentUnit,
    convertedInDecimal,
    inputs.targetUnit,
    normalizedAmount
  );
  const convertedIngr: ConvIngr = {
    currentAmount: isAmount,
    currentUnit: inputs.currentUnit,
    targetAmount: convertedInDecimal,
    targetUnit: inputs.targetUnit,
    ingredientName: inputs.ingredientName,
    convertedString: `${prettyConvertedString} ${inputs.ingredientName}`,
  };
  return convertedIngr;
};

// returns tuple for better error checking
export const convertComplex = async (inputs: IngrInput, isAmount: number): Promise<[ConvIngr | null, Error | null]> => {

  const complexIngr: ComplexIngr = {
    ingredientName: inputs.ingredientName,
    currentAmount: isAmount,
    currentUnit: inputs.currentUnit,
    altUnit: unitDict[inputs.currentUnit].normUnit,
    altAmount: unitDict[inputs.currentUnit].conversion * isAmount,
    targetUnit: inputs.targetUnit,
    targetConv: unitDict[inputs.targetUnit].conversion,
  };
  let tryIngredient: [AddedIngr | null, Error | null] = await postConversion(complexIngr);
  if (!tryIngredient[0]) {
    return [null, tryIngredient[1]]
  }
  const newIngredient = tryIngredient[0]
  const normalizedAmount: number = newIngredient.targetAmount * unitDict[inputs.targetUnit].conversion
  const prettyString: string = prettifyRemainder(inputs.currentUnit, newIngredient.targetAmount, inputs.targetUnit, normalizedAmount)
  const formattedIngr: ConvIngr = {
    currentAmount: isAmount,
    currentUnit: inputs.currentUnit,
    targetAmount: newIngredient.targetAmount,
    targetUnit: inputs.targetUnit,
    ingredientName: inputs.ingredientName,
    convertedString: `${prettyString} ${inputs.ingredientName}`,
  };
  return [formattedIngr, null];
};

//receives the converted amount in decimal, and returns a human readable string with the converted amount and target unit
const prettifyRemainder = (
  startingUnitName: string,
  convertedInDecimal: number,
  targetUnitName: string,
  normalizedAmount: number
): string => {
  console.log("prettifyRemainder")
  const targetUnit: Unit = unitDict[targetUnitName]
  const normalizedTolerance: number = calcNormalizedTolerance(normalizedAmount);
  const convertedTolerance: number = normalizedTolerance / targetUnit.conversion;
  let targetInt: number = Math.floor(convertedInDecimal);
  let closestInt: number = Math.round(convertedInDecimal);
  const decimalRemainder: number = convertedInDecimal - targetInt;

  //returns whole numbers within tolerance buffer
  //example return: 1 cup butter
  console.log(`normalizedTolerance`, normalizedTolerance)
  if (Math.abs(convertedInDecimal - closestInt) <= convertedTolerance) {
    console.log(`return 1`)
    return `${closestInt} ${checkPluralUnit(targetInt, targetUnitName)}`;
  }

  //if amount in target unit <1/64, so negligible
  if (convertedInDecimal <= 1/64) {
    console.log(`return 2`)
    return `${convertedInDecimal.toFixed(5)} ${targetUnitName} (amount negligible)`;
  }

  //returns rounded amount to 2 decimal places for unit types that commonly use decimal (mostly metric)
  //example return: .67 grams salt
  if (targetUnit.output === "decimal") {
    let rounded = roundTo(convertedInDecimal, 2);
    console.log(`return 3`)
    return `${rounded.toString(10)} ${checkPluralUnit(rounded, targetUnitName)}`;
  }

  let [fraction]: Fraction[] = filterFractions("allClosest", decimalRemainder);
  // NOTE: unit string is not functioning correctly here
  let unitString = checkPluralUnit(targetInt + fraction.decimal, targetUnitName);
  const currRemainder = normalizedAmount - (targetInt + fraction.decimal) * targetUnit.conversion;

  //returns fraction if common and amount is within tolerance
  //example return: 2 1/2 cups milk
  if (fraction.common === true && Math.abs(currRemainder) <= normalizedTolerance) {
    return `${targetInt === 0 ? "" : `${targetInt} `}${fraction.string
      } ${unitString}`;
  }

  //returns uncommon fraction and common fraction, with +/- 1-2 of smaller unit
  // example return: 1 6/32 cups or 1 cup, plus 2 tablespoons
  let normalizedRemainder =
    normalizedAmount - targetInt * targetUnit.conversion;
  const potentialFracString: string | null = tryCloseFracs(
    convertedInDecimal,
    normalizedRemainder,
    targetUnitName,
    normalizedTolerance,
    targetInt
  );
  console.log(`potentialFracString`, potentialFracString)
  console.log(`fraction`, fraction)
  let fractionString = `${targetInt === 0 ? "" : targetInt + " "}${fraction.string} ${unitString}`;
  console.log(`fractionString`, fractionString)
  if (potentialFracString) {
    // console.log("returning");
    return `${fractionString} ${potentialFracString}`;
  }

  console.log(`starting recursive`)

  // last resort, returns `${uncommonAmount} or ${commmonAmount} ${targetU}, plus ${list of counts and units}
  const [commonFrac]: Fraction[] = filterFractions(
    "commonClosestLower",
    convertedInDecimal - targetInt
  );
  normalizedRemainder =
    normalizedRemainder - commonFrac.decimal * targetUnit.conversion;
  const possibleU = findPossibleUnits(
    normalizedRemainder,
    targetUnit.type,
    targetUnit.normUnit,
    // startingUnitName
  );
  // console.log("possibleU", possibleU);
  // console.log("possibleU.length", possibleU.length);
  let result: [number, string][] = convertRecursive(
    normalizedTolerance,
    normalizedRemainder,
    possibleU
  );

  // console.log("result", result);
  if (result.length === 1 && result[0][1] === startingUnitName) {
    return `${targetInt > 0 ? targetInt + " " : ""}${fraction.string} ${unitString}`
  }
  let returnString = stringFromConvertRecursive(
    targetInt,
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
const tryCloseFracs = (
  convertedInDecimal: number,
  normalizedRemainder: number,
  targetUnitName: string,
  normalizedTolerance: number,
  // startingUnitName: string,
  targetInt: number
) => {
  console.log(`tryCloseFracs`)
  let targetUnit: Unit = unitDict[targetUnitName];
  let decimalRemainder: number = convertedInDecimal - targetInt;
  // find 2 closest common fractions
  let closest2: Fraction[] = filterFractions("commonClosest2", decimalRemainder);
  console.log(`closest2`, closest2)

  let fracOpt1: FracOption | null = checkFraction(
    closest2[0],
    normalizedRemainder,
    targetUnit,
    normalizedTolerance
  );
  console.log("fracOpt1", fracOpt1);
  let fracOpt2: FracOption | null = checkFraction(
    closest2[1],
    normalizedRemainder,
    targetUnit,
    normalizedTolerance
  );
  console.log("fracOpt2", fracOpt2);
  let closest: FracOption | null = null

  if (!fracOpt1 && !fracOpt2) {
    return null
  }

  if (!fracOpt1 && fracOpt2) {
    closest = fracOpt2
  }
  if (fracOpt1 && !fracOpt2) {
    closest = fracOpt1
  }
  if (fracOpt1 && fracOpt2) {
    closest = compareFracOpts(fracOpt1, fracOpt2, normalizedTolerance)
  }
  console.log(`closest`, closest)
  if (closest && closest.frac) {
    // fraction value for 1 was added to the list of fractions, so need adjust if that was the "fraction" returned
    if (closest.frac.decimal === 1) {
      targetInt += 1;
      closest.frac.decimal = 0;
      closest.frac.string="0"
    }
    let plusMinus =
      convertedInDecimal - targetInt - closest.frac.decimal >= 0
        ? "plus"
        : "minus";
    let unitString = checkPluralUnit(
      targetInt + closest.frac.decimal,
      targetUnitName
    );
    let secondUnitString = checkPluralUnit(
      closest["count"],
      closest["unit"]
    );
    return `or ${targetInt > 0 ? targetInt : ""} ${closest.frac.string==="0"?"":closest.frac.string
      } ${unitString}, ${plusMinus} ${closest["count"]} ${secondUnitString}`;
  }

  return null;
};

const compareFracOpts = (frac1: FracOption, frac2: FracOption, tol: number): FracOption | null => {
  console.log(`compareFracOpts`)
  // check if either is within tolerance
  if (frac1.remainder > tol && frac2.remainder > tol) {
    console.log(`compare return1`)
    return null
  }
  // if only 1 is within tolerance
  if (frac1.remainder > tol && frac2.remainder <= tol) {
    console.log(`compare return2`)
    return frac2
  }
  if (frac1.remainder <= tol && frac2.remainder > tol) {
    console.log(`compare return3`)
    return frac1
  }
  // if both are within tolerance, return option if the fraction is 0 or 1
  if (frac1.frac?.decimal === 0 || frac1.frac?.decimal === 1) {
    console.log(`compare return4`)
    return frac1
  }
  if (frac2.frac?.decimal === 0 || frac2.frac?.decimal === 1) {
    console.log(`compare return5`)
    return frac2
  }
  // return lower count number
  if (frac1.count < frac2.count) {
    console.log(`compare return6`)
    return frac1
  }
  if (frac1.count > frac2.count) {
    console.log(`compare return7`)
    return frac2
  }
  // if count is the same, return smaller unit
  // NOTE: not sure if this is the best priority, check here if returns seem off
  if (unitDict[frac1.unit].conversion < unitDict[frac2.unit].conversion) {
    console.log(`compare return8`)
    return frac1
  }
  if (unitDict[frac1.unit].conversion > unitDict[frac2.unit].conversion) {
    console.log(`compare return9`)
    return frac2
  }
  // if the unit is the same, return the smaller (already rounded)remainder
  if (frac1.remainder < frac2.remainder) {
    console.log(`compare return10`)
    return frac1
  }
  if (frac1.remainder > frac2.remainder) {
    console.log(`compare return11`)
    return frac2
  }
  // if the remainder is the same, return the smaller fraction
  if (frac1.frac && frac2.frac) {
    if (frac1.frac?.decimal <= frac2.frac?.decimal) {
      console.log(`compare return12`)
      return frac1
    } else {
      console.log(`compare return13`)
      return frac2
    }
  }
  console.log(`something went wrong, this should not be reached`)
  return frac1
}

//if an adequate option is found, returns {unit, count, remainder, fraction}, else returns null
const checkFraction = (
  fraction: Fraction,
  normalizedRemainder: number,
  targetUnit: Unit,
  normalizedTolerance: number,
  // startingUnitName: string
): FracOption | null => {


  normalizedRemainder = Math.abs(
    normalizedRemainder - fraction.decimal * targetUnit.conversion
  );
  //example unit returned: [pluralUnitName, conversion]
  let possibleUnits: string[] = findPossibleUnits(
    normalizedRemainder + normalizedTolerance,
    targetUnit.type,
    targetUnit.normUnit
  );

  //checks if 1 or 2 of unit will get within tolerance, if so adds absolute val of remainder, count, unit

  let lowestRem: FracOption | null = null

  while (possibleUnits.length > 0) {
    let currU = possibleUnits.pop()
    let currULowestR: [remainder: number, count: number] = [normalizedRemainder, 0]
    for (let i = 1; i < 5; i++) {
      let R = Math.abs(normalizedRemainder - unitDict[currU as string].conversion * i)
      if (currULowestR[0] > R) {
        currULowestR = [R, i]
      }
    }
    if (lowestRem === null || lowestRem["remainder"] > currULowestR[0]) {
      const rounded = roundTo(currULowestR[0], 2)
      lowestRem = { unit: currU as string, count: currULowestR[1], remainder: rounded }
    } else {
      break
    }
  }
  if (lowestRem) {
    lowestRem.frac = fraction
    if (lowestRem.remainder < normalizedRemainder) {
      return lowestRem
    }
  }
  return null

};

const convertRecursive = (
  normalizedTolerance: number,
  normalizedRemainder: number,
  possibleUnits: string[],
  // [count, unitName]
  result: [count: number, unitName: string][] = []
): [number, string][] => {
  console.log(`convertRecursive`)
  const target: string | undefined = possibleUnits.pop();
  if (normalizedRemainder <= normalizedTolerance || target === undefined) {
    return result;
  }

  const decimal = normalizedRemainder / unitDict[target].conversion;
  const count = Math.floor(decimal);
  normalizedRemainder = normalizedRemainder - count * unitDict[target].conversion;
  if (count > 0) {
    result.push([count, target]);
  }
  return convertRecursive(
    normalizedTolerance,
    normalizedRemainder,
    possibleUnits,
    result
  );
};

const stringFromConvertRecursive = (
  targetInt: number,
  fraction: Fraction,
  unitString: string,
  commonFrac: Fraction,
  recurResult: [number, string][]
) => {
  console.log(`stringFromConvertRecursive`)
  let returnString = `${targetInt > 0 ? targetInt : ""} ${fraction.string
    } ${unitString} or ${targetInt > 0 ? targetInt : ""} ${commonFrac.decimal > 0 ? commonFrac.string : ""
    } ${unitString}${recurResult.length > 0 ? ", plus" : ""}`;
  const lastI = recurResult.length - 1;
  for (let i = 0; i < recurResult.length; i++) {
    unitString = checkPluralUnit(recurResult[i][0], recurResult[i][1]);
    returnString = returnString.concat(
      `${i > 0 && lastI > 1 ? "," : ""}${i === lastI && lastI > 0 ? " and " : " "
      }${recurResult[i][0]} ${unitString}`
    );
  }
  return returnString;
};
