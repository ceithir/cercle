import React from "react";
import { Row, Col } from "react-bootstrap";
import Crossroads from "./../components/Crossroads.js";
import Achievements from "./../components/Achievements.js";
import achievements from "./achievements.js";

export const acquireItem = function(itemKey, updateFlag) {
  updateFlag(["inventory", itemKey, "acquired"], true);
};

export const useItem = function(itemKey, updateFlag) {
  updateFlag(["inventory", itemKey, "used"], true);
};

const computeAchievements = function(flags) {
  return achievements.filter((achievement) => {
    return achievement.condition(flags);
  });
};

const badEndMessage = function(flags) {
  const achievements = computeAchievements(flags);

  let achievementsText = `Vous avez fait preuve de prudence et d’ingéniosité, mais cela n’a pas suffi à vous éviter une fin brutale :`;
  if (1 === achievements.length) {
    achievementsText = `Votre séjour dans ce lagon paradisiaque s’est conclu de bien brutale façon :`;
  }

  const hintText = `Peut-être souhaiteriez-vous un indice avant d’effectuer une nouvelle tentative ? (non implémenté)`;

  return (
    <div className="ending-message">
      <p>{achievementsText}</p>
      <Achievements achievements={achievements} />
      <p>{hintText}</p>
    </div>
  );
}

const replayButton = function(reset) {
  return {
    "text": `Nouvelle partie`,
    "action": reset,
  };
}

const titleScreenButton = function(quit) {
  return {
    "text": `Retourner à l’écran titre`,
    "action": quit,
  };
}

const endButtons = function(reset, quit) {
  return (
    <Row>
      <Col md={6} mdOffset={3} className="lead text-center">
        <Crossroads choices={[replayButton(reset), titleScreenButton(quit)]} />
      </Col>
    </Row>
  );
}

export const endGame = function(goToSection, flags, updateFlag, reset, quit) {
  return (
    <div>
      <hr/>
      {badEndMessage(flags)}
      <hr/>
      {endButtons(reset, quit)}
    </div>
  );
}

const goodEndMessage = function(flags) {
  const achievementsText = `Ce fut un parcours mouvementé, mais vous en êtes venue à bout :`;
  const hintText = `Mais avez-vous découvert tous les secrets du lagon ? Par exemple saviez-vous…`;
  //TODO Random hints out of a list
  const hints = [
    `Qu’il est possible de rencontrer la mère de Raiahui ?`,
    `De battre Raiahui sans jamais avoir quitté l’île de départ ?`,
  ];

  return (
    <div className="ending-message">
      <p>{achievementsText}</p>
      <Achievements achievements={computeAchievements(flags)} />
      <p>{hintText}</p>
      <ul>
        {hints.map((hint, index) => {
          return <li key={index.toString()}>{hint}</li>;
        })}
      </ul>
    </div>
  );
}

export const trueEnd = function(goToSection, flags, updateFlag, reset, quit) {
  return (
    <div>
      <hr/>
      {goodEndMessage(flags)}
      <hr/>
      {endButtons(reset, quit)}
    </div>
  );
}
