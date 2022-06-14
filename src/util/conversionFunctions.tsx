import { postConversion } from "./crudFuncs";
import { ComplexIngr, IngrInput, ConvIngr, Unit, AddedIngr, Fraction, Error } from "../types"
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
  closestLowerFrac
} from "./utilFunctions";


// TODO: getting inconsistent results for 47 teaspoons to cups, sometimes getting "0 cup or 1 cup, minus 1 teaspoon", sometimes getting "15/16 cup or 1 cup, minus 1 teaspoon"

type FracOption = { unit: string, count: number, remainder: number, frac?: Fraction };

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
  const prettyString: string = prettifyRemainder(newIngredient.targetAmount, inputs.targetUnit, normalizedAmount)
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
  normalizedAmount: number
): string => {
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

  //returns whole numbers with +/- 1-4 of smaller unit
  // example return: 1 cup, plus 2 tablespoons
  let normalizedRemainder =
    normalizedAmount - targetInt * targetUnit.conversion;
  // const potentialFracString: string | null = tryCloseFracs(
  //   convertedInDecimal,
  //   normalizedRemainder,
  //   targetUnitName,
  //   normalizedTolerance,
  //   targetInt
  // );

  // if (potentialFracString) {
  //   return `${potentialFracString}`;
  // }


  //  setting up recursive result
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

  let plusMinus = result0.length <= result1.length ? "plus" : "minus"
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

// returns readable string if there is a close fraction that gets close to total amount with additional 1-2 of smaller unit
// if option is found, returns closest option with lower count
// const tryCloseFracs = (
//   convertedInDecimal: number,
//   normalizedRemainder: number,
//   targetUnitName: string,
//   normalizedTolerance: number,
//   // startingUnitName: string,
//   targetInt: number
// ) => {
//   let targetUnit: Unit = unitDict[targetUnitName];
//   let decimalRemainder: number = convertedInDecimal - targetInt;
//   // find 2 closest common fractions
//   let closest2Fracs: Fraction[] = closest2(decimalRemainder, true);
//   let fracOpt1: FracOption | null = checkFraction(
//     closest2Fracs[0],
//     normalizedRemainder,
//     targetUnit,
//     normalizedTolerance
//   );
//   let fracOpt2: FracOption | null = checkFraction(
//     closest2Fracs[1],
//     normalizedRemainder,
//     targetUnit,
//     normalizedTolerance
//   );
//   let closest: FracOption | null = null

//   if (!fracOpt1 && !fracOpt2) {
//     return null
//   }

//   if (!fracOpt1 && fracOpt2) {
//     closest = fracOpt2
//   }
//   if (fracOpt1 && !fracOpt2) {
//     closest = fracOpt1
//   }
//   if (fracOpt1 && fracOpt2) {
//     closest = compareFracOpts(fracOpt1, fracOpt2, normalizedTolerance)
//   }
//   if (closest && closest.frac) {
//     // fraction value for 1 was added to the list of fractions, so need adjust if that was the "fraction" returned
//     if (closest.frac.decimal === 1) {
//       targetInt += 1;
//       closest.frac.decimal = 0;
//       closest.frac.string = "0"
//     }
//     let plusMinus =
//       convertedInDecimal - targetInt - closest.frac.decimal >= 0
//         ? "plus"
//         : "minus";
//     let unitString = checkPluralUnit(
//       targetInt + closest.frac.decimal,
//       targetUnitName
//     );
//     let secondUnitString = checkPluralUnit(
//       closest["count"],
//       closest["unit"]
//     );
//     return `${targetInt > 0 ? targetInt : ""} ${closest.frac.string === "0" ? "" : closest.frac.string
//       } ${unitString}, ${plusMinus} ${closest["count"]} ${secondUnitString}`;
//   }

//   return null;
// };

// const compareFracOpts = (frac1: FracOption, frac2: FracOption, tol: number): FracOption | null => {
//   // check if either is within tolerance
//   if (frac1.remainder > tol && frac2.remainder > tol) {
//     return null
//   }
//   // if only 1 is within tolerance
//   if (frac1.remainder > tol && frac2.remainder <= tol) {
//     return frac2
//   }
//   if (frac1.remainder <= tol && frac2.remainder > tol) {
//     return frac1
//   }
//   // if both are within tolerance, return option if the fraction is 0 or 1
//   if (frac1.frac?.decimal === 0 || frac1.frac?.decimal === 1) {
//     return frac1
//   }
//   if (frac2.frac?.decimal === 0 || frac2.frac?.decimal === 1) {
//     return frac2
//   }
//   // return lower count number
//   if (frac1.count < frac2.count) {
//     return frac1
//   }
//   if (frac1.count > frac2.count) {
//     return frac2
//   }
//   // if count is the same, return smaller unit
//   // NOTE: not sure if this is the best priority, check here if returns seem off
//   if (unitDict[frac1.unit].conversion < unitDict[frac2.unit].conversion) {
//     return frac1
//   }
//   if (unitDict[frac1.unit].conversion > unitDict[frac2.unit].conversion) {
//     return frac2
//   }
//   // if the unit is the same, return the smaller (already rounded)remainder
//   if (frac1.remainder < frac2.remainder) {
//     return frac1
//   }
//   if (frac1.remainder > frac2.remainder) {
//     return frac2
//   }
//   // if the remainder is the same, return the smaller fraction
//   if (frac1.frac && frac2.frac) {
//     if (frac1.frac?.decimal <= frac2.frac?.decimal) {
//       return frac1
//     } else {
//       return frac2
//     }
//   }
//   console.log(`something went wrong, this should not be reached`)
//   return frac1
// }

//if an adequate option is found, returns {unit, count, remainder, fraction}, else returns null
// const checkFraction = (
//   fraction: Fraction,
//   normalizedRemainder: number,
//   targetUnit: Unit,
//   normalizedTolerance: number,
//   // startingUnitName: string
// ): FracOption | null => {


//   normalizedRemainder = Math.abs(
//     normalizedRemainder - fraction.decimal * targetUnit.conversion
//   );
//   //example unit returned: [pluralUnitName, conversion]
//   let possibleUnits: string[] = findPossibleUnits(
//     normalizedRemainder + normalizedTolerance,
//     targetUnit.type,
//     targetUnit.normUnit
//   );

//   //checks if 1 or 2 of unit will get within tolerance, if so adds absolute val of remainder, count, unit

//   let lowestRem: FracOption | null = null

//   while (possibleUnits.length > 0) {
//     let currU = possibleUnits.pop()
//     let currULowestR: [remainder: number, count: number] = [normalizedRemainder, 0]
//     for (let i = 1; i < 5; i++) {
//       let R = Math.abs(normalizedRemainder - unitDict[currU as string].conversion * i)
//       if (currULowestR[0] > R) {
//         currULowestR = [R, i]
//       }
//     }
//     if (lowestRem === null || lowestRem["remainder"] > currULowestR[0]) {
//       const rounded = roundTo(currULowestR[0], 2)
//       lowestRem = { unit: currU as string, count: currULowestR[1], remainder: rounded }
//     } else {
//       break
//     }
//   }
//   if (lowestRem) {
//     lowestRem.frac = fraction
//     if (lowestRem.remainder < normalizedRemainder) {
//       return lowestRem
//     }
//   }
//   return null

// };

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
  plusMinus: string
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
