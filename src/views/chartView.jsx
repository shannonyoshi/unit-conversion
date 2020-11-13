import React from "react";
import {unitDict} from "../util/units"
import {filterUnits} from "../util/utilFunctions"

import "../styling/chartView.scss"

export default function ChartView() {
  const [unitFilter, setUnitFilter] = useState("All")
  let unitFilters=["All", "Standard", "Metric", "Weight", "Volume"]

  const filterByType = ()=> {
    switch (unitFilter){
      case "All":
        return unitDict
      case "Standard":
        // filter by unit type US
        setUnitFilter(filterUnits("type", "US"))
        return
      case "Metric":
        // filter by type Metric
        setUnitFilter(filterUnits("type", "metric"))
        return
      case "Weight":
        // filter by normUnit g
        setUnitFilter(filterUnits("normUnit", "g"))
        return
      case "Volume":
        // filter by normUnit mL
        setUnitFilter(filterUnits("normUnit", "mL"))
        return
    }
  }

  return(
    <p>ChartView</p>
  )
}