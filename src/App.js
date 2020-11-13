import React from "react";
import { Route } from "react-router-dom";

import "./styling/App.scss";
import Header from "./components/header";
import ConvertView from "./views/convertView";
import AboutView from "./views/aboutView";
import SuggestView from "./views/suggestView";
import SiteInfoView from "./views/siteInfoView";
import ChartView from "./views/chartView"

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrashAlt,
  faBalanceScale,
  faChevronDown,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

library.add(faTrashAlt, faBalanceScale, faChevronDown, faEdit);
function App() {
  // ingredient ex. {"amount": "3", "unitFrom": "cups", "unitTo": "grams", "ingredient": "flour", "id": 0}
  return (
    <div className="App">
      <Header />
      <Route exact path="/" component={ConvertView} />
      <Route path="/suggestions" component={SuggestView} />
      <Route path="/charts" component={ChartView}/>
      <Route path="/site-info" component={SiteInfoView} />
      <Route path="/about-me" component={AboutView} />
    </div>
  );
}

export default App;
