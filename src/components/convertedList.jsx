import React from "react";

import conversionForm from "./conversationForm"
import ConvertedIngredient from "./convertedIngredient"

export default function ConvertedList(props) {
    const ingredients = props.ingredients
    return(
        <div className="list-wrapper">
            <ul className="list">
            {ingredients.map(ingredient=> {
                <li className="list-item"key={ingredient.ingredient}>ingredient</li>
            })}

        </ul>
        </div>
    )
}