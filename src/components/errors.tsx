import React, { FC } from "react";

import { Error, ErrorTypes } from "../types"

interface ErrorProps {
  errors: Error[],
  errorType?: ErrorTypes | null
}

const ShowErrors: FC<ErrorProps> = ({ errors, errorType = null }): JSX.Element | null => {
  let showErrors: Error[]
  
  if (errors===null) {
    return null
  }
  if (errorType) {
    showErrors = errors.filter((error) => error.name === errorType)
  } else {
    showErrors = errors
  }
  return (
    <div className="errors">
      <ul>
        {showErrors.map((error, index) =>
          <li key={`E${index} name`}>
            <b>{error.name} Error:</b> {error.message}
          </li>

        )}
      </ul>
    </div>
  );
}

export default ShowErrors;
