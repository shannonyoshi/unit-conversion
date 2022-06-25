import { ComplexIngr, AddedIngr, SugSubmit, Suggestion, Error } from "../types"
// const baseURL = "http://localhost:8080/api/";
const baseURL = "https://www.bakingunits.com/api/"


export const postSuggestion = async (suggestion: SugSubmit) => {
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

export const putSuggestion = async (suggestion: Suggestion): Promise<Suggestion> => {
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

export const delSuggestion = async (suggestionID: number) => {

  const request = {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: "none" },
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

export const postConversion = async (ingredient: ComplexIngr): Promise<[AddedIngr | null, Error | null]> => {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "none",
    },
    body: JSON.stringify(ingredient),
  };
  try {
    const response = await fetch(`${baseURL}convert`, request);
    if (!response.ok) {
      return [null, { name: "Server", message: "An error occurred fetching ingredient information" }]
    }
    const data: AddedIngr = await response.json();
    console.log("data: ", data)
    return [data, null];

  } catch (error) {
    console.log("error", error)
    return [null, { name: "Server", message: error as string }]
  }
};
