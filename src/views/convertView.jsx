import React, { useState } from "react";
import ConversionForm from "../components/conversionForm";
import ConvertedList from "../components/convertedList";
import "../styling/convertView.scss";

export default function ConvertView() {
  const [ingredients, setIngredients] = useState([]);
  const [inputs, setInputs] = useState(initialInputState);

  return (
    <div className="page-wrapper">
      <ConversionForm
        setIngredients={setIngredients}
        ingredients={ingredients}
        inputs={inputs}
        setInputs={setInputs}
      />
      <ConvertedList
        ingredients={ingredients}
        setIngredients={setIngredients}
        setInputs={setInputs}
      />
    </div>
  );
}
