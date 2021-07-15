import React from "react";

export default function SuggestionForm({
  suggestion,
  setSuggestion,
  isEdit,
  submitForm,
}) {
  const handleInputChange = (e) => {
    e.persist();
    if (e.target.name === "isError") {
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
    // console.log("handleSubmit()");
    // console.log("suggestion", suggestion);
    e.preventDefault();
    if (suggestion.checker && suggestion.checker.length > 0) {
      // console.log("if return");
      return;
    }
    // console.log("before submitForm");
    submitForm();
  };

  return (
    <div className="card-med-large">
      <h1 className="card-title">Suggestion Form</h1>
      <div className="suggestion-wrapper">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="suggestion-section">
            <label htmlFor="name" className="checker">
              Leave this blank
            </label>
            <input
              className="checker"
              type="text"
              id="checker"
              name="checker"
              value={suggestion.checker}
              onChange={handleInputChange}
              placeholder="Do not fill this out"
            />
            <label className="suggestion-label">Name</label>
            <input
              className="string-input"
              type="text"
              id="name"
              name="name"
              value={suggestion.name}
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
              name="email"
              value={suggestion.email}
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
              type="text"
              id="suggestion"
              name="message"
              value={suggestion.message}
              onChange={handleInputChange}
              placeholder="Your suggestion here!"
            />
          </div>

          <div className="suggestion-section checkbox">
            <input
              type="checkbox"
              id="reporting-error?"
              name="isError"
              value={suggestion.isError}
              onChange={handleInputChange}
            />
            <span>
              Please check this if you are reporting an error or issue
            </span>
          </div>
          <button type="submit" disabled={suggestion.message.length<1? true:false} className="submit-button">
            {isEdit ? "Update" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
