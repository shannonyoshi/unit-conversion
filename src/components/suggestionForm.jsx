import React, {useState} from "react";

const initialSuggestionState = { text: "", email: "", isErrorReport: false };

export default function SuggestionForm() {
  const [suggestion, setSuggestion] = useState(initialSuggestionState);

  const handleInputChange = (e) => {
    e.persist();
    // console.log("event.target", e.target, "event.target.value",e.target.value)
    if (e.target.name === "reporting-error?") {
      setSuggestion((suggestion) => ({
        ...suggestion,
        isError: !suggestion.isError,
      }));
    } else {
      setSuggestion((suggestion) => ({
        ...suggestion,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit=(e)=> {
      e.preventDefault()
      console.log("handleSubmitSuggestionForm doesn't do anything right now.")
      setSuggestion(initialSuggestionState)
  }

  return (
    <div className="suggestion-form-wrapper">
      <form onSubmit={handleSubmit}>
        <div className="suggestion-form-section">
          <label htmlFor="suggestion" className="suggestion-label">Suggestion</label>
          <textarea
            required
            type="text"
            id="suggestion"
            name="suggestion"
            value={suggestion.text}
            onChange={handleInputChange}
            
          />
        </div>
        <div className="suggestion-form-section">
          <label htmlFor="contact" className="suggestion-label">E-mail</label>
          <input
            className="email-input"
            type="email"
            id="contact"
            name="contact"
            value={suggestion.email}
            onChange={handleInputChange}
            placeholder="something@probably-gmail.com"
          />
        </div>
        <div className="suggestion-form-section">
          <input
            type="checkbox"
            id="reporting-error?"
            name="reporting-error?"
            value={suggestion.isErrorReport}
            onChange={handleInputChange}
          />
          <span>Please check this box if you are reporting an error or issue</span>
        </div>
      <button type="submit">Submit</button>
      </form>
    </div>
  );
}

//suggestion
//issues
//contact
