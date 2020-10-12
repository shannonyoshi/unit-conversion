import React, { useState } from "react";
import ConversionForm from "../components/conversionForm";
import ConvertedList from "../components/convertedList";
import "../styling/convertView.scss";

//name is used as a honeypot to weed out bots submitting the form
const initialInputState={
  name: "",
  amount: "",
  unitFrom: "",
  unitTo: "",
  ingredientName: "",
}

export default function ConvertView() {
  const [ingredients, setIngredients] = useState([]);
  const [inputs, setInputs] = useState(initialInputState);
console.log('inputs in ConvertView', inputs)
  return (
    <div className="convert-page-wrapper">
      <ConversionForm
        setIngredients={setIngredients}
        ingredients={ingredients}
        inputs={inputs}
        setInputs={setInputs}
        initialInputState={initialInputState}
      />
      <ConvertedList
        ingredients={ingredients}
        setIngredients={setIngredients}
        setInputs={setInputs}
      />
    </div>
  );
}
