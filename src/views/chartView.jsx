import React, { useState, useEffect } from "react";
import { unitDict } from "../util/units";

import ChartFilter from "../components/chartFilter"
import ChartTables from "../components/chartTables"

import "../styling/chartView.scss";


//filters units according to user input, calls chartTables
export default function ChartView() {
  const [unitFilter, setUnitFilter] = useState("All");
  const [units, setUnits] = useState(Object.keys(unitDict));
  let unitFilters = ["All", "Standard", "Metric", "Weight", "Volume", "Custom"];



  // const selectFilter = (event) => {
  //   setUnitFilter(event.target.value);
  // };

  // console.log('unitFilter:units', unitFilter,":",units)

  return (
    <div className="page-wrapper">
      <ChartFilter unitFilters={unitFilters} unitFilter={unitFilter} setUnitFilter={setUnitFilter} setUnits={setUnits}/>
      <ChartTables units={units}/>
    </div>
  );
}
