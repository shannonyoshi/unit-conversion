import React from "react";
import { useForm } from "react-hook-form";
//this could be held in the backend to make it more flexible
const unitDict = {
  drop: "volume",
  smidge: "volume",
  pinch: "volume",
  dash: "volume",
  teaspoon: "volume",
  tablespoon: "volume",
  "fluid ounce": "volume",
  cup: "volume",
  pint: "volume",
  quart: "volume",
  gallon: "volume",
  milliliter: "volume",
  liter: "volume",
  ounce: "weight",
  pound: "weight",
  gram: "weight",
  kilogram: "weight"
};

const unitKeys = Object.keys(unitDict);

const commonFractions = {
  "1/16": 0.0625,
  "1/10": 0.1,
  "1/8": 0.125,
  "1/6": 0.1667,
  "3/16": 0.1875,
  "1/5": 0.2,
  "1/4": 0.25,
  "5/16": 0.3125,
  "1/3": 0.333,
  "3/8": 0.375,
  "2/5": 0.4,
  "7/16": 0.4375,
  "1/2": 0.5,
  "9/16": 0.5625,
  "5/8": 0.625,
  "2/3": 0.667,
  "11/16": 0.6875,
  "3/4": 0.75,
  "13/16": 0.8125,
  "5/6": 0.833,
  "7/8": 0.875,
  "15/16": 0.9375
};

export default function ConversionForm(props) {
  const setIngredients = props.setIngredients;
  const convertedIngredients = props.ingredients;
  const [inputs, setInputs] = useState({
    amount: "",
    unitFrom: "",
    unitTo: "",
    ingredient: ""
  });
  const [errors, setErrors] = useState({ amount: false, ingredient: false });

  // const [amount, setAmount] = useState("");
  // const [unitTo, setUnitTo] = useState("")
  // const [unitFrom, setUnitFrom] = useState("")
  // const [ingredient, setIngredient] = useState("")

  const handleSubmit = e => {
    e.preventDefault();
    setErrors({ amount:false, ingredient:false})
    result = simpleConvert();
    amountResult = validateAmount();
  };
  const handleInputChange = e => {
    e.persist();
    setInputs(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
  };
  // returns false of not valid and the parsed number if valid""
  const validateAmount = () => {

    let amount = inputs.amount.trim();
    let amountArray = amount.split(" ").map(item => {
      item.trim();
    });
    if (amountArray.length>2||(amount.includes("/")&&amount.includes("."))) {
      setErrors({ ...errors, amount: true });
        return false
      }
    if (amount.includes("/")) {
      // parses whole number
      const parsed = parseInt(amountArray[0], 10);
      if (isNaN(parsed)) {
        setErrors({ ...errors, amount: true });
        return false;
      }
      const fraction = amountArray[1];
      if (fraction in commonFractions) {
        const decimal = commonFractions[fraction];
        return decimal + parsed;
      } else {
        let slashIndex = fraction.indexOf("/");
        const dividend = parseInt(fraction.slice(0, slashIndex), 10);
        const divisor = parseInt(fraction.slice(slashIndex + 1), 10);
        if (isNaN(dividend) || isNaN(divisor)) {
          setErrors({ ...errors, amount: true });
          return false;
        } else {
          const quotient = Math.floor((dividend / divisor) * 10000) / 1000;
          return parsed + quotient;
        }
      }
    }
      if (amount.includes(".")) {
        const parsedFl = parseFloat(amount, 10);
        if (isNaN(parsedFl)) {
          setErrors({ ...errors, amount: true });
          return false;
        } else {
          return parsedFl;
        }
      } 
      
      if (!amount.includes(".") && !amount.includes("/")) {
        let parsingAmount=amount
        if (amountArray.length > 1) {
          parsingAmount = amountArray.join("");
        }
        const parsedInt = parseInt(parsinAmount, 10);
        if (isNaN(parsedInt)) {
          setErrors({ ...errors, amount: true });
          return false;
        } else {
          return parsedInt;
        }
      }
    }
  };

  // checks to see if conversion can be done using simple calculation, or an API call is needed
  const simpleConvert = () => {
    unitFrom = inputs.unitFrom;
    unitTo = inputs.unitTo;
    if (unitDict[unitFrom] === unitDict[unitTo]) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="formWrapper">
      <h2>Unit Converter</h2>
      <form onSubmit={handleSubmit}>
        <label for="amount">Amount</label>
        <input
          required
          type="text"
          id="amount"
          placeholder="3 1/2"
          value={inputs.amount}
          onChange={handleInputChange}
        />
        <label for="unitFrom">From</label>
        <select
          required
          id="unitFrom"
          name="unitFrom"
          value={inputs.unitFrom}
          onChange={handleInputChange}
        >
          {unitKeys.map(unit => {
            <option value={unit}>{unit}</option>;
          })}
        </select>
        <label for="unitTo">To</label>
        <select
          value={inputs.unitTo}
          id="unitTo"
          name="unitTo"
          onChange={handleInputChange}
        >
          {unitKeys.map(unit => {
            <option value={unit}>{unit}</option>;
          })}
        </select>
        <label for="ingredient">Ingredient</label>
        <input
          type="text"
          id="ingredient"
          placeholder="flour"
          value={inputs.ingredient}
        ></input>
        <button type="submit">Convert</button>
      </form>
    </div>
  );
}
