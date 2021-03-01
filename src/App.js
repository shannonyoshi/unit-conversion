import React from "react";
import { Route, Switch } from "react-router-dom";

import Header from "./components/header";
import ConvertView from "./views/convertView";
import AboutView from "./views/aboutView";
import SuggestView from "./views/suggestView";
import SiteInfoView from "./views/siteInfoView";
import ChartView from "./views/chartView";
import Footer from "./components/footer";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrashAlt,
  faBalanceScale,
  faChevronDown,
  faEdit,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

library.add(
  faTrashAlt,
  faBalanceScale,
  faChevronDown,
  faEdit,
  faSyncAlt,
  faGithub
);
function App() {
  // ingredient ex. {"Amount": "3", "currentUnit": "cups", "targetUnit": "grams", "ingredient": "flour", "id": 0}
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/" component={ConvertView} />
        <Route path="/suggestions" component={SuggestView} />
        <Route path="/charts" component={ChartView} />
        <Route path="/site-info" component={SiteInfoView} />
        <Route path="/about-me" component={AboutView} />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
