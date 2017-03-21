import React from "react";
import { Button } from "react-bootstrap";
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
  const text = `Rejouer ?`;
  const action = () => {goToSection(null)};

  return (
    <div className="text-center">
      <Button onClick={action}>{text}</Button>
    </div>
  );
}

const computeAchievements = function(flags) {
  return achievements.filter((achievement) => {
    return achievement.condition(flags);
  });
};

export const endGame = function(goToSection, flags) {
  return (
    <div>
      <hr/>
      {endMessage()}
      <Achievements achievements={computeAchievements(flags)} />
      {replayButton(goToSection)}
    </div>
  );
}
