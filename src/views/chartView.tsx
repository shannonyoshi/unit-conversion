import React, {FC, useState } from "react";
import { unitDict } from "../util/units";
import {Filter} from "../types"

import ChartFilter from "../components/chartFilter";
import ChartTables from "../components/chartTables";
import CustomFilter from "../components/customFilter";

import "../styling/chartView.scss";

//filters units according to user input, calls chartTables
const ChartView: FC = (): JSX.Element => {
  const [unitFilter, setUnitFilter] = useState<Filter>("All");
  const [units, setUnits] = useState(Object.keys(unitDict));
  const [showCustomFilter, setShowCustomFilter] = useState<boolean>(false);
  const [customUnits, setCustomUnits] = useState([]);
  let unitFilters:Filter[] = ["All", "Standard", "Metric", "Weight", "Volume", "Custom"];

  return (
    <div className="charts-page-wrapper">
      <ChartFilter
        unitFilters={unitFilters}
        unitFilter={unitFilter}
        setUnitFilter={setUnitFilter}
        setUnits={setUnits}
        showCustomFilter={showCustomFilter}
        setShowCustomFilter={setShowCustomFilter}
      />
      {showCustomFilter ? (
        <CustomFilter
          customUnits={customUnits}
          setCustomUnits={setCustomUnits}
          setUnits={setUnits}
          setShowCustomFilter={setShowCustomFilter}
        />
      ) : (
        <ChartTables units={units} />
      )}
    </div>
  );
};

export default ChartView;
