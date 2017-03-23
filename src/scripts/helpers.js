import React from "react";
import { Row, Col } from "react-bootstrap";
import Crossroads from "./../components/Crossroads.js";
import Achievements from "./../components/Achievements.js";
import achievements from "./achievements.js";

export const acquireItem = function(itemKey, flags, updateFlag) {
  updateFlag(["inventory", itemKey, "acquired"], true);
};

export const useItem = function(itemKey, flags, updateFlag) {
  updateFlag(["inventory", itemKey, "used"], true);
};

const endMessage = function () {
  return (
    <div>
      <p>Votre aventure dans ce lagon isolé est maintenant parvenue à sa conclusion.</p>
      <p>Si vous le souhaitez, vous pouvez la relire dans son intégralité via le Journal. Vous trouverez également ci-dessous la liste des événements marquants de votre parcours.</p>
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

const computeAchievements = function(flags) {
  return achievements.filter((achievement) => {
    return achievement.condition(flags);
  });
};

export const endGame = function(goToSection, flags, updateFlag, reset, quit) {
  return (
    <div>
      <hr/>
      {endMessage()}
      <Achievements achievements={computeAchievements(flags)} />
      <Row>
        <Col md={6} mdOffset={3} className="lead text-center">
          <Crossroads choices={[replayButton(reset), titleScreenButton(quit)]} />
        </Col>
      </Row>
    </div>
  );
}
