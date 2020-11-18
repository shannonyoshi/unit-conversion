import React, { useState } from "react";

import Logo from "../components/Logo";
import Navigation from "../components/navigation";

import "../styling/header.scss";

export default function Header() {
  const [open, setOpen] = useState(false);

  const toggleOpen = (e) => {
    setOpen(!open);
  };
  return (
    <header>
      <div className="hamburger-wrapper">
        <div className={`hamburger-menu ${open}`} onClick={toggleOpen}>
          <div className={`top line ${open}`} />
          <div className={`middle line ${open}`} />
          <div className={`bottom line ${open}`} />
        </div>
        <Logo description="header-logo"/>
      </div>
        <Navigation description={`header-nav ${open}`} clickHandler={toggleOpen} />
    </header>
  );
}
