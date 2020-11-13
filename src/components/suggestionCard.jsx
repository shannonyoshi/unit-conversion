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
    <div className="suggestion-form-wrapper">
      <p className="warning">{message}</p>
      {deleted ? <button onClick={reset}>Reset the form</button> : <></>}
      <div className="suggestion-form-section">
        <p className="suggestion-label">Name</p>
        <p className="suggestion-text">{suggestion.Name}</p>
      </div>
      <div className="suggestion-form-section">
        <p className="suggestion-label">E-mail</p>
        <p className="suggestion-text">{suggestion.Email}</p>
      </div>
      <div className="suggestion-form-section">
        <p className="suggestion-label">Suggestion</p>
        <p className="suggestion-text">{suggestion.Message}</p>
      </div>
      <div className="suggestion-form-section">
        <p className="suggestion-IsError">
          {suggestion.IsError
            ? "This submission has been marked as an Error Report."
            : "This submission has not been marked as an Error Report."}
        </p>
        {deleted ? (
          <></>
        ) : (
          <div>
            <FontAwesomeIcon
              icon="edit"
              className="icon-btn"
              onClick={(e) => toggleEdit(e)}
            />

            <FontAwesomeIcon
              icon="trash-alt"
              className="icon-btn"
              onClick={(e) => removeSug(e)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
