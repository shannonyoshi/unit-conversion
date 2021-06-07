import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Logo from "../components/Logo";
import Navigation from "../components/navigation";

import "../styling/footer.scss";
const Footer = (): JSX.Element => {
  return (
    <div className="footer-wrapper">
      <footer>
        <Logo description="footer-logo" />
        <Navigation description="footer-nav" />
        <a
          href="https://github.com/shannonyoshi/unit-conversion"
          target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={["fab", "github"]} className="github-icon" />
        </a>
      </footer>
    </div>
  );
}

export default Footer;