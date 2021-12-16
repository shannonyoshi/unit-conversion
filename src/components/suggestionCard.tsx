import React, { useState, FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { delSuggestion } from "../util/crudFuncs";

import {Suggestion} from "../types"


interface SuggCardProps {
  toggleEdit: (e: React.MouseEvent) => void;
  suggestion: Suggestion;
  reset:()=>void;
}

const SuggestionCard:FC<SuggCardProps>=({ toggleEdit, suggestion, reset }:SuggCardProps) =>{
  const [message, setMessage] = useState("");
  const [deleted, setDeleted] = useState(false);
  const removeSug = async (e: React.MouseEvent) => {
    e.preventDefault();
    setDeleted(true);
    if (suggestion.id) {
      let result = await delSuggestion(suggestion.id);
      console.log("result", result);
      if (result) {
        setMessage("This suggestion has been deleted");
      } else {
        setMessage("An error occurred, this suggestion has not been deleted");
      }
    } else {
      setMessage("Unable to delete this suggestion");
    }
  };

  return (
    <div className="card-med-large">
      <div></div>
        {deleted ? (
          <div className="deleted">
            <p className="warning">{message}</p>
          <FontAwesomeIcon
          icon="sync-alt"
          flip="horizontal"
          className="icon-btn reset"
          onClick={reset}
          />
          </div>
          ) : (
            <div className="icons">
            <FontAwesomeIcon
              icon="edit"
              className="icon-btn edit-icon"
              onClick={toggleEdit}
              />

            <FontAwesomeIcon
              icon="trash-alt"
              className="icon-btn del-icon"
              onClick={removeSug}
            />
          </div>
        )}
      <h1 className="card-title">Submitted Suggestion</h1>
      <div className="suggestion-wrapper">
        <div className="suggestion-section">
          <p className="suggestion-label">Name</p>
          <p className="suggestion-text">{suggestion.name}</p>
        </div>
        <div className="suggestion-section">
          <p className="suggestion-label">E-mail</p>
          <p className="suggestion-text">{suggestion.email}</p>
        </div>
        <div className="suggestion-section">
          <p className="suggestion-label">Suggestion</p>
          <p className="suggestion-text">{suggestion.message}</p>
        </div>
        <div className="suggestion-section">
          <p
            className={`suggestion-${
              suggestion.isError ? "isError" : "isNotError"
            }`}>
            {suggestion.isError
              ? "This submission IS an Error Report."
              : "This submission is NOT an Error Report."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SuggestionCard;