import React from 'react';
import {Route} from "react-router-dom"

import './App.css';
import Header from "./components/header"
import ConvertView from "./views/convertView"
import AboutView from "./views/aboutView"
import SuggestView from "./views/suggestView"
import SiteInfoView from "./views/siteInfoView"

function App() {
  
// ingredient ex. {"amount": "3", "unitFrom": "cups", "unitTo": "grams", "ingredient": "flour", "id": 0}
  return (
    <div className="App">
      <Header/>
      <Route exact path="/" component={ConvertView}/>
      <Route path="/about-me" component={AboutView}/>
      <Route path="/suggestions" component={SuggestView}/>
      <Route path="/site-info" component={SiteInfoView}/>
    </div>
  );
}

export default App;
