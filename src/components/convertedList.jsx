import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ConvertedList(props) {
  const ingredients = props.ingredients;
  const setIngredients = props.setIngredients;
  const setInputs = props.setInputs;
  // console.log(
  //   "Ingredients in convertedList",
  //   ingredients,
  //   "ingredients.length",
  //   ingredients.length
  // );

  const deleteIngredient = (index) => {
    let newIngredientsArray = ingredients;
    newIngredientsArray.splice(index, 1);
    setIngredients([...newIngredientsArray]);
  };

  const removeIngredient = (e, index) => {
    e.preventDefault();
    deleteIngredient(index);
  };

  const editIngredient = (e, index) => {
    e.preventDefault();
    let toEdit = ingredients[index]
    deleteIngredient(index)
    setInputs({amount: toEdit.amount, unitFrom: toEdit.unitFrom, unitTo: toEdit.unitTo, ingredient: toEdit.ingredientName})
    
  };
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
                  {ingredient.convertedString}
                </li>

                <FontAwesomeIcon
                  icon="trash-alt"
                  className="delete-item"
                  onClick={(e) => removeIngredient(e, index)}
                />
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
                  {`${ingredient.amount} ${ingredient.unitFrom} ${ingredient.ingredientName}`}
                </li>
                {/* <FontAwesomeIcon
                  icon="trash-alt"
                  className="delete-item"
                  onClick={(e) => removeIngredient(e, index)}
                /> */}
                <FontAwesomeIcon
                  icon="edit"
                  className="edit-item"
                  onClick={(e) => editIngredient(e, index)}
                />
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
