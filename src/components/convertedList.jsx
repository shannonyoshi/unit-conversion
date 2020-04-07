import React from "react";

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
            {ingredients.map((ingredient) => (
              <li
                className="converted list-item"
                key={ingredient[0].ingredient}
              >
                {ingredient[0]}
              </li>
            ))}
          </ul>
        ) : (
          <p>No Ingredients Converted</p>
        )}
      </div>
      <div className="card">
        <h1 className="card-title">Original List</h1>
        {ingredients.length > 0 ? (
          <ul className="list">
            {ingredients.map((ingredient) => (
              <li className="original list-item" key={ingredient[1].ingredient}>
                {ingredient[1]}
              </li>
            ))}
          </ul>
        ) : (
          <p>No Ingredients Converted</p>
        )}
      </div>
    </>
  );
}
