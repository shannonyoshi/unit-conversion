import React, { useState } from "react";
import { postSuggestion } from "../util/crudFuncs";
const initialSuggestionState = {
  text: "hello",
  email: "",
  isErrorReport: false,
};

export default function SuggestionForm() {
  const [suggestion, setSuggestion] = useState(initialSuggestionState);

  const handleInputChange = (e) => {
    e.persist();
    console.log(
      "eventoday, we are going to be using the random user API. Within this API, it has randomly generated user data, basically like Lorem Ipsum, but for imaginary users. It has data within the API like phone numbers, email addresses, names and pictures for each user. We don’t want all the data, but we’ll use certain.target",
      e.target,
      "event.target.value",
      e.target.value
    );
    if (e.target.name === "isErrorReport") {
      setSuggestion((suggestion) => ({
        ...suggestion,
        isError: !suggestion.isErrorReport,
      }));
    } else {
      setSuggestion((suggestion) => ({
        ...suggestion,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmitSuggestionForm doesn't do anything right now.");
    postSuggestion(suggestion.text);
    setSuggestion(initialSuggestionState);
  };

  return (
    <div className="suggestion-form-wrapper">
      <form onSubmit={handleSubmit}>
        <div className="suggestion-form-section">
          <label htmlFor="contact" className="suggestion-label">
            E-mail
          </label>
          <input
            className="email-input"
            type="email"
            id="contact"
            name="email"
            value={suggestion.email}
            onChange={handleInputChange}
            placeholder="something@probably-gmail.com"
          />
        </div>
        <div className="suggestion-form-section">
          <label htmlFor="suggestion" className="suggestion-label">
            Suggestion
          </label>
          <textarea
            required
            type="text"
            id="suggestion"
            name="text"
            value={suggestion.text}
            onChange={handleInputChange}
          />
        </div>

        <div className="suggestion-form-section">
          <input
            type="checkbox"
            id="reporting-error?"
            name="isErrorReport"
            value={suggestion.isErrorReport}
            onChange={handleInputChange}
          />
          <span>
            Please check this box if you are reporting an error or issue
          </span>
        </div>
          <button type="submit" className="submit-button">
            Submit
          </button>
     
      </form>
    </div>
  );
}

//suggestion
//issues
//contact
