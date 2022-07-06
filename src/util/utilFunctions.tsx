import { unitDict, allFractions } from "./units";
import { Fraction, unitProperty, Set, AddedIngr, IngrInput, Error } from "../types"

export const getAbbrev = (): string[][] => {
  let units = Object.keys(unitDict)
  let ret: string[][] = []
  for (let i = 0; i < units.length; i++) {
    ret.push([units[i], unitDict[units[i]].singular, ...unitDict[units[i]]!.aka])
  }
  return ret
}

export const roundTo = (toRound: number, decPoints: number) => {
  let mult = Math.pow(10, decPoints)
  return Math.round(toRound * mult) / mult
}

interface fracInfo {
  string: string, // string of the fraction
  slashIndex: number, // represents index of "/" in this fraction string
  location: number //represents index of fraction in the amount array
}

// returns fraction if one is found, otherwise null (including if more than one is found)
const findFraction = (amountArray: string[]): fracInfo | null => {
  let fractions: fracInfo[] = []
  for (let i = 0; i < amountArray.length; i++) {
    if (amountArray[i].includes("/")) {
      fractions.push({ string: amountArray[i], slashIndex: amountArray[i].indexOf("/"), location: i })
    }
  }
  return fractions.length === 1 ? fractions[0] : null

}
export const matchUnitNames = (input: string[]): string | null => {
  // console.log(`input`, input)
  let abbrevs = getAbbrev()
  // console.log(`abbrevs`, abbrevs)
  let potentialU = input.length > 1 ? input.join(" ") : input[0]
  // console.log(`potentialU`, potentialU)
  if (!potentialU.startsWith("t") && !potentialU.startsWith("T")) {
    potentialU = potentialU.toLowerCase()
  }
  for (let i = 0; i < abbrevs.length; i++) {
    // console.log(`abbrevs[i]`, abbrevs[i])
    // console.log(`abbrevs[i].includes(potentialU)`, abbrevs[i].includes(potentialU))
    if (abbrevs[i].includes(potentialU)) {
      // console.log(`return true`, abbrevs[i][0])
      return abbrevs[i][0]
    }
  }
  return null
}

export const validateList = (ingrString: string): [IngrInput | null, Error | null] => {
  let error: Error
  let currString = ingrString
  let arrow: number = ingrString.indexOf("->")
  let targetU: string = ""

  if (arrow > -1) {
    currString = ingrString.slice(0, arrow)
    let end: string[] = ingrString.slice(arrow + 2).split(" ")
    let target: string | null = matchUnitNames(end)
    if (target) {
      targetU = target
    } else {
      error = { name: "General", message: "Could not validate target unit name" }
      return [null, error]
    }
  } else {
    targetU = "grams"
  }

  let words = currString.split(" ")
  let amount: number = 0
  let amountI: number[] = []
  let currentU: string | null = null
  let unitI: number[] = []
  let iNameStart: number = -1

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
  let amountString = amountI.map(index => words[index]).join(" ")
  let iName = iNameStart !== -1 ? words.slice(-words.length + iNameStart).join(" ") : ""
  if (amount > 0 && currentU) {
    let ret: IngrInput = {
      name: "",
      currentAmount: amountString,
      currentUnit: currentU,
      targetUnit: targetU,
      ingredientName: iName
    }
    return [ret, null]
  } else {
    let messageString = `${amount === 0 ? `Could not validate the amount ${amountString}` : currentU ? `Could not validate the unit provided: ${ingrString.slice(unitI[0], unitI[-1])}` : "Error validating information provided"}`
    error = { name: "Conversion", message: messageString }
    return [null, error]
  }
}

// returns decimal of the input if there is a valid fraction or null if not
const validateFraction = (amountArray: string[]): null | number => {
  let fraction: fracInfo | null = findFraction(amountArray)

  //if one "/" was found and "/" is not the first or last character of the strings 
  if (fraction && fraction.slashIndex !== 0 && fraction.slashIndex !== fraction.string.length - 1) {

    const fracArray = fraction.string.split("/");
    const dividend = parseInt(fracArray[0], 10);
    const divisor = parseInt(fracArray[1], 10);
    let wholeNum: number = 0

    if (fraction.location > 0) {
      let ints = amountArray.slice(0, fraction.location).join("")
      wholeNum = Number(ints)
    }
    if (!isNaN(dividend) && !isNaN(divisor) && !isNaN(wholeNum)) {
      const quotient = roundTo(dividend / divisor, 3);
      if (wholeNum + quotient === 0) {
        return null
      } else {
        return wholeNum + quotient;
      }
    }
  }
  return null;
};

//returns parsed amount in decimal or false if amount is unable to be parsed
export const validateAmount = (amount: string): number | null => {

  let num = Number(amount)
  // console.log(`num`, num)
  // console.log(`isNaN(num)`, isNaN(num))
  if (!isNaN(num)) {
    // console.log(`return num`)
    return num
  } else {
    // console.log(`else`)
    //split amount on white space into string[], then remove excess white space
    let amountArray: string[] = amount.split(" ").map((item: string) => item.trim());
    amountArray = amountArray.filter((item: string) => item !== "");
    // console.log(`amountArray`, amountArray)
    //checks if amount is a whole number that can be returned
    if (!amount.includes(".") && !amount.includes("/") && !amount.includes(",")) {
      const parsedWholeNum = parseInt(amountArray.join(""));
      if (typeof parsedWholeNum === "number" && !isNaN(num)) {
        // console.log(`parsedWholeNum`, parsedWholeNum)
        return parsedWholeNum;
      }
    }
    // checks amount is/has fraction
    if (amount.includes("/")) {
      // console.log(`validateFraction`)
      return validateFraction(amountArray);

    }
    if ((amount.includes(".") || amount.includes(",")) && amountArray.length === 1) {
      const parsedFl = parseFloat(amountArray[0]);
      if (typeof parsedFl === "number") {
        // console.log(`parsedFl`, parsedFl)
        return parsedFl;
      }
    }

  }
  // console.log(`return null from validateAAmount`)
  return null;
};

//checks if the conversion is weight=>weight or vol=>vol
export const checkIfSimple = (currentUnit: string, targetUnit: string): boolean => {
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

//returns tolerance in mL or g, ingr only required for complex conversions
export const calcNormalizedTolerance = (normalizedAmount: number, settings: Set, ingr?: AddedIngr): number => {
  if (settings.toleranceType === "percent") {
    let percentage = settings.tolerance / 100
    return normalizedAmount * percentage;
  }
  else {
    let tolU = unitDict[settings.toleranceType]
    let convertedTol = tolU.conversion * settings.tolerance
    if (!ingr || tolU.normUnit === unitDict[ingr.targetUnit].normUnit) {
      return convertedTol
    }
    else {
      return convertedTol * ingr.targetAmount / ingr.sourceAmount
    }
  }
};

// Fraction filter functions:
const getFracs = (common: boolean): Fraction[] => {
  if (common === true) {
    return allFractions.filter((fraction) => fraction.common === true)
  } else {
    return allFractions
  }
}

export const closestFrac = (remainder: number, common: boolean = false): Fraction => {
  let fracs: Fraction[] = getFracs(common)
  return fracs.reduce((prev, curr) => {
    return Math.abs(curr.decimal - remainder) < Math.abs(prev.decimal - remainder) ? curr : prev
  })
}

// returns the 2 closest fractions, should have a higher than and lower than the remainder
export const closest2 = (remainder: number, common: boolean = false): [Fraction, Fraction] => {
  //adds additional fraction to the end ["", 1.00, "true"]
  let fracs = getFracs(common)
  fracs.push({ string: "", decimal: 1, common: true });
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

// return array of unit names in order from smallest to largest units
//exclude is for mostly starting unit name when we don't want to return the starting unit as an option
export const findPossibleUnits = (
  normalizedRemainder: number,
  targetUnitType: string,
  targetNormUnit: string,
  exclude?: undefined | string
): string[] => {

  const possible: string[] = [];
  for (let [key, value] of Object.entries(unitDict)) {
    if (
      value.type === targetUnitType &&
      value.conversion <= normalizedRemainder &&
      value.normUnit === targetNormUnit &&
      key !== exclude
    ) {
      possible.push(key);
    }
  }
  return possible;
};

//filters based on propertyName matching provided filterString, accepts array of unit names
export const filterUnits = (propertyName: unitProperty, filterString: string, units?: string[]): string[] => {
  let result: string[] = [];
  if (units) {
    result = units.filter(
      (unitName: string) => unitDict[unitName][propertyName] === filterString
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
