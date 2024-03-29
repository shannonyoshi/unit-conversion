import React, { useState, FC } from "react";
import ConversionForm from "../components/conversionForm";
import ConvertedList from "../components/convertedList";
import "../styling/convertView.scss";

import {IngrInput, ConvIngr}from "../types"

//name is used as a honeypot to weed out bots submitting the form
const initialInputState:IngrInput={
  name: "",
  currentAmount: "",
  currentUnit: "",
  targetUnit: "",
  ingredientName: "",
}

const ConvertView: FC=():JSX.Element=> {
  const [ingredients, setIngredients] = useState<ConvIngr[]>([]);
  const [inputs, setInputs] = useState<IngrInput>(initialInputState);

  return (
    <div className="convert-page-wrapper">
      <ConversionForm
        setConvertedIngredients={setIngredients}
        convertedIngredients={ingredients}
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
};

export default ConvertView;
