import React from "react";

export default function Requirements() {
  return (
    <div className="req-wrapper">
      <div className ="req current">
        <h3>Current Requirements and Limitations</h3>
        <p>
          The current version of this website only allows weight to weight and
          volume to volume conversions
        </p>
        <p>
          Each entry must include an amount, the current unit, and the target
          unit. Ingredient name is not currently required, but will be once
          additional functionality is added
        </p>
        <p>
          There are plans to increase usability by incorporating 3rd party
          information which will allow volume to weight and weight to volume
          conversions
        </p>
      </div>
      <div className="req future">
        <h3>Plans for Improvement</h3>
        <p>Ability to delete and edit the list produced</p>
        <p>
          Weight to volume and volume to weight conversions will be possible
          with the addition of third party ingredient information
        </p>
        <p>
          Instead of multiple inputs with drop down menus, there will instead be
          a single text box, which will accept a list of ingredients and the
          type of target units--such as US or Metric
        </p>
        <p>
          I want to hear your suggestions! I will be adding a section to add
          suggestions or let me know when something isn't working properly
        </p>
        <p>
          There is not currently a timeline for these additional features--it's
          just me working on this website, so it'll take however long it takes
          for me to figure out how to accomplish all of this
        </p>
      </div>
    </div>
  );
}
