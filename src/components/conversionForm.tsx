import React, { useState, Dispatch, SetStateAction, FC } from "react";
import { formConversion } from "../util/conversionFunctions";
import { unitDict } from "../util/units";

import { IngrInput, ConvIngr, Error, ErrorTypes } from "../types";

import ShowErrors from "./errors";

const unitKeys = Object.keys(unitDict);

interface FormProps {
  setConvertedIngredients: Dispatch<SetStateAction<ConvIngr[]>>;
  convertedIngredients: ConvIngr[];
  inputs: IngrInput;
  setInputs: Dispatch<SetStateAction<IngrInput>>;
  initialInputState: IngrInput;
}

const ConversionForm: FC<FormProps> = ({
  setConvertedIngredients,
  convertedIngredients,
  inputs,
  setInputs,
  initialInputState,
}: FormProps): JSX.Element => {
  // const [errors, setErrors] = useState<Error[] | null>(null);
  const [errors, setErrors] = useState<Error[] | null>([{name: "General", message: "This is an error. What happens when the error is really long"}, {name:"Amount", message: "This is another error about the amount"}]);


  //checks if conversion is "simple" (vol=>vol or weight=>weight), validate amount
  //if so, use function from util file to perform the conversion, then set to state converted list to display
  //else, validate ingredientName, do post request
  //performs API call to BE

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const converted: [ConvIngr | null, Error | null] = await formConversion(inputs)
    if (converted[1]) {
      setErrors([converted[1]])
      return
    }
    if (converted[0]) {
      setConvertedIngredients([...convertedIngredients, converted[0]]);
      setInputs(initialInputState)

    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist()
    setInputs((inputs) => ({ ...inputs, [event.target.name]: event.target.value }));
    setErrors(null);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    e.preventDefault()
    let value: string = e.currentTarget.value
    let name: string = e.currentTarget.name

    setInputs((inputs) => ({ ...inputs, [name]: value }))
  }

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
              id="currentAmount"
              placeholder="3 1/2"
              name="currentAmount"
              value={inputs.currentAmount}
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
              onChange={handleSelectChange}>
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
              onChange={handleSelectChange}
            >
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
              value={inputs.name}
              onChange={handleInputChange}
            />
          </div>
          {errors ? <ShowErrors errors={errors} /> : null}
          <button
            type="submit"
            disabled={
              (inputs.currentAmount.length > 0) &&
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