import React, { useState, Dispatch, SetStateAction, FC } from "react";
import { validateAmount, checkIfSimple } from "../util/utilFunctions";
import { convertComplex, convertSimple } from "../util/conversionFunctions";
import { unitDict } from "../util/units";

import { IngrInput, ConvIngr, ErrorInt } from "../types";

import ShowErrors from "./errors";

const unitKeys = Object.keys(unitDict);

interface FormProps {
  setConvertedIngredients: Dispatch<SetStateAction<ConvIngr[]>>;
  convertedIngredients: ConvIngr[];
  inputs: IngrInput;
  setInputs: Dispatch<SetStateAction<IngrInput>>;
  initialInputState: IngrInput;
}
const initialErrorState = {
  Amount: "",
  "Ingredient Name": "",
  Conversion: "",
  General: "",
};
const ConversionForm: FC<FormProps> = ({
  setConvertedIngredients,
  convertedIngredients,
  inputs,
  setInputs,
  initialInputState,
}: FormProps): JSX.Element => {
  const [errors, setErrors] = useState<ErrorInt>(initialErrorState);

  //checks if conversion is "simple" (vol=>vol or weight=>weight), validate amount
  //if so, use function from util file to perform the conversion, then set to state converted list to display
  //else, validate ingredientName, do post request
  //performs API call to BE

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrors(initialErrorState);
    //assumes if name is filled out (it's hidden from view), the form was completed by a bot. It is only "visible" to people using screen readers
    if (inputs.name && inputs.name.length > 0) {
      return;
    }

    const isAmount = validateAmount(inputs.amount);
    // console.log("amount valid?", isAmount);
    if (!isAmount) {
      setErrors({
        ...errors,
        Amount:
          "Unable to validate amount, either use decimal amounts (1.5) or fractions (1 1/2)",
      });
      return;
    }

    const isSimple = checkIfSimple(inputs.currentUnit, inputs.targetUnit);
    if (isSimple) {
      let simpleConvIngr: ConvIngr = convertSimple(isAmount, inputs);
      setConvertedIngredients([...convertedIngredients, simpleConvIngr]);
      setInputs(initialInputState)
    } else {
      let convertedIngr: ConvIngr | { errorMessage: string } = await convertComplex(inputs, isAmount);
      if (convertedIngr.errorMessage) {
        setErrors({ ...errors, "Ingredient Name": convertedIngr.message });

      }
      //  TODO: figure out how this etypeof convertedIngr != ConvIngrrror should go
      // if (convertedIngr.errorType) {
      // }
    }
    setConvertedIngredients([...convertedIngredients, convertedIngr]);
    setInputs(initialInputState);
  };
  const handleInputChange = (e) => {
    e.persist();
    // console.log("event.target", e.target, "event.target.value",e.target.value)
    setInputs((inputs) => ({ ...inputs, [e.target.name]: e.target.value }));
    setErrors(initialErrorState);
  };

  return (
    <div className="card-small">
      <div className="form-wrapper">
        <h1 className="card-title">Unit Converter</h1>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-section">
            <label htmlFor="name" className="checker">
              Leave this blank
            </label>
            <input
              name="name"
              value={inputs.name}
              className="checker"
              type="text"
              placeholder="Do not fill this out"
              onChange={handleInputChange}
            />
            <label htmlFor="amount" className="convert-label">
              Amount
            </label>
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
            <label htmlFor="currentUnit" className="convert-label">
              From
            </label>

            <select
              required
              id="currentUnit"
              name="currentUnit"
              value={inputs.currentUnit}
              onChange={handleInputChange}>
              <option value="" disabled >
                Select Unit
              </option>
              {unitKeys.map((unit) => (
                <option value={unit} key={`currentUnit${unit}`}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          <div className="form-section">
            <label htmlFor="targetUnit" className="convert-label">
              To
            </label>

            <select
              required
              value={inputs.targetUnit}
              id="targetUnit"
              name="targetUnit"
              onChange={handleInputChange}>
              <option value="" disabled >
                Select Unit
              </option>
              {unitKeys.map((unit) => (
                <option value={unit} key={`targetUnit${unit}`}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          <div className="form-section">
            <label htmlFor="ingredientName" className="convert-label">
              Ingredient
            </label>
            <input
              type="text"
              id="ingredientName"
              name="ingredientName"
              placeholder="flour"
              value={inputs.ingredientName}
              onChange={handleInputChange}
            />
          </div>
          <ShowErrors errors={errors} />
          <button
            type="submit"
            disabled={
              (inputs.amount > 0 || inputs.amount.length > 0) &&
                inputs.currentUnit.length > 0 &&
                inputs.targetUnit.length > 0
                ? false
                : true
            }>
            Convert
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversionForm;