import React, { useState, useEffect } from "react";
import { validateAmount, checkIfSimple } from "../util/utilFunctions";
import { convertSimple } from "../util/conversionFunctions";
import { unitDict } from "../util/units";
import {postConversion} from "../util/crudFuncs";
import ShowErrors from "./errors"

const unitKeys = Object.keys(unitDict);

export default function ConversionForm(props) {
  const setConvertedIngredients = props.setIngredients;
  const convertedIngredients = props.ingredients;
  const inputs = props.inputs;
  const setInputs = props.setInputs;
  const initialInputState = props.initialInputState;
  const initialErrorState = {
    "Amount": "",
    "Ingredient Name": "",
    "Conversion": "",
    "General": "",
  }
  const [errors, setErrors] = useState(initialErrorState);
  // const [showErrors, setShowErrors] = useState(true);
  // console.log("showErrors", showErrors)
  // console.log("errors", errors)
  //should check is conversion is "simple" (vol=>vol or weight=>weight), validate amount
  //if a simple conversion, use function from util file to perform the conversion, then set to state converted list to display
  //if not a simple conversion , validate Name
  //perform API call to BE(not yet set up)

  // TODO: finish handleSubmit for complex conversions once backend is functional. BE should check if item is in DB forInStatement, if not perform additional API call

  // useEffect(() => {
  //   const errorVals = Object.values(errors);
  //   // let count = 0;
  //   let i=0
  //   while (i < errorVals.length){
  //     if (errorVals[i].length > 0 ){
  //       setShowErrors(true)
  //       return
  //     }
  //     i++
  //   }
  //     setShowErrors(false);

  // }, [errors]);

  const handleSubmit = (e) => {
    console.log('SUBMIT inputs', inputs)
    e.preventDefault();
    setErrors(initialErrorState);
    // setShowErrors(false)
    //assumes if name is filled out (it's hidden from view), the form was completed by a bot. It is only "visible" to people using screen readers
    if (inputs.name && inputs.name.length > 0) {
      return;
    }

    const isSimple = checkIfSimple(inputs.unitFrom, inputs.unitTo);
    // console.log("simpleConversion?", isSimple);
    const isAmount = validateAmount(inputs.amount);
    // console.log("amount valid?", isAmount);
    if (!isAmount) {
      setErrors({
        ...errors,
        amount: "Unable to validate amount, either use decimal amounts (1.5) or fractions (1 1/2)",
      });
      return;
    }
    if (isSimple) {
      const convertedAmount = convertSimple(
        isAmount,
        inputs.unitFrom,
        inputs.unitTo
      );
      const converted = `${convertedAmount} ${inputs.ingredientName? inputs.ingredientName:""}`;
      // console.log("converted", converted);
      if (converted) {
        let convertedFullInfo = {
          amount: isAmount,
          unitFrom: inputs.unitFrom,
          unitTo: inputs.unitTo,
          ingredientName: inputs.ingredientName,
          convertedString: converted,
        };
        setConvertedIngredients([...convertedIngredients, convertedFullInfo]);
        setInputs({ ...initialInputState });
      } else {
        setErrors({ ...errors, conversion: "Unable to convert given ingredient" });
      }
    } else {
      //if not a simple conversion
      if (inputs.ingredientName.length<0) {

        let complexIngr = {
          ingredientName: inputs.ingredientName,
          currentAmount: isAmount,
          currentUnit: inputs.unitFrom,
          altUnit: unitDict[inputs.unitFrom].type,
          altAmount: unitDict[inputs.unitFrom].conversion,
          targetUnit: inputs.unitTo,
        }
        postConversion(complexIngr)
        console.log('complexIngr', complexIngr)
      } else {
        setErrors({...errors, "Ingredient Name": "Can't complete this type of conversion without specifying an ingredient name"})
      }
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
            <label htmlFor="name" className="honey">
              Leave this blank
            </label>
            <input
              name="name"
              value={inputs.name}
              className="honey"
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
            <label htmlFor="unitFrom" className="convert-label">
              From
            </label>
        
            <select
              required
              id="unitFrom"
              name="unitFrom"
              value={inputs.unitFrom}
              onChange={handleInputChange}>
              <option value="" disabled defaultValue>
                Select Unit
              </option>
              {unitKeys.map((unit) => (
                <option value={unit} key={`unitFrom${unit}`}>
                  {unit}
                </option>
              ))}
            </select>
       
          </div>
          <div className="form-section">
            <label htmlFor="unitTo" className="convert-label">
              To
            </label>
       
            <select
              value={inputs.unitTo}
              id="unitTo"
              name="unitTo"
              onChange={handleInputChange}>
              <option value="" disabled defaultValue>
                Select Unit
              </option>
              {unitKeys.map((unit) => (
                <option value={unit} key={`unitTo${unit}`}>
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
          <ShowErrors errors = {errors}/>
          <button type="submit">Convert</button>
        </form>
        {/* {showErrors === true ? (
          <div className="errors">
            <h3>Errors:</h3>
            <ul>
              {Object.entries(errors).map(([key, value]) => (value!==""?
                <li key={key}>
                  {key.charAt(0).toUpperCase()+key.slice(1)}: {value}
                </li>: null
              ))}
            </ul>
          </div>
        ) : (
          <></>
        )} */}
      </div>
    </div>
  );
}
