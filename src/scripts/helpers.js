import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import Achievements from "./../components/Achievements.js";
import achievements from "./achievements.js";

const updateItem = function(element, itemKey, flags, updateFlag) {
  const item = Object.assign({}, flags["inventory"][itemKey], element);
  let flag = {};
  flag[itemKey] = item;
  updateFlag("inventory", Object.assign({}, flags.inventory, flag));
}

export const acquireItem = function(itemKey, flags, updateFlag) {
  updateItem({acquired: true}, itemKey, flags, updateFlag);
};

export const useItem = function(itemKey, flags, updateFlag) {
  updateItem({used: true}, itemKey, flags, updateFlag);
};

const endMessage = function () {
  return (
    <div>
      <p>Votre aventure dans ce lagon isolé est maintenant parvenue à sa conclusion.</p>
      <p>Si vous le souhaitez, vous pouvez la relire dans son intégralité via le Journal. Vous trouverez également ci-dessous la liste des événements marquants de votre parcours.</p>
    </div>
  );
}

const replayButton = function(goToSection) {
  const text = `Nouvelle partie`;
  const action = () => {goToSection(null)};

  return (
    <Button bsSize="large" block onClick={action}>{text}</Button>
  );
}

const titleScreenButton = function(quit) {
  const text = `Retourner à l’écran titre`;

  return (
    <Button bsSize="large" block onClick={quit}>{text}</Button>
  );
}

const computeAchievements = function(flags) {
  return achievements.filter((achievement) => {
    return achievement.condition(flags);
  });
};

export const endGame = function(goToSection, flags, updateFlag, quit) {
  return (
    <div>
      <hr/>
      {endMessage()}
      <Achievements achievements={computeAchievements(flags)} />
      <Row>
        <Col mdOffset={3} md={6}>
          {replayButton(goToSection)}
          {titleScreenButton(quit)}
        </Col>
      </Row>
    </div>
  );
}
