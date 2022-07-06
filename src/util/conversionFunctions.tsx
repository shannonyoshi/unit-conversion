import { postConversion } from "./crudFuncs";
import { ComplexIngr, IngrInput, ConvIngr, Unit, AddedIngr, Fraction, Error, Set, InputsList } from "../types"
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
  matchUnitNames
} from "./utilFunctions";

type pm = "plus" | "minus"

// return type :Promise<[ConvIngr | null, Error | null]>
export const listConversion = async (inputsList: InputsList, settings: Set) => {
  console.log("inputsList: ", inputsList)
  // splits input string into ingredients by new line character
  let rows: string[] = inputsList.string.split("\n")
  // removes extra white spaces from each row
  rows = rows.map(row => row.replace(/\s\s+/g, ' ').trim())
  // iterate over rows, make IngrInputs for each row
  let ingrs: [IngrInput | null, Error | null][] = rows.map(row => stringToIngr(row))
  // validate info for each ingredient, then try to convert it
  // add result to return []
  console.log(`rows`, rows)
  console.log(`ingrs`, ingrs)
  for (let i = 0; i < ingrs.length; i++) {
    let curr = ingrs[i]
    if (curr[0]) {
// TODO: start here tomorroq
    }

  }


  return []
}

const stringToIngr = (ingrString: string): [IngrInput | null, Error | null] => {
  // console.log(`ingrString`, ingrString)
  let words = ingrString.split(" ")
  // console.log(`words`, words)
  let amount: number = 0
  let amountI: number[] = []
  let currentU: string | null = null
  let unitI: number[] = []
  let iNameStart: number = -1
  let targetU: string = ""

  let arrow = words.indexOf("->")
  if (arrow > -1 && arrow < words.length - 1) {
    let target = matchUnitNames(words.slice(arrow + 1))
    if (target){
      targetU=target
    }
  }
  if (arrow===-1){
    targetU="grams"
  }

  for (let i = 0; i < words.length; i++) {
    // find valid amount
    let isAmount = validateAmount(words[i])
    if (isAmount) {
      amountI.push(i)
      amount += isAmount
      continue;
    }
    // if amount has been found, and current word is not an amount, 
    // check if this word is a unit
    if (amount > 0 && !isAmount && !currentU) {

      currentU = matchUnitNames([words[i]])
      // console.log(` returned currentU`, currentU)
      if (currentU !== null) {
        unitI.push(i)
        continue;
      }
      // if this word isn't a unit, check if its a compount unit (2 words)
      // if so, skip the next i
      if (currentU === null && i + 1 < words.length) {
        currentU = matchUnitNames([words[i], words[i + 1]])
        // console.log(` returned currentU`, currentU)
        if (currentU) {
          unitI.push(i)
          unitI.push(i + 1)
          i += 1
          continue;
        }
      }

    }
    // once an amount and current unit are validated,
    // the rest of the words are the ingredient name
    if (amount > 0 && currentU && iNameStart === -1) {
      iNameStart = i
      break;
    }
  }
  let iName = iNameStart !== -1 ? words.slice(-words.length + iNameStart).join(" ") : ""
  // console.log(`amount`, amount)
  // console.log(`currentU`, currentU)
  // console.log(`iName`, iName)
  if (amount > 0 && currentU) {
    let ret: IngrInput = {
      name: "",
      currentAmount: `${amount}`,
      currentUnit: currentU,
      targetUnit: "",
      ingredientName: iName

    }
    return [ret, null]
  } else {
    let messageString = `${amount === 0 ? `Could not validate the amount ${ingrString.slice(0, amountI[-1])}` : currentU ? `Could not validate the unit provided: ${ingrString.slice(unitI[0], unitI[-1])}` : "Error validating information provided"}`
    return [null, { name: "Conversion", message: messageString }]
  }
}

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
