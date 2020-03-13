import React from "react";

// import conversionForm from "./conversionForm"

export default function ConvertedList(props) {
    const ingredients = props.ingredients
    if (ingredients.length > 0) {
    return(
        <div className="list-wrapper">
            <ul className="list">
            {ingredients.map(ingredient=> 
                <li className="list-item"key={ingredient.ingredient}>ingredient</li>
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