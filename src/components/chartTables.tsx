import React, { FC } from "react";
import { unitDict } from "../util/units";
import { filterFractions, filterUnits } from "../util/utilFunctions";

type TablesProps = {
  units: string[]
}


const ChartTables: FC<TablesProps> = ({ units }: TablesProps): JSX.Element => {
  let chartType: Set<string> = new Set();
  for (let i = 0; i < units.length; i++) {
    let curr = units[i];
    chartType.add(unitDict[curr].normUnit);
  }
  if (units.length === 0) {
    return <></>;
  }

  if (chartType.size > 1) {
    let units1 = filterUnits("normUnit", "mL", units);
    let units2 = filterUnits("normUnit", "g", units);
    return (
      <div className="table-card">
        <div className="single-table">
          <h1>Volume Table</h1>
          <ChartTable units={units1} table={"volume"} />
        </div>
        <div className="single-table weight">
          <h1>Weight Table</h1>
          <ChartTable units={units2} table={"weight"} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="table-card">
        <h1>
          {unitDict[units[0]].normUnit === "mL" ? "Volume" : "Weight"} Table
        </h1>
        <ChartTable units={units} table={"single"} />
      </div>
    );
  }
}

type TableProps = {
  units: string[],
  table: string
}

interface SubR {
  decimal: number,
  string: string
}

interface RowData {
  heading: string,
  rowData:SubR[]
}

const ChartTable: FC<TableProps> = ({ units, table }: TableProps): JSX.Element => {
  let tData:RowData[]=[];
  for (let i = 0; i < units.length; i++) {
    let currName: string = units[i];
    let currResult:RowData = { heading: currName, rowData: [] };
    let currAmount: number = unitDict[currName].conversion;
    for (let k = 0; k < units.length; k++) {
      let subU: string = units[k];
      let conversion: number = unitDict[subU].conversion/ currAmount;
      let convertedInt:number = Math.floor(conversion);
      
      let closestFrac = filterFractions(
        "allClosest",
        (conversion - convertedInt)
      );
      let deci:number = Math.floor(conversion * 100) / 100
      // let str =
      let subResult: SubR = {
        decimal: deci, 
        string: `${convertedInt > 0 ? convertedInt + " " : ""}${closestFrac[0]
          }`
      };

      currResult.rowData.push(subResult);
    }
    tData.push(currResult);
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th scope="col" rowSpan={2} className="bold">
              Units
            </th>
            {/* <th scope="col">Test</th> */}
            {units.map((unitName) => (
              <th
                colSpan={2}
                scope="col"
                key={`${table} header ${unitName}`}
                className="bold">
                {unitName.charAt(0).toUpperCase() + unitName.slice(1)}
              </th>
            ))}
          </tr>
          <tr>
            {units.map((unitName) => (
              <th
                className="small"
                colSpan={2}
                scope="col"
                key={`${table} "normU" ${unitDict[unitName].conversion}`}>
                ({unitDict[unitName].conversion} {unitDict[unitName].normUnit})
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tData.map((row, index) => (
            <tr key={`${table} row ${row.heading} ${index}`}>
              <th scope="row" className="freeze bold">
                {row.heading.charAt(0).toUpperCase() + row.heading.slice(1)}
              </th>
              {row.rowData.map((subU, i) =>
                Number.isInteger(subU.decimal) ? (
                  <td
                    colSpan={2}
                    key={` ${table} entry ${row.heading} ${index} ${i}`}
                    className={index % 2 === 1 ? "odd" : ""}>
                    {subU.decimal === 0 ? "" : subU.decimal}
                  </td>
                ) : (
                  <React.Fragment
                    key={`${table} entry ${row.heading} ${index} ${i}`}>
                    <td className={index % 2 === 1 ? "odd" : ""}>
                      {subU.decimal === 0 ? "" : subU.decimal}
                    </td>
                    <td className={index % 2 === 1 ? "odd" : ""}>
                      {subU.decimal === 0 ? "" : subU.string}
                    </td>
                  </React.Fragment>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default ChartTables;