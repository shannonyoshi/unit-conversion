import React, { useState } from "react";
import "../styling/suggestView.scss";

import { postSuggestion, putSuggestion } from "../util/crudFuncs";
import SuggestionForm from "../components/suggestionForm";
import SuggestionCard from "../components/suggestionCard"

export default function SuggestView() {
  const blankSuggestion = {
    checker:"",
    name: "",
    message: "",
    email: "",
    isError: false,
  };
  const [suggestion, setSuggestion] = useState(blankSuggestion);
  const [showCard, setShowCard] = useState(false);
  const [isEdit, setIsEdit] = useState(false)
  const submitForm = async() => {
    console.log('submitForm()')
    let sugToSubmit = suggestion
    delete sugToSubmit["checker"]
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

  const reset = ()=> {
    setSuggestion(blankSuggestion)
    setShowCard(false)
    setIsEdit(false)
  }

  return (
    <div className="page-wrapper">
        {showCard ? (
          <SuggestionCard toggleEdit={toggleEdit} suggestion={suggestion} reset={reset}/>
        ) : (
          <SuggestionForm
            suggestion={suggestion}
            setSuggestion={setSuggestion}
            isEdit={isEdit}
            submitForm={submitForm}
          />
        )}
    </div>
  );
}
