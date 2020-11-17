import React from "react";
import { unitDict } from "../util/units";
import { filterFractions, filterUnits } from "../util/utilFunctions";

export default function ChartTables({ units }) {

  let chartType = new Set();
  for (let i = 0; i < units.length; i++) {
    let curr = units[i];
    chartType.add(unitDict[curr].normUnit);
  }

  if (chartType.size > 1) {
    let units1 = filterUnits("normUnit", "mL", units);
    let units2 = filterUnits("normUnit", "g", units);
    return (
      <div>
        <h1>Volume</h1>
        <ChartTable units={units1} table={"volume"} />
        <h1>Weight</h1>
        <ChartTable units={units2} table={"weight"} />
      </div>
    );
  } else {
    return <ChartTable units={units} table={"single"}/>;
  }
}

function ChartTable({ units, table }) {

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
          <th scope="col" rowSpan="2">Units</th>
          {/* <th scope="col">Test</th> */}
          {units.map((unitName) => (
            <th colSpan="2" scope="col" key={`${table} header ${unitName}`}>
              {unitName.charAt(0).toUpperCase() + unitName.slice(1)}
            </th>
          ))}
        </tr>
        <tr>
        {units.map((unitName) => (
            <th colSpan="2" scope="col" key={`${table} "normU" ${unitDict[unitName].conversion}`}>
              ({unitDict[unitName].conversion} {unitDict[unitName].normUnit})
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tData.map((row, index) => (
          <tr key={`${table} row ${row.heading} ${index}`}>
            <th scope="row" className="freeze">
              {row.heading.charAt(0).toUpperCase() + row.heading.slice(1)}
            </th>
        {row.rData.map((subU, i) => (Number.isInteger(subU.decimal)? <td colSpan="2" key={` ${table} entry ${row.heading} ${index} ${i}`}>{subU.decimal===0? "": subU.decimal}</td>:
              < React.Fragment key={`${table} entry ${row.heading} ${index} ${i}`}>
              <td >{subU.decimal===0?"": subU.decimal}</td>
              <td>{subU.decimal===0?"": subU.string}</td>
              </ React.Fragment>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}