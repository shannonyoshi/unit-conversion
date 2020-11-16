import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import "../styling/header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header() {
  const [open, setOpen] = useState(false);

  const toggleOpen = (e) => {
    setOpen(!open);
  };
  return (
    <div>
      <header className="header">
        <div className="wrapper">
          <div className={`hamburger ${open}`} onClick={toggleOpen}>
            <div className={`top line ${open}`} />
            <div className={`middle line ${open}`} />
            <div className={`bottom line ${open}`} />
          </div>
          <Logo />
        </div>
        <div className="nav-wrapper">
          <Navigation open={open} toggleOpen={toggleOpen} />
        </div>
      </header>
    </div>
  );
}

const Logo = () => {
  return (
    <div className="header-left">
      <FontAwesomeIcon icon="balance-scale" className="header-logo-icon" />
      <h3 className="header-logo-text">
        Baking Unit
        <br />
        Conversion
      </h3>
    </div>
  );
};

const Navigation = ({ open, toggleOpen }) => {
  return (
    <nav className={`header-right ${open}`} onClick={toggleOpen}>
      <NavLink
        exact
        to="/"
        className="inactive-nav-link"
        activeClassName="active-nav-link">
        Converter
      </NavLink>
      <NavLink
        to="/suggestions"
        className="inactive-nav-link"
        activeClassName="active-nav-link">
        Suggestions
      </NavLink>
      <NavLink
        to="/charts"
        className="inactive-nav-link"
        activeClassName="active-nav-link">
        Charts
      </NavLink>
      <NavLink
        to="/about-me"
        className="inactive-nav-link"
        activeClassName="active-nav-link">
        About Me
      </NavLink>
      <NavLink
        to="/site-info"
        className="inactive-nav-link"
        activeClassName="active-nav-link">
        Site Info
      </NavLink>
    </nav>
  );
};
