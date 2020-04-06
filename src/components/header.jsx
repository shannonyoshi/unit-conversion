import React from "react"
import {NavLink} from "react-router-dom"

export default function Header() {
    return (
      <div>
        <header className="App-header">
          <h3 className="App-logo">Unit<br/>Converter</h3>
        </header>
        <nav>
          <NavLink exact to="/">Converter</NavLink>
          <NavLink to="/suggestions">Suggestions</NavLink>
          <NavLink to="/about-me">About Me</NavLink>
          <NavLink to="/site-info">Site Info</NavLink>
        </nav>
        </div>
    );
  }