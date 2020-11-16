import React, { useEffect, useState } from "react";
import { unitDict } from "../util/units";
import { filterFractions, filterUnits } from "../util/utilFunctions";

export default function ChartTables({ units }) {
  // console.log('3. RENDER CHART TABLES')
  // useEffect(()=> {
  //   console.log('UseEffect')
  // },[units])

  let chartType = new Set();
  for (let i = 0; i < units.length; i++) {
    let curr = units[i];
    chartType.add(unitDict[curr].normUnit);
  }
  // const sortBySize = (unitNames)=>{{
  //   unitNames.forEach(name=>)

  // }}

  if (chartType.size > 1) {
    let units1 = filterUnits("normUnit", "mL", units);
    let units2 = filterUnits("normUnit", "g", units);
    return (
      <div>
        <h1>Volume</h1>
        <ChartTable units={units1} />
        <h1>Weight</h1>
        <ChartTable units={units2} />
      </div>
    );
  } else {
    return <ChartTable units={units} />;
  }
}

function ChartTable({ units }) {

  let tData = [];
  for (let i = 0; i < units.length; i++) {
    let currName = units[i];
    let currResult = { heading: currName, rData: [] };
    let currAmount = unitDict[currName].conversion;
    for (let k = 0; k < units.length; k++) {
      let subResult = {};
      let subU = units[k];
      let targetAmount = unitDict[subU].conversion;
      let conversion = targetAmount / currAmount;
      subResult["decimal"] = Math.floor(conversion * 100) / 100;
      let convertedInt = Math.floor(conversion);
      let closestFrac = filterFractions(
        "allClosest",
        conversion - convertedInt
      );
      subResult["string"] = `${convertedInt > 0 ? convertedInt + " " : ""}${closestFrac[0]}`;
      currResult.rData.push(subResult);
    }
    tData.push(currResult);
  }

  return (
    <div className="table-wrapper">
    <table>
      <thead>
        <tr>
          <th scope="col">Units</th>
          {/* <th scope="col">Test</th> */}
          {units.map((unitName) => (
            <th colSpan="2" scope="col">
              {unitName} ({unitDict[unitName].conversion} {unitDict[unitName].normUnit})
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tData.map((row) => (
          <tr>
            <th scope="row" className="freeze">
              {row.heading}
            </th>
        {row.rData.map((subU) => (Number.isInteger(subU.decimal)? <td colSpan="2">{subU.decimal===0? "": subU.decimal}</td>:
              <>
              <td>{subU.decimal===0?"": subU.decimal}</td>
              <td nowrap>{subU.decimal===0?"": subU.string}</td>
              </>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}