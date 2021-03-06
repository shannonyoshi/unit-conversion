import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {checkPluralUnit} from "../util/utilFunctions"

export default function ConvertedList({ingredients, setIngredients, setInputs}) {
  // removes ingredient from list
  const deleteIngredient = (index) => {
    let newIngredientsArray = ingredients;
    newIngredientsArray.splice(index, 1);
    setIngredients([...newIngredientsArray]);
  };

  //adds ingredient to form, removes from lists
  const editIngredient = (e, index) => {
    e.preventDefault();
    let toEdit = ingredients[index];
    deleteIngredient(index);
    setInputs({
      name: "",
      amount: toEdit.amount,
      currentUnit: toEdit.currentUnit,
      targetUnit: toEdit.targetUnit,
      ingredientName: toEdit.ingredientName,
    });
  };
  return (
    <>
      <div className="card-small">
        <h1 className="card-title">Converted List</h1>
        {ingredients.length > 0 ? (
          <ul className="list">
            {ingredients.map((ingredient, index) => (
              <div className="list-item" key={`C${index}`}>
                <li className="converted">{ingredient.convertedString}</li>

                <FontAwesomeIcon
                  icon="trash-alt"
                  className="delete-item icon-btn"
                  onClick={(e) => deleteIngredient(e, index)}
                />
              </div>
            ))}
          </ul>
        ) : (
          <p className="no-items">No Ingredients Converted</p>
        )}
      </div>
      <div className="card-small">
        <h1 className="card-title">Original List</h1>
        {ingredients.length > 0 ? (
          <ul className="list">
            {ingredients.map((ingredient, index) => (
              <div className="list-item" key={`O${index}`}>
                <li className="original">
                  {`${ingredient.amount} ${checkPluralUnit(ingredient.amount, ingredient.currentUnit)} ${ingredient.ingredientName}`}
                </li>
                <div>
                  <FontAwesomeIcon
                    icon="edit"
                    className="edit-item icon-btn"
                    onClick={(e) => editIngredient(e, index)}
                  />
                  <FontAwesomeIcon
                    icon="trash-alt"
                    className="delete-item icon-btn"
                    onClick={(e) => deleteIngredient(index)}
                  />
                </div>
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
