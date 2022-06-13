import React, { FC } from "react";
import { unitDict } from "../util/units";
import { closestFrac, filterUnits } from "../util/utilFunctions";
import { Fraction } from "../types"

type TablesProps = {
  unitNames: string[]
}

const ChartTables: FC<TablesProps> = ({ unitNames }: TablesProps): JSX.Element => {
  let chartType: Set<string> = new Set();
  for (let i = 0; i < unitNames.length; i++) {
    let curr = unitNames[i];
    chartType.add(unitDict[curr].normUnit);
  }
  if (unitNames.length === 0) {
    return <></>;
  }

  if (chartType.size > 1) {
    let unitNames1 = filterUnits("normUnit", "mL", unitNames);
    let unitNames2 = filterUnits("normUnit", "g", unitNames);
    return (
      <div className="table-card">
        <div className="single-table">
          <h1>Volume Table</h1>
          <ChartTable unitNames={unitNames1} table={"volume"} />
        </div>
        <div className="single-table weight">
          <h1>Weight Table</h1>
          <ChartTable unitNames={unitNames2} table={"weight"} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="table-card">
        <h1>
          {unitDict[unitNames[0]].normUnit === "mL" ? "Volume" : "Weight"} Table
        </h1>
        <ChartTable unitNames={unitNames} table={"single"} />
      </div>
    );
  }
}

type TableProps = {
  unitNames: string[],
  table: string
}

interface SubR {
  decimal: number,
  string: string
}

interface RowData {
  heading: string,
  rowData: SubR[]
}

const generateTableData = (unitNames: string[]): RowData[] => {
  let tableData: RowData[] = []
  for (let i = 0; i < unitNames.length; i++) {
    let currName: string = unitNames[i];
    let currResult: RowData = { heading: currName, rowData: [] };
    let currAmount: number = unitDict[currName].conversion;
    for (let k = 0; k < unitNames.length; k++) {
      let subResult: SubR
      let subU: string = unitNames[k];

      if (subU === currName) {
        subResult = { decimal: 1, string: `1` }
      } else {

        let converted: number = unitDict[subU].conversion / currAmount;
        let convertedInt: number = Math.floor(converted);

        let closestFraction: Fraction = closestFrac(converted - convertedInt);


        let deci: number = Math.round(converted * 100) / 100
        if (closestFraction && closestFraction.decimal === 1) {
          closestFraction = { string: "", decimal: 0.0, common: true }
          convertedInt += 1
        }
        if (closestFraction && closestFraction.decimal < .0156 && convertedInt >= 500) {
          closestFraction = { string: "", decimal: 0.0, common: true }
          deci = Math.round(deci)
        }

        subResult = {
          decimal: deci,
          string: `${convertedInt > 0 ? convertedInt + " " : ""}${closestFrac === undefined ? "" : closestFraction.string
            }`
        }
      };

      currResult.rowData.push(subResult);
    }
    tableData.push(currResult);
  }
  return tableData
}

const ChartTable: FC<TableProps> = ({ unitNames, table }: TableProps): JSX.Element => {
  let tData: RowData[] = generateTableData(unitNames);
  return (

    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th scope="col" rowSpan={2} className="bold">
              Units
            </th>
            {unitNames.map((unitName) => (
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
            {unitNames.map((unitName) => (
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
                Number.isInteger(subU.decimal) || subU.decimal === 0 ? (
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