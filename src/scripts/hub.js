import React from "react";
import Crossroads from "./../components/Crossroads.js";
import Funnel from "./../components/Funnel.js";
import {useItem} from "./helpers.js";

const getIslandNumber = function(island) {
  return island.match(/\w+\-(\d+)/)[1];
}

const computeTripTime = function(currentIsland, newIsland) {
  return Math.abs(getIslandNumber(currentIsland) - getIslandNumber(newIsland)) % 7 < 2 ? 1 : 2;
}

const moveToIsland = function(newIsland, goToSection, flags, updateFlag) {
  const newTime = flags.time + computeTripTime(flags.currentIsland, newIsland);
  updateFlag("time", flags.time+2);

  if (newTime > 10) {
    return goToSection("no-more-time-on-sea");
  }

  updateFlag("currentIsland", newIsland);
  updateFlag("visitedIslands", flags.visitedIslands.slice().concat([newIsland]));
  goToSection(newIsland);
}

const getIslands = function() {
  return [
    {
      "key": "island-2",
      "description": `La première des deux îles anonymes`,
    },
    {
      "key": "island-3",
      "description": `La seconde île anonyme`,
    },
    {
      "key": "island-4",
      "description": `La petite île excentrée`,
    },
    {
      "key": "island-5",
      "description": `L'étrange rocher`,
    },
    {
      "key": "island-6",
      "description": `L'île aux arbres`,
    },
    {
      "key": "island-7",
      "description": `La petite île à côté de l'île de l'épreuve`,
    },
    {
      "key": "island-8",
      "description": `L'île de l'épreuve`,
    },
  ];
}

const getIslandChoice = function(island, goToSection, flags, updateFlag) {
  return {
    "text": island.description,
    "onClick": () => {
      moveToIsland(island.key, goToSection, flags, updateFlag);
    },
  };
}

const getOtherChoices = function(goToSection, flags, updateFlag) {
  let otherChoices = [
    {
      "text": `Rentrer vous reposer au village`,
      "onClick": () => {
        goToSection("island-1");
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

  if (flags.talkedWithFaanarua && !flags.inventory.dolphin.acquired) {
    otherChoices.push({
      "text": `Aller chercher l'amulette`,
      "onClick": () => {
        moveToIsland("island-7", goToSection, flags, updateFlag);
      },
      "condition": `Faanarua`,
    });
  }

  return otherChoices;
}

const getIslandChoices = function(goToSection, flags, updateFlag) {
  const currentIsland = flags.currentIsland;
  const alreadyVisitedIslands = flags.visitedIslands;

  const islands = getIslands().filter(function(island) {
    return !alreadyVisitedIslands.includes(island.key);
  });

  const nearIslands = islands.filter(function(island) {
    return 1 === computeTripTime(currentIsland, island.key);
  });

  const farIslands = islands.filter(function(island) {
    return 2 === computeTripTime(currentIsland, island.key);
  });

  const nearText = `De là où vous êtes, vous êtes à proximité de :`;
  const nearChoices = nearIslands.map(function(island) {
    return getIslandChoice(island, goToSection, flags, updateFlag);
  });

  let farText = `Vous pouvez également couper court et vous rendre directement à l'une des îles plus éloignées.`;
  if (0 === nearChoices.length) {
    farText = `Vous avez déjà visité toutes les îles mitoyennes de celle-ci, mais avec quelques efforts supplémentaires, vous pouvez atteindre :`;
  }
  const farChoices = farIslands.map(function(island) {
    return getIslandChoice(island, goToSection, flags, updateFlag);
  });

  const otherText = `Vous pouvez également mettre en pause l'exploration et…`;
  const otherChoices = getOtherChoices(goToSection, flags, updateFlag);

  return (
    <div>
      {nearChoices.length > 0 && <Crossroads text={nearText} choices={nearChoices} />}
      {farChoices.length > 0 && <Crossroads text={farText} choices={farChoices} />}
      <Crossroads text={otherText} choices={otherChoices} />
    </div>
  );
};

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
      return getIslandChoices(goToSection, flags, updateFlag);
    }
  },
  //TODO Handle the time ran out on earth event
  "back-to-hub": {
    "text":`
<p>Vous rejoignez votre pirogue, et prenez quelques instants pour réfléchir à la direction dans laquelle vous allez la propulser.</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      return getIslandChoices(goToSection, flags, updateFlag);
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
      const action = () => {goToSection('island-1')};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "no-more-time-on-sea" : {
    "text": `
<p>Vous pagayez avec régularité vers votre nouvelle destination lorsqu'un bruit d'éclaboussures attire votre attention : la tête d'un jeune garçon de la tribu vient d'émerger de l'eau à une faible distance de votre pirogue.</p>

<div class="conversation">
<p>- Mananuiva ! vous crie-t-il. On m'a envoyé te chercher : la course va bientôt commencer.</p>
</div>

<p>Vous arrêtez votre embarcation et jetez un coup d'oeil à la position du soleil : vous n'avez guère fait attention au passage du temps, mais l'après-midi est en effet sur le point de se terminer.</p>

<p>Vous aidez le garçon — qui doit avoir quatre ou cinq ans de moins que vous — à se hisser à l'avant de la pirogue avant de diriger celle-ci vers l'île où réside la tribu. Une fois revenue sur la même plage dont vous êtes partie ce matin, vous laissez là votre embarcation.</p>
    `,
    "next": function(goToSection) {
      const text = `Vous suivez votre jeune guide vers l'endroit où doit débuter la course.`;
      const action = () => {goToSection('trial')};

      return (
        <Funnel text={text} action={action} />
      );
    }
  }
}

export default hub;
