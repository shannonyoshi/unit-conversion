import React, { FC, Dispatch, SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { checkPluralUnit } from "../util/utilFunctions"
import { ConvIngr, IngrInput } from "../types"

type ConvListProps = {
  ingredients: ConvIngr[],
  setIngredients: Dispatch<SetStateAction< ConvIngr[]>>,
  setInputs: Dispatch<SetStateAction<IngrInput>>
}

const ConvertedList: FC<ConvListProps> = ({ ingredients, setIngredients, setInputs }: ConvListProps): JSX.Element => {
  
  // removes ingredient from list
  const deleteIngredient = (index: number) => {
    let newIngredientsArray = ingredients;
    newIngredientsArray.splice(index, 1);
    setIngredients([...newIngredientsArray]);
  };

  //removes ingredient from list and adds to inputs on conversion form
  const editIngredient = (e:React.MouseEvent, index:number) => {
    e.preventDefault();
    let toEdit = ingredients[index];
    deleteIngredient(index);
    setInputs({
      name: "",
      currentAmount: toEdit.currentAmount.toString(),
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
            {ingredients.map((ingredient, index:number) => (
              <div className="list-item" key={`C${index}`}>
                <li className="converted">{ingredient.convertedString}</li>

                <FontAwesomeIcon
                  icon="trash-alt"
                  className="delete-item icon-btn"
                  onClick={(e:React.MouseEvent) => deleteIngredient(index)}
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
                  {`${ingredient.currAmtStr} ${checkPluralUnit(Number(ingredient.currentAmount), ingredient.currentUnit)} ${ingredient.ingredientName}`}
                </li>
                <div>
                  <FontAwesomeIcon
                    icon="edit"
                    className="edit-item icon-btn"
                    onClick={(e:React.MouseEvent) => editIngredient(e,index)}
                  />
                  <FontAwesomeIcon
                    icon="trash-alt"
                    className="delete-item icon-btn"
                    onClick={(e:React.MouseEvent) => deleteIngredient(index)}
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

export default ConvertedList;