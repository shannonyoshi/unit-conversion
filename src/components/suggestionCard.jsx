import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { delSuggestion } from "../util/crudFuncs";

export default function SuggestionCard({
  toggleEdit,
  suggestion,
  reset,
}) {
  const [message, setMessage] = useState("");
  const [deleted, setDeleted] = useState(false);
  const removeSug =async (e) => {
    e.preventDefault();
    setDeleted(true);
    if (suggestion.ID) {
      let result = await delSuggestion(suggestion.ID);
      console.log('result', result)
      if (result) {
        setMessage("This suggestion has been successfully deleted");
      } else {
        setMessage("An error occurred, this suggestion has not been deleted");
      }
    } else {
      setMessage("Unable to delete this suggestion");
    }
  };

  console.log("suggestion in SUGGESTION CARD", suggestion);
  return (
    <div className="suggestion-wrapper">
      <p className="warning">{message}</p>
      {deleted ? <button onClick={reset}>Reset the form</button> : <></>}
      <div className="suggestion-section">
        <p className="suggestion-label">Name</p>
        <p className="suggestion-text">{suggestion.Name}</p>
      </div>
      <div className="suggestion-section">
        <p className="suggestion-label">E-mail</p>
        <p className="suggestion-text">{suggestion.Email}</p>
      </div>
      <div className="suggestion-section">
        <p className="suggestion-label">Suggestion</p>
        <p className="suggestion-text">{suggestion.Message}</p>
      </div>
      <div className="suggestion-section">
        <p className={`suggestion-${suggestion.IsError?"isError":"isNotError"}`}>
          {suggestion.IsError
            ? "This submission IS an Error Report."
            : "This submission is NOT an Error Report."}
        </p>
      </div>
        {deleted ? (
          <></>
        ) : (
          <div>
            <FontAwesomeIcon
              icon="edit"
              className="icon-btn edit-icon"
              onClick={(e) => toggleEdit(e)}
            />

            <FontAwesomeIcon
              icon="trash-alt"
              className="icon-btn del-icon"
              onClick={(e) => removeSug(e)}
            />
          </div>
        )}
    </div>
  );
}
