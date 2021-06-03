import React from "react";
import { Link } from "react-router-dom";

import "../styling/aboutView.scss";

export default function AboutView() {
  // return( <div>
  //     <h2>About Me</h2>
  //     </div>
  // )
  return (
    <div className="page-wrapper">
      <div className="card-large">
        <h1 className="card-title">About Me</h1>
        <a href="https://syoshi.dev/" className="link port" target="_blank"><h4>View my portfolio</h4></a>
        <p className="indent">
          I love baking! Learning about food science is fun&mdash;sometimes
          frustrating&mdash;and always interesting. Plus, seeing friends and
          family enjoy my food is one of life's simple pleasures with the added
          bonus of being an excellent ego boost. The worst part about baking,
          apart from having too many tempting treats around, is cleaning up the
          inevitable mess. After using a kitchen scale for the first time, I
          realized how much less there is to clean when measuring cups aren't
          needed, and I was hooked.
        </p>
        <p className="indent">
          When I started programming not too long ago, I knew I would need some
          projects to improve my skills and show my work. I spent a lot of time
          brainstorming, but couldn't settle on a project because I wanted it to
          be useful to me and, hopefully, others. One day, I wanted to try a new
          recipe and needed to convert some measurements. I went looking for a
          website to help with the conversions, but couldn't find what I was
          looking for. And just like that, I knew what I wanted to build.
        </p>
        <p className="indent">
          I hope you enjoy this website! It's been a rewarding challenge to get
          it this far, and I still have plans to add features. If you want to
          learn more about the technical aspects and plans for this site, check
          out the{" "}
          <Link to="/site-info" className="link">
            Site Info page
          </Link>
          . If you have any concerns or feature suggestions, please submit them
          via the form on the{" "}
          <Link to="/suggestions" className="link">
            Suggestions page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
