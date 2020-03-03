import React from "react";
import { useForm } from "react-hook-form";

const volumeUnits = [
  "drop",
  "smidge",
  "pinch",
  "dash",
  "teaspoon",
  "tablespoon",
  "fluid ounce",
  "cup",
  "pint",
  "quart",
  "gallon",
  "milliliter",
  "liter"
];

const weightUnits = ["ounce", "pound", "gram", "kilogram"];
const allUnits = volumeUnits.concat(weightUnits);

export default function ConversionForm(props) {
    const setIngredients= props.setIngredients
    const [amount, setAmount] = useState("");
    const [unitTo, setUnitTo] = useState("")
    const [unitFrom, setUnitFrom] = useState("")
    const [ingredient, setIngredient] = useState("")
  return (
    <div className="formWrapper">
      <h2>Unit Converter</h2>
      <form>
      <label for="amount">Amount</label>
      <input type="number" id="amount" placeholder="3 1/2" />
      <label for="unitFrom">From</label>
      <select id="unitFrom" name="unitFrom">
        {allUnits.map(unit => {
          <option value={unit}>{unit}</option>;
        })}
      </select>
      <label for="unitTo">To</label>
      <select>
        {allUnits.map(unit => {
          <option value={unit}>{unit}</option>;
        })}
      </select>
      <label for="ingredient">Ingredient</label>
      <input type="text" id="ingredient" placeholder="flour"></input>
      <button type="submit">Convert</button>
      </form>
    </div>
  );
}
