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
          className={`inactive-nav-link ${description}`}
          activeClassName={`active-nav-link ${description}`}>
          Converter
        </NavLink>
        <NavLink
          to="/suggestions"
          className={`inactive-nav-link ${description}`}
          activeClassName={`active-nav-link ${description}`}>
          Suggestions
        </NavLink>
        <NavLink
          to="/charts"
          className={`inactive-nav-link ${description}`}
          activeClassName={`active-nav-link ${description}`}>
          Charts
        </NavLink>
        <NavLink
          to="/about-me"
          className={`inactive-nav-link ${description}`}
          activeClassName={`active-nav-link ${description}`}>
          About Me
        </NavLink>
        <NavLink
          to="/site-info"
          className={`inactive-nav-link ${description}`}
          activeClassName={`active-nav-link ${description}`}>
          Site Info
        </NavLink>
      </nav>
    </div>
  );
}
