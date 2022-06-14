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
        <div className="additional-links">
        <a
          href="https://github.com/shannonyoshi/unit-conversion"
          target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={["fab", "github"]} className="github-icon" />
        </a>
        <a className="portfolio-link" href="https://syoshi.dev/"
          target="_blank" rel="noopener noreferrer">PortFolio
        </a>
          </div>
      </footer>
    </div>
  );
}

export default Footer;