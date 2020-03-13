import {unitDict, allFractions} from "./units"
//returns parsed amount in decimal or false if amount is unable to be parsed
export const validateAmount = amount => {
  let amountArray = amount.split(" ").map(item => item.trim());
  if (!amount.includes(".") && !amount.includes("/")) {
    const parsedWholeNum = parseInt(amountArray.join(""));
    console.log("parsedWholeNum", parsedWholeNum);
    if (isNaN(parsedWholeNum)) {
      return false;
    } else {
      return parsedWholeNum;
    }
  }
  if (amount.includes("/")) {
    // parses whole number
    const parsed = parseInt(amountArray[0], 10);
    if (isNaN(parsed)) {
      return false;
    } else {
      const fraction = amountArray[1];
      let slashIndex = fraction.indexOf("/");
      const dividend = parseInt(fraction.slice(0, slashIndex), 10);
      const divisor = parseInt(fraction.slice(slashIndex + 1), 10);
      if (isNaN(dividend) || isNaN(divisor)) {
        return false;
      } else {
        const quotient = Math.floor((dividend / divisor) * 1000) / 1000;
        return parsed + quotient;
      }
    }
  }
  if (amount.includes(".") && amountArray.length === 1) {
    const parsedFl = parseFloat(amount, 10);
    if (isNaN(parsedFl)) {
      return false;
    } else {
      return parsedFl;
    }
  }
  return false;
};

//performs simple conversion, returns string of converted amount + unit, warning if not accurate withing +/-2.5%
export const convertSimple = (amount, startingUnit, endUnit) => {
  startingUnit = unitDict[startingUnit];
  let targetUnit = unitDict[endUnit];
  let warning = null
  const amountmLs = amount * startingUnit.conversion;
  const targetUnitInDecimal = amountmLs / targetUnit.conversion;
  const decimalRemainder = targetUnitInDecimal - Math.floor(targetUnitInDecimal);
  if (decimalRemainder <= 0.015) {
    //returns whole numbers + unit
    return (`${Math.floor(targetUnitInDecimal)} ${endUnit}`, warning);
  }
  if (targetUnit.output === "decimal") {
    //returns amount with max 2 decimal numbers
    let amountTo2Decimal = Math.floor(targetUnitInDecimal * 100) / 100;
    return (`${amountTo2Decimal.toString(10)} ${endUnit}`, warning);
  } 
  //ex. fraction = ["1/10", 0.1, false]
    const fraction = findClosestFraction(decimalRemainder);
    const targetUnitmLs = Math.floor(targetUnitInDecimal) + fraction[1]
    if (amountmLs*.985 <=targetUnitmLs && targetUnitmLs <= amountmLs*1.025) {
      warning = "Warning: conversion is not accurate within +/-2.5%"
    }
    //true means this is a common fraction used for baking
    if (fraction[2]===true) {
      return (`${Math.floor(targetUnitInDecimal)+ fraction[0]}`, warning)
    } else {

    
      let remainingmLs = decimalRemainder * targetUnit.conversion

      //START WORKING HERE, convertedRemainder needs work
      let converted = convertRemainder(remainingmLs, targetUnit.type)
    }
};


const convertRemainder = (remainingmLs, targetUnitType) => {
  console.log("CONVERT REMAINDER CALLED")  
  let availableUnits = []
    for (let unit of Object.entries(unitDict)) {
      // console.log("COUNT: ", count)
      // console.log("in convertRemainder availableUnit loop unit", unit)
      console.log(`unit.unit (${unit[unit]}) === targetUnitType(${targetUnitType}): ${unit.unit === targetUnitType}`)
      console.log(`unit.conversion (${unit.conversion}) <= remainingmLs (${remainingmLs}): ${unit.conversion <= remainingmLs}`)
      if (unit.unit === targetUnitType && unit.conversion <= remainingmLs) {
        availableUnits.append([unit]);
      }
    }
    console.log("convertRemainder availableUnits", availableUnits);
    // TODO: finish this
  }

  const findClosestFraction = (remainder) => {
    let closestFraction = allFractions.reduce((prev, curr) =>
      Math.abs(curr[1] - remainder) < Math.abs(prev[1] - remainder) ? curr : prev
    );
    console.log("closestFraction in findClosestFraction", closestFraction)
    //TODO: INVESTIIGATE STARTNG HERE, ARRAY NOT REDUCINT TO SINGLE ELEMENT, MAYBE SORE THE ARRAY DIFFERENCELY

    return closestFraction
  
  }