import React from "react";
import { Row, Col } from "react-bootstrap";
import Crossroads from "./../components/Crossroads.js";
import Funnel from "./../components/Funnel.js";
import Achievements from "./../components/Achievements.js";
import achievements from "./achievements.js";
import {getHint} from "./hints.js";
import Hint from "./../components/Hint.js";

export const acquireItem = function(itemKey, updateFlag) {
  updateFlag(["inventory", itemKey, "acquired"], true);
};

export const useItem = function(itemKey, updateFlag) {
  updateFlag(["inventory", itemKey, "used"], true);
};

const gameIsStillWinnableWithoutTurningFullyMad = (flags) => {
  if (flags.drunk) {
    // Technically still possible with enough other options, but so hard it barely matters
    return false;
  }

  const options = [
    flags.wellRested,
    flags.boostedByFruit,
    flags.inventory.dolphin.acquired && !flags.inventory.dolphin.used,
    flags.inventory.smokePearls.acquired && !flags.inventory.smokePearls.used,
    flags.inventory.doll.acquired && !flags.inventory.doll.used,
    flags.inventory.net.acquired && !flags.inventory.net.used,
  ];

  // You can win with only one option, but it’s quite hard, so requiring at least two
  return options.filter(element => element).length >= 2;
}

const computeAchievements = function(flags) {
  return achievements.filter((achievement) => {
    return achievement.condition(flags);
  });
};

const badEndMessage = function(flags) {
  const achievements = computeAchievements(flags);

  let achievementsText = `You showed caution and cleverness, but it wasn’t enough to save you from a brutal end:`;
  if (1 === achievements.length) {
    achievementsText = `Your stay on this idyllic atoll has ended in a rather brutal manner:`;
  }

  const hint = getHint(flags);
  const hintWarning = `Would you like a clue before making another attempt?`;

  return (
    <div className="ending-message">
      <p>{achievementsText}</p>
      <Achievements achievements={achievements} />
      {hint && <Hint hint={hint} warning={hintWarning} />}
    </div>
  );
}

const endButtons = function(flags, reset, quit) {
  let choices = [];

  if (!flags.survivedTheTrial && flags.flagsBeforeActualTrial) {
    choices.push({
      "text": `Start the trial again`,
      "action": () => {
        const recursiveFlags = Object.assign({}, flags, {"flagsBeforeActualTrial": flags})
        reset("trial-underwater", recursiveFlags);
      },
    });
    choices.push({
      "text": `Start again from the beginning`,
      "action": () => {reset()},
    });
  } else {
    choices.push({
      "text": flags.survivedTheTrial? `New game`: `Start again`,
      "action": () => {reset()},
    });
    choices.push({
      "text": `Go back to the main page`,
      "action": () => {quit()},
    });
  }

  const showWarningText = !flags.survivedTheTrial && flags.flagsBeforeActualTrial && !gameIsStillWinnableWithoutTurningFullyMad(flags);
  const warningText = `The odds were definitely against Mananuiva when she faced the trial. It might be wiser to start again from the beginning.`;

  return (
    <div className="restart-buttons">
      {showWarningText && <p className="hint">{warningText}</p>}
      <Row>
        <Col md={6} mdOffset={3} className="lead text-center">
          <Crossroads choices={choices} />
        </Col>
      </Row>
    </div>
  );
}

export const endGame = function(goToSection, flags, updateFlag, reset, quit) {
  return (
    <div>
      <hr/>
      {badEndMessage(flags)}
      <hr/>
      {endButtons(flags, reset, quit)}
    </div>
  );
}

const goodEndMessage = function(flags) {
  const achievementsText = `It wasn’t easy, but you’ve done it:`;

  return (
    <div className="ending-message">
      <p>{achievementsText}</p>
      <Achievements achievements={computeAchievements(flags)} />
    </div>
  );
}

export const trueEnd = function(goToSection, flags, updateFlag, reset, quit) {
  return (
    <div>
      <hr/>
      {goodEndMessage(flags)}
      <hr/>
      {endButtons(flags, reset, quit)}
    </div>
  );
}

export const coatSentence = text => `<p class="transition-sentence">${text}</p>`;

export const repeatingCrossroad = (goToSection, choices) => {
  return (
    <Crossroads choices={choices.map(choice => {
      return {
        "text": choice.text,
        "action": () => goToSection("function" === typeof choice.action? choice.action(): choice.action, coatSentence(choice.text))
      };
    })} />
  );
}

export const repeatingFunnel = (goToSection, text, action) => {
  return (
    <Funnel text={text} action={() => goToSection("function" === typeof action? action(): action, coatSentence(text))} />
  );
}

export const wentToIsland = (islandKey, flags) => {
  return -1 !== flags.visitedIslands.indexOf(islandKey);
}

export const secondTimeToIsland = (islandKey, flags) => {
  return flags.visitedIslands.filter(visitedIslandKey => islandKey === visitedIslandKey).length >= 2;
}

const inventoryChange = (content) => {
  return `
<div class="inventory-change-container">
  <p class="inventory-change">${content}</p>
</div>
  `;
}

export const itemAcquisitionFeedback = (itemName) => {
  return inventoryChange(`
<span class="item-name">${itemName}</span> has been added to your inventory.
  `);
}

export const itemUpdateFeedback = (itemName) => {
  return inventoryChange(`
<span class="item-name">${itemName}</span> has been updated.
  `);
}
