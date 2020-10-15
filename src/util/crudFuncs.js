const baseURL = "http://localhost:8080/api/";

export const postSuggestion = async (suggestionString) => {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "none",
    },
    body: JSON.stringify({ suggestion: suggestionString }),
  };
  const response = await fetch(`${baseURL}suggest`, request);
  if (!response.ok) {
    console.log(response);
  }
  const data = await response.json();
  console.log("POST RESPONSE DATA: ", data);
};

// example ingredient: ingredientName, currentAmount, currentUnit, altUnit, altAmount, targetUnit
//altUnit and altAmount is the "type" and conversion of currentUnit.

export const postConversion = async (ingredient) => {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "none",
    },
    body: JSON.stringify(ingredient),
  };
  console.log('request', request)
  const response = await fetch(`${baseURL}convert`, request)
  if (!response.ok) {
      console.log('response', response)
  }
//   const data = await response.json();
//   console.log('returned conversion data', data)
};
