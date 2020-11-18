import React, { useState } from "react";
import { unitDict } from "../util/units";

import ChartFilter from "../components/chartFilter"
import ChartTables from "../components/chartTables"
import CustomFilter from "../components/customFilter"

import "../styling/chartView.scss";

//filters units according to user input, calls chartTables
export default function ChartView() {
  const [unitFilter, setUnitFilter] = useState("All");
  const [units, setUnits] = useState(Object.keys(unitDict));
  const [showCustomFilter, setShowCustomFilter] = useState(false)
  const [customUnits, setCustomUnits] = useState([]);
  let unitFilters = ["All", "Standard", "Metric", "Weight", "Volume", "Custom"];

  return (
    <div className="charts-page-wrapper">
      <ChartFilter unitFilters={unitFilters} unitFilter={unitFilter} setUnitFilter={setUnitFilter} setUnits={setUnits} showCustomFilter={showCustomFilter} setShowCustomFilter={setShowCustomFilter}/>
      {showCustomFilter?<CustomFilter customUnits={customUnits} setCustomUnits={setCustomUnits} setUnits={setUnits} setShowCustomFilter={setShowCustomFilter}/>:<ChartTables units={units}/>}
    </div>
  );
}
