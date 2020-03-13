import React, { useState } from "react";
import { convertSimple, validateAmount } from "../util/utilFunctions";
import { unitDict, allFractions } from "../util/units";

const unitKeys = Object.keys(unitDict);

export default function ConversionForm(props) {
  const setConvertedIngredients = props.setIngredients;
  const convertedIngredients = props.ingredients;
  const [inputs, setInputs] = useState({
    amount: "",
    unitFrom: "",
    unitTo: "",
    ingredient: ""
  });
  const [errors, setErrors] = useState({ amount: false, ingredient: false });

  //should check for type of conversion, validate amount
  //if a simple conversion, use function from util file to perform the conversion, then set to state converted list to display
  //if not a simple conversion (vol=>vol or weight=>weight), validate ingredient
  //perform API call to BE(not yet set up)

  // TODO: finish handleSubmit for complex conversions once backend is functional. BE should check if item is in DB forInStatement, if not perform additional API call
  const handleSubmit = e => {
    e.preventDefault();
    console.log("submitted");
    setErrors({ amount: false, ingredient: false });

    let simpleResult = simpleConvert();
    console.log("simpleConversion?", simpleResult);
    let amountResult = validateAmount(inputs.amount.trim());
    console.log("amount valid?", amountResult);
    if (amountResult === false) {
      setErrors({ ...errors, amount: true });
      return;
    }
    if (simpleResult) {
      console.log(
        "go to convertSimple",
        amountResult,
        inputs.unitFrom,
        inputs.unitTo
      );
      let converted = convertSimple(
        amountResult,
        inputs.unitFrom,
        inputs.unitTo
      );
      console.log("converted", converted);
      if (converted) {
        setConvertedIngredients({ ...convertedIngredients, converted });
      }
    }
  };
  const handleInputChange = e => {
    e.persist();
    // console.log("event.target", e.target, "event.target.value",e.target.value)
    setInputs(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
  };
  // returns false if not valid and the parsed number in decmial if true
  

  // checks to see if conversion can be done using simple calculation, or an API call is needed
  const simpleConvert = () => {
    let unitFrom = inputs.unitFrom;
    let unitTo = inputs.unitTo;
    console.log("in simpleConvert unitFrom", unitDict[unitFrom]);
    console.log("in simpleConvert unitTo", unitDict[unitTo].type);
    if (unitDict[unitFrom].type === unitDict[unitTo].type) {
      return true;
    }
    return false;
  };

  return (
    <div className="formWrapper">
      <h2>Unit Converter</h2>
      <form onSubmit={handleSubmit}>
        <label for="amount">Amount</label>
        <input
          required
          type="text"
          id="amount"
          placeholder="3 1/2"
          name="amount"
          value={inputs.amount}
          onChange={handleInputChange}
        />
        <label for="unitFrom">From</label>
        <select
          required
          id="unitFrom"
          name="unitFrom"
          value={inputs.unitFrom}
          onChange={handleInputChange}
        >
          {unitKeys.map(unit => (
            <option value={unit} key={`unitFrom${unit}`}>
              {unit}
            </option>
          ))}
        </select>
        <label for="unitTo">To</label>
        <select
          value={inputs.unitTo}
          id="unitTo"
          name="unitTo"
          onChange={handleInputChange}
        >
          {unitKeys.map(unit => (
            <option value={unit} key={`unitTo${unit}`}>
              {unit}
            </option>
          ))}
        </select>
        <label for="ingredient">Ingredient</label>
        <input
          type="text"
          id="ingredient"
          name="ingredient"
          placeholder="flour"
          value={inputs.ingredient}
          onChange={handleInputChange}
        ></input>
        <button type="submit">Convert</button>
      </form>
    </div>
  );
}
