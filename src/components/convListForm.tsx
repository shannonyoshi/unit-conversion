import React, { FC, SetStateAction, Dispatch } from "react";

import ShowErrors from "./errors"

import { InputsList, ConvIngr, Set } from "../types";

interface ListFormProps {
  inputsList: InputsList,
  setInputsList: Dispatch<SetStateAction<InputsList>>,
  setIngredients: Dispatch<SetStateAction<ConvIngr[]>>
  settings: Set,
}

const ConversionListForm: FC<ListFormProps> = ({ inputsList, setInputsList, setIngredients }: ListFormProps): JSX.Element => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    e.persist()
    setInputsList((inputsList) => ({ ...inputsList, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

  }

  return (
    <div>
      <h1 className="card-title">List Converter</h1>
      <p>If converting to grams or doing a simple (weight&#10140;weight or volume&#10140;volume) conversion, you can list all ingredients and convert them at once</p>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label htmlFor="name" className="checker">
            Leave this blank
          </label>
          <input
            className="checker"
            type="text"
            id="name"
            name="name"
            value={inputsList.name}
            onChange={handleChange}
            placeholder="Do not fill this out"
          />
        </div>

        <div className="form-section">
          <label htmlFor="list" className="list">List to convert</label>
          <textarea
            name="list"
            value={inputsList.string}
            className="list"
            id="inputs-list"
            onChange={handleChange}
            placeholder="1 cup flour"

          />
        </div>

      </form>
    </div>
  )
}

export default ConversionListForm;