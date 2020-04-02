import React, {useEffect} from "react";

// import conversionForm from "./conversionForm"

export default function ConvertedList(props) {

    const ingredients = props.ingredients
    console.log("Ingredients in convertedList", ingredients, "ingredients.length", ingredients.length)
    if (ingredients.length > 0) {
    return(
        <div className="list-wrapper">
            <ul className="list">
            {ingredients.map(ingredient=> 
                <li className="list-item"key={ingredient.ingredient}>{ingredient}</li>
                // {if (!ingredient[1]===null) {
                //     <span>{ingredient[1]}</span>}
            )}

        </ul>
        </div>
    )}
    else {
        return (
            <div>
                <h4>No Ingredients Converted</h4>
            </div>
        )
    }
}