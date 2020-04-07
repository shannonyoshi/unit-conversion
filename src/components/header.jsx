import React from "react";
import { NavLink } from "react-router-dom";

import "../styling/header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header() {
  return (
    <div>
      <header className="header">
        <div className="header-left">
          <FontAwesomeIcon icon="balance-scale" className="header-logo-icon" />
          <h3 className="header-logo-text">
            Baking Unit
            <br />
            Conversion
          </h3>
        </div>

        <nav className="header-right">
          <NavLink
            exact
            to="/"
            className="inactive-nav-link"
            activeClassName="active-nav-link"
          >
            Converter
          </NavLink>
          <NavLink
            to="/suggestions"
            className="inactive-nav-link"
            activeClassName="active-nav-link"
          >
            Suggestions
          </NavLink>
          <NavLink
            to="/about-me"
            className="inactive-nav-link"
            activeClassName="active-nav-link"
          >
            About Me
          </NavLink>
          <NavLink
            to="/site-info"
            className="inactive-nav-link"
            activeClassName="active-nav-link"
          >
            Site Info
          </NavLink>
        </nav>
      </header>
    </div>
  );
}
