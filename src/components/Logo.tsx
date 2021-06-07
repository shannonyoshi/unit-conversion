import React, {FC} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../styling/logo.scss";

interface LogoProps {
  description: string;
}

const Logo: FC<LogoProps> = ({ description }: LogoProps): JSX.Element => {
  return (
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
  );
};

export default Logo;
