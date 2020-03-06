import React, {useState} from 'react';
// import logo from './logo.svg';
import './App.css';
import Header from "./components/header"
import ConvertedList from "./components/convertedList"
import ConversionForm from "./components/conversionForm"

function App() {
  const [ingredients, setIngredients] = useState([])
// ingredient ex. {"amount": "3", "unitFrom": "cups", "unitTo": "grams", "ingredient": "flour", "id": 0}
  return (
    <div className="App">
      <Header/>
      <ConversionForm setIngredients={setIngredients} ingredients={ingredients}/>
      <ConvertedList ingredients={ingredients}/>
    </div>
  );
}

export default App;
