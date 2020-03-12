import {unitDict, commonFractions, uncommonFractions} from "./units"

const convertRemainder = (remainingmLs, targetUnitType) => {
    let availableUnits = [];
    for (let unit in unitDict) {
      if (unit.unit === targetUnitType && unit.conversion <= remainingmLs) {
        availableUnits.append([unit]);
      }
    }
    console.log("convertRemainder availableUnits", availableUnits);
    // TODO: finish this
  };
  
  const findClosestFraction = remainder => {
    const fractionValues = Object.values(commonFractions);
    let closestFractionVal = fractionValues.reduce((prev, curr) =>
      Math.abs(curr - remainder) < Math.abs(prev - remainder) ? curr : prev
    );
    //tolerance is +/-2.5%
    const lowAmountTolerance = remainder * 0.985;
    const highAmountTolerance = remainder * 1.025;
    if (
      lowAmountTolerance <= closestFractionVal &&
      closestFractionVal <= highAmountTolerance
    ) {
      let closestFraction = Object.keys(commonFractions).find(
        key => commonFractions[key] === closestFractionVal
      );
      return closestFraction;
    } else {
      convertRemainder();
      //find largest unit that does not exceed remainder, until within 2.5%
      //get mLs left, remainder, then find largest smaller unit
    }
  };
  //performs simple conversion, returns string of converted amount + unit
  export const convertSimple = (amount, currentUnit, targetUnit) => {
    const unitFrom = unitDict[currentUnit];
    const unitTo = unitDict[targetUnit];
    const amountmLs = amount * unitFrom.conversion;
    console.log("amountmLs", amountmLs);
    const unitToAmount = amountmLs / unitTo.conversion;
    console.log("unitToAmount", unitToAmount);
    const remainder = unitToAmount - Math.floor(unitToAmount);
    if (remainder <= 0.05) {
      //returns whole numbers + unit
      return `${Math.floor(unitToAmount)} ${targetUnit}`;
    }
    console.log("remainder", remainder);
    if (unitTo.output === "decimal") {
      //returns amount with max 2 decimal numbers
      let amountTo2Decimal = Math.floor(unitToAmount * 100) / 100;
      return amountTo2Decimal.toString(10);
    } else {
      const fraction = findClosestFraction();
      return `${Math.floor(unitToAmount)} ${fraction} ${targetUnit}`;
    }
  
    //otherwise calculate additional units (1 cup plus 2 tsp), return fraction, additional units fraction
    //handle output type: fraction vs decimal.
  };