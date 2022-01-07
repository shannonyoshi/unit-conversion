import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { filterUnits } from "../util/utilFunctions";

export default function CustomFilter({
  customUnits,
  setCustomUnits,
  setUnitNames,
  setShowCustomFilter,
}) {
  const volumeUnits = filterUnits("normUnit", "mL");
  const weightUnits = filterUnits("normUnit", "g");
  const toggleSelected = (e, name) => {
    if (customUnits.includes(name)) {
      const copy = customUnits.filter((unitName) => name !== unitName);
      setCustomUnits(copy);
    } else {
      setCustomUnits([...customUnits, name]);
    }
  };

  const submitUnits = () => {
    setUnitNames(customUnits);
    setShowCustomFilter(false);
  };

  const reset = () => {
    setCustomUnits([]);
  };

  return (
    <div className="btns-wrapper">
      <h1 className="card-title">Select Units       <FontAwesomeIcon
          icon="sync-alt"
          flip="horizontal"
          onClick={reset}
          className="icon-btn reset"
        /></h1>
  
      <h1>Volume</h1>
      {volumeUnits.map((name) => (
        <button
          onClick={(e) => toggleSelected(e, name)}
          className={`filter-btn ${
            customUnits.includes(name) ? "selected" : "unselected"
          }`}
          key={`${name}-btn`}>
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </button>
      ))}
      <h1>Weight</h1>
      {weightUnits.map((name) => (
        <button
          onClick={(e) => toggleSelected(e, name)}
          className={`filter-btn ${
            customUnits.includes(name) ? "selected" : "unselected"
          }`}
          key={`${name}-btn`}>
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </button>
      ))}
      <button onClick={submitUnits} className="submit-btn large">
        Submit
      </button>
    </div>
  );
}
