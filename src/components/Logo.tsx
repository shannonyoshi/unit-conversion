import React, { FC } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../styling/logo.scss";

interface LogoProps {
  description: string;
}

const Logo: FC<LogoProps> = ({ description }: LogoProps): JSX.Element => {
  return (
    <Link to="/" className="home-link">
    <div className={`logo-wrapper ${description}`}>

        <FontAwesomeIcon
          icon="balance-scale"
          className={`logo-icon ${description}`}
          />
        <h3 className={`logo-text ${description}`}>
          Baking Unit
          <br />
          Conversion
        </h3>
     
    </div>
    </Link>
  );
};

export default Logo;
