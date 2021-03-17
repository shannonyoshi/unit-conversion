// const baseURL = "http://localhost:8080/api/";
const baseURL = "https://bakingunits.com/api/"

export const postSuggestion = async (suggestion) => {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "none",
    },
    body: JSON.stringify(suggestion),
  };
   console.log('request', request)
  const response = await fetch(`${baseURL}suggest`, request);
  console.log('response', response)
  // console.log('response.status', response.status)
  if (!response.ok) {
    console.log(response);
  }
  const data = await response.json();
  console.log("POST RESPONSE DATA: ", data);
  return data;
};

export const putSuggestion = async (suggestion) => {
  const request = {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: "none" },
    body: JSON.stringify(suggestion),
  };
  const response = await fetch(`${baseURL}suggest`, request);
  if (!response.ok) {
    console.log(response);
  }
  const data = await response.json();
  console.log("PUT RESPONSE DATA: ", data);

  return data;
};

export const delSuggestion = async (suggestionID)=> {
  
  const request = {
    method: "DELETE",
    headers: {"Content-Type": "application/json", Authorization: "none"},
    body: JSON.stringify(suggestionID)
  }

  const response = await fetch(`${baseURL}suggest`, request);
  if (!response.ok) {
    console.log('response', response)
    return false
  }
  return true
}

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

  const response = await fetch(`${baseURL}convert`, request);
  if (!response.ok) {
    console.log("response", response);
  }
  const data = await response.json();
  // console.log('returned conversion data', data)
  return data;
};
