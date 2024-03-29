import React, { useState, Dispatch, SetStateAction, FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { formConversion } from "../util/conversionFunctions";
import { unitDict } from "../util/units";

import { IngrInput, ConvIngr, Error, Set } from "../types";

import ShowErrors from "./errors";
import SettingsForm from "./settingsForm";

const unitKeys = Object.keys(unitDict);

interface FormProps {
  setConvertedIngredients: Dispatch<SetStateAction<ConvIngr[]>>;
  convertedIngredients: ConvIngr[];
  inputs: IngrInput;
  setInputs: Dispatch<SetStateAction<IngrInput>>;
  initialInputState: IngrInput;
}

const defaultTol: Set = { tolerance: .5, toleranceType: "percent" }

const ConversionForm: FC<FormProps> = ({
  setConvertedIngredients,
  convertedIngredients,
  inputs,
  setInputs,
  initialInputState,
}: FormProps): JSX.Element => {
  const [errors, setErrors] = useState<Error[] | null>(null);
  const [settings, setSettings] = useState<Set>(defaultTol)
  const [viewSettings, setViewSettings] = useState<boolean>(false)

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const converted: [ConvIngr | null, Error | null] = await formConversion(inputs, settings)
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
        {viewSettings === false ? <FontAwesomeIcon icon="cog" className="icon-btn settings" onClick={(e: React.MouseEvent) => setViewSettings(true)} /> : ""}
        <h1 className="card-title">{viewSettings === true ? "Tolerance Settings" : "Unit Converter"}</h1>
        {viewSettings === true ? <SettingsForm settings={settings} setSettings={setSettings} defaultTol={defaultTol} setViewSettings={setViewSettings} /> :
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
                value={inputs.ingredientName}
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
        }
      </div>
    </div>
  );
};

export default ConversionForm;