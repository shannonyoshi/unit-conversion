import React, { useState, Dispatch, SetStateAction, FC } from "react";

import { unitDict } from "../util/units";
import { Set } from "./conversionForm";

interface SettingsProps {
  settings: Set,
  setSettings: Dispatch<SetStateAction<Set>>,
  defaultTol: Set
}


const SettingsForm: FC<SettingsProps> = ({ settings, setSettings, defaultTol }: SettingsProps): JSX.Element => {

  const [inputs, setInputs] = useState<Set>(settings)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist()
    setInputs((inputs) => ({ ...inputs, [event.target.name]: event.target.value }));
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    e.preventDefault()
    let value: string = e.currentTarget.value
    let name: string = e.currentTarget.name
    setInputs((inputs) => ({ ...inputs, [name]: value }))
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setSettings(inputs)
    setInputs(defaultTol)
  }

  const reset = () => {
    setInputs(defaultTol)
  }

  return <form className="settings-form" onSubmit={handleSubmit}>
      {/* <p>This setting changes the accuracy of the converted ingredient when converting to standard measurements (as opposed to metric). This does not affect metric return values.</p> */}
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
    <button type="submit">Save</button>
  </form>
}

export default SettingsForm;