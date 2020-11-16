import React, { useState, useEffect } from "react";
import { unitDict } from "../util/units";
import { filterUnits } from "../util/utilFunctions";

import ChartTables from "../components/chartTables"

import "../styling/chartView.scss";


//filters units according to user input, calls chartTables
export default function ChartView() {
  const [unitFilter, setUnitFilter] = useState("All");
  const [units, setUnits] = useState(Object.keys(unitDict));
  let unitFilters = ["All", "Standard", "Metric", "Weight", "Volume", "Custom"];

  useEffect(() => {
    const filterByType = () => {
      console.log('1. unitFilter', unitFilter)
      switch (unitFilter) {
        case "All":
          return Object.keys(unitDict);
        case "Standard":
          console.log('Standard')
          // filter by unit type US
          return filterUnits("type", "US");
        case "Metric":
          // filter by unit type Metric
          console.log('Metric')
          return filterUnits("type", "metric");
        case "Weight":
          console.log('weight')
          // filter by normUnit g
          return filterUnits("normUnit", "g");
        case "Volume":
          console.log('volume')
          // filter by normUnit mL
          return filterUnits("normUnit", "mL");
        case "Custom":
          // TODO:finish this option
          return
        default:
          return Object.keys(unitDict);
      }
    };
    const filteredUnits = filterByType();
    setUnits(filteredUnits);
  }, [unitFilter]);

  const selectFilter = (event) => {
    setUnitFilter(event.target.value);
  };

  // console.log('unitFilter:units', unitFilter,":",units)

  return (
    <div className="page-wrapper">
      <label>Filter</label>
      <select
        id="filter"
        name="filter"
        value={unitFilter}
        onChange={selectFilter}>
        {unitFilters.map((item) => (
          <option value={item} key={`filter${item}`}>
            {item}
          </option>
        ))}
      </select>
      <ChartTables units={units}/>
    </div>
  );
}
