import React, {useState} from "react";
import ConversionForm from "../components/conversionForm";
import ConvertedList from "../components/convertedList"

export default function ConvertView() {
  const [ingredients, setIngredients] = useState([]);

  return (
    <div>
      <ConversionForm
        setIngredients={setIngredients}
        ingredients={ingredients}
      />
      <ConvertedList ingredients={ingredients} />
    </div>
  );
}
