import { postConversion } from "./crudFuncs";
import { ComplexIngr, IngrInput, ConvIngr, Unit, AddedIngr, Fraction } from "../types"
import { unitDict } from "./units";
import {
  checkPluralUnit,
  calcNormalizedTolerance,
  filterFractions,
  findPossibleUnits,
} from "./utilFunctions";

// used in a few funcs below
type FracOption = { unit: [string, number], count: number, remainder: number, frac?: Fraction }


//performs simple conversion, returns string of converted amount + unit
export const convertSimple = (amount: number, inputs: IngrInput): ConvIngr => {
  let targetUnit: Unit = unitDict[inputs.targetUnit];
  // amount in grams or mLs
  const normalizedAmount: number = amount * unitDict[inputs.currentUnit].conversion;
  // converted amount in decimal
  const convertedAmountInDecimal: number = normalizedAmount / targetUnit.conversion;
  const prettyConvertedString: string = prettifyRemainder(
    inputs.currentUnit,
    convertedAmountInDecimal,
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
  return convertedIngr;
};
// returns tuple for better error checking
export const convertComplex = async (inputs: IngrInput, isAmount: number): Promise<ConvIngr | null> => {

  const complexIngr: ComplexIngr = {
    ingredientName: inputs.ingredientName,
    currentAmount: isAmount,
    currentUnit: inputs.currentUnit,
    altUnit: unitDict[inputs.currentUnit].normUnit,
    altAmount: unitDict[inputs.currentUnit].conversion * isAmount,
    targetUnit: inputs.targetUnit,
    targetConv: unitDict[inputs.targetUnit].conversion,
  };
  const newIngredient: AddedIngr | null = await postConversion(complexIngr);
  console.log("newIngredient", newIngredient);
  // return newIngredient
  // TODO: should prettify converted string since only decimal is being returned
  if (newIngredient===null){
    return null
  }
  const normalizedAmount:number = newIngredient.targetAmount * unitDict[inputs.targetUnit].conversion
  const prettyString:string = prettifyRemainder(inputs.currentUnit, newIngredient.targetAmount, inputs.targetUnit, normalizedAmount)
  console.log('prettyString', prettyString)
  const formattedIngr:ConvIngr = {
    amount: inputs.amount,
    currentUnit: inputs.currentUnit,
    targetUnit: inputs.targetUnit,
    ingredientName: inputs.ingredientName,
    convertedString: `${prettyString} ${inputs.ingredientName}`,
  };
  return formattedIngr;
};

//receives the converted amount in decimal, and returns a human readable string with the converted amount and target unit
const prettifyRemainder = (
  startingUnitName: string,
  convertedAmountInDecimal: number,
  targetUnitName: string,
  normalizedAmount: number
): string => {
  const targetUnit: Unit = unitDict[targetUnitName]
  const normalizedTolerance: number = calcNormalizedTolerance(normalizedAmount);
  const convertedTolerance: number = normalizedTolerance / targetUnit.conversion;
  let targetUnitInt: number = Math.floor(convertedAmountInDecimal);
  let closestInt: number = Math.round(convertedAmountInDecimal);
  const decimalRemainder: number = convertedAmountInDecimal - targetUnitInt;

  //returns whole numbers within tolerance buffer
  //example return: 1 cup butter
  if (convertedAmountInDecimal - targetUnitInt <= convertedTolerance) {
    return `${targetUnitInt} ${checkPluralUnit(targetUnitInt, targetUnitName)}`;
  }
  if (Math.abs(closestInt - convertedAmountInDecimal) <= convertedTolerance) {
    return `${closestInt} ${checkPluralUnit(closestInt, targetUnitName)}`;
  }
  //if amount in target unit <1/64, so negligible
  if (convertedAmountInDecimal <= 0.0155) {
    return `${convertedAmountInDecimal.toFixed(
      5
    )} ${targetUnitName} (amount negligible)`;
  }

  //returns rounded amount to 2 decimal places for unit types that commonly use decimal (mostly metric)
  //example return: .67 grams salt
  if (targetUnit.output === "decimal") {
    let rounded = Math.floor(convertedAmountInDecimal * 100) / 100;
    return `${rounded.toString(10)} ${checkPluralUnit(rounded, targetUnitName)}`;
  }

  const [fraction]: Fraction[] = filterFractions("allClosest", decimalRemainder);
  // console.log("decimalRemainder", decimalRemainder);
  // console.log("fraction", fraction);

  //returns fraction if common and amount is within tolerance
  //example return: 2 1/2 cups milk
  let unitString = checkPluralUnit(targetUnitInt + fraction.decimal, targetUnitName);
  const currRemainder =
    normalizedAmount - (targetUnitInt + fraction.decimal) * targetUnit.conversion;
  if (fraction.common === true && currRemainder <= normalizedTolerance) {
    return `${targetUnitInt === 0 ? "" : targetUnitInt} ${fraction.string
      } ${unitString}`;
  }
  //returns uncommon fraction and common fraction, with +/- 1-2 of smaller unit
  // example return: 1 6/32 cups or 1 cup, plus 2 tablespoons
  let fractionString = `${targetUnitInt === 0 ? "" : targetUnitInt + " "}${fraction.string
    } ${unitString}`;
  // console.log("fractionString", fractionString);
  let normalizedRemainder =
    normalizedAmount - targetUnitInt * targetUnit.conversion;
  const potentialFracString = checkCloseFracs(
    convertedAmountInDecimal,
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
  const [commonFrac]: Fraction[] = filterFractions(
    "commonClosestLower",
    convertedAmountInDecimal - targetUnitInt
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
    return `${targetUnitInt > 0 ? targetUnitInt + " " : ""}${fraction.string} ${unitString}`
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
  convertedAmountInDecimal: number,
  normalizedRemainder: number,
  targetUnitName: string,
  normalizedTolerance: number,
  startingUnitName: string
) => {
  let targetUnit: Unit = unitDict[targetUnitName];
  let targetInt: number = Math.floor(convertedAmountInDecimal);
  let decimalRemainder: number = convertedAmountInDecimal - targetInt;
  let closest2: Fraction[] = filterFractions("commonClosest2", decimalRemainder);

  let fracOpt1: FracOption | null = checkFraction(
    closest2[0],
    normalizedRemainder,
    targetUnit,
    normalizedTolerance,
    startingUnitName
  );
  // console.log("fracOpt1", fracOpt1);
  let fracOpt2: FracOption | null = checkFraction(
    closest2[1],
    normalizedRemainder,
    targetUnit,
    normalizedTolerance,
    startingUnitName
  );
  // console.log("fracOpt2", fracOpt2);
  let closest: FracOption | null = null
  if (!fracOpt1 && fracOpt2) {
    closest = fracOpt2
  }
  if (!fracOpt2 && fracOpt1) {
    closest = fracOpt1
  }
  if (fracOpt1 && fracOpt2) {
    closest = fracOpt1 && !fracOpt2 ? fracOpt1 : fracOpt2 && !fracOpt1 ? fracOpt2 : null;
    // console.log("closest", closest);
    if (fracOpt1 && fracOpt2) {
      closest =
        fracOpt1.remainder < fracOpt2.remainder ? fracOpt1 : fracOpt2;
      if (fracOpt1.remainder === fracOpt2.remainder) {
        closest = fracOpt1["count"] < fracOpt2["count"] ? fracOpt1 : fracOpt2;
        if (fracOpt1["count"] === fracOpt2["count"] && fracOpt1.frac && fracOpt2.frac) {
          closest =
            fracOpt1.frac.decimal < fracOpt2.frac.decimal ? fracOpt1 : fracOpt2;
        }
      }
    }

  }

  if (closest && closest.frac) {
    // fraction value for 1 was added to the list of fractions, so need adjust if that was the "fraction" returned
    if (closest.frac.decimal === 1) {
      targetInt += 1;
      closest.frac.decimal = 0;
    }
    let plusMinus =
      convertedAmountInDecimal - targetInt - closest.frac.decimal >= 0
        ? "plus"
        : "minus";
    let unitString = checkPluralUnit(
      targetInt + closest.frac.decimal,
      targetUnitName
    );
    let secondUnitString = checkPluralUnit(
      closest["count"],
      closest["unit"][0]
    );
    return `or ${targetInt > 0 ? targetInt : ""} ${closest.frac.string
      } ${unitString}, ${plusMinus} ${closest["count"]} ${secondUnitString}`;
  }

  return null;
};

//if an adequate option is found, returns {unit, count, remainder, fraction}, else returns null
const checkFraction = (
  fraction: Fraction,
  normalizedRemainder: number,
  targetUnit: Unit,
  normalizedTolerance: number,
  startingUnitName: string
): FracOption | null => {
  normalizedRemainder = Math.abs(
    normalizedRemainder - fraction.decimal * targetUnit.conversion
  );
  //example unit returned: [pluralUnitName, conversion]
  let possibleUnits: [string, number][] = findPossibleUnits(
    normalizedRemainder + normalizedTolerance,
    targetUnit.type,
    targetUnit.normUnit
  );

  //checks if 1 or 2 of unit will get within tolerance, if so adds absolute val of remainder, count, unit

  let options = new Map<number, FracOption>();
  //keys for options are the absolute value of the remainder
  for (let i = 0; i < possibleUnits.length; i++) {
    let singleR = Math.abs(normalizedRemainder - possibleUnits[i][1]);
    let doubleR = Math.abs(normalizedRemainder - possibleUnits[i][1] * 2);
    // adds lower remainder to options, preference to lower count
    if (singleR <= doubleR) {
      options.set(singleR, {
        unit: possibleUnits[i],
        count: 1,
        remainder: singleR,
      });
    } else {
      options.set(doubleR, {
        unit: possibleUnits[i],
        count: 2,
        remainder: doubleR,
      });
    }
  }
  //finds key to lowest remainder option

  let bestOptKey: number = Math.min(...Object.keys(options).map(Number));

  let bestOpt: FracOption | undefined = options.get(bestOptKey)
  if (
    bestOptKey <= normalizedTolerance && bestOpt &&
    bestOpt.unit[0] !== startingUnitName
  ) {
    bestOpt.frac = fraction

    return bestOpt;
  } else {
    return null;
  }
};

const convertRecursive = (
  normalizedTolerance: number,
  normalizedRemainder: number,
  // [unitName, conversion]
  possibleUnits: [string, number][],
  // [count, unitName]
  result: [number, string][] = []
): [number, string][] => {

  const target: [string, number] | undefined = possibleUnits.shift();
  if (normalizedRemainder <= normalizedTolerance || target === undefined) {
    return result;
  }

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

const stringFromConvertRecursive = (
  targetUnitInt: number,
  fraction: Fraction,
  unitString: string,
  commonFrac:Fraction,
  recurResult:[number, string][]
) => {
  let returnString = `${targetUnitInt > 0 ? targetUnitInt : ""} ${fraction.string
    } ${unitString} or ${targetUnitInt > 0 ? targetUnitInt : ""} ${commonFrac.decimal > 0 ? commonFrac.string : ""
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
