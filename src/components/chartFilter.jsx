import React, { useEffect } from "react";

import { unitDict } from "../util/units";
import { filterUnits } from "../util/utilFunctions";

export default function ChartFilter({
  unitFilters,
  unitFilter,
  setUnitFilter,
  setUnits,
}) {
  useEffect(() => {
    const filterByType = () => {
      console.log("1. unitFilter", unitFilter);
      switch (unitFilter) {
        case "All":
          return Object.keys(unitDict);
        case "Standard":
          console.log("Standard");
          // filter by unit type US
          return filterUnits("type", "US");
        case "Metric":
          // filter by unit type Metric
          console.log("Metric");
          return filterUnits("type", "metric");
        case "Weight":
          console.log("weight");
          // filter by normUnit g
          return filterUnits("normUnit", "g");
        case "Volume":
          console.log("volume");
          // filter by normUnit mL
          return filterUnits("normUnit", "mL");
        case "Custom":
          // TODO:finish this option
          return;
        default:
          return Object.keys(unitDict);
      }
    };
    const filteredUnits = filterByType();
    setUnits(filteredUnits);
  }, [unitFilter]);

  return (
    <div className="filter">
      <label>Filter:</label>
      <select
        id="filter"
        name="filter"
        value={unitFilter}
        onChange={(e) => setUnitFilter(e.target.value)}>
        {unitFilters.map((item) => (
          <option value={item} key={`filter${item}`}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
