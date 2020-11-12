import React, { useState } from "react";
import { postSuggestion } from "../util/crudFuncs";
const initialSuggestionState = {
  name: "",
  message: "",
  email: "",
  isError: false,
};

export default function SuggestionForm() {
  const [suggestion, setSuggestion] = useState(initialSuggestionState);

  const handleInputChange = (e) => {
    e.persist();
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
    postSuggestion(suggestion);
    setSuggestion(initialSuggestionState);
  };

  return (
    <div className="suggestion-form-wrapper">
      <form onSubmit={handleSubmit}>
        <div className="suggestion-form-section">
          <label className="suggestion-label">Name</label>
          <input
            className="email-input"
            type="text"
            id="name"
            name="name"
            value={suggestion.name}
            onChange={handleInputChange}
            placeholder="Jane Smith"
          />
        </div>
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
            type="message"
            id="suggestion"
            name="message"
            value={suggestion.text}
            onChange={handleInputChange}
            placeholder="Your suggestion here!"
          />
        </div>

        <div className="suggestion-form-section checkbox">
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
