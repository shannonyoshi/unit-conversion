import React from "react";
import Logo from "../components/Logo";
import Navigation from "../components/navigation";

import "../styling/footer.scss";
export default function Footer() {
  return (
    <div className="footer-wrapper">
      <footer>
        <Logo description="footer-logo" />
        <Navigation description="footer-nav" />
      </footer>
    </div>
  );
}
