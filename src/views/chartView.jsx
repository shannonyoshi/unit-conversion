import React, { useState } from "react";
import { unitDict } from "../util/units";

import ChartFilter from "../components/chartFilter"
import ChartTables from "../components/chartTables"

import "../styling/chartView.scss";

//filters units according to user input, calls chartTables
export default function ChartView() {
  const [unitFilter, setUnitFilter] = useState("All");
  const [units, setUnits] = useState(Object.keys(unitDict));
  let unitFilters = ["All", "Standard", "Metric", "Weight", "Volume", "Custom"];

  return (
    <div className="charts-page-wrapper">
      <ChartFilter unitFilters={unitFilters} unitFilter={unitFilter} setUnitFilter={setUnitFilter} setUnits={setUnits}/>
      <ChartTables units={units}/>
    </div>
  );
}
