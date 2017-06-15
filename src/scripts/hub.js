import React from "react";
import Crossroads from "./../components/Crossroads.js";
import Funnel from "./../components/Funnel.js";
import {useItem, acquireItem, endGame, repeatingFunnel, coatSentence} from "./helpers.js";
import atollMap from "./../images/map.jpg";
import { Image } from "react-bootstrap";

const timeLimit = 12;

const getIslandNumber = function(island) {
  return island.match(/\w+\-(\d+)/)[1];
}

const computeTripTime = function(currentIsland, newIsland) {
  return Math.abs(getIslandNumber(currentIsland) - getIslandNumber(newIsland)) % 7 < 2 ? 1 : 2;
}

const moveToIsland = function(newIsland, goToSection, flags, updateFlag) {
  let newTime = flags.time + computeTripTime(flags.currentIsland, newIsland);
  if (flags.damagedBoat) {
    newTime += 1;
  }

  updateFlag("time", newTime);

  if (newTime >= timeLimit) {
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
      "description": `Une île sans réel signe distinctif`,
      "path": "M95 415 C 20 430, 50 560, 145 555 S 140 395, 95 415",
      "harbor": {"x": 165, "y": 485},
      "textPosition": {"x": 180, "y": 475},
      "textAnchor": "left",
      "cross": [65, 430, 180, 540, 145, 425, 75, 540],
    },
    {
      "key": "island-3",
      "description": flags.toldAboutFaanaruaByVarenui? `L’île de Faanarua`: `Une autre île tout ce qu’il y a de plus banal`,
      "path": "M20 345 C 20 245, 125 245, 130 345 S 20 405, 20 345",
      "harbor": {"x": 120, "y": 340},
      "textPosition": {"x": 140, "y": 335},
      "textAnchor": "left",
      "cross": [30, 270, 125, 410, 125, 275, 25, 405],
    },
    {
      "key": "island-4",
      "description": `La petite île excentrée`,
      "path": "M50 205 C 50 150, 120 170, 125 205 S 50 260, 50 205",
      "harbor": {"x": 115, "y": 220},
      "textPosition": {"x": 135, "y": 215},
      "textAnchor": "left",
      "cross": [60, 175, 105, 235, 120, 175, 45, 235],
    },
    {
      "key": "island-5",
      "description": flags.toldAboutAtollByRaiahui? `L’île de la sorcière`: `L’étrange rocher`,
      "path": "M100 80 C 120 0, 210 0, 240 80 S 90 170, 100 80",
      "harbor": {"x": 160, "y": 140},
      "textPosition": {"x": 175, "y": 170},
      "textAnchor": "left",
      "cross": [120, 25, 225, 145, 235, 35, 115, 135],
    },
    {
      "key": "island-6",
      "description": (flags.toldAboutAtollByRaiahui || flags.toldAboutLazyOneByAriinea)? `L’île du Vieux Fainéant`: `L’île aux arbres`,
      "path": "M 360, 50 C 400,-35 640,100 630,145 620,175 580, 210 570, 200 575, 185 475, 115 390, 105 385, 110 355, 80 360, 50 Z",
      "harbor": {"x": 525, "y": 150},
      "textPosition": {"x": 490, "y": 165},
      "textAnchor": "right",
      "cross": [375, 15, 620, 190, 360, 90, 635, 120],
    },
    {
      "key": "island-7",
      "description": `La petite île à côté de l’île de l’épreuve`,
      "path": "M595 260 C 605 240, 625 210, 650 250 S 580 290, 595 260",
      "harbor": {"x": 605, "y": 265},
      "textPosition": {"x": 590, "y": 265},
      "textAnchor": "right",
      "cross": [605, 245, 640, 275, 645, 240, 605, 275],
    },
    {
      "key": "island-8",
      "description": `L’île de l’épreuve`,
      "path": "M575 430 C 580 380, 645 365, 650 430 S 575 480, 575 430",
      "harbor": {"x": 580, "y": 430},
      "textPosition": {"x": 560, "y": 430},
      "textAnchor": "right",
      "cross": [585, 405, 645, 450, 650, 405, 580, 450],
    },
  ];
}

const getIslandChoice = function(island, goToSection, flags, updateFlag) {
  return {
    "text": island.description+".",
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

const getIslandMap = (goToSection, flags, updateFlag) => {
  const alreadyVisitedText = ` (déjà visitée)`;

  const currentIsland = flags.visitedIslands.length > 0 ? flags.visitedIslands[flags.visitedIslands.length-1]: "island-1";

  const islands = getIslands(flags).concat([
    {
      "key": "island-1",
      "description": `Le village`,
      "path": "M 170, 555 C 220, 520 290, 600 330, 580 400, 570 530, 490 540, 475 555, 460 625, 510 615, 520 575, 635 240, 715 150, 620 150, 622 170, 555 170, 555 Z",
      "harbor": {"x": 325, "y": 585},
      "textPosition": {"x": 370, "y": 615},
      "textAnchor": "middle",
    },
  ]).map((island) => {
    const disabled = flags.visitedIslands.includes(island.key);
    const current = island.key === currentIsland;

    const onClick = () => {
      if (disabled) {
        return;
      }

      moveToIsland(island.key, goToSection, flags, updateFlag);
    };

    return Object.assign(
      {},
      island,
      {
        "description": island.description + (disabled ? alreadyVisitedText : ""),
        "current": current,
        "disabled": disabled,
        "onClick": onClick,
      },
    );
  });

  return (
    <div>
      <Image src={atollMap} className="center-block visible-xs visible-xm" responsive />
      <svg
        id="atoll-map"
        width="720" height="720"
        className="center-block hidden-xs hidden-xm"
        xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <image xlinkHref={atollMap} x="0" y="0" height="720" width="720"/>
        {islands.map((island) => {
          let className = "island";
          if (island.current) {
            className += " current";
          }
          if (island.disabled) {
            className += " disabled";
          }

          return (
            <g key={island.key} className={className}>
              <path d={island.path} className="shape" onClick={island.onClick} />
              <text x={island.textPosition.x} y={island.textPosition.y} className={`lead text-anchor-${island.textAnchor}`}>{island.description}</text>
              {island.current && <text x={island.harbor.x} y={island.harbor.y} className="here">{`⚓`}</text>}
              {island.disabled && island.cross && <g className="crossed">
                <line x1={island.cross[0]} y1={island.cross[1]} x2={island.cross[2]} y2={island.cross[3]} />
                <line x1={island.cross[4]} y1={island.cross[5]} x2={island.cross[6]} y2={island.cross[7]} />
              </g>}
            </g>
          );
        })}
      </svg>
    </div>
  );
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
      {getIslandMap(goToSection, flags, updateFlag)}
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
    case 2:
      return `Le soleil est encore bas, la journée ne fait que commencer.`;
    case 3:
    case 4:
    case 5:
      return `Le soleil poursuit sa route, allant tranquillement vers le milieu de la journée.`;
    case 6:
    case 7:
      return `Le soleil est presque à son zénith.`;
    case 8:
    case 9:
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

<p>L’île juste à côté est similaire, à peine plus grande, mais a cela de notable qu’elle servira de point d’arrivée à la course qui vous opposera à Raiahui.</p>

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

      if (flags.time < timeLimit) {
        text += `<p class="text-info">${timeDescription(flags.time)}</p>`;
      }

      return text;
    },
    "next": function(goToSection, flags, updateFlag) {
      if (flags.time >= timeLimit) {
        const text = `Mais quelqu’un a déjà fait ce choix pour vous.`;
        const action = () => {
          if (flags.visitedIslands.length > 0 && "island-6" === flags.visitedIslands[flags.visitedIslands.length-1]) {
            updateFlag("aVillagerOnCrocodileIsland", true);
          }
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

<p>Vous aidez le garçon — qui transporte avec lui son couteau d’ivoire incurvé — à se hisser à l’avant de la pirogue, puis vous dirigez celle-ci vers l’île où réside la tribu.</p>
    `,
    "next": function(goToSection) {
      const text = `Une fois revenue sur la même plage dont vous êtes partie ce matin, vous laissez là votre embarcation et suivez votre jeune guide vers l’endroit où doit débuter la course.`;
      const action = "trial";

      return repeatingFunnel(goToSection, text, action);
    }
  },
  "no-more-time-on-land" : {
    "text": `
<p>Une surprise vous attend lorsque vous regagnez votre pirogue : la tête d’un jeune garçon de la tribu émerge de l’eau à une faible distance.</p>

<div class="conversation">
<p>— Mananuiva ! vous crie-t-il. On m’a envoyé te chercher : la course va bientôt commencer.</p>
</div>

<p>Vous jetez un coup d’œil à la position du soleil : vous n’avez guère fait attention au passage du temps, mais l’après-midi est en effet sur le point de se terminer.</p>

<p>Vous prenez place à bord de la pirogue et dites au garçon — qui n’a rien d’autre avec lui que son couteau d’ivoire incurvé — de s’installer à l’avant. Plongeant ensuite votre pagaie dans l’eau, vous prenez la direction de l’île où réside la tribu.</p>
    `,
    "next": function(goToSection) {
      const text = `Une fois revenue sur la même plage dont vous êtes partie ce matin, vous laissez là votre embarcation et suivez votre jeune guide vers l’endroit où doit débuter la course.`;
      const action = "trial";

      return repeatingFunnel(goToSection, text, action);
    }
  },
  "exit": {
    "text": `
<p>Vous engagez votre pirogue dans l’une des passes séparant les îles de l’atoll les unes des autres. Vous gardez un œil attentif en-dessous de vous, guettant les récifs de corail qui pourraient affleurer juste en-dessous des vagues, mais aucun problème ne se présente et vous avez bientôt quitté le lagon pour rejoindre l’océan, où les vagues sont un peu plus haute et la brise un peu plus vive.</p>

<p>La vision qu’on a de l’atoll est beaucoup plus limitée depuis l’extérieur que depuis l’intérieur et vous n’observez rien de neuf.</p>

<p>À cette frontière entre ce minuscule univers qu’est l’archipel et le véritable monde dans son immensité, vous hésitez.</p>
    `,
    "next": function (goToSection, flags, updateFlag) {
      const backText = `Vous regagnez le lagon pour choisir une nouvelle destination.`;

      const choices = [
        {
          "text": backText,
          "action": () => {
            const extraLog = coatSentence(backText);

            if (flags.time >= timeLimit) {
              return goToSection("no-more-time-at-sea", extraLog);
            }

            goToSection("back-to-hub", extraLog);
          },
        },
        {
          "text": `Vous décidez de renoncer à la course et de quitter l’atoll.`,
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
        if (!flags.drunk && flags.time <= 9) {
          updateFlag("wellRested", true);
        }
        if (flags.drunk && flags.time <= 8) {
          updateFlag("drunk", false);
          updateFlag("refreshed", true);
        }

        goToSection("rest");
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "rest": {
    "text": (flags) => {
      let statusComment = `<p class="text-info">Vous auriez bien dormi quelques instants de plus.</p>`;

      if (flags.drunk) {
        statusComment = `<p class="text-info">Ce court repos n’aura malheureusement pas réussi à contrebalancer votre récent excès. Vous vous sentez encore faible, et ne pouvez plus qu’espérer que l’excitation de la course et les claques de l’eau salée contre votre visage seront suffisantes pour vous remettre d’aplomb.</p>`;
      }

      if (flags.refreshed) {
        statusComment = `<p class="text-info">La nausée induite par votre consommation enthousiaste d’alcool s’est dissipée. Vous êtes prête.</p>`;
      }

      if (flags.wellRested) {
        statusComment = `<p class="text-info">Cette bonne sieste vous a remis d’aplomb. Vous vous sentez en pleine forme, prête à en découdre.</p>`;
      }

      return `
<p>Le soleil a fortement décliné lorsqu’un jeune garçon vient vous tirer en vous secouant de la somnolence où vous aviez glissé.</p>

<div class="conversation">
<p>— Mananuiva, il faut que tu viennes, la course va commencer !</p>
</div>

<p>Rouvrant les yeux, vous quittez le hamac avec un peu de regret et vous étirez quelques instants.</p>

${statusComment}
      `;
    },
    "next": (goToSection) => {
      const text = `Vous emboîtez le pas à votre jeune guide.`;
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
