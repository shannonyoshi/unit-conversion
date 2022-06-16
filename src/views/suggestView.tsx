import React, { useState } from "react";
import "../styling/suggestView.scss";

import { Suggestion, SugSubmit } from "../types"
import { postSuggestion, putSuggestion } from "../util/crudFuncs";
import SuggestionForm from "../components/suggestionForm";
import SuggestionCard from "../components/suggestionCard"

export default function SuggestView() {
  const blankSuggestion: Suggestion = {
    name: "",
    message: "",
    email: "",
    isError: false,
  };
  const [suggestion, setSuggestion] = useState<Suggestion>(blankSuggestion);
  const [checker, setChecker] = useState<string>("")
  const [showCard, setShowCard] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const submitForm = async () => {
    let returnedSug: Suggestion
    if (isEdit) {
      // putSuggestion removes checker from suggestion since that does not go to DB, and remove viewedAt & createdAt because they are not updated by user
        let putSug: Suggestion = { id: suggestion.id, name: suggestion.name, email: suggestion.email, message: suggestion.message, isError: suggestion.isError }
        returnedSug = await putSuggestion(putSug)
    } else {
      let postSug: SugSubmit = { name: suggestion.name, message: suggestion.message, email: suggestion.email, isError: suggestion.isError }
      returnedSug = await postSuggestion(postSug);
    }
    setSuggestion(returnedSug);
    setShowCard(true);
    setIsEdit(false)
  };

  const toggleEdit = (e: React.MouseEvent) => {
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
          checker={checker}
          setChecker={setChecker}
          suggestion={suggestion}
          setSuggestion={setSuggestion}
          isEdit={isEdit}
          submitForm={submitForm}
        />
      )}
    </div>
  );
}
