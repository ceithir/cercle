import React from "react";
import Crossroads from "./../components/Crossroads.js";
import Funnel from "./../components/Funnel.js";
import {useItem, acquireItem, endGame} from "./helpers.js";

const getIslandNumber = function(island) {
  return island.match(/\w+\-(\d+)/)[1];
}

const computeTripTime = function(currentIsland, newIsland) {
  return Math.abs(getIslandNumber(currentIsland) - getIslandNumber(newIsland)) % 7 < 2 ? 1 : 2;
}

const moveToIsland = function(newIsland, goToSection, flags, updateFlag) {
  let newTime = flags.time + computeTripTime(flags.currentIsland, newIsland);
  if (flags.feeble) {
    newTime += 1;
    updateFlag("feeble", false);
  }
  if (flags.damagedBoat) {
    newTime += 1;
  }

  updateFlag("time", newTime);

  if (newTime > 10) {
    return goToSection("no-more-time-at-sea");
  }

  updateFlag("currentIsland", newIsland);
  updateFlag("visitedIslands", flags.visitedIslands.slice().concat([newIsland]));
  goToSection(newIsland);
}

const getIslands = function(flags) {
  return [
    {
      "key": "island-2",
      "description": `Une île sans réel signe distinctif.`,
    },
    {
      "key": "island-3",
      "description": flags.toldAboutFaanaruaByVarenui ? `L’île de Faanarua.` : `Une autre île tout ce qu’il y a de plus banal.`,
    },
    {
      "key": "island-4",
      "description": `La petite île excentrée.`,
    },
    {
      "key": "island-5",
      "description": flags.toldAboutAtollByRaiahui ? `L’île de la sorcière.` : `L’étrange rocher.`,
    },
    {
      "key": "island-6",
      "description": flags.toldAboutAtollByRaiahui || flags.toldAboutLazyOneByAriinea ? `L’île du Vieux Fainéant.` : `L’île aux arbres.`,
    },
    {
      "key": "island-7",
      "description": `La petite île à côté de l’île de l’épreuve.`,
    },
    {
      "key": "island-8",
      "description": `L’île de l’épreuve.`,
    },
  ];
}

const getIslandChoice = function(island, goToSection, flags, updateFlag) {
  return {
    "text": island.description,
    "action": () => {
      moveToIsland(island.key, goToSection, flags, updateFlag);
    },
  };
}

const getOtherChoices = function(goToSection, flags, updateFlag) {
  let otherChoices = [
    {
      "text": `Rentrer vous reposer au village.`,
      "action": () => {
        goToSection("island-1");
      },
    },
    {
      "text": `Quitter le lagon.`,
      "action": () => {
        updateFlag("time", flags.time+1);
        goToSection("exit");
      },
    },
  ];

  const alcohol = flags.inventory.alcohol;
  if (alcohol.acquired && !alcohol.used) {
    otherChoices.push({
      "text": `Goûter le contenu de la calebasse.`,
      "action": () => {
        useItem("alcohol", updateFlag);
        updateFlag("drunk", true);
        updateFlag("time", flags.time+1);
        goToSection("drink");
      },
      "conditional": true,
    });
  }

  const pearls = flags.inventory.pearls;
  if (pearls.acquired && !pearls.used) {
    otherChoices.push({
      "text": `Examiner de plus près ces mystérieuses perles.`,
      "action": () => {
        useItem("pearls", updateFlag);
        acquireItem("smokePearls", updateFlag);
        goToSection("look-at-pearls");
      },
      "conditional": true,
    });
  }

  if (flags.talkedWithFaanarua && !flags.inventory.dolphin.acquired) {
    otherChoices.push({
      "text": `Aller chercher l’amulette dont Faanarua vous a parlé.`,
      "action": () => {
        moveToIsland("island-7", goToSection, flags, updateFlag);
      },
      "conditional": true,
    });
  }

  return otherChoices;
}

const getIslandChoices = function(goToSection, flags, updateFlag) {
  const currentIsland = flags.currentIsland;
  const alreadyVisitedIslands = flags.visitedIslands;

  const islands = getIslands(flags).filter(function(island) {
    return !alreadyVisitedIslands.includes(island.key);
  });

  const nearIslands = islands.filter(function(island) {
    return 1 === computeTripTime(currentIsland, island.key);
  });

  const farIslands = islands.filter(function(island) {
    return 2 === computeTripTime(currentIsland, island.key);
  });

  const nearText = `De là où vous êtes, vous êtes à proximité de :`;
  const nearChoices = nearIslands.map(function(island) {
    return getIslandChoice(island, goToSection, flags, updateFlag);
  });

  let farText = `Vous pouvez également couper court et vous rendre directement à l’une des îles plus éloignées.`;
  if (0 === nearChoices.length) {
    farText = `Vous avez déjà visité toutes les îles mitoyennes de celle-ci, mais avec quelques efforts supplémentaires, vous pouvez atteindre :`;
  }
  const farChoices = farIslands.map(function(island) {
    return getIslandChoice(island, goToSection, flags, updateFlag);
  });

  const otherText = `Vous pouvez également mettre en pause l’exploration et…`;
  const otherChoices = getOtherChoices(goToSection, flags, updateFlag);

  return (
    <div>
      {nearChoices.length > 0 && <Crossroads context={nearText} choices={nearChoices} />}
      {farChoices.length > 0 && <Crossroads context={farText} choices={farChoices} />}
      <Crossroads context={otherText} choices={otherChoices} />
    </div>
  );
};

const timeDescription = (time) => {
  switch(time) {
    case 0:
    case 1:
      return `Le soleil est encore bas, la journée ne fait que commencer.`;
    case 2:
    case 3:
      return `Le soleil poursuit sa route, allant tranquillement vers le milieu de la journée.`;
    case 4:
    case 5:
      return `Le soleil est presque à son zénith.`;
    case 6:
    case 7:
      return `Le soleil est encore resplendissant, mais a entamé sa redescente.`;
    default:
      return `Le soleil glisse peu à peu vers l’horizon, la soirée approche.`;
  }
}

const hub = {
  "hub": {
    "text": (flags) => {
      let faanaruaIsland = ``;
      if (flags.toldAboutFaanaruaByVarenui) {
        faanaruaIsland += `<p class="text-info">Ce serait là que se serait installée Faanarua, la seule membre de cette communauté à avoir exploré plus que superficiellement le monde extérieur.`;
        if (flags.toldAboutFaanaruaByRaiahui) {
          faanaruaIsland += ` Raiahui vous a également parlé d’elle, la décrivant comme une grande chasseuse et conteuse.`
        }
        faanaruaIsland += `</p>`;
      }

      let witchIslandDescription = `<p>La première est curieusement différente des autres : loin d’être une étendue lisse et basse, elle émerge des flots comme un large rocher.`;
      if (flags.toldAboutAtollByRaiahui) {
        witchIslandDescription += ` <span class="text-info">Raiahui vous l’a décrite comme étant habitée par une sorcière.</span>`;
      }
      witchIslandDescription += `</p>`;

      let crocodileIslandDescription = `<p>La seconde est plus ordinaire en apparence, avec comme seule particularité visible à cette distance d’être couverte d’un enchevêtrement de grands arbres.`;
      if (flags.toldAboutAtollByRaiahui) {
        crocodileIslandDescription += ` <span class="text-info">Raiahui vous a précisé qu’il s’agissait de la résidence du peu accueillant « Vieux Fainéant ».</span>`;
        if (flags.toldAboutLazyOneByAriinea) {
            crocodileIslandDescription += ` <span class="text-info">Ariinea et son amie vous ont dit peu ou prou la même chose, insistant sur la dangerosité de cette mystérieuse personne.</span>`;
        }
      } else {
        if (flags.toldAboutLazyOneByAriinea) {
          crocodileIslandDescription += ` <span class="text-info">C’est probablement là que réside le « Vieux Fainéant » dont Ariinea vous a parlé. Et dont son amie vous a également fortement déconseillé d’approcher, le considérant réellement dangereux.</span>`;
        }
      }
      crocodileIslandDescription += `</p>`;

      return `
<p>Debout aux côtés de votre pirogue, vous analysez la situation.</p>

<p>L’atoll compte en tout huit îles de tailles variées.</p>

<p>Celle sur laquelle vous vous trouvez, et où se trouve le village, est à l’extrémité sud. C’est clairement la plus grande de l’atoll ; sa forme mince et courbe fait penser à un arc.</p>

<p>En tournant sur vous-même dans le sens des aiguilles d’une montre (un objet que vous n’avez jamais eu sous les yeux, mais dont vous avez vaguement entendu parler) se dévoilent deux îles en apparence, assez similaires : de taille moyenne et couvertes de nombreux palmiers.</p>

${faanaruaIsland}

<p>Puis vient au nord-ouest une île nettement plus petite et à la végétation moins élevée.</p>

<p>Se profilent ensuite les deux îles que Raiahui vous a explicitement déconseillé d’approcher.</p>

${witchIslandDescription}

${crocodileIslandDescription}

<p>Ensuite, quelque part entre l’est et le nord-est, existe une île qui n’est en réalité qu’une minuscule étendue de sable clair.</p>

<p>L'île juste à côté est similaire, à peine plus grande, mais a cela de notable qu'elle servira de point d’arrivée à la course qui vous opposera à Raiahui.</p>

<p>La surface du lagon n’est agitée que de minuscules vagues, ce qui vous promet une navigation plus aisée que ce à quoi vous êtes habituée. Vous pourriez sans doute en faire le tour, peut-être pas de toutes mais de la majorité, et revenir dans à temps pour l’épreuve à laquelle vous avez été conviée.</p>
      `;
    },
    "next": function(goToSection, flags, updateFlag) {
      return getIslandChoices(goToSection, flags, updateFlag);
    }
  },
  "back-to-hub": {
    "text": (flags) => {
      let text =`
<p>Vous rejoignez votre pirogue, et prenez quelques instants pour réfléchir à la direction dans laquelle vous allez la propulser.</p>
      `;

      if (flags.time < 10) {
        text += `<p class="text-info">${timeDescription(flags.time)}</p>`;
      }

      return text;
    },
    "next": function(goToSection, flags, updateFlag) {
      if (flags.time >= 10) {
        const text = `Mais quelqu’un a déjà fait ce choix pour vous.`;
        const action = () => {
          goToSection("no-more-time-on-land");
        }

        return (
          <Funnel text={text} action={action} />
        );
      }

      return getIslandChoices(goToSection, flags, updateFlag);
    }
  },
  "drink": {
    "text": `
<p>Vous débouchez la calebasse et une odeur puissante vous emplit aussitôt les narines. Vous ne buvez d’abord qu’une gorgée prudente, qui vous brûle malgré tout quelque peu le palais. Le goût âpre et intense ne ressemble à aucune des boissons que vous connaissez. Après quelques gorgées, vous commencez cependant à vous y habituer et à le trouver agréable. Vous avez bientôt vidé le contenu entier de la calebasse.</p>

<p>Vous ne consommez que rarement de l’alcool et vous n’avez aucune expérience des effets d’une boisson aussi forte. Mais vous êtes sur le point de les découvrir d’une façon fort brutale : votre sens de l’équilibre se dissout dans un vacillement incontrôlable, les couleurs de ce qui vous entoure se fondent et une pression terrible semble vouloir faire éclater les parois de votre crâne.</p>

<p>Nauséeuse, à la fois brûlante et glacée, vous n’avez plus la moindre envie de poursuivre votre exploration de l’atoll. Tout ce que vous désirez, c’est retourner au village vous allonger.</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const text = `Poussée par cette pensée, vous pagayez pâteusement.`;
      const action = () => {
        moveToIsland("island-1", goToSection, flags, updateFlag);
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "no-more-time-at-sea" : {
    "text": `
<p>Vous pagayez avec régularité vers votre nouvelle destination lorsqu’un bruit d’éclaboussures attire votre attention : la tête d’un jeune garçon de la tribu vient d’émerger de l’eau à une faible distance de votre pirogue.</p>

<div class="conversation">
<p>— Mananuiva ! vous crie-t-il. On m’a envoyé te chercher : la course va bientôt commencer.</p>
</div>

<p>Vous arrêtez votre embarcation et jetez un coup d’œil à la position du soleil : vous n’avez guère fait attention au passage du temps, mais l’après-midi est en effet sur le point de se terminer.</p>

<p>Vous aidez le garçon — qui doit avoir quatre ou cinq ans de moins que vous — à se hisser à l’avant de la pirogue avant de diriger celle-ci vers l’île où réside la tribu. Une fois revenue sur la même plage dont vous êtes partie ce matin, vous laissez là votre embarcation.</p>
    `,
    "next": function(goToSection) {
      const text = `Vous suivez votre jeune guide vers l’endroit où doit débuter la course.`;
      const action = () => {goToSection("trial")};

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "no-more-time-on-land" : {
    "text": `
<p>Une surprise vous attend lorsque vous regagnez votre pirogue : la tête d’un jeune garçon de la tribu émerge de l’eau à une faible distance.</p>

<div class="conversation">
<p>— Mananuiva ! vous crie-t-il. On m’a envoyé te chercher : la course va bientôt commencer.</p>
</div>

<p>Vous jetez un coup d’œil à la position du soleil : vous n’avez guère fait attention au passage du temps, mais l’après-midi est en effet sur le point de se terminer.</p>

<p>Vous prenez place à bord de la pirogue et dites au garçon — qui doit avoir quatre ou cinq ans de moins que vous — de s’installer à l’avant. Plongeant ensuite votre pagaie dans l’eau, vous prenez la direction de l’île où réside la tribu. Une fois revenue sur la même plage dont vous êtes partie ce matin, vous laissez là votre embarcation.</p>
    `,
    "next": function(goToSection) {
      const text = `Vous suivez votre jeune guide vers l’endroit où doit débuter la course.`;
      const action = () => {goToSection("trial")};

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "exit": {
    "text": `
<p>Vous engagez votre pirogue dans l’une des passes séparant les îles de l’atoll les unes des autres. Vous gardez un œil attentif en-dessous de vous, guettant les récifs de corail qui pourraient affleurer juste en-dessous des vagues, mais aucun problème ne se présente et vous avez bientôt quitté le lagon pour rejoindre l’océan, où les vagues sont un peu plus haute et la brise un peu plus vive.</p>

<p>La vision qu’on a de l’atoll est beaucoup plus limitée depuis l’extérieur que depuis l’intérieur et vous n’observez rien de neuf.</p>

<p>À cette frontière entre ce minuscule univers qu’est l’archipel et le véritable monde dans son immensité, vous hésitez.</p>
    `,
    "next": function (goToSection, flags, updateFlag) {
      const choices = [
        {
          "text": `Vous retournez dans le lagon.`,
          "action": () => {
            if (flags.time >= 10) {
              return goToSection("no-more-time-at-sea");
            }

            goToSection("back-to-hub");
          },
        },
        {
          "text": `Vous laissez tomber la course et prenez le large.`,
          "action": () => {
            updateFlag("triedToFlee", true);
            goToSection("out-of-here");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "out-of-here": {
    "text": `
<p>Vous vous éloignez de l’atoll à coups de pagaie réguliers, les yeux dirigés vers l’horizon. Vous ne pensez déjà plus qu’aux prochaines îles que vous visiterez. Vous vous sentez certaine que l’une d’elles vous mettra sur la piste de ce que vous recherchez.</p>

<p>Alors que vous êtes plongée dans vos pensées, un bruit d’éclaboussures se fait soudain entendre juste à côté de vous et une douleur effroyable vous transperce le bras. Vous êtes brutalement tirée hors de votre pirogue et dans l’eau, qui se referme au-dessus de votre tête.</p>

<p>Une fois cette explosion de mouvements passée, le calme revient très vite à la surface. Privée de l’impulsion que vous lui donniez à coups de pagaie, votre embarcation flotte avec désoeuvrement, insouciante. Autour d’elle, les reflets que le soleil fait palpiter sur les vagues prennent peu à peu la couleur du rubis.</p>
    `,
    "next": endGame,
  },
  "island-1": {
    "text": `
<p>Les abords du village sont plus animés que lorsque vous êtes partie, mais la différence reste modérée. Vous croisez plusieurs membres de la tribu, qui vous adressent des signes de tête, mais vous ne remarquez nulle part Raiahui.</p>

<p>Vous regagnez rapidement votre hamac — ou un autre qui lui ressemble — et vous y installez confortablement pour vous reposer.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Vous fermez les yeux juste un instant.`;
      const action = () => {
        if (!flags.drunk && flags.time <= 8) {
          updateFlag("wellRested", true);
        }
        if (flags.drunk && flags.time <= 6) {
          updateFlag("drunk", false);
        }

        goToSection("rest");
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "rest": {
    "text": `
<p>Le soleil a fortement décliné lorsqu’un jeune garçon vient vous tirer en vous secouant de la somnolence où vous aviez glissé.</p>

<div class="conversation">
<p>— Mananuiva, il faut que tu viennes, la course va commencer !</p>
</div>

<p>Rouvrant les yeux, vous quittez le hamac avec un peu de regret et vous étirez quelques instants.</p>
    `,
    "next": (goToSection) => {
      const text = `Enfin, vous emboîtez le pas à votre jeune guide.`;
      const action = () => {goToSection("trial")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "look-at-pearls": {
    "text": `
<p>Ces perles ne viennent pas d’un animal, en tout cas pas d’un animal que vous connaissez. Il vous suffit de les toucher pour vous en rendre compte. La sensation est différente, irrégulière, rugueuse, toute minérale. De plus elles s’effritent entre vos doigts en y laissant une pellicule de poussière d’un noir plus profond qu’une nuit sans lune.</p>

<p>Alors que vous plongez votre main dans l’eau pour la nettoyer, vous remarquez que l’eau change de couleur, s’obscurcissant énormément autour de vos phalanges. Il vous vient alors à l’idée d’immerger entièrement une de ces perles.</p>

<p>Sans grand effet tout d’abord. À peine quelques maigrichonnes fumerolles un peu plus foncées sans échappent. Vous la frottez un peu, et la fumée sous-marine gagne en épaisseur et en opacité. Vous finissez par l’écraser carrément, libérant une vaste nuage ne laissant pas passer la moindre particule de lumière.</p>

<p>Le faible courant du lagon ayant le plus grand mal à disperser le résultat de votre expérience, votre pirogue se trouve maintenant au centre d’une flaque d’ombre. Elle ne semble pas dangereuse, juste impénétrable.</p>

<p>Vous rangez prudemment les perles qu’il vous reste, certaines que vous trouverez bien une utilité à une si intéressante trouvaille.</p>
    `,
    "next": (goToSection) => {
      const text = `Pour l’heure, vous reportez votre attention vers la navigation.`;
      const action = () => {goToSection("back-to-hub")};

      return (
        <Funnel text={text} action={action} />
      );
    }
  }
}

export default hub;
