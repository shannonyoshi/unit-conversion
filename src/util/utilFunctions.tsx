import { unitDict, allFractions } from "./units";
import { Fraction, unitProperty } from "../types"

// TODO: rewrite validateAmount to work better in typescript


// returns decimal of the input if there is a valid fraction or false if not
const validateFraction = (amountArray: string[]): boolean | number => {
  let fracIndexArr: number[] = [];
  // finds strings that include "/", and saves index of that string
  const fraction = amountArray.filter((string, index) => {
    if (string.includes("/")) {
      fracIndexArr.push(index);
      return true;
    }
    return false;
  });
  //if one "/" was found
  if (fracIndexArr.length === 1) {
    let fracIndex: number = fracIndexArr[0];
    let parsed: number = 0;
    // for numbers >1
    if (fracIndex > 0) {
      // parsed is the whole number before the fraction
      parsed = parseInt(amountArray.slice(0, fracIndex).join(""), 10);
    }
    const fracArray = fraction[0].split("/");
    const dividend = parseInt(fracArray[0], 10);
    const divisor = parseInt(fracArray[1], 10);
    if (
      typeof dividend === "number" &&
      typeof divisor === "number" &&
      typeof parsed === "number"
    ) {
      const quotient = Math.floor((dividend / divisor) * 1000) / 1000;
      return parsed + quotient;
    }
  }
  return false;
};
//returns parsed amount in decimal or false if amount is unable to be parsed
export const validateAmount = (amount: string): number | null => {

  //split amount on white space into string[], then remove excess white space
  let amountArray: string[] = amount.split(" ").map((item: string) => item.trim());
  amountArray = amountArray.filter((item: string) => item !== "");
  //checks if amount is a whole number that can be returned
  if (!amount.includes(".") && !amount.includes("/") && !amount.includes(",")) {
    const parsedWholeNum = parseInt(amountArray.join(""));
    if (typeof parsedWholeNum === "number") {
      return parsedWholeNum;
    }
    // checks amount is/has fraction
    if (amount.includes("/")) {
      return validateFraction(amountArray);
    }
    if ((amount.includes(".") || amount.includes(",")) && amountArray.length === 1) {
      const parsedFl = parseFloat(amountArray[0]);
      if (typeof parsedFl === "number") {
        return parsedFl;
      }
    }
  }
  return null;
};

//checks if the conversion is weight=>weight or vol=>vol
export const checkIfSimple = (currentUnit: string, targetUnit: string) => {
  if (unitDict[currentUnit].normUnit === unitDict[targetUnit].normUnit) {
    return true;
  }
  return false;
};

export const checkPluralUnit = (amount: number, endUnitName: string) => {
  let returnString = endUnitName;
  if (0 < amount && amount <= 1) {
    returnString = unitDict[endUnitName].singular;
  }
  return returnString;
};

//returns tolerance in mLs of +/-2.5%
export const calcNormalizedTolerance = (normalizedAmount: number): number => {
  const twoPointFivePercent = normalizedAmount * 1.025 - normalizedAmount;

  return twoPointFivePercent;
};

//filters fractions, remainder should be in decimal, if closest2, check if returning ["",1,"true"]
export const filterFractions = (type: string, remainder?: number): Fraction[] => {
  // returns the 2 closest fractions, should have a higher than and lower than the remainder
  const closest2 = (fracs: Fraction[], remainder: number): [Fraction, Fraction] => {
    //adds additional fraction to the end ["", 1.00, "true"]
    fracs.push({ string: fracs[0].string, decimal: fracs[0].decimal + 1, common: fracs[0].common });
    let i = 0;
    let next = fracs[1];
    let current = fracs[i];
    while (i + 1 < fracs.length && next.decimal < remainder) {
      current = fracs[i];
      next = fracs[i + 1];
      i += 1;
    }
    return [current, next];
  };
  if (!remainder) {
    switch (type) {
      case "all":
        return allFractions;
      case "common":
        // returns common=true fractions
        return allFractions.filter((fraction) => fraction.common === true);
      default:
        return []
    }
  }
  else {
    switch (type) {
      case "commonClosestLower":
        // returns the closest common fraction that is less than the remainder
        const commonFracs: Fraction[] = filterFractions("common");
        const close2Fracs: Fraction[] = closest2(commonFracs, remainder);
        return [close2Fracs[0]];
      case "allClosest":
        // returns common = true or false
        return [allFractions.reduce((prev, curr) => {
          return Math.abs(curr.decimal - remainder) < Math.abs(prev.decimal - remainder) ? curr : prev
        })]
      // returns common=true closest fraction
      case "commonClosest":
        return [allFractions.reduce((prev, curr) =>
          Math.abs(curr.decimal - remainder) < Math.abs(prev.decimal - remainder) &&
            curr.common === true
            ? curr
            : prev
        )];
      case "commonClosest2":
        let common = filterFractions("common");
        return closest2(common, remainder);
      default:
        return [];
    }
  };
}

//returns array of units in [[name, conversion],[name, conversion]] format of same type that are smaller than remainingmLs, starting from largest unit
//exclude is for mostly starting unit name when we don't want to return the starting unit as an option
export const findPossibleUnits = (
  remainingmLs: number,
  targetUnitType: string,
  targetNormUnit: string,
  exclude?: undefined | string
): [string, number][] => {

  const possible: [string, number][] = [];
  for (let [key, value] of Object.entries(unitDict)) {
    if (
      value.type === targetUnitType &&
      value.conversion <= remainingmLs &&
      value.normUnit === targetNormUnit &&
      key !== exclude
    ) {
      possible.push([key, value.conversion]);
    }
  }
  return possible.reverse();
};


//filters based on propertyName matching provided filterString, accepts array of unit names
export const filterUnits = (propertyName: unitProperty, filterString: string, units?: string[]): string[] => {
  let result: string[] = [];
  if (units) {
    result = units.filter(
      (unitName:string) => unitDict[unitName][propertyName] === filterString
    );
  } else {
    for (let [key, value] of Object.entries(unitDict)) {
      if (value[propertyName] === filterString) {
        result.push(key);
      }
    }
  }

  return result;
};
