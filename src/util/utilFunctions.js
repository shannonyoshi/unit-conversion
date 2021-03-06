import { unitDict, allFractions } from "./units";

//returns parsed amount in decimal or false if amount is unable to be parsed
export const validateAmount = (amount) => {
  //probably will never catch anything with this one  ¯\_( )_/¯
  let result = false;
  if (typeof amount === "number") {
    return amount;
  }
  //split amount on white space, then remove excess white space
  let amountArray = amount.split(" ").map((item) => item.trim());
  amountArray = amountArray.filter((item) => item !== "");
  //checks for whole number to return
  if (!amount.includes(".") && !amount.includes("/") && !amount.includes(",")) {
    const parsedWholeNum = parseInt(amountArray.join(""));
    if (typeof parsedWholeNum == "number") {
      result = parsedWholeNum;
    }
  }
  // checks amount is/has fraction
  if (amount.includes("/")) {
    result = validateFraction(amountArray);
  }
  if (
    (amount.includes(".") || amount.includes(",")) &&
    amountArray.length === 1
  ) {
    const parsedFl = parseFloat(amountArray[0], 10);
    if (typeof parsedFl === "number") {
      result = parsedFl;
    }
  }
  return result;
};

const validateFraction = (amountArray) => {
  let fracIndex = [];
  const fraction = amountArray.filter((string, index) => {
    if (string.includes("/")) {
      fracIndex.push(index);
      return true;
    }
    return false;
  });
  //if one fraction was found
  if (fracIndex.length === 1) {
    fracIndex = fracIndex[0];
    let parsed = 0;
    // for numbers >1
    if (fracIndex > 0) {
      parsed = parseInt(amountArray.slice(0, fracIndex).join(""), 10);
    }
    const fracArray = fraction[0].split("/");
    const dividend = parseInt(fracArray[0], 10);
    const divisor = parseInt(fracArray[1], 10);
    if (
      typeof dividend == "number" &&
      typeof divisor == "number" &&
      typeof parsed == "number"
    ) {
      const quotient = Math.floor((dividend / divisor) * 1000) / 1000;
      return parsed + quotient;
    }
  }
  return false;
};

//checks if the conversion is weight=>weight or vol=>vol
export const checkIfSimple = (currentUnit, targetUnit) => {
  if (unitDict[currentUnit].normUnit === unitDict[targetUnit].normUnit) {
    return true;
  }
  return false;
};

export const checkPluralUnit = (amount, endUnitName) => {
  let returnString = endUnitName;
  if (0 < amount && amount <= 1) {
    returnString = unitDict[endUnitName].singular;
  }
  return returnString;
};

//returns tolerance in mLs of +/-2.5%
export const calcNormalizedTolerance = (normalizedAmount) => {
  const twoPointFivePercent = normalizedAmount * 1.025 - normalizedAmount;

  return twoPointFivePercent;
};

//filters fractions, remainder should be in decimal, if closest2, check if returning ["",1,"true"]
export const filterFractions = (type, remainder = null) => {
  const closest2 = (fracs) => {
    //adds additional fraction to the end ["", 1.00, "true"]
    fracs.push([fracs[0][0], fracs[0][1] + 1, fracs[0][2]]);
    let i = 0;
    let next = fracs[1];
    let current = fracs[i];
    while (i + 1 < fracs.length && next[1] < remainder) {
      current = fracs[i];
      next = fracs[i + 1];
      i += 1;
    }
    return [current, next];
  };
  switch (type) {
    case "all":
      return allFractions;
    case "common":
      return allFractions.filter((fraction) => fraction[2] === true);
    case "commonClosestLower":
      const commonFracs = filterFractions("common");
      const close2Fracs = closest2(commonFracs);
      return close2Fracs[0];
    case "allClosest":
      return allFractions.reduce((prev, curr)=> {
        return Math.abs(curr[1] - remainder) < Math.abs(prev[1] - remainder)? curr: prev})
    case "commonClosest":
      return allFractions.reduce((prev, curr) =>
        Math.abs(curr[1] - remainder) < Math.abs(prev[1] - remainder) &&
        curr[2] === true
          ? curr
          : prev
      );
    case "commonClosest2":
      let common = filterFractions("common");
      return closest2(common);
    default:
      return null;
  }
};

//returns array of units in [[name, conversion],[name, conversion]] format of same type that are smaller than remainingmLs, starting from largest unit
//exclude is for mostly starting unit name when we don't want to return the starting unit as an option
export const findPossibleUnits = (
  remainingmLs,
  targetUnitType,
  targetNormUnit,
  exclude = null
) => {

  const possible = [];
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

//filters based on filterType matching provided filterString, accepts unitDict OR array of unit names
export const filterUnits = (filterType, filterString, units = unitDict) => {
  let result = [];
  if (Array.isArray(units)) {
    result = units.filter(
      (unitName) => unitDict[unitName][filterType] === filterString
    );
  } else {
    for (let [key, value] of Object.entries(units)) {
      if (value[filterType] === filterString) {
        result.push(key);
      }
    }
  }

  return result;
};
