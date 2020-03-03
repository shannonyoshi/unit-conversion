import React from "react";

export default function ConvertedIngredient(props) {
    ingredients = props.ingredients
    return(
        <ul>
            {ingredients.map(ingredient=> {
                <li key={ingredient.ingredient}>ingredient</li>
            })}

        </ul>
    )

}