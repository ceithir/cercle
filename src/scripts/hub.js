import React from "react";
import Crossroads from "./../components/Crossroads.js";
import Funnel from "./../components/Funnel.js";
import {useItem} from "./helpers.js";

const hub = {
  "hub": {
    "text":`
<p>Debout aux côtés de votre pirogue, vous analysez la situation.</p>

<p>L'atoll compte en tout huit îles de tailles variées.</p>

<p>Celle sur laquelle vous vous trouvez, et où se trouve le village, est à l'extrémité sud. C'est clairement la plus grande de l'atoll ; sa forme mince et courbe fait penser à un arc.</p>

<p>En tournant sur vous-même dans le sens des aiguilles d'une montre ((un objet que vous n'avez jamais eu sous les yeux, mais dont vous avez vaguement entendu parler) se dévoilent deux îles en apparence, assez similaires : de taille moyenne et couvertes de nombreux palmiers.</p>

<p>Puis vient au nord-ouest une île nettement plus petite et à la végétation moins élevée.</p>

<p>L'île suivante est curieusement différente des autres : loin d'être une étendue lisse et basse, elle émerge des flots comme un large rocher.</p>

<p>En continuant votre tour, vous découvrez une île couverte d'un enchevêtrement de grands arbres.</p>

<p>Ensuite, quelque part entre l'est et le nord-est, existe une île qui n'est en réalité qu'une minuscule étendue de sable clair.</p>

<p>À ses côtés, une île similaire et à peine plus grande, qui est le point d'arrivée de la course qui vous opposera à Raiahui.</p>

<p>La surface du lagon n'est agitée que de minuscules vagues, ce qui vous promet une navigation plus aisée que ce à quoi vous êtes habituée. Vous pourriez sans doute en faire le tour, peut-être pas de toutes mais de la majorité, et revenir dans à temps pour l'épreuve à laquelle vous avez été conviée.</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const nearText = `De là où vous êtes, vous êtes à proximité de :`;
      const nearChoices = [
        {
          "text": `La première des deux îles anonymes`,
          "onClick": () => {
            updateFlag("time", flags.time+1);
            goToSection("island-2");
          },
        },
        {
          "text": `L'île de l'épreuve`,
          "onClick": () => {
            updateFlag("time", flags.time+1);
            goToSection("island-8");
          },
        },
      ];

      const farText = `Vous pouvez également couper court et vous rendre directement à l'une des îles plus éloignées.`;
      const farChoices = [
        {
          "text": `La seconde île anonyme`,
          "onClick": () => {
            updateFlag("time", flags.time+2);
            goToSection("island-3");
          },
        },
        {
          "text": `La petite île excentrée`,
          "onClick": () => {
            updateFlag("time", flags.time+2);
            goToSection("island-4");
          },
        },
        {
          "text": `L'étrange rocher'`,
          "onClick": () => {
            updateFlag("time", flags.time+2);
            goToSection("island-5");
          },
        },
        {
          "text": `L'île aux arbres'`,
          "onClick": () => {
            updateFlag("time", flags.time+2);
            goToSection("island-6");
          },
        },
        {
          "text": `La petite île à côté de l'île de l'épreuve`,
          "onClick": () => {
            updateFlag("time", flags.time+2);
            goToSection("island-7");
          },
        }
      ];

      const otherText = `Vous pouvez également mettre en pause l'exploration et…`;
      let otherChoices = [
        {
          "text": `Rentrer vous reposer au village`,
          "onClick": () => {
            goToSection("rest");
          },
        },
        {
          "text": `Quitter le lagon`,
          "onClick": () => {
            updateFlag("time", flags.time+1);
            goToSection("exit");
          },
        },
      ];

      const alcohol = flags.inventory.alcohol;
      if (alcohol.acquired && !alcohol.used) {
        otherChoices.push({
          "text": `Goûter le contenu de la calebasse`,
          "onClick": () => {
            useItem("alcohol", flags, updateFlag);
            updateFlag("drunk", true);
            goToSection("drink");
          },
          "condition": alcohol.name,
        });
      }

      return (
        <div>
          <Crossroads text={nearText} choices={nearChoices} />
          <Crossroads text={farText} choices={farChoices} />
          <Crossroads text={otherText} choices={otherChoices} />
        </div>
      );
    }
  },
  "drink": {
    "text": `
<p>Vous débouchez la calebasse et une odeur puissante vous emplit aussitôt les narines. Vous ne buvez d'abord qu'une gorgée prudente, qui vous brûle malgré tout quelque peu le palais. Le goût âpre et intense ne ressemble à aucune des boissons que vous connaissez. Après quelques gorgées, vous commencez cependant à vous y habituer et à le trouver agréable. Vous avez bientôt vidé le contenu entier de la calebasse.</p>

<p>Vous ne consommez que rarement de l'alcool et vous n'avez aucune expérience des effets d'une boisson aussi forte. Mais vous êtes sur le point de les découvrir d'une façon fort brutale : votre sens de l'équilibre se dissout dans un vacillement incontrôlable, les couleurs de ce qui vous entoure se fondent et une pression terrible semble vouloir faire éclater les parois de votre crâne.</p>

<p>Nauséeuse, à la fois brûlante et glacée, vous n'avez plus la moindre envie de poursuivre votre exploration de l'atoll. Tout ce que vous désirez, c'est retourner au village vous allonger.</p>
    `,
    "next": function(goToSection, flags) {
      //TODO If trip from current island to island would bring time to 10 or greater, interrupted by someone
      const text = `Poussée par cette pensée, vous pagayez pâteusement.`;
      const action = () => {goToSection('rest')};

      return (
        <Funnel text={text} action={action} />
      );
    },
  }
}

export default hub;
