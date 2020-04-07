import React, {useState} from "react";
import ConversionForm from "../components/conversionForm";
import ConvertedList from "../components/convertedList"
import "../styling/convertView.scss"

export default function ConvertView() {
  const [ingredients, setIngredients] = useState([]);

  return (
    <div className="page-wrapper">

      <ConversionForm
        setIngredients={setIngredients}
        ingredients={ingredients}
      />
      <ConvertedList ingredients={ingredients} />
    </div>
  );
}
