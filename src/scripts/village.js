import React from "react";
import Crossroads from "./../components/Crossroads.js";
import {acquireItem, repeatingCrossroad, repeatingFunnel, coatSentence, itemAcquisitionFeedback} from "./helpers.js";

const exploreOrLeave = function(goToSection, flags, updateFlag) {
  const leaveText = `Vous regagnez votre pirogue.`;

  const choices = [
    {
      "text": `Vous partez explorer le reste de l’île.`,
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
 <p>Le village est encore plongé dans une profonde torpeur, mais vous n’êtes pas la seule personne réveillée : à une certaine distance des huttes, vous remarquez un homme et une femme en train de s’affairer avec leurs couteaux d’ivoire, entaillant profondément un grand nombre de palmiers. Ils vous adressent un signe de main en vous apercevant, mais n’interrompent pas leur besogne.</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const choices = [
        {
          "text": `Vous décidez de les aborder.`,
          "action": () => {
            updateFlag("time", flags.time+1);
            goToSection("wine-makers");
          },
        },
        {
          "text": `Vous partez explorer le reste de l’île.`,
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
<p>L’homme s’appelle Oramui et la femme Terani. En préparation de la cérémonie de ce soir, ils sont occupés à récupérer la sève nécessaire pour faire du vin de palme. Cette boisson claire et effervescente ne vous est pas inconnue — elle est fréquemment servie lors des célébrations dans votre tribu — mais vous n’avez qu’une idée assez vague de la manière dont elle est préparée.</p>

<div class="conversation">
<p>— Il ne faut pas récolter la sève trop à l’avance, vous explique Oramui. La boisson devient très rapidement plus forte et plus acide. Si on la conserve plus d’un jour, elle se fait vite imbuvable.</p>
</div>

<p>Il vous indique du doigt quelques petites piles de calebasses, en vous expliquant qu’elles contiennent la sève qu’ils ont récoltée la veille, peu après votre arrivée. Mais votre regard ne tarde pas à être attirée par une douzaine de calebasses conservées à l’écart et enveloppées dans de grandes feuilles.</p>

<div class="conversation">
<p>— C’est aussi du vin de palme ? demandez-vous.</p>
</div>

<p>Oramui et Terani secouent vigoureusement la tête et se lancent dans une description compliquée, émaillée de mots que vous ne connaissez pas. Vous parvenez tout de même à saisir qu’il s’agit d’une boisson dérivée du vin de palme, mais beaucoup plus forte.</p>

<p>Une fois leurs explications achevées, les deux récolteurs s’apprêtent à reprendre leur ouvrage, mais une grimace contrariée tord la bouche de Terani lorsqu’elle réalise qu’elle a égaré son couteau d’ivoire. Elle le cherche pendant quelques instants avec une frustration visible ; vous êtes sur le point de lui proposer votre aide lorsqu’elle le retrouve enfin, planté à hauteur d’yeux dans le tronc d’un palmier voisin.</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const choices = [
        {
          "text": `Vous demandez à boire un peu de vin de palme.`,
          "action": "soft-drink",
        },
        {
          "text": `Vous demandez à essayer l’alcool fort.`,
          "action": () => {
            acquireItem("alcohol", updateFlag);
            return "hard-drink";
          },
        },
        {
          "text": `Vous prenez congé pour aller explorer le reste de l’île.`,
          "action": () => {
            updateFlag("time", flags.time+1);
            return "outside-the-village";
          },
        },
        {
          "text": `Vous prenez congé et regagnez votre pirogue.`,
          "action": "hub",
        },
      ];

      return repeatingCrossroad(goToSection, choices)
    },
  },
  "outside-the-village": {
    "text": `
<p>L’île fait une longueur non négligeable et, si la végétation n’est pas suffisamment dense pour ralentir votre allure, elle limite en revanche beaucoup votre champ de vision. Vous ne tardez pas à réaliser qu’explorer l’île en détail vous prendrait la moitié de la journée. Vous persévérez néanmoins un certain temps, mais ne découvrez rien d’intéressant. C’est à peine si vous remarquez quelques signes rappelant qu’un village se trouve tout près. La tribu ne se livre apparemment à aucune sorte de culture et on peut tout juste deviner çà et là qu’un arbre a été abattu à coups de hache.</p>
    `,
    "next": function(goToSection) {
      const text = `Lassée, vous bifurquez pour atteindre la plage et vous hâtez ensuite de regagner votre pirogue.`;
      const action = "hub";

      return repeatingFunnel(goToSection, text, action);
    }
  },
  "soft-drink": {
    "text": `
<p>Terani vous fait goûter un peu de la sève recueillie la veille. La liqueur blanchâtre a un goût légèrement sucré que vous trouvez agréable. Vous remerciez poliment les deux récolteurs avant de prendre congé.</p>
    `,
    "next": exploreOrLeave,
  },
  "hard-drink": {
    "text": (flags) => {
      return `
<p>Terani fronce les sourcils lorsque vous présentez votre requête et vous devinez que cette boisson, dont la préparation demande davantage d’efforts, est d’une consommation plus réservée que le simple vin de palme. Vous vous attendez à ce qu’elle refuse, mais, après avoir échangé un regard avec Oramui, elle hausse les épaules et vous offre l’une des calebasses d’alcool fort.</p>

${itemAcquisitionFeedback(flags.inventory.alcohol.name)}

<div class="conversation">
<p>— Cela fait très vite tourner la tête, vous dit-elle. Il ne faut surtout pas que tu en boives avant d’avoir terminé ta course de ce soir contre Raiahui.</p>
</div>

<p>La recommandation fait sourire Oramui, mais il n’ajoute rien. Vous remerciez poliment les deux récolteurs avant de prendre congé.</p>
      `
    },
    "next": exploreOrLeave,
  }
};

export default village;
