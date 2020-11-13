import React, { useState } from "react";
import "../styling/suggestView.scss";

import { postSuggestion, putSuggestion } from "../util/crudFuncs";
import SuggestionForm from "../components/suggestionForm";
import SuggestionCard from "../components/suggestionCard"

export default function SuggestView() {
  const blankSuggestion = {
    Name: "",
    Message: "",
    Email: "",
    IsError: false,
  };
  const [suggestion, setSuggestion] = useState(blankSuggestion);
  const [showCard, setShowCard] = useState(false);
  const [isEdit, setIsEdit] = useState(false)
  const submitForm = async() => {
    let returnedSug={}
    if (isEdit) {
      returnedSug = await putSuggestion(suggestion)
    } else {
      returnedSug = await postSuggestion(suggestion);
    }
    console.log('returnedSug', returnedSug)
    setSuggestion(returnedSug);
    setShowCard(true);
    setIsEdit(false)
  };

  const toggleEdit= (e) =>{
    e.preventDefault()
    setShowCard(false)
    setIsEdit(true)
  }


  return (
    <div className="page-wrapper">
      <div className="card-med-large">
        <h1 className="card-title">{showCard? "Submitted Suggestion":"Suggestion Form"}</h1>
        {/* <h1 className="card-title">
          Page currently being constructed, check back soon!
        </h1> */}
        {showCard ? (
          <SuggestionCard toggleEdit={toggleEdit} suggestion={suggestion} />
        ) : (
          <SuggestionForm
            suggestion={suggestion}
            setSuggestion={setSuggestion}
            isEdit={isEdit}
            submitForm={submitForm}
          />
        )}
      </div>
    </div>
  );
}
