import React from "react";
import "../styling/suggestView.scss";

import SuggestionForm from "../components/suggestionForm";

export default function SuggestView() {
  return (
    <div className="page-wrapper">
      <div className="card-med-large">
        <h1 className="card-title">Suggestion Form</h1>
        {/* <h1 className="card-title">
          Page currently being constructed, check back soon!
        </h1> */}
        <SuggestionForm />
      </div>
    </div>
  );
}
