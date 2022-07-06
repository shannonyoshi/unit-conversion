import React, { FC, SetStateAction, Dispatch, useState } from "react";

import ShowErrors from "./errors"

import { InputsList, ConvIngr, Set, Error } from "../types";
import { listConversion } from "../util/conversionFunctions";

interface ListFormProps {
  inputsList: InputsList,
  setInputsList: Dispatch<SetStateAction<InputsList>>,
  setIngredients: Dispatch<SetStateAction<ConvIngr[]>>,
  ingredients: ConvIngr[],
  settings: Set,
}

const ConversionListForm: FC<ListFormProps> = ({ inputsList, setInputsList, setIngredients, settings, ingredients }: ListFormProps): JSX.Element => {
  const [errors, setErrors] = useState<Error[] | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    e.persist()
    setInputsList((inputsList) => ({ ...inputsList, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.SyntheticEvent): Promise<Error | void> => {
    e.preventDefault()
    const tryList: [ConvIngr | null, Error | null][] = await listConversion(inputsList, settings)
    let errorList: Error[] = []
    let ingrList: ConvIngr[] = []
    tryList.forEach(ingr => {
      if (ingr[0] !== null) {
        ingrList.push(ingr[0])
      } if (ingr[1] !== null) {
        errorList.push(ingr[1])
      }
    })
    setIngredients([...ingredients, ...ingrList])
    setErrors(errorList)


    // TODO: finish error checking, etc for handleSubmit 
  }

  return (
    <div>
      <h1 className="card-title">List Converter</h1>
      <p>If converting to grams or doing a simple (weight&#10140;weight or volume&#10140;volume) conversion, you can list all ingredients and convert them at once</p>
      <p>Example: 1 cup water -&gt; pints</p>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label htmlFor="name" className="checker">
            Leave this blank
          </label>
          <input
            type="text"
            name="name"
            value={inputsList.name}
            className="checker"
            id="name1"
            onChange={handleChange}
            placeholder="Do not fill this out"
          />
        </div>

        <div className="form-section">
          <label htmlFor="list" className="list">List to convert</label>
          <textarea
            name="string"
            value={inputsList.string}
            className="list"
            id="inputs-list"
            onChange={handleChange}
            placeholder="1 cup flour"

          />
        </div>
        {errors ? <ShowErrors errors={errors} /> : null}
        <button
          type="submit"
          disabled={inputsList.string.length === 0 ? true :
            inputsList.name.length > 0 ? true : false}>
          Convert
        </button>
      </form>
    </div>
  )
}

export default ConversionListForm;