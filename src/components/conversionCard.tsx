import React, { useState, Dispatch, SetStateAction, FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IngrInput, ConvIngr, Error, Set, InputsList, FormOptions } from "../types";


import SettingsForm from "./settingsForm";
import ConversionListForm from "./convListForm";
import ConversionForm from "./conversionForm";

const defaultTol: Set = { tolerance: .5, toleranceType: "percent" }

interface ConvCardProps {
  setIngredients: Dispatch<SetStateAction<ConvIngr[]>>;
  ingredients: ConvIngr[];
  inputs: IngrInput;
  setInputs: Dispatch<SetStateAction<IngrInput>>;
  initialInputState: IngrInput;
}

const initInputsList: InputsList = {
  name: "",
  string: "1 cup    flour ->pints\n3/4 cup sugar  ->tablespoon ",
  valList: []
}

const ConversionCard = ({ setIngredients, ingredients, inputs, setInputs, initialInputState }: ConvCardProps): JSX.Element => {
  const [settings, setSettings] = useState<Set>(defaultTol)
  const [formType, setFormType] = useState<FormOptions>("individual")
  const [viewSettings, setViewSettings] = useState<boolean>(false)
  const [inputsList, setInputsList] = useState<InputsList>(initInputsList);

  const showList = (e: React.MouseEvent) => {
    e.preventDefault()
    setFormType("list")
  }
  const showIndividual = (e: React.MouseEvent) => {
    e.preventDefault()
    setFormType("individual")
  }

  return (
    <div className="card-small">
      <div className="form-wrapper">
        <div className="icons">

          {formType === "individual" ?
            <FontAwesomeIcon icon="ellipsis-v" className="icon-btn list" onClick={showList} /> :
            <FontAwesomeIcon icon="circle" className="icon-btn individual" onClick={showIndividual} />
          }
          {/* {viewSettings === false ? */}
          <FontAwesomeIcon icon="cog" className={`icon-btn settings ${viewSettings === true ? "hidden" : ""}`} onClick={(e: React.MouseEvent) => setViewSettings(true)} />
          {/* <div className="icon-btn placeholder"></div> */}
          {/* } */}
        </div>
        {viewSettings === true ?
          <SettingsForm settings={settings} setSettings={setSettings} defaultTol={defaultTol} setViewSettings={setViewSettings} /> :
          formType === "list" ?
            <ConversionListForm inputsList={inputsList} setInputsList={setInputsList} settings={settings} setIngredients={setIngredients} ingredients={ingredients} /> :
            <ConversionForm setConvertedIngredients={setIngredients} convertedIngredients={ingredients} inputs={inputs} setInputs={setInputs} initialInputState={initialInputState} settings={settings} />
        }
      </div>
    </div>
  )
}

export default ConversionCard;