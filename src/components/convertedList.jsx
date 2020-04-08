import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ConvertedList(props) {
  const ingredients = props.ingredients;
  console.log(
    "Ingredients in convertedList",
    ingredients,
    "ingredients.length",
    ingredients.length
  );
  //   if (ingredients.length > 0) {
  return (
    <>
      <div className="card">
        <h1 className="card-title">Converted List</h1>
        {ingredients.length > 0 ? (
          <ul className="list">
            {ingredients.map((ingredient, index) => (
              <div className="list-item">
                <li className="converted" key={`C${index}`}>
                  {ingredient[0]}
                </li>
                <FontAwesomeIcon icon="trash-alt" className="delete-item" />
              </div>
            ))}
          </ul>
        ) : (
          <p className="no-items">No Ingredients Converted</p>
        )}
      </div>
      <div className="card">
        <h1 className="card-title">Original List</h1>
        {ingredients.length > 0 ? (
          <ul className="list">
            {ingredients.map((ingredient, index) => (
              <div className="list-item">
                <li className="original" key={`O${index}`}>
                  {ingredient[1]}
                </li>
                <FontAwesomeIcon icon="trash-alt" className="delete-item" />
              </div>
            ))}
          </ul>
        ) : (
          <p className="no-items">No Ingredients Converted</p>
        )}
      </div>
    </>
  );
}
