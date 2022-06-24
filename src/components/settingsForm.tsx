import React, { useState, Dispatch, SetStateAction, FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { unitDict } from "../util/units";
import { Set, Error } from "../types";
import { validateAmount } from "../util/utilFunctions";
import ShowErrors from "./errors"

interface SettingsProps {
  settings: Set,
  setSettings: Dispatch<SetStateAction<Set>>,
  defaultTol: Set
  setViewSettings: Dispatch<SetStateAction<boolean>>,
}

const SettingsForm: FC<SettingsProps> = ({ settings, setSettings, defaultTol, setViewSettings }: SettingsProps): JSX.Element => {
  const [errors, setErrors] = useState<Error[] | null>(null)
  const [inputs, setInputs] = useState<Set>(settings)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist()
    setInputs((inputs) => ({ ...inputs, [event.target.name]: event.target.value }));
    if (errors) {
      setErrors(null)
    }
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    e.preventDefault()
    let value: string = e.currentTarget.value
    let name: string = e.currentTarget.name
    setInputs((inputs) => ({ ...inputs, [name]: value }))
    if (errors) {
      setErrors(null)
    }
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    let isAmount: number | null = typeof settings.tolerance === "number" ? settings.tolerance : validateAmount(inputs.tolerance.toString(10))
    if (isAmount && !isNaN(isAmount)) {
      setSettings(inputs)
      setInputs(defaultTol)
    } else {
      setErrors([{ name: "Tolerance", message: "Unable to validate the number supplied" }])
    }
  }

  const reset = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setInputs(defaultTol)
  }

  const close = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setViewSettings(false)
  }

  return <form className="settings-form" onSubmit={handleSubmit}>
    <p>This setting changes the accuracy of the converted ingredient when converting to standard measurements. This does not affect decimal (metric) return values.</p>
    <FontAwesomeIcon icon="undo-alt" className="icon-btn reset" onClick={reset} title="reset" />
    <div className="form-section">
      <label htmlFor="amount" className="settings-label">
        Amount
      </label>
      <input
        required
        value={inputs.tolerance}
        type="text"
        id="tolAmount"
        name="tolerance"
        onChange={handleInputChange}
        placeholder="examples:   1    |   .1    |    1/4   "
      />
    </div>
    <div className="form-section">

      <label htmlFor="tolType" className="settings-label">
        Type
      </label>
      <select
        required
        id="tolType"
        onChange={handleSelectChange}
        name="toleranceType"
        value={inputs.toleranceType}>
        <option value="percent" key={`tolTypepercent`}>
          Percent
        </option>
        {Object.keys(unitDict).map((unit) => (
          <option value={unit} key={`tolType${unit}`}>
            {unit}
          </option>
        ))}

      </select>
    </div>
    {errors ? <ShowErrors errors={errors} /> : null}
    <div className="buttons">
      <button type="submit">Save</button> <button className="close" onClick={close}>Close</button>
    </div>
  </form>
}

export default SettingsForm;