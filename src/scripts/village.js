import React from "react";
import Crossroads from "./../components/Crossroads.js";
import {acquireItem, repeatingCrossroad, repeatingFunnel, coatSentence, itemAcquisitionFeedback} from "./helpers.js";

const exploreOrLeave = function(goToSection, flags, updateFlag) {
  const leaveText = `You go back to your canoe.`;

  const choices = [
    {
      "text": `You decide to explore the rest of the island.`,
      "action": () => {
        updateFlag("time", flags.time+1);
        goToSection("outside-the-village");
      },
    },
    {
      "text": leaveText,
      "action": () => {goToSection("hub", coatSentence(leaveText));},
    },
  ];

  return (
    <Crossroads choices={choices} />
  );
}

const village = {
  "village": {
    "text": `
 <p>The village is still deep in sleep, but you’re not the only one who’s awake : some distance away from the huts, you notice a man and a woman busy making deep cuts on palm trees with their ivory knives. They wave when they spot you, but do not halt their activity.</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const choices = [
        {
          "text": `You decide to approach them.`,
          "action": () => {
            updateFlag("time", flags.time+1);
            goToSection("wine-makers");
          },
        },
        {
          "text": `You decide to explore the rest of the island`,
          "action": () => {
            updateFlag("time", flags.time+1);
            goToSection("outside-the-village");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "wine-makers": {
    "text": `
<p>The man is Oramui and the woman Terani. As a preparation for this evening’s ceremony, they’re collecting sap to make palm wine. The pale, sweet beverage is not unknown to you – it’s commonly served during the celebrations of your tribe – but you only have a vague idea as to how it’s prepared.</p>

<div class="conversation">
<p>“It’s important not to collect the sap too early,” explains Oramui, “because it quickly becomes stronger and more acidic. If you wait more than a day, it will be undrinkable.”</p>
</div>

<p>He shows you small piles of calabashes and explains they contain the sap they collected yesterday, shortly after your arrival. But your eyes are soon drawn to a dozen of calabashes kept apart from the others, and wrapped in large leaves.</p>

<div class="conversation">
<p>“Is this palm wine too?” you ask.</p>
</div>

<p>Oramui and Terani shake their heads and engage in a complicated explanation, involving quite a few words you do not know. You only manage to understand that it’s a beverage derived from palm wine, but much stronger.</p>

<p>As they’re about to go back to their work, Terani is upset to discover that she’s misplaced her ivory knife. She looks for it with obvious frustration. Just as you’re about to offer your help, she finds it stuck at eye level in the trunk of a nearby palm tree.</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const choices = [
        {
          "text": `You ask if you can drink some palm wine.`,
          "action": "soft-drink",
        },
        {
          "text": `You ask if you can try their hard liquor.`,
          "action": () => {
            acquireItem("alcohol", updateFlag);
            return "hard-drink";
          },
        },
        {
          "text": `You take your leave and explore the rest of the island.`,
          "action": () => {
            updateFlag("time", flags.time+1);
            return "outside-the-village";
          },
        },
        {
          "text": `You take your leave and head back to your canoe.`,
          "action": "hub",
        },
      ];

      return repeatingCrossroad(goToSection, choices)
    },
  },
  "outside-the-village": {
    "text": `
<p>The island is fairly long and, while the vegetation isn’t dense enough to really slow you down, it greatly limits your field of vision. You soon realize that exploring the entire island in detail would require half the day. You persist for a while, but discover nothing of interest. In fact, few details even remind you of the presence of the nearby village. The tribe does not seem to cultivate any plants, or to cut down trees very often.</p>
    `,
    "next": function(goToSection) {
      const text = `Feeling bored, you head for the beach and, from there, quickly return to your canoe.`;
      const action = "hub";

      return repeatingFunnel(goToSection, text, action);
    }
  },
  "soft-drink": {
    "text": `
<p>Terani lets you drink a bit of the sap collected yesterday. The pale beverage has a slightly sweet taste that you find quite pleasant. You thank them politely, then take your leave.</p>
    `,
    "next": exploreOrLeave,
  },
  "hard-drink": {
    "text": (flags) => {
      return `
<p>Terani frowns, and you surmise that the liquor – being harder to produce – is not as easily shared as mere palm wine. You expect her to refuse, but, after exchanging a look with Oramui, she shrugs and hands over to you one of the calabashes full of hard liquor.</p>

${itemAcquisitionFeedback(flags.inventory.alcohol.name)}

<div class="conversation">
<p>“It will make you feel very dizzy,” she warns you. “You absolutely musn’t drink any of it before your race against Raiahui.”</p>
</div>

<p>Her advice brings a smile to Oramui’s lips, but he doesn’t add anything. You thank them politely before taking your leave.</p>
      `
    },
    "next": exploreOrLeave,
  }
};

export default village;
