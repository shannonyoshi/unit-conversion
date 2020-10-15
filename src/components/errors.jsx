import React from "react";

export default function ShowErrors({ errors }) {
  console.log("errors", errors);
  let show = false;
  const errorVals = Object.values(errors);
  let i = 0;
  while (i < errorVals.length) {
    if (errorVals[i].length > 0) {
      show = true;
      break;
    }
    i++;
  }
  console.log("show", show);
  if (show === true) {
    return (
      <div className="errors">
        <ul>
          {Object.entries(errors).map(([key, value]) =>
            value !== "" ? (
              <li key={key}>
                <b>{key} Error:</b> {value}
              </li>
            ) : null
          )}
        </ul>
      </div>
    );
  }
  return null
}
