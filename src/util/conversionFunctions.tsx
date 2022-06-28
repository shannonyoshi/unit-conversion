import { postConversion } from "./crudFuncs";
import { ComplexIngr, IngrInput, ConvIngr, Unit, AddedIngr, Fraction, Error, Set } from "../types"
import { unitDict } from "./units";
import {
  checkPluralUnit,
  calcNormalizedTolerance,
  findPossibleUnits,
  validateAmount,
  checkIfSimple,
  roundTo,
  closest2,
  closestFrac,
} from "./utilFunctions";

type pm = "plus" | "minus"

export const formConversion = async (inputs: IngrInput, settings: Set): Promise<[ConvIngr | null, Error | null]> => {
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
    if (settings.toleranceType === "percent" || unitDict[inputs.currentUnit].normUnit === unitDict[settings.toleranceType].normUnit) {
      return [convertSimple(isAmount, inputs, settings), null]
    } else {
      let issue = unitDict[settings.toleranceType].normUnit === "g" ? "weight" : "volume"
      let changeTo = issue === "weight" ? "volume" : "weight"
      return [null, { name: "Tolerance", message: `The tolerance type is set to ${issue}, which does not match what you are trying to convert. Please update tolerance setting to ${changeTo} or percent` }]
    }
  }
  else {
    if (inputs.ingredientName.length === 0) {
      // form button should be disabled when not enough info, so this should not be needed
      return [null, { name: "Ingredient Name", message: "An ingredient name is needed for complex conversion" }]
    }
    return await convertComplex(inputs, isAmount, settings)
  }
}

//performs simple conversion, returns string of converted amount + unit
export const convertSimple = (isAmount: number, inputs: IngrInput, settings: Set): ConvIngr => {
  let targetUnit: Unit = unitDict[inputs.targetUnit];
  // amount in grams or mLs
  const normalizedAmount: number = isAmount * unitDict[inputs.currentUnit].conversion;
  const convertedInDecimal: number = normalizedAmount / targetUnit.conversion;
  const normTol = calcNormalizedTolerance(normalizedAmount, settings)
  const prettyConvertedString: string = prettifyRemainder(
    convertedInDecimal,
    inputs.targetUnit,
    normalizedAmount,
    normTol
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
export const convertComplex = async (inputs: IngrInput, isAmount: number, settings: Set): Promise<[ConvIngr | null, Error | null]> => {

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
  const normTol = calcNormalizedTolerance(normalizedAmount, settings, tryIngredient[0])
  const prettyString: string = prettifyRemainder(newIngredient.targetAmount, inputs.targetUnit, normalizedAmount, normTol)
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
  convertedInDecimal: number,
  targetUnitName: string,
  normalizedAmount: number,
  normalizedTolerance: number
): string => {
  const targetUnit: Unit = unitDict[targetUnitName]
  const convertedTolerance: number = normalizedTolerance / targetUnit.conversion;
  let targetInt: number = Math.floor(convertedInDecimal);
  let closestInt: number = Math.round(convertedInDecimal);
  const decimalRemainder: number = convertedInDecimal - targetInt;

  //returns whole numbers within tolerance buffer
  //example return: 1 cup butter
  if (Math.abs(convertedInDecimal - closestInt) <= convertedTolerance) {
    return `${closestInt} ${checkPluralUnit(targetInt, targetUnitName)}`;
  }

  //if amount in target unit <1/64, so negligible
  if (convertedInDecimal <= 1 / 64) {
    return `${convertedInDecimal.toFixed(5)} ${targetUnitName} (amount negligible)`;
  }

  //returns rounded amount to 2 decimal places for unit types that commonly use decimal (mostly metric)
  //example return: .67 grams salt
  if (targetUnit.output === "decimal") {
    let rounded = roundTo(convertedInDecimal, 2);
    return `${rounded.toString(10)} ${checkPluralUnit(rounded, targetUnitName)}`;
  }

  let fraction: Fraction = closestFrac(decimalRemainder);
  let unitString = checkPluralUnit(targetInt + fraction.decimal, targetUnitName);
  const currRemainder = normalizedAmount - (targetInt + fraction.decimal) * targetUnit.conversion;

  //returns fraction if common and amount is within tolerance
  //example return: 2 1/2 cups milk
  if (fraction.common === true && Math.abs(currRemainder) <= normalizedTolerance) {
    return `${targetInt === 0 ? "" : `${targetInt} `}${fraction.string
      } ${unitString}`;
  }

  let normalizedRemainder =
    normalizedAmount - targetInt * targetUnit.conversion;

  const commonFrac: Fraction[] = closest2(convertedInDecimal - targetInt, true);
  let normalizedRemainder0 =
    normalizedRemainder - commonFrac[0].decimal * targetUnit.conversion;
  const possibleU0 = findPossibleUnits(
    normalizedRemainder0 + normalizedTolerance,
    targetUnit.type,
    targetUnit.normUnit,
  );

  let result0: [number, string][] = convertRecursive(
    normalizedTolerance,
    normalizedRemainder0,
    possibleU0,
  );

  let normalizedRemainder1 = Math.abs(normalizedRemainder - commonFrac[1].decimal * targetUnit.conversion)
  const possibleU1 = findPossibleUnits(normalizedRemainder1 + normalizedTolerance, targetUnit.type, targetUnit.normUnit)
  let result1: [number, string][] = convertRecursive(normalizedTolerance, normalizedRemainder1, possibleU1,)

  let plusMinus: pm = result0.length <= result1.length ? "plus" : "minus"
  let bestResult = result0.length <= result1.length ? result0 : result1

  let returnString = stringFromConvertRecursive(
    targetInt,
    unitString,
    commonFrac[plusMinus === "plus" ? 0 : 1],
    bestResult,
    plusMinus
  );
  return returnString;
};

const convertRecursive = (
  normalizedTolerance: number,
  normalizedRemainder: number,
  possibleUnits: string[],
  result: [count: number, unitName: string][] = []
): [number, string][] => {

  const target: string | undefined = possibleUnits.pop();
  if (normalizedRemainder <= normalizedTolerance || target === undefined) {
    return result;
  }

  const decimal = roundTo(normalizedRemainder / unitDict[target].conversion, 2);
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
  unitString: string,
  commonFrac: Fraction,
  recurResult: [number, string][],
  plusMinus: pm
) => {
  if (commonFrac.decimal === 1) {
    targetInt += 1
    commonFrac.decimal = 0
    commonFrac.string = ""
  }

  let returnString = `${targetInt > 0 ? `${targetInt} ` : ""}${commonFrac.decimal > 0 ? commonFrac.string : ""
    } ${unitString}${recurResult.length > 0 ? plusMinus === "plus" ? ", plus" : ", minus" : ""}`;
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
