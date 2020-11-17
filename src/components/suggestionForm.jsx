import React from "react";

export default function SuggestionForm({
  suggestion,
  setSuggestion,
  isEdit,
  submitForm,
}) {
  console.log("suggestion", suggestion);

  const handleInputChange = (e) => {
    e.persist();
    if (e.target.name === "IsError") {
      setSuggestion((suggestion) => ({
        ...suggestion,
        IsError: !suggestion.isError,
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
    if (suggestion.country && suggestion.country.length > 0) {
      return;
    }
    submitForm();
  };

  return (
    <div className="suggestion-wrapper">
      <form onSubmit={handleSubmit}>
        <div className="suggestion-section">
          <label htmlFor="name" className="checker">
            Leave this blank
          </label>
          <input
            name="country"
            value={suggestion.country}
            className="checker"
            type="text"
            placeholder="Do not fill this out"
            onChange={handleInputChange}
          />
          <label className="suggestion-label">Name</label>
          <input
            className="string-input"
            type="text"
            id="name"
            name="Name"
            value={suggestion.Name}
            onChange={handleInputChange}
            placeholder="Jane Smith"
          />
        </div>
        <div className="suggestion-section">
          <label htmlFor="contact" className="suggestion-label">
            E-mail
          </label>
          <input
            className="string-input"
            type="email"
            id="contact"
            name="Email"
            value={suggestion.Email}
            onChange={handleInputChange}
            placeholder="something@probably-gmail.com"
          />
        </div>
        <div className="suggestion-section">
          <label htmlFor="suggestion" className="suggestion-label">
            Suggestion
          </label>
          <textarea
            required
            type="message"
            id="suggestion"
            name="Message"
            value={suggestion.Message}
            onChange={handleInputChange}
            placeholder="Your suggestion here!"
          />
        </div>

        <div className="suggestion-section checkbox">
          <input
            type="checkbox"
            id="reporting-error?"
            name="IsError"
            value={suggestion.IsError}
            onChange={handleInputChange}
          />
          <span>
            Please check this box if you are reporting an error or issue
          </span>
        </div>
        <button type="submit" className="submit-button">
          {isEdit ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
}
