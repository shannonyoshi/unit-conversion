import React, { FC, useState } from "react";

import Logo from "../components/Logo";
import Navigation from "../components/navigation";

import "../styling/header.scss";

const Header: FC = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);

  const toggleOpen = (e:React.MouseEvent) => {
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
        <Logo description="header-logo" />
      </div>
      <Navigation description={`header-nav ${open}`} clickHandler={toggleOpen} />
    </header>
  );
};

export default Header;