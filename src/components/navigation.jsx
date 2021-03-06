import React from "react";
import { NavLink } from "react-router-dom";

import "../styling/navigation.scss";

export default function Navigation({ description, clickHandler = null }) {
  return (
    <div className={`nav-wrapper ${description}`}>
      <nav
        className={`${description}`}
        onClick={clickHandler ? clickHandler : undefined}>
        <NavLink
          exact
          to="/"
          className={`nav-link ${description}`}
          activeClassName="active">
          Converter
        </NavLink>
        <NavLink
          to="/suggestions"
          className={`nav-link ${description}`}
          activeClassName="active">
          Suggestions
        </NavLink>
        <NavLink
          to="/charts"
          className={`nav-link ${description}`}
          activeClassName="active">
          Charts
        </NavLink>
        <NavLink
          to="/about-me"
          className={`nav-link ${description}`}
          activeClassName="active">
          About Me
        </NavLink>
        <NavLink
          to="/site-info"
          className={`nav-link ${description}`}
          activeClassName="active">
          Site Info
        </NavLink>
      </nav>
    </div>
  );
}
