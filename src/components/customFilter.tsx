import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction, FC } from "react";
import { filterUnits } from "../util/utilFunctions";

interface CustFilterProps {
  customUnits: string[],
  setCustomUnits: Dispatch<SetStateAction<string[]>>,
  setUnitNames: Dispatch<SetStateAction<string[]>>,
  setShowCustomFilter: Dispatch<SetStateAction<boolean>>
}

const CustomFilter: FC<CustFilterProps> = ({
  customUnits,
  setCustomUnits,
  setUnitNames,
  setShowCustomFilter
}: CustFilterProps): JSX.Element => {

  const volumeUnits: string[] = filterUnits("normUnit", "mL");
  const weightUnits: string[] = filterUnits("normUnit", "g");
  const toggleSelected = (name: string) => {
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
      <h1 className="card-title">
        Select Units{" "}
        <FontAwesomeIcon
          icon="sync-alt"
          flip="horizontal"
          onClick={reset}
          className="icon-btn reset"
        />
      </h1>

      <h1>Volume</h1>
      {volumeUnits.map((name) => (
        <button
          onClick={(e) => toggleSelected(name)}
          className={`filter-btn ${customUnits.includes(name) ? "selected" : "unselected"
            }`}
          key={`${name}-btn`}>
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </button>
      ))}
      <h1>Weight</h1>
      {weightUnits.map((name) => (
        <button
          onClick={(e) => toggleSelected(name)}
          className={`filter-btn ${customUnits.includes(name) ? "selected" : "unselected"
            }`}
          key={`${name}-btn`}>
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </button>
      ))}
      <button onClick={submitUnits} className="submit-btn large">
        View Chart
      </button>
    </div>
  );
}

export default CustomFilter;
