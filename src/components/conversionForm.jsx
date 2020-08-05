import React, { useState, useEffect } from "react";
import {
  validateAmount,
  checkIfSimple,
} from "../util/utilFunctions";
import {convertSimple} from "../util/conversionFunctions"
import { unitDict } from "../util/units";

const unitKeys = Object.keys(unitDict);

export default function ConversionForm(props) {
  const setConvertedIngredients = props.setIngredients;
  const convertedIngredients = props.ingredients;
  const inputs=props.inputs;
  const setInputs = props.setInputs
  const initialInputState=props.initialInputState
  const [errors, setErrors] = useState({
    amount: "",
    ingredient: "",
    conversion: "",
    general: "",
  });
  const [showErrors, setShowErrors] = useState(true);
  // console.log("showErrors", showErrors)
  // console.log("errors", errors)
  //should check for type of conversion, validate amount
  //if a simple conversion, use function from util file to perform the conversion, then set to state converted list to display
  //if not a simple conversion (vol=>vol or weight=>weight), validate ingredient
  //perform API call to BE(not yet set up)

  // TODO: finish handleSubmit for complex conversions once backend is functional. BE should check if item is in DB forInStatement, if not perform additional API call

  useEffect(() => {
    const errorVals = Object.values(errors);
    let count = 0;
    errorVals.forEach((error) => {
      if (error.length > 0) {
        count += 1;
      }
    });
    if (count > 0 && showErrors === false) {
      setShowErrors(true);
    }
    if (count === 0 && showErrors === true) {
      setShowErrors(false);
    }
  }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("submitted");
    setErrors({ amount: "", ingredient: "" });
    //assumes if name is filled out (it's hidden from view), the form was completed by a bot. It is only "visible" to people using screen readers
    if (inputs.name.length>0) {
      return
    }

    let isSimple = checkIfSimple(inputs.unitFrom, inputs.unitTo);
    console.log("simpleConversion?", isSimple);
    let isAmount = validateAmount(inputs.amount.trim());
    console.log("amount valid?", isAmount);
    if (!isAmount) {
      setErrors({
        ...errors,
        amount: "Unable to validate amount, see examples",
      });
      return;
    }
    if (isSimple) {
      const convertedAmount = convertSimple(
        isAmount,
        inputs.unitFrom,
        inputs.unitTo
      );
      const converted = `${convertedAmount} ${inputs.ingredient}`;
      console.log("converted", converted);
      if (converted) {
        let convertedFullInfo = {amount:isAmount, unitFrom:inputs.unitFrom, unitTo:inputs.unitTo, ingredientName:inputs.ingredient, convertedString:converted}
        setConvertedIngredients([
          ...convertedIngredients,
          convertedFullInfo,
        ]);
        setInputs({...initialInputState})
      } else {
        setErrors({ ...errors, conversion: "Unable to convert" });
      }
    } else {
      //if not a simple conversion
      setErrors({
        ...errors,
        general:
          "Currently only able to convert volume -> volume or weight -> weight",
      });
    }
  };
  const handleInputChange = (e) => {
    e.persist();
    // console.log("event.target", e.target, "event.target.value",e.target.value)
    setInputs((inputs) => ({ ...inputs, [e.target.name]: e.target.value }));
  };

  return (
    <div className="card-small">
      <div className="form-wrapper">
        <h1 className="card-title">Unit Converter</h1>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-section">
            <label htmlFor="name" className="honey">Leave this blank</label>
            <input className="honey" type="text" placeholder="Do not fill this out" name="name" value = {inputs.name} onChange={handleInputChange}/>
            <label htmlFor="amount" className="convert-label">Amount</label>
            <input
              required
              type="text"
              id="amount"
              placeholder="3 1/2"
              name="amount"
              value={inputs.amount}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-section">
            <label htmlFor="unitFrom" className="convert-label">From</label>
            {/* <div className="select-wrapper"> */}
              <select
                required
                id="unitFrom"
                name="unitFrom"
                value={inputs.unitFrom}
                onChange={handleInputChange}
              >
                <option value="" disabled defaultValue>
                  Select Unit
                </option>
                {unitKeys.map((unit) => (
                  <option value={unit} key={`unitFrom${unit}`}>
                    {unit}
                  </option>
                ))}
              </select>
            {/* </div> */}
          </div>
          <div className="form-section">
            <label htmlFor="unitTo" className="convert-label">To</label>
            {/* <div className="select-wrapper"> */}
              <select
                value={inputs.unitTo}
                id="unitTo"
                name="unitTo"
                onChange={handleInputChange}
              >
                <option value="" disabled defaultValue>
                  Select Unit
                </option>
                {unitKeys.map((unit) => (
                  <option value={unit} key={`unitTo${unit}`}>
                    {unit}
                  </option>
                ))}
              </select>
            {/* </div> */}
          </div>
          <div className="form-section">
            <label htmlFor="ingredient" className="convert-label">Ingredient</label>
            <input
              type="text"
              id="ingredient"
              name="ingredient"
              placeholder="flour"
              value={inputs.ingredient}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Convert</button>
        </form>
        {showErrors === true ? (
          <div className="errors">
            <p>Errors:</p>
            <ul>
              {Object.entries(errors).map(([key, value]) => (
                <li key={key}>
                  {key}:{value}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
