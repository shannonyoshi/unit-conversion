import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../styling/siteView.scss";

export default function SiteInfoView() {
  return (
    <div className="info-page-wrapper">
      <div className="card-large">
        <h1 className="card-title">
          Site Info{" "}
          <a
            href="https://github.com/shannonyoshi/unit-conversion"
            target="_blank">
            <FontAwesomeIcon icon={["fab", "github"]} className="github-icon" />
          </a>
        </h1>
        <p className="indent">
          The front end of this site is built with React. I was able to keep
          state simple enough to use hooks and minimal prop drilling, without
          the need for Redux or Context. Text parsing, validation, and simple
          conversions&mdash;defined as weight to weight or volume to
          volume&mdash;are handled by the front end since no additional
          information is required. For now the forms have honeypots to weed out
          bots. The results of simple conversions are within +/-2.5% of the
          input amount in order to balance accuracy and readability.
        </p>

        <p className="indent">
          The back end is written in Go. Since this is my first Go project, I
          kept it simple using a multiplexer with a Postgres relational
          database. There are 2 tables, one for suggestions, and one for
          ingredient density. Complex conversions, which are weight to volume or
          volume to weight, use the density to convert ingredients. A third
          party API is integrated to get the information used to calculate the
          density for new ingredients.
        </p>
        <h1 className="card-title second">Feature Plans</h1>
        <h3 className="card-subtitle">Multi-Ingredient Input</h3>
        <p>
          <span>What:</span> Add optional conversion form with a textarea to
          allow multiple ingredients to be input at once. This feature requires
          additional text parsing, user error notifications.
        </p>
        <p>
          <span>Why:</span> Converting a single ingredient at a time is annoying
          and repetitive if multiple ingredients require conversion.
        </p>
        <h3 className="card-subtitle">Admin Portal</h3>
        <p>
          <span>What:</span> Create an admin portal with user authentication and
          CRUD functionality for suggestions
        </p>
        <p>
          <span>Why:</span> Currently there is no UI to do anything with the
          suggestions and error reports received, so all interactions with that
          table are via the Postgres command line. This makes it difficult to
          keep track of those records, and allows for greater user error.
        </p>
        <h3 className="card-subtitle">Error Reporting</h3>
        <p>
          <span>What:</span> Add error reporting functionality to the conversion
          page. This should auto-populate a form with the conversions taking
          place, and include (at minimum) a text area for users to describe the
          issue.
        </p>
        <p>
          <span>Why:</span> Although users are able report errors now via the
          suggestion form, reducing the effort required to report them should
          increase the likelihood that reports will be made when errors occur,
          allowing me to improve the site more.
        </p>
      </div>
    </div>
  );
}
