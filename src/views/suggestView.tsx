import React, { useState } from "react";
import "../styling/suggestView.scss";

import { Suggestion, SugSubmit } from "../types"
import { postSuggestion, putSuggestion } from "../util/crudFuncs";
import SuggestionForm from "../components/suggestionForm";
import SuggestionCard from "../components/suggestionCard"

export default function SuggestView() {
  const blankSuggestion: Suggestion = {
    checker: "",
    name: "",
    message: "",
    email: "",
    isError: false,
  };
  const [suggestion, setSuggestion] = useState<Suggestion>(blankSuggestion);
  const [showCard, setShowCard] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const submitForm = async () => {
    let sugToSubmit: SugSubmit = { name: suggestion.name, message: suggestion.message, email: suggestion.email, isError: suggestion.isError }
    let returnedSug:Suggestion
    if (isEdit) {
      returnedSug = await putSuggestion(sugToSubmit)
    } else {
      returnedSug = await postSuggestion(sugToSubmit);
    }
    setSuggestion(returnedSug);
    setShowCard(true);
    setIsEdit(false)
  };

  const toggleEdit = (e:React.MouseEvent) => {
    e.preventDefault()
    setShowCard(false)
    setIsEdit(true)
  }

  const reset = () => {
    setSuggestion(blankSuggestion)
    setShowCard(false)
    setIsEdit(false)
  }

  return (
    <div className="page-wrapper">
      {showCard ? (
        <SuggestionCard toggleEdit={toggleEdit} suggestion={suggestion} reset={reset} />
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
