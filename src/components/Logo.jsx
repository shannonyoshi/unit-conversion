import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../styling/logo.scss";

export default function Logo({description=""}) {
  return (
    <div className={`logo-wrapper ${description}`}>
      <FontAwesomeIcon icon="balance-scale" className={`logo-icon ${description}`} />
      <h3 className={`logo-text ${description}`}>
        Baking Unit
        <br />
        Conversion
      </h3>
    </div>
  );
}
