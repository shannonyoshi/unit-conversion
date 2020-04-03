import React from "react";

// import conversionForm from "./conversionForm"

export default function ConvertedList(props) {

    const ingredients = props.ingredients
    console.log("Ingredients in convertedList", ingredients, "ingredients.length", ingredients.length)
    if (ingredients.length > 0) {
    return(
        <div className="list-wrapper">
            <h4>Converted List</h4>
            <ul className="list">
            {ingredients.map(ingredient=> 
                <li className="converted list-item"key={ingredient[0].ingredient}>{ingredient[0]}</li>
            )}

        </ul>
        <h4>Original List</h4>
            <ul className="list">
            {ingredients.map(ingredient=> 
                <li className="converted list-item"key={ingredient[1].ingredient}>{ingredient[1]}</li>
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