import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SuggestionCard({ toggleEdit, suggestion }) {
  console.log('suggestion in SUGGESTION CARD', suggestion)
  return (
    <div className="suggestion-form-wrapper">
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
        <p className="suggestion-label">
          {suggestion.IsError
            ? "This submission has been marked as an Error Report."
            : "This submission has not been marked as an Error Report."}
        </p>
        <FontAwesomeIcon
                    icon="edit"
                    className="edit-item icon-btn"
                    onClick={(e) => toggleEdit(e)}
                  />
      
      {/* <FontAwesomeIcon
                        icon="trash-alt"
                        className="delete-item icon-btn"
                        onClick={(e) => deleteSegguestion}
                      /> */}
      </div>
    </div>
  );
}
