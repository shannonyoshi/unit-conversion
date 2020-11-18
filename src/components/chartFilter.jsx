import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";

import { unitDict } from "../util/units";
import { filterUnits } from "../util/utilFunctions";

export default function ChartFilter({
  unitFilters,
  unitFilter,
  setUnitFilter,
  setUnits,
  showCustomFilter,
  setShowCustomFilter,
}) {
  useEffect(() => {
    const filterByType = () => {
      //   console.log("1. unitFilter", unitFilter);
      switch (unitFilter) {
        case "All":
          setShowCustomFilter(false);
          return Object.keys(unitDict);
        case "Standard":
          setShowCustomFilter(false);
          // filter by unit type US
          return filterUnits("type", "US");
        case "Metric":
          setShowCustomFilter(false);
          // filter by unit type Metric
          return filterUnits("type", "metric");
        case "Weight":
          setShowCustomFilter(false);
          // filter by normUnit g
          return filterUnits("normUnit", "g");
        case "Volume":
          setShowCustomFilter(false);
          // console.log("volume");
          // filter by normUnit mL
          return filterUnits("normUnit", "mL");
        case "Custom":
          setShowCustomFilter(true);
          return [];
        default:
          setShowCustomFilter(false);
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
      {unitFilter === "Custom" && !showCustomFilter ? (
        <FontAwesomeIcon
          icon="edit"
          className="icon-btn edit-item"
          onClick={(e) => setShowCustomFilter(true)}
        />
      ) : (
        ""
      )}
    </div>
  );
}
