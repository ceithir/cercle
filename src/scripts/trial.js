import React from "react";
import Crossroads from "./../components/Crossroads.js";
import Funnel from "./../components/Funnel.js";
import {endGame, trueEnd, useItem, acquireItem, repeatingFunnel, coatSentence} from "./helpers.js";
import squaleImage from "./../images/squale.jpg";

const cleanInventoryBeforeRace = (flags, updateFlag) => {
  useItem("alcohol", updateFlag);
  useItem("pearls", updateFlag);
  useItem("fruit", updateFlag);
  useItem("fieryCalabash", updateFlag);
}

const preludeChoices = (goToSection, flags, updateFlag) => {
  let choices = [];

  const fruit = flags.inventory.fruit;
  if (fruit.acquired && !fruit.used && !flags.tastedFruit) {
    choices.push({
      "text": `Vous goûtez à l’un des fruits rouges que vous avez cueillis sur l’île du crocodile.`,
      "action": () => {
        updateFlag("tastedFruit", true);
        goToSection("trial-eat-fruit");
      },
      "conditional": true,
    });
  }

  if (flags.tastedFruit && flags.examinedTrialCalabashes && !flags.inventory.fieryCalabash.acquired) {
    choices.push({
      "text": `Vous mélangez le jus des fruits rouges au contenu d’une calebasse.`,
      "action": () => {
        useItem("fruit", updateFlag);
        acquireItem("fieryCalabash", updateFlag);
        goToSection("trial-brew-fire");
      },
      "conditional": true,
    });
  }

  choices.push({
    "text": `Vous entamez la course dès maintenant, sans attendre.`,
    "action": () => {
      cleanInventoryBeforeRace(flags, updateFlag);
      updateFlag("eatenByRaiahui", true);
      goToSection("trial-surprise");
    },
  });

  if (!flags.talkedToPerfectlyUselessDrunkGirl) {
    choices.push({
      "text": `Vous interrogez quelqu’un pour obtenir des explications.`,
      "action": () => {
        updateFlag("talkedToPerfectlyUselessDrunkGirl", true);
        goToSection("trial-explanations");
      } ,
    });
  }

  if (!flags.examinedTrialCalabashes) {
    choices.push({
      "text": `Vous allez examiner l’une des nombreuses calebasses éparpillées ici et là.`,
      "action": () => {
        updateFlag("examinedTrialCalabashes", true);
        goToSection("trial-calabashes");
      },
    });
  }

  choices.push({
    "text": `Vous allez voir Raiahui.`,
    "action": () => {
      goToSection("trial-raiahui");
    } ,
  });

  return choices;
}

const preludeNext = (goToSection, flags, updateFlag) => {
  return (
    <Crossroads choices={preludeChoices(goToSection, flags, updateFlag)} />
  );
}

const trueStartFunnel = (text, goToSection, flags, updateFlag) => {
  const action = () => {
    cleanInventoryBeforeRace(flags, updateFlag);
    updateFlag("gotAHeadStart", true);
    return "the-trial-begins";
  };

  return repeatingFunnel(
    goToSection,
    text,
    action
  );
}

const savePointAction = (text, goToSection, flags, updateFlag) => {
  updateFlag("seenRaiahuiTrueForm", true);
  if (!flags.drunk) {
    updateFlag("flagsBeforeActualTrial", Object.assign({}, flags, {"seenRaiahuiTrueForm": true}));
  }
  return goToSection("trial-underwater", coatSentence(text));
}

const raiahuiGoodEndText = `
<p>La journée est à présent sur le point de toucher à son terme. La course est terminée depuis quelques instants déjà et sur l’île sablonneuse se déroule une cérémonie succincte, qu’aucune personne étrangère à la tribu n’est plus là pour observer.</p>

<div class="conversation">
<p>— Je te félicite, Raiahui, dit Ataroa. Tu as remporté l’épreuve et prouvé que tu étais digne de faire partie des adultes de la tribu.</p>
</div>

<p>Des bruits d’approbation parcourent les hommes et les femmes qui se trouvent là. Raiahui hoche la tête avec un mélange de respect, de fierté et de joie.</p>

<div class="conversation">
<p>— Cette épreuve t’a-t-elle appris quelque chose ? demande le chef.</p>
<p>— Elle m’a beaucoup appris.</p>
<p>— Je souhaite que tu n’oublies pas Mananuiva à l’avenir. Même si elle a participé à ce rite dans d’autres intentions, c’est grâce à elle que tu es désormais une adulte.</p>
<p>— Je ne l’oublierai pas.</p>
</div>

<p>Aucune autre parole n’est nécessaire. Un à un, les adultes qui assistaient à la cérémonie quittent l’île pour regagner le village. Il ne reste bientôt plus que Raiahui, que l’épreuve a laissé curieusement épuisée et pleine d’une humeur introspective. Avec une lenteur rêveuse, elle effleure du bout des doigts le contour de ses lèvres. Puis elle s’assied sur le sable encore chaud. Du côté du lagon, le soleil est en train de se coucher. Raiahui reste à le regarder jusqu’à ce que les derniers reflets ensanglantés aient disparu de la surface de l’eau.</p>
`;

const trial = {
  "trial": {
    "text": `
<p>À la suite du jeune garçon, vous arrivez sur la plage bordant l’extrémité de l’île, où toute la tribu est en train de s’assembler. Vous apercevez Raiahui en compagnie des adolescents de son âge, formant un groupe un peu à part du reste de la foule ; un large sourire se dessine sur son visage lorsque ses yeux se posent sur vous.</p>

<p>Le jour est en train de décliner, mais sa clarté reste suffisante pour donner à l’eau une grande transparence. Le fond de la passe — celle-là même que vous avez traversée hier pour pénétrer dans le lagon — est en partie recouvert de coraux que vous distinguez avec netteté. De l’autre côté se trouve l’île sablonneuse qui servira de point d’arrivée à votre course.</p>

<p>Les murmures qui parcouraient la foule s’éteignent lorsqu’Ataroa fait signe à Raiahui et à vous-même de vous tenir devant lui.</p>

<div class="conversation">
<p>— Vous connaissez toutes les deux les détails dont vous avez besoin, déclare-t-il sans que son visage rude ne manifeste aucune expression. Aucun membre de la tribu ne viendra interférer. La course commence dès maintenant.</p>
</div>

<p>Il ponctue cette déclaration laconique d’un hochement de tête, puis, sans rien ajouter, il quitte la plage pour retourner vers le village. Sous votre regard interloqué, l’essentiel de la tribu lui emboîte le pas.</p>
    `,
    "next": (goToSection) => {
      const text = `Il ne reste bientôt plus que vous-même, Raiahui et les autres adolescents.`;
      const action = () => {goToSection("trial-preparation");};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-preparation": {
    "text": (flags) => {
      let equipment = ``;

      const amulet = flags.inventory.dolphin;
      if (amulet.acquired && !amulet.used) {
        equipment += `<p class="text-conditional">Vous portez l’amulette en forme de dauphin autour de votre cou. Il est impossible de ne pas la voir, mais ni Raiahui ni sa cour ne semblent y accorder la moindre espèce d’attention.</p>`;
      }

      let items = ``;

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        items += `<p class="text-conditional">Vous avez en revanche enroulé le filet de la sorcière autour de votre taille, soupçonnant qu’il pourrait vous être très utile.</p>`;
      }

      const doll = flags.inventory.doll;
      if (doll.acquired && !doll.used) {
        items += `<p class="text-conditional">Vous avez en revanche attaché la figurine de bois à une lanière passée autour de votre taille, vous fiant à l’intuition qui vous souffle qu’elle pourrait vous être très utile.</p>`;
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        if (doll.acquired && !doll.used) {
          items += `<p class="text-conditional">Vous avez également glissé à ses côtés un petit sac de toile abritant les perles de la sorcière.`;
        } else {
          if (net.acquired && !net.used) {
            items += `<p class="text-conditional">Vous emportez également ses perles`;
          } else {
            items += `<p class="text-conditional">Vous emportez avec vous les perles de la sorcière`;
          }
          items += `, dans un petit sac de toile accroché à votre taille à l’aide d’une lanière.`;
        }
        items += `</p>`;
      }

      return `
<p>La course a-t-elle vraiment commencé ? L’ambiance qui vous entoure n’en donne pas l’impression. Les adolescents chahutent, rient et font circuler des calebasses remplies de vin de palme. Raiahui est au coeur de cette sorte de célébration anticipée, savourant visiblement l’attention dont elle est l’objet et ne vous accordant pas un regard.</p>

<p>Vous jetez un coup d’œil vers votre point d’arrivée. Il y a une certaine distance à parcourir, mais il ne s’agira pas d’une épreuve d’endurance : si vous partiez avec quelques instants d’avance, même un excellent nageur aurait peu de chances de vous rattraper.</p>

<p>Déstabilisée par l’étrangeté de la situation, vous vous raccrochez à des questions plus concrètes, vérifiant que vous êtes dans de bonnes conditions pour nager.</p>

${equipment}

<p>Vous commencez par vous débarasser de votre pagne, qui vous ralentirait inutilement.</p>

${items}

<p>Vous faites ensuite jouer vos articulations en un échauffement sommaire, plus pour rappeler à Raiahui que vous prenez cette épreuve au sérieux que par réel besoin physique.</p>
      `;
    },
    "next": preludeNext,
  },
  "trial-eat-fruit": {
    "text": `
<p>Espérant qu’il vous aidera dans votre course, comme vous l’a assuré le crocodile, vous goûtez au plus petit des fruits rouges… mais vos dents ont à peine entamé sa chair juteuse qu’une atroce sensation de brûlure enflamme toute votre gorge.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous recrachez le fruit aussitôt.`,
          "action": () => {
            updateFlag("boostedByFruit", true);
            goToSection("trial-spit-fruit");
          },
        },
        {
          "text": `Vous avalez le fruit malgré tout.`,
          "action": () => {
            if (flags.drunk) {
              updateFlag("refreshedByFruit", true);
              updateFlag("drunk", false);
              return goToSection("trial-swallow-fruit-drunk");
            }

            updateFlag("drunk", true);
            goToSection("trial-swallow-fruit");
          } ,
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "trial-spit-fruit": {
    "text": `
<p>Vous recrachez sans tarder le fruit sur le sable de la plage. La sensation de brûlure persiste et semble même se répandre dans le reste de votre corps, faisant naître de minuscules gouttes de sueur à la surface de votre peau.</p>

<p>Vous prenez des inspirations profondes et, après quelques instants, le phénomène se résorbe heureusement jusqu’à ne laisser qu’une vague impression de chaleur au creux de votre ventre.</p>

<p>Pas question de goûter à un autre de ces fruits !</p>
    `,
    "next": preludeNext,
  },
  "trial-swallow-fruit-drunk": {
    "text": `
<p>Avec une grimace, vous vous forcez à avaler le fruit rouge. L’espace d’un instant, vous n’éprouvez rien de plus que la sensation de brûlure qui subsiste dans votre gorge. Puis vos entrailles se tordent, des frémissements convulsifs parcourent votre peau et une sueur glacée naît sur votre front. Terrifiée, il vous vient la pensée que vous venez de vous empoisonner, trompée par le dernier mensonge du crocodile.</p>

<p>Tout aussi soudainement qu’il était apparu, le malaise se dissipe. Quelques tremblements vous agitent encore, mais ils ne sont plus dûs qu’à un reste de peur. Vous ne vous sentez pas plus mal qu’auparavant. Au contraire, vous réalisez que la migraine nauséeuse qui vous tourmentait depuis que vous avez eu l’imprudence de boire la calebasse d’alcool fort s’est dissipée !</p>

<p>Vous jugez néanmoins imprudent de consommer davantage qu’un seul de ces fruits.</p>
    `,
    "next": preludeNext,
  },
  "trial-swallow-fruit": {
    "text": `
<p>Avec une grimace, vous vous forcez à avaler le fruit rouge. L’espace d’un instant, vous n’éprouvez rien de plus que la sensation de brûlure qui subsiste dans votre gorge. Puis vos entrailles se tordent, des frémissements convulsifs parcourent votre peau et une sueur glacée naît sur votre front. Terrifiée, il vous vient la pensée que vous venez de vous empoisonner, trompée par le dernier mensonge du crocodile.</p>

<p>Après quelques instants de panique, le malaise se résorbe heureusement peu à peu. Mais c’est de façon incomplète : un vertige insistant rend instable le sol sous vos pas et des accès de nausée vous donnent périodiquement l’impression que vous êtes sur le point de vomir.</p>

<p>Il n’y a rien à faire, sinon maudire la perfidie irrationnelle du reptile géant. Vous allez devoir faire preuve de volonté et de ressource pour arracher la victoire dans cette course en dépit de votre état.</p>

<p>Il est bien entendu hors de question de goûter à un autre de ces maudits fruits !</p>
    `,
    "next": preludeNext,
  },
  "trial-surprise": {
    "text": `
<p>Vous ne saisissez pas clairement les raisons du comportement de Raiahui, mais la chose la plus sensée à faire vous semble être de saisir l’occasion. Vous assurant que personne ne vous prête attention, vous vous approchez de la rive et vous immergez aussi silencieusement que possible dans les eaux tièdes de la passe. Quelques brasses vigoureuses sous la surface vous propulsent en direction de l’île sablonneuse. Lorsque vous refaites surface, un rapide regard en arrière vous apprend que Raiahui se tient toujours sur la plage, entourée des autres adolescents. Elle ne semble pas avoir remarqué votre départ.</p>

<p>Vous avez déjà accompli le quart du trajet lorsque des exclamations excitées vous parviennent aux oreilles depuis la plage. Votre concurrente vient sans doute enfin d’entamer la course à son tour. Vous vous contentez d’accélérer légèrement le rythme de vos mouvements. Quand bien même Raiahui serait vraiment meilleure nageuse que vous-même, il vous suffit de ne pas épuiser vos forces trop vite pour que votre avance vous garantisse virtuellement la victoire.</p>

<p>Et pourtant, une inquiétude irrationnelle s’est insinuée en vous. Vous jetez de manière espacée quelques coups d’œil furtifs en arrière, mais ils ne vous permettent pas d’apercevoir où se trouve Raiahui, comme si elle nageait sans jamais remonter à la surface. Saisie tout à coup d’une peur sans motif apparent, vous hâtez la cadence de votre nage plus tôt que vous n’en aviez l’intention, alors que vous n’avez pas tout à fait accompli la moitié du trajet. Mais le pressentiment glaçant qui ne cesse de grandir dans votre esprit vous dit que cela ne change rien.</p>

<p>Il vous semble désormais, à chaque nouveau mouvement de vos membres, que le point d’arrivée s’éloigne un peu plus et que se rapproche inexorablement quelque chose d’horrible.</p>

<hr/>` + raiahuiGoodEndText,
    "next": endGame,
  },
  "trial-explanations": {
    "text": `
<p>Vous saisissez par le bras une adolescente en train de boire du vin de palme non loin de vous.</p>

<div class="conversation">
<p>— Qu’est-ce qui se passe ? demandez-vous à savoir. Si la course a bien commencé, pourquoi est-ce que nous ne partons pas toutes les deux ? Est-ce qu’il faut attendre quelque chose ?</p>
</div>

<p>La fille glousse. À en juger par l’expression hilare qui est peinte sur son visage, la calebasse qu’elle tient doit déjà être assez vide.</p>

<div class="conversation">
<p>— Ne t’en fais pas, ne t’en fais pas, dit-elle en vous donnant une tape maladroite sur l’épaule. Raiahui va partir, mais tu n’as pas besoin de l’attendre. Prendre un peu d’avance, ça peut être utile !</p>
</div>

<p>Vous n’en tirez rien d’autre.</p>
    `,
    "next": preludeNext,
  },
  "trial-raiahui": {
    "text": `
<p>Raiahui est le centre rayonnant d’un cercle d’adolescents, dont la conversation gaie est ponctuée de rires fréquents.</p>

<div class="conversation">
<p>— Mananuiva ! s’exclame-t-elle en vous apercevant. Je pensais que tu étais déjà partie. Ne m’attends pas : je bois juste un peu et je te rejoins !</p>
</div>

<p>Les autres adolescents vous regardent d’un air amusé, mais ne disent rien. Une calebasse vide gît déjà aux pieds de Raiahui.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [
        {
          "text": `Vous suivez son conseil et entamez immédiatement la course.`,
          "action": () => {
            cleanInventoryBeforeRace(flags, updateFlag);
            updateFlag("eatenByRaiahui", true);
            goToSection("trial-surprise-alt");
          },
        },
        {
          "text": `Vous la provoquez pour qu’elle parte en même temps que vous.`,
          "action": () => {
            cleanInventoryBeforeRace(flags, updateFlag);
            updateFlag("eatenByRaiahui", true);
            goToSection("trial-fair");
          },
        },
        {
          "text": `Vous restez quelques instants en sa compagnie.`,
          "action": () => {
            goToSection("trial-raiahui-slow");
          },
        },
        {
          "text": `Vous essayez de dérober le couteau en ivoire que vous voyez accroché à son pagne.`,
          "action": () => {
            goToSection("trial-knife");
          },
        },
      ];

      const alcohol = flags.inventory.alcohol;
      if (alcohol.acquired && !alcohol.used) {
        choices.push({
          "text": `Vous lui offrez votre propre calebasse d’alcool fort.`,
          "action": () => {
            useItem("alcohol", updateFlag);
            goToSection("raiahui-drunk");
          },
          "conditional": true,
        });
      }

      const calabash = flags.inventory.fieryCalabash;
      if (calabash.acquired && !calabash.used) {
        choices.push({
          "text": `Vous lui offrez la calebasse à laquelle vous avez mélangé le jus des fruits rouges.`,
          "action": () => {
            useItem("fieryCalabash", updateFlag);
            goToSection("raiahui-poisoned");
          },
          "conditional": true,
        });
      }

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "trial-surprise-alt": {
    "text": `
<p>Vous ne saisissez pas bien les raisons du comportement de Raiahui, mais la chose la plus sensée à faire vous semble être de saisir effectivement l’occasion. Vous vous dirigez à grands pas vers la rive et plongez sans attendre dans les eaux tièdes de la passe. Quelques brasses vigoureuses sous la surface vous propulsent en direction de l’île sablonneuse. Lorsque vous refaites surface, un rapide regard en arrière vous apprend que Raiahui se tient toujours sur la plage, entourée des autres adolescents. Elle ne semble même pas regarder dans votre direction.</p>

<p>Vous avez déjà accompli le quart du trajet lorsque des exclamations excitées vous parviennent aux oreilles depuis la plage. Votre concurrente vient sans doute enfin de se lancer à votre poursuite. Vous vous contentez d’accélérer légèrement le rythme de vos mouvements. Quand bien même Raiahui serait vraiment meilleure nageuse que vous-même, il vous suffit de ne pas épuiser vos forces trop vite pour que votre avance vous garantisse virtuellement la victoire.</p>

<p>Et pourtant, une inquiétude irrationnelle s’est insinuée en vous. Vous jetez de manière espacée quelques coups d’œil furtifs en arrière, mais ils ne vous permettent pas d’apercevoir où se trouve Raiahui, comme si elle nageait sans jamais remonter à la surface. Saisie tout à coup d’une peur sans motif apparent, vous hâtez la cadence de votre nage plus tôt que vous n’en aviez l’intention, alors que vous n’avez pas tout à fait accompli la moitié du trajet. Mais le pressentiment glaçant qui ne cesse de grandir dans votre esprit vous dit que cela ne change rien.</p>

<p>Il vous semble désormais, à chaque nouveau mouvement de vos membres, que le point d’arrivée s’éloigne un peu plus et que se rapproche inexorablement quelque chose d’horrible.</p>

<hr/>
    ` + raiahuiGoodEndText,
    "next": endGame,
  },
  "trial-fair": {
    "text": `
<div class="conversation">
<p>— Pour quelqu’un qui s’attend à devenir adulte aujourd’hui, tu as vraiment un comportement de gamine ! Je ne suis pas là pour te faire rire ! Si tu ne débutes pas cette course tout de suite, en même temps que moi, je renonce à participer à ton rite de passage et tu pourras attendre la venue du prochain étranger !</p>
</div>

<p>Une expression à la fois alarmée et vexée passe sur le visage de Raiahui. Elle regarde les adolescents qui l’entourent comme si elle en espérait un conseil, puis hausse finalement les épaules.</p>

<div class="conversation">
<p>— Comme tu veux, mais c’est tant pis pour toi.</p>
</div>

<p>Vous descendez ensemble vers la rive, suivies de toute la jeune assistance, que la scène semble beaucoup amuser. Des plaisanteries s’échangent autour de vous, mais vous n’y prêtez guère attention. Votre adversaire affiche quant à elle une désinvolture ostensible et vous la voyez même prendre quelques gorgées d’alcool supplémentaires au goulot d’une calebasse.</p>

<p>Les eaux tièdes de la passe se referment en même temps sur vous deux, mais quelques brasses vigoureuses vous permettent de passer devant Raiahui. Vous savez que la distance à franchir va vous imposer d’économiser vos forces, mais le fait de se retrouver d’entrée de jeu derrière vous devrait ébranler la confiance en elle-même de votre concurrente.</p>

<p>Votre tête émerge finalement à la surface et vous êtes alors presque assourdie par la cacophonie de cris des adolescents restés sur la plage. Raiahui est toujours sous l’eau, mais vous ne perdez pas un instant à essayer de déterminer sa position exacte. A présent que la course a commencé, l’habitude vous fait faire abstraction de tout ce qui est extérieur à vos mouvements de nage.</p>

<p>Mais cet état de concentration ne dure que jusqu’à votre inspiration suivante. Quelque chose ne va pas. Raiahui n’a toujours pas reparu, les cris provenant de la plage sont en train d’atteindre un sommet d’excitation stridente.</p>

<p>Sans savoir pourquoi, vous sentez grandir en vous le pressentiment glaçant d’avoir commis une terrible erreur.</p>

<hr/>
    ` + raiahuiGoodEndText,
    "next": endGame,
  },
  "trial-knife": {
    "text": `
<p>Vous profitez de ce que Raiahui est en train d’entamer une nouvelle calebasse pour lui subtiliser adroitement son couteau. Mais elle s’en rend compte aussitôt et tourne vers vous un regard où il n’y a plus la moindre trace d’amusement.</p>

<div class="conversation">
<p>— Rends-moi ça ! Rends-moi ça tout de suite !</p>
</div>

<p>Laissant tomber la calebasse sur le sable, elle se jette sur vous pour récupérer sa possession.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous jetez le couteau dans le lagon.`,
          "action": () => {
            cleanInventoryBeforeRace(flags, updateFlag);
            updateFlag("eatenByRaiahui", true);
            goToSection("knife-sea");
          },
        },
        {
          "text": `Vous jetez le couteau parmi les arbres qui bordent la plage.`,
          "action": () => {
            goToSection("knife-land");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "knife-sea": {
    "text": `
<p>Le couteau d’ivoire décrit une ample courbe et retombe dans le lagon avec une légère éclaboussure. Avec une exclamation agacée, Raiahui se détourne aussitôt de vous et se précipite dans cette direction. Vous n’allez pas laisser passer cette occasion ! Sous le regard ébahi des adolescents qui vous entourent, vous franchissez en un instant la distance qui vous sépare de la rive et plongez sans attendre dans les eaux tièdes de la passe.</p>

<p>Quelques brasses vigoureuses sous la surface vous propulsent en direction de l’île sablonneuse. Lorsque vous remontez à l’air libre, Raiahui n’est plus en vue, mais presque tous les spectateurs restés sur la plage se tiennent désormais du côté du lagon, sans doute pour voir si votre concurrente parvient à récupérer son précieux couteau. Vous adoptez un rythme de nage modéré, de manière à économiser pour l’instant vos forces.</p>

<p>Vous avez déjà parcouru presque le quart du trajet lorsque le bruit d’exclamation vous parvient aux tympans. Un bref regard en arrière vous apprend que les adolescents présents sur la plage sont en train d’agiter les bras en poussant des cris d’encouragement. Raiahui a dû enfin se lancer à votre poursuite, soit que la chance lui ait permis de retrouver rapidement son couteau au fond du lagon, soit qu’elle ait décidé de s’en occuper plus tard. Cela n’a pas une grande importance : quand bien même elle serait vraiment meilleure nageuse que vous, l’avance que vous avez acquise vous garantit virtuellement la victoire.</p>

<p>Et pourtant, une inquiétude irrationnelle s’est insinuée en vous. Vous jetez de manière espacée quelques coups d’œil furtifs en arrière, mais ils ne vous permettent pas d’apercevoir où se trouve Raiahui, comme si elle nageait sans jamais remonter à la surface. Saisie tout à coup d’une peur sans motif apparent, vous hâtez la cadence de votre nage plus tôt que vous n’en aviez l’intention, alors que vous n’avez pas tout à fait accompli la moitié du trajet. Mais le pressentiment glaçant qui ne cesse de grandir dans votre esprit vous dit que cela ne change rien.</p>

<p>Il vous semble désormais, à chaque nouveau mouvement de vos membres, que le point d’arrivée s’éloigne un peu plus et que se rapproche inexorablement quelque chose d’horrible.</p>

<hr/>
    ` + raiahuiGoodEndText,
    "next": endGame,
  },
  "knife-land": {
    "text": `
<p>Le couteau d’ivoire décrit une ample courbe et disparaît silencieusement parmi les palmiers. Avec une exclamation furieuse, Raiahui se détourne aussitôt de vous et se précipite dans cette direction. Vous n’allez pas laisser passer cette occasion !</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Sous le regard absolument stupéfait des adolescents qui vous entourent, vous franchissez en trois enjambées la distance qui vous sépare de la rive.`;

      return trueStartFunnel(text, goToSection, flags, updateFlag);
    },
  },
  "raiahui-drunk": {
    "text": `
<div class="conversation">
<p>— Ce n’est pas moi qui vais t’empêcher de te saoûler, dites-vous en lui tendant votre calebasse. Tiens, vide aussi celle-ci, si tu t’imagines vraiment que tu pourras me battre à la course ensuite !</p>
</div>

<p>Votre défi fait courir des exclamations amusées parmi la jeune assistance. Raiahui accepte votre présent avec un sourire de confiance totale. Même si elle réalise que cette boisson est autrement plus forte que du simple vin de palme, vous soupçonnez qu’elle videra tout de même l’essentiel de la calebasse, ne serait-ce que pour ne pas perdre la face.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Laissant votre concurrente s’enivrer plus qu’elle ne devrait, vous traversez la plage d’un pas rapide en direction de la rive.`;

      return trueStartFunnel(text, goToSection, flags, updateFlag);
    },
  },
  "the-trial-begins": {
    "text": (flags) => {
      let intro = `
<p>Les eaux tièdes et transparentes de la passe se referment sur vous. Vous glissez un instant, portée par l’élan de votre plongeon, puis vous commencez à nager sans remonter tout de suite à la surface. Vous adoptez un rythme énergique, mais pas précipité, de manière à conserver une partie de vos forces.</p>
      `;

      if (flags.playedTheFool) {
        intro = ``;
      }

      return `
${intro}

<p>Votre tête émerge finalement à l’air libre. Vous adoptez un style de natation un peu plus rapide, mais sans forcer encore l’allure. Plongée dans l’exécution de vos mouvements souples et réguliers, vous oubliez presque la compétition un instant pour ne plus éprouver que le plaisir sans mélange que vous apporte toujours le simple fait de nager.</p>

<p>Vous avez franchi près de la moitié de la distance vous séparant de votre destination lorsqu’un concert d’exclamations vous parvient aux oreilles. Jetant un coup d’œil en arrière sans perdre votre allure, vous voyez que tous les adolescents se sont assemblés près de la rive. Leurs gesticulations vous laissent deviner que Raiahui vient enfin de plonger à son tour.</p>

<p>Vous n’augmentez pas immédiatement la cadence de vos mouvements. Vous avez après tout une avance considérable. Vous prenez la précaution de jeter par la suite des coups d’œil périodiques en arrière, mais, curieusement, ils ne vous apprennent rien : vous ne voyez à aucun moment la tête de Raiahui émerger au-dessus des vagues et sa position vous reste absolument inconnue.</p>

<p>Comment peut-elle retenir son souffle aussi longtemps ?</p>
      `;
    },
    "next": (goToSection, flags, updateFlag) => {
      const diveText = `Vous plongez sous l’eau pour distinguer enfin où se trouve Raiahui.`;
      const choices = [
        {
          "text": `Vous accélérez votre rythme de nage.`,
          "action": () => {
            goToSection("trial-straightforward");
          },
        },
        {
          "text": diveText,
          "action": () => {
            savePointAction(diveText, goToSection, flags, updateFlag);
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "trial-straightforward": {
    "text": `
<p>Vous forcez la cadence de vos mouvements, atteignant la vitesse maximale dont vous êtes capable. Il reste à peine plus d’un tiers de la course. Comment qui que ce soit pourrait-il encore vous rattraper à présent ?</p>

<p>Et pourtant, un pressentiment oppressant s’est insinué en vous et ne cesse de croître, à chaque fois que vos membres achèvent un nouveau mouvement, à chaque fois que vous prenez une inspiration nouvelle. Il vous semble — et vous ne comprenez pas pourquoi — que le temps dont vous disposez est en train de s’effilocher rapidement.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Il vous semble — et vous ne comprenez pas pourquoi — que le temps dont vous disposez est en train de s’effilocher rapidement.`;

      const doll = flags.inventory.doll;
      if (doll.acquired && !doll.used) {
        const action = () => {
          useItem("doll", updateFlag);
          goToSection("trial-doll", coatSentence(text));
        };

        return (
          <Funnel text={text} action={action} conditional={true} />
        );
      }

      const amulet = flags.inventory.dolphin;
      if (amulet.acquired && !amulet.used) {
        const action = () => {
          useItem("dolphin", updateFlag);
          goToSection("trial-early-amulet", coatSentence(text));
        };

        return (
          <Funnel text={text} action={action} conditional={true} />
        );
      }

      const action = () => {
        updateFlag("eatenByRaiahui", true);
        goToSection("raiahui-good-end", coatSentence(text));
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "raiahui-good-end": {
    "text": raiahuiGoodEndText,
    "next": endGame,
  },
  "trial-doll": {
    "text": `
<p>La figurine, que vous aviez attachée à votre taille, commence à s’agiter furieusement. Craignant quelque sorcellerie, vous essayez de vous en débarrasser, mais elle se délivre d’elle-même et s’accroche fermement à votre bras. Son poids devient tout à coup immense et vous avez à peine le temps de prendre une inspiration avant qu’il ne vous entraîne sous la surface.</p>

<p>Vous vous débattez furieusement, mais la figurine vous a déjà relâchée et a disparu.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Soulagée, vous êtes sur le point de remonter à la surface, mais votre regard se tourne un instant derrière vous.`;
      const action = () => {
        savePointAction(text, goToSection, flags, updateFlag);
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-early-amulet": {
    "text": `
<p>Une multitude de sons à peine audibles est en train de vous parvenir, emplissant votre crâne jusqu’à presque le saturer. D’une manière que vous seriez incapable d’expliquer, vous possédez soudain une manière supplémentaire de percevoir ce qui vous entoure. Vous avez une conscience très nette du fond sablonneux de la passe, saisissant sans avoir besoin les voir tous les récifs de corail qui le hérisse.</p>

<p>Mais surtout, vous pouvez sentir une forme qui se trouve derrière vous et ne cesse de se rapprocher. Vous ne parvenez pas à interpréter ses contours fuselés, mais ils vous inspirent une profonde crainte instinctive.</p>

<p>Votre sens supplémentaire se volatilise aussi soudainement qu’il était apparu et, au même instant, l’amulette que vous portiez autour de votre cou se désagrège.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Devinant intuitivement qu’elle vient d’épuiser ses derniers pouvoirs pour vous transmettre cet avertissement, vous plongez sous l’eau pour voir ce qui vous suit.`;
      const action = () => {
        savePointAction(text, goToSection, flags, updateFlag);
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-underwater": {
    "text": `
<p>Avez-vous deviné que la tribu apparemment si dénuée de moyens vous dissimulait sa vraie nature ? Avez-vous soupçonné que cette course n’était pas une simple compétition, à l’issue de laquelle le perdant ne connaîtrait rien de pire que la vexation de l’échec ? Vous est-il revenu en mémoire de vieilles légendes parlant d’humains qui étaient en même temps autre chose ?</p>

<p>Tout cela n’a plus aucune importance à présent, car la transparence de l’eau vous permet de distinguer sans aucun mal la seconde apparence de Raiahui tandis qu’elle réduit à vive allure la distance qui vous sépare.</p>

<img src="${squaleImage}" class="img-responsive text-img" alt=""/>

<p>Propulsé par les mouvements puissants de sa queue, son corps marbré de rayures sombres est plus à l’aise dans l’élément aquatique que vous ne pourrez jamais l’être. Sa gueule paraît presque inoffensive pour le moment, mais vous avez déjà vu des mâchoires de requin-tigre et les nombreuses dents tranchantes dont elles sont garnies.</p>

<p>Vous remontez à la surface pour respirer. Une terreur horrible s’est répandue dans tout votre être, mais elle ne vous prive pas encore de vos moyens. Un tiers de la distance vous sépare encore de l’îlot qui constitue votre destination. En-dessous de vous, quelques récifs de corail émergent ici et là du fond sablonneux de la passe. Sur votre droite, du côté de l’océan, le corail devient beaucoup plus dense et enchevêtré.</p>
    `,
    "next": (goToSection) => {
      const choices = [
        {
          "text": `Vous nagez de toutes vos forces en direction de l’îlot.`,
          "action": () => {
            goToSection("trial-rush");
          },
        },
        {
          "text": `Vous plongez vers les récifs de corail qui se trouvent juste en-dessous de vous.`,
          "action": () => {
            goToSection("trial-hide-closer");
          },
        },
        {
          "text": `Vous essayez d’atteindre les récifs sur votre droite, plus denses mais deux fois plus éloignés.`,
          "action": () => {
            goToSection("trial-hide");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "trial-rush": {
    "text": `
<p>La panique anime vos membres d’une énergie bouillonnante, vous faisant nager plus vite que vous n’en avez jamais été capable. Mais Raiahui reste beaucoup trop rapide. Un coup d’œil angoissé en arrière vous permet de voir qu’elle est sur le point de vous rejoindre.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `Vous lui jetez le filet de la sorcière.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("caught-a-raiahui");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `Vous écrasez les perles noires en votre possession.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("killed-by-pearls");
          },
          "conditional": true,
        });
      }

      const escapeText = `Vous nagez aussi vite que possible en une tentative désespérée pour lui échapper malgré tout.`;
      choices.push({
        "text": escapeText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(escapeText));
        }
      });

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "caught-a-raiahui": {
    "text": `
<p>Saisissant le filet que vous aviez entouré autour de votre taille, vous le jetez vers Raiahui. Votre geste n’a presque aucune force, mais le filet de la sorcière n’a pas perdu sa vertu : il se déploie de lui-même et enveloppe étroitement votre poursuivante alors qu’elle allait vous atteindre. Raiahui se contorsionne furieusement, déchiquetant les mailles serrées pour parvenir à se libérer.</p>
    `,
    "next": (goToSection) => {
      const text = `Vous vous éloignez d’elle avec toute la vitesse possible.`;
      const action = () => {goToSection("arrival-in-sight")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "killed-by-pearls": {
    "text": `
<p>Vous écrasez les perles d’un geste convulsif et les eaux transparentes qui vous entourent deviennent brusquement d’un noir impénétrable.</p>

<p>Vous continuez à nager aussi vite que vous en êtes capable, mais il ne s’écoule qu’un bref instant avant qu’un impact cuisant ne vous cingle tout à coup la jambe. Un corps rugueux vient de passer tout près de vous !</p>

<p>Sous vos yeux horrifiés, un aileron brun-gris émerge de l’eau opaque juste devant vous.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      return repeatingFunnel(
        goToSection,
        `D’un mouvement brusque, il s’oriente dans votre direction.`,
        () => {
          updateFlag("eatenByRaiahui", true);
          return "raiahui-good-end";
        },
      );
    }
  },
  "arrival-in-sight": {
    "text": `
<p>L’île sablonneuse n’est désormais plus qu’à une faible distance devant vous. Vous nagez vers elle aussi vite que possible, mais les intenses efforts physiques auxquels la terreur vous a poussée commencent à affecter vos forces. Vous sentez un début d’épuisement vous gagner.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      if (flags.drunk) {
        const text = `Votre ventre est agité de douloureux gargouillis tandis qu’un arrière-goût d’alcool remonte dans votre bouche.`
        const action = () => {
          goToSection("exhausted");
        };

        return (
          <Funnel text={text} action={action} conditional={true} />
        );
      }

      const amulet = flags.inventory.dolphin;
      if (amulet.acquired && !amulet.used) {
        const text = `L’amulette contre votre poitrine tremble sous l’irrégularité de votre souffle.`
        const action = () => {
          useItem("dolphin", updateFlag);
          goToSection("trial-saved-by-dolphin");
        };

        return (
          <Funnel action={action} text={text} conditional={true} />
        );
      }

      if (flags.boostedByFruit) {
        const text = `Votre ventre, délaissé par votre organisme au profit de vos muscles, gronde.`
        const action = () => {
          goToSection("trial-saved-by-fruit");
        };

        return (
          <Funnel action={action} text={text} conditional={true} />
        );
      }

      if (flags.wellRested) {
        const text = `Vous êtes plus forte que la fatigue.`
        const action = () => {
          goToSection("trial-saved-by-sloth");
        };

        return (
          <Funnel action={action} text={text} conditional={true} />
        );
      }

      const text = `Vous rassemblez vos dernières forces.`
      const action = () => {
        goToSection("exhausted");
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-saved-by-dolphin": {
    "text": `
<p>Il vous semble tout à coup qu’une profonde bouffée d’air pur s’infiltre dans vos poumons. La faiblesse qui commençait à alourdir vos membres se dissipe comme si elle n’avait jamais existé et vous continuez sans mal à nager à une vitesse étourdissante.</p>
    `,
    "next": (goToSection) => {
      const text = `À votre cou, l’amulette en forme de dauphin se désagrège, ayant épuisé pour vous ses derniers pouvoirs.`;
      const action = () => {goToSection("final-island")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-saved-by-fruit": {
    "text": `
<p>Alors que la panique vous saisit à l’idée de défaillir si près de votre but, une énergie brûlante naît soudain dans le creux de votre ventre et se répand dans tous vos muscles avec la vivacité de la foudre.</p>
    `,
    "next": (goToSection) => {
      const text = `N’éprouvant plus rien de l’épuisement qui alourdissait vos membres il y a un instant, vous continuez de nager à une vitesse étourdissante.`;
      const action = () => {goToSection("final-island")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-saved-by-sloth": {
    "text": `
<p>Vous puisez dans toutes vos ressources pour franchir la distance qui vous sépare encore de votre but.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Là où la panique ne suffit plus, c’est votre volonté qui contraint vos muscles à dépasser l’épuisement et à vous propulser vers l’île, toujours plus près, sans ralentir un instant.`,
        "final-island",
      );
    },
  },
  "final-island": {
    "text": `
<p>Une bouffée d’espoir délirante vous saisit lorsque vous sentez enfin le sable sous vos pieds. Vous vous hâtez de vous redresser. L’eau ne vous parvient qu’à la taille et il vous suffira de quelques enjambées pour atteindre enfin l’île.</p>

<p>Un grand bruit d’éclaboussures vous fait vous retourner : Raiahui vient d’émerger de l’eau à son tour. L’espace d’un fugitif instant, vous la voyez sous une curieuse forme hybride, à mi-chemin entre ses deux apparences. Puis sa peau reprend une couleur brune uniforme, son visage retrouve un aspect humain et ses membres antérieurs se terminent à nouveau par des mains, dont l’une serre un couteau couleur d’ivoire.</p>

<p>Son arme tendue devant elle, Raiahui se précipite vers vous avec un hurlement enragé.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `Vous lui jetez le filet de la sorcière.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("net-on-sand");
          },
          "conditional": true,
        });
      }

      choices = choices.concat([
        {
          "text": `Vous essayez de lui arracher son couteau.`,
          "action": () => {
            goToSection("raiahui-fight");
          },
        },
        {
          "text": `Vous vous précipitez vers l’île.`,
          "action": () => {
            goToSection("run-to-finish");
          },
        },
      ]);

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "raiahui-fight": {
    "text": `
<p>Vous échouez à saisir le poignet de Raiahui. D’un mouvement vif, elle tente de vous transpercer le ventre, mais vous vous tordez de justesse sur le côté et le tranchant aiguisé du couteau ne vous inflige qu’une légère estafilade.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous lui assénez un coup de poing.`,
          "action": () => {
            goToSection("raiahui-punch");
          },
        },
        {
          "text": `Vous l’agrippez au corps-à-corps.`,
          "action": () => {
            if (flags.drunk || flags.weakened) {
              updateFlag("stabbedToDeath", true);
              return goToSection("raiahui-grapple");
            }

            goToSection("raiahui-grapple-strong");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "raiahui-punch": {
    "text": `
<p>Votre coup de poing surprend Raiahui, qui n’a pas le réflexe de l’esquiver. Il la frappe en plein ventre et elle vacille légèrement en arrière, mais elle tend son couteau devant elle pour vous empêcher d’en profiter.</p>
    `,
    "next": (goToSection) => {
      const text = `Réalisant que la situation est à votre désavantage, vous profitez de l’occasion pour vous précipiter vers l’île.`;
      const action = () => {
        goToSection("run-to-finish");
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "raiahui-grapple": {
    "text": `
<p>Vous essayez de saisir votre adversaire d’une manière qui l’empêche de se servir de son arme, mais l’eau rend sa peau glissante. Brièvement déséquilibrée par cette tentative, vous n’arrivez pas cette fois à éviter le couteau de Raiahui : sa pointe effilée s’enfonce profondément dans votre poitrine et vous basculez en arrière, soudain privée de force. La dernière chose que vous distinguez, alors que les eaux déjà rouges se referment sur votre visage, est le regard de votre meurtrière posé sur vous.</p>
    `,
    "next": endGame,
  },
  "raiahui-grapple-strong": {
    "text": `
<p>Vous essayez de saisir votre adversaire d’une manière qui l’empêche de se servir de son arme, mais l’eau rend sa peau glissante. Brièvement déséquilibrée par cette tentative, c’est tout juste si vous parvenez à arrêter le bras de Raiahui lorsqu’elle tente à nouveau de vous poignarder.</p>

<p>Vous luttez un instant l’un contre l’autre, mais vos prises sont mal assurées et vous n’avez pas l’avantage.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous poussez Raiahui en arrière de toutes vos forces.`,
          "action": () => {
            updateFlag("stabbedToDeath", true);
            goToSection("raiahui-grapple-strong-death");
          },
        },
        {
          "text": `Vous lui griffez le visage.`,
          "action": () => {
            goToSection("raiahui-grapple-strong-escape");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      )
    }
  },
  "raiahui-grapple-strong-death": {
    "text": `
<p>Vous parvenez à déséquilibrer Raiahui, mais elle s’agrippe à vous et vous entraîne avec elle ! Vous basculez ensemble dans l’eau, où s’ensuit une mêlée confuse et frénétique. Le couteau de Raiahui finit par s’enfoncer dans votre ventre et la douleur foudroyante vous ôte instantanément toutes vos forces. La dernière chose que vous distinguez, alors qu’un rouge épais remplace la transparence de l’eau, est le visage de votre meurtrière tout proche du vôtre.</p>
    `,
    "next": endGame,
  },
  "raiahui-grapple-strong-escape": {
    "text": `
<p>Raiahui a un réflexe de recul lorsque vos doigts tendus se rapprochent de ses yeux. Saisissant l’occasion, vous parvenez à vous dégager et à la repousser en arrière. Raiahui est momentanément déséquilibrée, mais elle tend son couteau devant elle pour vous empêcher d’en profiter.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Réalisant que vous avez peu de chance de prendre le dessus dans cet affrontement, vous vous enfuyez vers l’îlot.`,
        "run-to-finish",
      );
    }
  },
  "net-on-sand": {
    "text": `
<p>Vous jetez le filet de la sorcière vers Raiahui, mais elle est trop proche pour qu’il puisse se déployer totalement avant de l’atteindre. Il ne fait que s’enrouler étroitement autour de son bras, sans lui causer de gêne véritable. Ce phénomène inattendu la fait cependant hésiter un instant et vous en profitez pour vous enfuir vers la rive sablonneuse.</p>

<p>Vous n’avez pas le temps de l’atteindre : vous avez à peine effectué quelques enjambées, soulevant de grandes gerbes d’eau autour de vous, lorsqu’une poussée brutale vous fait perdre l’équilibre et basculer en avant. Reprenant rapidement pied, vous vous retournez juste à temps pour saisir le poignet de Raiahui, arrêtant la pointe de son couteau tout près de votre visage. L’eau vous arrive encore à mi-cuisse. La main libre de Raiahui se referme sur votre bras et vous luttez furieusement l’une contre l’autre, faisant jaillir des éclaboussures à moins de trois enjambées de la rive.</p>

<p>Le couteau vous frôle à plusieurs reprises et vous sentez que Raiahui essaie de vous ramener à un endroit où l’eau sera plus profonde.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous résistez farouchement.`,
          "action": () => {
            goToSection("raiahui-struggle");
          },
        },
        {
          "text": `Vous guettez une occasion de vous dégager et de fuir vers l’île.`,
          "action": () => {
            if (flags.drunk || flags.weakened) {
              updateFlag("stabbedToDeath", true);
              return goToSection("raiahui-backstab");
            }

            goToSection("raiahui-knife-close");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "run-to-finish": {
    "text": `
<p>Vos jambes soulèvent de grandes gerbes d’eau tandis que vous essayez de gagner la rive sablonneuse au plus vite. Mais vous avez à peine le temps d’effectuer quelques enjambées avant qu’une poussée brutale ne vous fasse perdre l’équilibre et basculer en avant. Reprenant rapidement pied, vous vous retournez juste à temps pour saisir le poignet de Raiahui, arrêtant la pointe de son couteau tout près de votre visage. L’eau vous arrive encore à mi-cuisse. La main libre de Raiahui se referme sur votre bras et vous luttez furieusement l’une contre l’autre, faisant jaillir des éclaboussures à moins de trois enjambées de la rive. Le couteau vous frôle à plusieurs reprises et vous sentez que Raiahui essaie de vous ramener à un endroit où l’eau sera plus profonde.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous résistez farouchement.`,
          "action": () => {
            goToSection("raiahui-struggle");
          },
        },
        {
          "text": `Vous guettez une occasion de vous dégager et de fuir vers l’île.`,
          "action": () => {
            if (flags.drunk || flags.weakened) {
              updateFlag("stabbedToDeath", true);
              return goToSection("raiahui-backstab");
            }

            goToSection("raiahui-knife-close");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "raiahui-backstab": {
    "text": `
<p>Vous réussissez finalement à vous dégager de l’étreinte de votre adversaire et vous vous élancez vers l’île dans l’espoir de l’atteindre enfin. Mais Raiahui vous rattrape et son couteau s’enfonce profondément dans votre dos. Foudroyée par la douleur, vous vous effondrez en avant. La rive est à portée de bras, mais toutes vos forces vous ont abandonné. Votre dernière vision est celle de l’eau devant votre visage se teintant peu à peu de rouge.</p>
    `,
    "next": endGame,
  },
  "raiahui-knife-close": {
    "text": `
<p>Vous réussissez finalement à vous dégager de l’étreinte de votre adversaire et vous tournez pour courir jusqu’à la rive ensablée. Mais Raiahui est trop proche et réagit trop rapidement. Du coin de l’oeil, vous voyez son bras se tendre pour vous poignarder. D’extrême justesse, vous parvenez à vous tordre sur le côté et le couteau d’ivoire ne fait que vous écorcher le flanc au lieu de s’enfoncer profondément dans votre dos.</p>

<p>Raiahui vous agrippe par les cheveux et vous tire brutalement en arrière. Vous parvenez à lui donner un coup de coude dans le ventre, ce qui ne lui fait pas lâcher prise mais vous donne le temps de lui saisir le poignet à deux mains avant qu’elle ne puisse vous enfoncer son couteau d’ivoire dans la gorge.</p>

<p>Pendant un bref instant, vous êtes toutes les deux immobiles, haletantes, guettant pareillement l’occasion de prendre l’avantage dans cet étrange corps-à-corps. Tout près de votre visage, vous distinguez avec netteté les gouttes de votre sang qui perlent le long de la blancheur laiteuse du couteau.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous frappez Raiahui aussi fort que vous le pouvez.`,
          "action": () => {goToSection("raiahui-struggle-alt")},
        },
        {
          "text": `Vous lui tordez le bras pour essayer de lui faire lâcher son couteau.`,
          "action": () => {
            updateFlag("stabbedToDeath", true);
            goToSection("raiahui-struggle-death");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "raiahui-struggle-death": {
    "text": `
<p>Vous parvenez brièvement à éloigner de vous la pointe du couteau d’ivoire. Puis le bras libre de Raiahui entoure votre cou, sa jambe s’enroule autour de la vôtre et elle vous tire brutalement en arrière. Vous basculez ensemble dans l’eau, où s’ensuit une mêlée confuse et frénétique. Le couteau de Raiahui finit par s’enfoncer dans votre ventre et la douleur foudroyante vous ôte instantanément toutes vos forces. La dernière chose que vous distinguez, alors qu’un rouge épais remplace la transparence de l’eau, est le visage de votre meurtrière tout proche du vôtre.</p>
    `,
    "next": endGame,
  },
  "raiahui-struggle": {
    "text": `
<p>Votre terreur a atteint son point d’ébullition et elle se vaporise soudain en une rage brûlante.</p>

<div class="conversation">
<p>— LÂCHE-MOI, ESPÈCE DE…</p>
</div>

<p>Vous hurlez un mot que votre mère n’aurait pas été heureuse d’entendre, le ponctuez d’un violent coup de tête qui frappe votre adversaire en plein visage et lui mordez ensuite sauvagement l’avant-bras. Raiahui pousse un cri de douleur perçant et laisse presque échapper son précieux couteau. Vous lui écrasez votre poing sur la figure et, tandis qu’elle titube en arrière, vous franchissez enfin la distance qui vous séparait de la rive sablonneuse.</p>

<p>Raiahui retrouve son équilibre et elle se précipite à vos trousses, mais, avant qu’elle ne puisse vous rejoindre, de nombreuses silhouettes surgissent tout autour de vous et des mains viennent la retenir.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      return repeatingFunnel(
        goToSection,
        `— L’épreuve est terminée, déclare Ataroa.`,
        () => {
          updateFlag("survivedTheTrial", true);
          return "victory";
        },
      );
    },
  },
  "raiahui-struggle-alt": {
    "text": `
<p>Votre terreur a atteint son point d’ébullition et elle se vaporise soudain en une rage brûlante.</p>

<div class="conversation">
<p>— LÂCHE-MOI, ESPÈCE DE…</p>
</div>

<p>Vous hurlez un mot que votre mère n’aurait pas été heureuse d’entendre, le ponctuez d’un violent coup de tête en arrière qui frappe votre adversaire en plein visage et lui mordez ensuite sauvagement l’avant-bras. Raiahui pousse un cri de douleur perçant, lâche vos cheveux et laisse presque échapper son précieux couteau. Vous retournant à demi, vous lui assénez un coup de coude brutal en pleine poitrine et, tandis qu’elle titube en arrière, vous franchissez enfin la distance qui vous séparait de la rive sablonneuse.</p>

<p>Raiahui retrouve son équilibre et elle se précipite à vos trousses, mais, avant qu’elle ne puisse vous rejoindre, de nombreuses silhouettes surgissent tout autour de vous et des mains viennent la retenir.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      return repeatingFunnel(
        goToSection,
        `— L’épreuve est terminée, déclare Ataroa.`,
        () => {
          updateFlag("survivedTheTrial", true);
          return "victory";
        },
      );
    }
  },
  "victory": {
    "text": `
<p>Les adultes de la tribu vous entourent en un cercle épais et leurs yeux vous détaillent avec beaucoup plus d’attention que lors de votre arrivée de la veille. Vous vous sentez trop épuisée pour avoir encore peur, mais il n’y a de toute façon aucune hostilité sur leurs visages, seulement une profonde curiosité.</p>

<div class="conversation">
<p>— Tu as mérité notre respect, Mananuiva, vous déclare Ataroa d’une voix où perce presque une certaine admiration. Ce n’est pas fréquemment qu’un étranger remporte une de nos courses.</p>
</div>

<p>Quelques remarques acerbes se présentent à votre esprit, mais, même si vous aviez le courage de les articuler, vous ne vous sentez pas l’énergie nécessaire.</p>

<div class="conversation">
<p>— Tu es libre de repartir, poursuit Ataroa, désignant du doigt votre pirogue, qui repose sur le sable à l’autre extrémité de la petite île. Nous avons pris soin de ton embarcation et nous l’avons remplie des provisions dont tu pourras avoir besoin. Quant à ta récompense…</p>
</div>

<p>Il fait un signe de la main et un autre homme s’avance, portant un bol rempli d’un liquide blanc-gris.</p>

<div class="conversation">
<p>— L’Écume des Profondeurs t’appartient. Il ne reste qu’un ingrédient à y ajouter, ce que nous allons faire tout de suite. Il est ordinairement fourni par celui qui va boire l’Écume, mais, étant donné les circonstances, il est normal qu’il vienne de quelqu’un d’autre.</p>
</div>

<p>Deux adultes s’approchent, tenant entre eux Raiahui, qui est visiblement terrifiée. Ataroa lui saisit le poignet et lui entaille profondément la paume de son couteau. Un filet de sang vient se mêler au contenu de la coupe, qui prend aussitôt une teinte vivement argentée.</p>

<div class="conversation">
<p>— L’Écume des Profondeurs est prête, déclare Ataroa en vous la remettant. Bois-là ce soir et tu visiteras le monde des esprits pendant ton sommeil.</p>
</div>

<p>Il se tourne à présent vers votre concurrente, qui tremble de tout son corps.</p>

<div class="conversation">
<p>— Raiahui, dit-il d’une voix froide, tu ne mérites pas d’être une adulte. Tu as échoué à l’épreuve par arrogance, en sous-estimant ton adversaire. Je pense que tu ne prendras pas ton épreuve suivante autant à la légère.</p>
</div>

<p>Il s’empare du couteau de la jeune femme et, d’un mouvement puissant, le jette vers le lagon.</p>

<div class="conversation">
<p>— Si tu parviens à regagner le village, ta stupidité sera pardonnée.</p>
</div>

<p>Les mains qui retenaient Raiahui la relâchent subitement. La jeune femme promène un regard affolé sur les adultes qui l’entourent, puis se précipite vers le lagon pour y plonger. Vous la regardez un instant nager de toutes ses forces vers l’endroit où son couteau a disparu. Prisonnière de sa forme humaine, elle reste une très bonne nageuse, mais vous êtes certaine que vous auriez pu la battre dans une course normale.</p>

<p>Ataroa se tourne vers vous et vous adresse un dernier hochement de tête en guise d’adieu.</p>

<div class="conversation">
<p>— Je te souhaite de découvrir ce que tu cherches, Mananuiva.</p>
</div>

<p>Puis tous les adultes de la tribu vont plonger à leur tour et vous voyez dans l’eau transparente leurs formes effilées se lancer à la poursuite de Raiahui.</p>

<p>Vous ne tenez pas à savoir ce qui va se dérouler dans le lagon et vous n’êtes même pas certaine de préférer l’une ou l’autre issue possible. Vous traversez la petite île sablonneuse et allez vous asseoir devant l’océan. Le bruit régulier des vagues vous apaise, dissipant le peu de tension qui subsiste encore dans vos muscles. Derrière vous, le soleil ne tardera plus à atteindre l’horizon.</p>

<p>Vous baissez les yeux vers l’Écume des Profondeurs, dont la surface reflète confusément votre visage. Cela valait-il la peine que vous vous êtes donnée et les dangers que vous avez courus ? Peu importe désormais : votre aventure sur cet atoll appartient déjà au passé et la suite de votre quête vous attend.</p>

<p>Vous vous installez confortablement et portez la coupe à vos lèvres.</p>
    `,
    "next": (goToSection) => {
      const text = `Cette nuit, vous allez rêver. Et demain, vous allez repartir.`;
      const action = () => {
        goToSection("ending-credits");
      };

      return (
        <div className="true-end-link">
          <Funnel text={text} action={action} />
        </div>
      );
    },
  },
  "trial-hide": {
    "text": `
<p>Vous restez un instant encore à la surface, nageant de toutes vos forces pour vous rapprocher des récifs. Puis vous prenez une profonde inspiration et vous plongez.</p>

<p>Quelques brasses puissantes vous permettent de vous enfoncer rapidement vers le fond de la passe. Entre deux masses de corail aux formes extravagantes, vous repérez une anfractuosité verticale et irrégulière, qui vous semble trop étroite pour que Raiahui vous y suive.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous nagez sans vous retourner pour l’atteindre le plus vite possible.`,
          "action": () => {
            goToSection("trial-not-looking-back");
          },
        },
        {
          "text": `Vous prenez le temps de jeter un coup d’œil en arrière pour voir où se trouve Raiahui.`,
          "action": () => {
            goToSection("trial-looking-back");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "trial-not-looking-back": {
    "text": `
<p>Vous n’avez pas besoin de voir Raiahui pour savoir qu’elle vous poursuit et que l’écart entre vous ne cesse de se réduire. Tourner la tête pour le vérifier vous ralentirait un instant sans rien vous apporter.</p>

<p>Vous nagez aussi vite que vous en êtes capable. Six brasses vous séparent encore de l’anfractuosité où vous espérez vous réfugier. Puis cinq. Puis quatre. Raiahui ne doit certainement plus être loin derrière vous. Plus que trois. Plus que deux. Vous y êtes presque. Une. Vous y êtes !</p>

<p>Alors que vous vous glissez à l’intérieur de l’anfractuosité, vous voyez du coin de l’oeil Raiahui sur le point de vous rejoindre, sa gueule entrouverte révélant ses nombreuses dents effilées.</p>
    `,
    "next": (goToSection) => {
      const text = `Vous vous hâtez de vous enfoncer parmi les coraux pour vous mettre hors de sa portée.`;
      const action = () => {goToSection("far-corals")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-looking-back": {
    "text": `
<p>Vous tournez la tête et un frémissement d’effroi vous parcourt lorsque vous découvrez que Raiahui est beaucoup plus proche qu’elle ne l’était il y a seulement quelques instants. La distance qui vous sépare encore est en train de diminuer avec une grande rapidité. Pouvez-vous vraiment atteindre les récifs de corail avant qu’elle ne vous rattrape ?</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `Vous lui jetez le filet de la sorcière.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("far-corals-net");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `Vous écrasez les perles noires en votre possession.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("far-corals-pearls");
          },
          "conditional": true,
        });
      }

      choices.push({
        "text": `Vous nagez de toutes vos forces vers l’anfractuosité que vous avez repérée.`,
        "action": () => {
          if (flags.boostedByFruit) {
            updateFlag("boostedByFruit", false);
            return goToSection("far-corals-doped");
          }

          updateFlag("bleeding", true);
          goToSection("far-corals-wound");
        }
      });

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "far-corals-pearls": {
    "text": `
<p>Vous écrasez toutes les perles dont vous disposez et un nuage noir impénétrable se répand autour de vous. Totalement aveugle, vous nagez dans la direction approximative de l’anfractuosité.</p>

<p>Après quelques brasses énergiques, vous parvenez de nouveau à distinguer vos propres membres, puis les couleurs vives du corail.</p>

<p>L’eau achève de redevenir transparente autour de vous. Tournant la tête, vous apercevez la forme souple et fuselée de Raiahui, à une certaine distance sur votre droite. Elle est parvenue à rester en-dehors du nuage opaque, mais cela lui a fait perdre du temps. L’anfractuosité où vous espériez trouver refuge ne se trouve plus qu’à quelques brasses devant vous.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Vous l’atteignez et vous y glissez sans perdre un instant.`,
        "far-corals",
      );
    }
  },
  "far-corals-net": {
    "text": `
<p>Saisissant le filet que vous aviez entouré autour de votre taille, vous le jetez vers Raiahui. Votre geste n’a ni la force ni la précision qui seraient normalement nécessaire, mais le filet de la sorcière n’a pas perdu sa vertu : il se déploie de lui-même et traverse en un instant la distance qui vous sépare pour envelopper étroitement votre poursuivante. Raiahui se contorsionne furieusement, déchiquetant les mailles serrées pour parvenir à se libérer.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Ce répit vous suffit amplement à atteindre les récifs de corail et à vous réfugier dans l’anfractuosité.`,
        "far-corals",
      );
    },
  },
  "far-corals-doped": {
    "text": `
<p>Vous nagez aussi vite que vous en êtes capable, mais la panique vous tenaille à l’idée que ce n’est pas suffisant.</p>

<p>Une énergie brûlante naît soudain dans le creux de votre ventre et se répand dans tous vos muscles avec la vivacité de la foudre. Vos mouvements se font plus rapides et plus puissants. Les récifs de corail se rapprochent à une vitesse étourdissante !</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Cette vitalité anormale se volatilise à l’instant même où vous atteignez l’anfractuosité, où vous vous glissez sans perdre un instant.`,
        "far-corals",
      );
    }
  },
  "far-corals-wound": {
    "text": `
<p>Vous nagez aussi vite que vous en êtes capable, mais la panique vous tenaille à l’idée que ce n’est pas suffisant.</p>

<p>Six brasses vous séparent encore de l’anfractuosité où vous espérez vous réfugier. Plus que cinq. Plus que quatre. À quelle distance se trouve désormais Raiahui ? Trois. Il vous semble à chaque instant que sa mâchoire est sur le point de se refermer sur votre jambe. Deux. Vous y êtes presque. Une. Vous y êtes !</p>

<p>Alors qu’un ultime mouvement de jambes vous propulse à l’intérieur de l’anfractuosité, vous sentez un impact soudain contre la plante de votre pied. Terrifiée, vous vous enfoncez en hâte parmi les formes baroques et colorées du corail.</p>

<p>Une fois certaine d’être — pour l’instant — hors d’atteinte de Raiahui, vous prenez le temps d’examiner votre pied. Vous avez une mince coupure au talon, trop peu profonde pour être bien doulourouse. Il s’en échappe un peu de sang, qui se dissout presque aussitôt dans la transparence de l’eau.</p>

<p>Avec un frémissement, vous réalisez ce qui s’est passé : juste au moment où vous atteigniez l’anfractuosité, Raiahui a tenté de vous happer par la cheville. Elle vous a manqué de justesse, mais votre pied a heurté le rebord de sa gueule et c’est le tranchant de l’une de ses dents qui vous a fait cette blessure superficielle.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Vous vous en tirez à bon compte et ce n’est pas cette coupure qui vous gênera pour nager, mais vous êtes encore loin d’être tirée d’affaire.`,
        "far-corals",
      );
    }
  },
  "far-corals": {
    "text": `
<p>La lumière qui vous parvient depuis la surface diminue brièvement lorsque la forme effilée de Raiahui passe juste au-dessus de vous avec une lenteur ostensible.</p>

<p>Vous savez que le temps ne joue pas en votre faveur. Raiahui ne peut pas vous atteindre, mais elle sait très bien où vous êtes en ce moment et, contrairement à elle, vous ne pouvez pas rester sous l’eau indéfiniment.</p>

<p>L’étroite faille entre les deux masses de corail est plus longue que vous ne le réalisiez et vous réalisez avec une bouffée d’espoir qu’elle est plus ou moins orientée vers l’îlot qui constitue votre destination. Peut-être avez-vous une chance de vous rapprocher de la terre ferme sans vous exposer aux yeux de votre poursuivante.</p>

<p>Vous progressez adroitement le long de la faille. Les parois irrégulières du corail sont d’abord si rapprochées que vous devez parfois vous contorsionner pour vous glisser entre elles sans vous écorcher la peau. Mais elles s’écartent peu à peu, jusqu’à un point où vous commencez à vous sentir dangereusement exposée.</p>

<p>Vous vous arrêtez un instant, hésitante. Une demi-douzaine de brasses devant vous, la faille capricieuse se resserre de nouveau. Mais, sur toute cette distance, sa largeur est suffisante pour qu’un requin puisse s’y introduire. Raiahui est actuellement hors de votre champ de vision, mais cela ne signifie pas qu’elle soit éloignée.</p>
    `,
    "next": (goToSection) => {
      const choices = [
        {
          "text": `Vous traversez cet espace exposé aussi rapidement que possible.`,
          "action": () => {goToSection("far-corals-quick")},
        },
        {
          "text": `Vous traversez l’espace exposé en vous efforçant de rester discrète.`,
          "action": () => {goToSection("far-corals-sneaky")},
        },
      ];

      return (
        <Crossroads choices={choices} />
      )
    }
  },
  "far-corals-quick": {
    "text": `
<p>Vous vous propulsez en avant et nagez aussi vite que vous le permet cet espace malgré tout confiné. Mais vous avez à peine franchi la moitié de la distance lorsque Raiahui apparaît soudain sur votre gauche ! D’un mouvement rapide, elle se glisse à l’intérieur de la faille, ses nageoires frôlant les parois de corail. Vous distinguez avec une netteté terrifiante les dents qui hérissent sa gueule encore presque close alors qu’elle se rapproche de vos jambes.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `Vous lui jetez le filet de la sorcière.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("far-corals-net-2");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `Vous écrasez les perles noires en votre possession.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("far-corals-pearls-2");
          },
          "conditional": true,
        });
      }

      choices.push({
        "text": `Vous lui donnez des coups de pieds en une tentative désespérée pour la tenir à distance.`,
        "action": () => {
          updateFlag("bleeding", true);
          goToSection("far-corals-fight");
        }
      });

      const deathText = `Vous continuez de nager aussi vite que vous êtes capable.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        }
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "far-corals-net-2": {
    "text": `
<p>Raiahui est trop proche pour que le filet de la sorcière puisse se déployer totalement avant de l’atteindre. Mais il s’enroule étroitement autour de sa tête et s’accroche à ses dents tranchantes.</p>

<p>Elle s’agite furieusement, déchiquetant les mailles serrées pour se débarrasser de cette gêne. Le mince sursis que cela vous accorde vous permet d’atteindre le point où les parois de corail se resserrent suffisamment pour qu’elle ne puisse plus vous suivre.</p>

<p>Jetant un coup d’œil en arrière, vous voyez Raiahui achever de mettre le filet en lambeaux, puis remonter et disparaître de votre champ de vision.</p>
    `,
    "next": (goToSection) => {
      const text = `Vous reprenez votre progression sans perdre un instant.`;
      const action = () => {goToSection("far-corals-last")};

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "far-corals-fight": {
    "text": `
<p>Vous décochez des coups de pied convulsifs au museau gris-brun avec toute la force que vous donne la panique. Raiahui n’en est guère affectée, mais cette résistance acharnée fait obstacle à ses efforts pour vous happer. Sa mâchoire terrifiante s’ouvre et se referme à plusieurs reprises tout près de l’une de vos chevilles, sans parvenir à l’atteindre.</p>

<p>Si l’espace qui vous entoure était plus dégagé, vous n’auriez aucune chance de vous défendre ainsi. Mais le corail confine les mouvements de Raiahui, l’empêchant de tirer parti de sa mobilité et de sa vitesse.</p>

<p>Tout en la repoussant de votre mieux, vous continuez autant que possible à progresser le long de la passe. Votre attention étant toute entière concentrée dans une seule direction, vous vous écorchez à plusieurs reprises contre les aspérités du corail, mais c’est à peine si vous remarquez la douleur.</p>

<p>Enfin, presque sans vous en rendre compte, vous atteignez le point où la faille se resserre trop pour votre poursuivante. Avec un soulagement incrédule, vous voyez Raiahui remonter tout à coup, puis disparaître de votre champ de vision.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Vous poursuivez sans attendre votre progression.`,
        "far-corals-last"
      );
    }
  },
  "far-corals-pearls-2": {
    "text": `
<p>Vous écrasez d’un geste convulsif toutes les perles en votre possession et un nuage noir impénétrable se répand aussitôt autour de vous.</p>

<p>Votre réconfort ne dure qu’un minuscule instant : Raiahui ne peut certes plus vous voir, mais vous êtes vous-même totalement aveugle ! Le corail qui vous entoure, loin de vous accorder encore la moindre protection, est devenu un piège invisible contre lequel vous risquez à chaque instant de vous blesser.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const doll = flags.inventory.doll;
      if (doll.acquired && !doll.used) {
        const text = `Juste avant que vous ne preniez une décision, il se passe quelque chose de totalement inattendu.`;
        const action = () => {
          useItem("doll", updateFlag);
          goToSection("far-corals-doll");
        }

        return (
          <Funnel text={text} action={action} />
        );
      }

      const dolphin = flags.inventory.dolphin;
      if (dolphin.acquired && !dolphin.used) {
        const text = `Juste avant que vous ne preniez une décision, il se passe quelque chose de totalement inattendu.`;
        const action = () => {
          useItem("dolphin", updateFlag);
          goToSection("far-corals-amulet");
        }

        return (
          <Funnel text={text} action={action} />
        );
      }

      const deathText = `Vous vous efforcez malgré tout de continuer à suivre la faille.`;
      const choices = [
        {
          "text": deathText,
          "action": () => {
            updateFlag("eatenByRaiahui", true);
            goToSection("raiahui-good-end", coatSentence(deathText));
          },
        },
        {
          "text": `Vous remontez vers la surface.`,
          "action": () => {
            updateFlag("bleeding", true);
            goToSection("i-hate-pearls");
          }
        }
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "far-corals-doll": {
    "text": `
<p> La figurine créée par le crocodile est tout à coup agitée de mouvements convulsifs, jusqu’à se détacher de la lanière par laquelle elle était retenue à votre taille. Vous ne saisissez pas ce qui est en train d’arriver, mais, un instant plus tard, vous sentez une main en bois — de taille tout à fait humaine — se refermer autour de la vôtre pour vous tirer vers le haut. Totalement aveugle mais étrangement confiante, vous vous laissez guider, accompagnant à peine le mouvement de petits battements de jambes.</p>

<p>Quelques instants plus tard, la main vous relâche et vous émergez hors de l’épais nuage. La surface ensoleillée se trouve à seulement quelques brasses au-dessus de vous. En contrebas, les récifs de corail parmi lesquels vous vous trouviez restent en bonne partie dissimulés par l’étrange obscurité. Vous ne parvenez pas à distinguer où se trouve Raiahui, mais vous ne pouvez de toute façon pas retenir votre respiration beaucoup plus longtemps.</p>
    `,
    "next": (goToSection) => {
      const text = `Vous remontez à l’air libre.`;
      const action = () => {goToSection("surface-close")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "far-corals-amulet": {
    "text": `
<p>Une multitude de sons à peine audibles est en train de vous parvenir, emplissant votre crâne jusqu’à presque le saturer. Brusquement, vous n’êtes plus aveugle. Vos yeux restent incapables de percer l’obscurité, mais, d’une façon que vous seriez incapable d’expliquer, vous percevez les formes de tout ce qui vous entoure, aussi bien celles du corail que celle — toute proche — de Raiahui.</p>

<p>Ne cherchant pas à comprendre ce phénomène miraculeux, vous vous hâtez de vous éloigner de votre poursuivante. Quelques instants vous suffisent à atteindre le point où la faille se resserre trop pour qu’elle puisse vous suivre. Vous continuez votre progression sans presque ralentir.</p>

<p>L’eau qui vous entoure retrouve progressivement sa transparence : vous pouvez de nouveau distinguer votre propre membres, puis le mélange désordonné des couleurs du corail. À mesure que la vue vous revient, votre étrange sens supplémentaire s’estompe. Lorsqu’il disparaît complètement, vous voyez l’amulette que vous portez se désagréger tout à coup. Ce phénomène surnaturel devait être son œuvre, mais il lui a coûté les derniers pouvoirs qu’elle possédait encore.</p>

<p>Derrière vous, la zone d’obscurité est loin d’avoir disparu. Vous ne pouvez pas distinguer où se trouve Raiahui.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Vous poursuivez sans attendre votre progression.`,
        "far-corals-last"
      );
    },
  },
  "i-hate-pearls": {
    "text": `
<p>Vous vous écorchez la jambe contre l’une des excroissances invisibles du corail, mais vous parvenez tant bien que mal à vous diriger vers la surface. L’obscurité qui vous entoure perd peu à peu son opacité : vous pouvez de nouveau distinguer vos propres membres, puis les reflets du soleil au-dessus de vous.</p>

<p>Mais lorsque l’eau achève de redevenir transparente, c’est pour vous révéler la forme souple et fuselée de Raiahui, juste en-dessous de vous ! Qu’elle ait deviné votre tentative ou simplement voulu échapper à la zone de ténèbres, elle est remontée en même temps que vous.</p>

<p>Elle se dirige droit sur vous aussitôt qu’elle vous aperçoit.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `Vous lui jetez le filet de la sorcière.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("far-net-surface");
          },
          "conditional": true,
        });
      }

      const deathText = `Vous tentez désespérément de lui échapper.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        }
      });

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "far-net-surface": {
    "text": `
<p>Saisissant le filet que vous aviez entouré autour de votre taille, vous le jetez en hâte vers Raiahui. Votre geste n’a ni la force ni la précision qui seraient normalement nécessaire, mais le filet de la sorcière n’a pas perdu sa vertu : il se déploie de lui-même et enveloppe étroitement votre poursuivante juste au moment où celle-ci allait vous atteindre. Raiahui se contorsionne furieusement, déchiquetant les mailles serrées pour parvenir à se libérer.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Vous vous hâtez de vous éloigner d’elle, tout en remontant progressivement à l’air libre.`,
        "surface-close",
      );
    },
  },
  "far-corals-sneaky": {
    "text": `
<p>Vous progressez de façon fluide, utilisant autant que possible le relief du corail pour que Raiahui ait du mal à vous apercevoir si elle venait à passer soudain au-dessus de vous. La crainte qui vous tenaille fait de cette lenteur délibérée une torture, mais vous vous forcez à ne pas aller plus vite.</p>

<p>Après quelques instants qui vous paraissent interminables, vous atteignez le point où les parois de corail se rapprochent suffisamment pour vous accorder de nouveau une relative sécurité. Vous jetez un coup d’oeil en arrière, mais ne distinguez toujours pas où se trouve Raiahui.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Vous reprenez sans plus attendre votre progression.`,
        "far-corals-last",
      );
    }
  },
  "far-corals-last": {
    "text": `
<p>La faille s’incurve sur la gauche et se resserre encore. Les deux masses de corail qui vous entourent se font si proches qu’elles commencent à se confondre et il vient un point où les espaces qui subsistent entre elles sont devenus trop étroits pour que vous puissiez encore vous y glisser. Vous allez devoir remonter.</p>

<p>Le manque d’air commence de toute façon à être difficile à supporter. Vous êtes capable de retenir très longtemps votre respiration, mais vous n’êtes pas un poisson !</p>

<p>Vous élevant prudemment jusqu’au rebord de l’anfractuosité, vous réalisez que votre parcours au milieu des récifs de corail ne vous a pas autant rapproché de l’îlot sablonneux que vous l’espériez. Du moins vous a-t-il permis d’échapper temporairement à Raiahui. Vous vous efforcez de distinguer où elle se trouve actuellement, mais sans succès.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous abandonnez définitivement votre abri et remontez vers la surface.`,
          "action": () => {
            goToSection("far-corals-last-out-quick");
          },
        },
        {
          "text": `Vous restez où vous êtes, malgré la sensation de brûlure qui commence à remplir vos poumons.`,
          "action": () => {
            const dolphin = flags.inventory.dolphin;
            if (dolphin.acquired && !dolphin.used) {
                useItem("dolphin", updateFlag);
                return goToSection("far-corals-last-out-slow-amulet");
            }

            updateFlag("weakened", true);
            goToSection("far-corals-last-out-slow")
          }
        },
      ];

      return (
        <Crossroads choices={choices} />
      )
    }
  },
  "far-corals-last-out-quick": {
    "text": `
<p>Vous abandonnez votre abri et remontez vers la surface. C’est à ce moment-là seulement que vous apercevez la forme fuselée de Raiahui, à une certaine distance, en train de vous chercher parmi les récifs de corail. Elle n’est pas tournée dans votre direction pour l’instant. Vous espérez que cela durera assez longtemps pour que vous puissiez vous éloigner.</p>
    `,
    "next": (goToSection) => {
      const text = `Vous franchissez en hâte la distance qui vous sépare encore de l’air libre.`;
      const action = () => {goToSection("surface-close")};

      return (
        <Funnel text={text} action={action} />
      )
    }
  },
  "far-corals-last-out-slow-amulet": {
    "text": `
<p>Il vous semble tout à coup qu’une profonde bouffée d’air pur s’infiltre dans vos poumons. La tentation grandissante de remonter à la surface se volatilise et vous vous sentez capable de retenir votre respiration au moins aussi longtemps que vous l’avez déjà fait. À votre cou, l’amulette en forme de dauphin se désagrège et vous devinez qu’elle vient d’épuiser pour vous ses derniers pouvoirs.</p>

<p>Les instants s’écoulent et vous n’apercevez toujours pas Raiahui. Continuer d’attendre indéfiniment n’est guère susceptible d’augmenter vos chances ; vous devez prendre le risque de remonter.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Vous quittez donc votre refuge temporaire et vous dirigez vers la surface.`;
      const action = () => {
        if (flags.bleeding) {
          return goToSection("far-corals-last-out-slow-amulet-bleeding");
        }

        goToSection("far-corals-last-out-quick");
      }

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "far-corals-last-out-slow-amulet-bleeding": {
    "text": `
<p>Vous avez à peine quitté votre abri pour vous diriger vers la surface lorsque la forme souple de Raiahui surgit tout à coup sur votre droite ! Elle savait où vous étiez cachée et guettait le moment où vous seriez forcée d’en sortir !</p>

<p>Une accélération foudroyante la propulse dans votre direction.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `Vous lui jetez le filet de la sorcière.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("far-net-surface");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `Vous écrasez les perles noires en votre possession.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("i-hate-pearls-2");
          },
          "conditional": true,
        });
      }

      const deathText = `Vous tentez désespérément de lui échapper.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        }
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "i-hate-pearls-2": {
    "text": `
<p>Juste à temps, vous vous souvenez des perles noires en votre possession. Vous les écrasez d’un geste convulsif, sans même les retirer du sachet accroché à votre taille, et un épais nuage de ténèbres impénétrables vous enveloppe instantanément.</p>

<p>Totalement aveugle, vous voulez d’abord continuer à vous diriger vers la surface, mais vous réalisez soudain que c’est sans doute ce à quoi s’attendra Raiahui. Fort heureusement, le sursis que vous a accordé l’amulette vous permet de retenir votre respiration encore un certain temps. Interrompant donc votre remontée, vous vous mettez à nager vigoureusement dans une direction perpendiculaire à celle d’où venait votre poursuivante.</p>

<p>L’eau qui vous entoure retrouve sa transparence à mesure que vous vous éloignez de l’endroit où vous avez écrasé les perles. Vous distinguez de nouveau vos propres membres, puis les reflets du soleil contre la surface, puis les récifs de corail et l’îlot qui constitue votre destination. Risquant un regard en arrière, vers la zone d’obscurité qui s’étire et se dilue avec une grande lenteur, vous ne parvenez pas à apercevoir Raiahui.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `L’effet de l’amulette s’est totalement estompé et vous êtes donc contrainte de remonter à l’air libre.`,
        "surface-close",
      );
    }
  },
  "far-corals-last-out-slow": {
    "text": `
<p>Vous vous contraignez à rester où vous êtes, cherchant à apercevoir Raiahui malgré les ombres qui s’amoncellent devant vos yeux. Vous plaquez une main contre votre bouche pour retenir le réflexe mortel qui vous ferait tenter de prendre une inspiration.</p>

<p>Les instants passent et vous ne distinguez toujours nulle part votre poursuivante. Votre crâne s’est rempli d’un brouillard noir et rouge qui ne cesse de s’épaissir. Finalement, vous réalisez que vous n’avez plus le choix : vous devez prendre le risque de remonter ou mourir noyée.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Vous quittez votre refuge temporaire et vous dirigez vers la surface en toute hâte.`;
      const action = () => {
        if (flags.bleeding) {
          return goToSection("far-corals-last-out-slow-bleeding");
        }

        goToSection("surface-close");
      };

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "far-corals-last-out-slow-bleeding": {
    "text": `
<p>Vous avez à peine quitté votre abri pour vous diriger vers la surface lorsque la forme souple de Raiahui surgit tout à coup sur votre droite ! Elle savait où vous étiez cachée et guettait le moment où vous seriez forcée d’en sortir !</p>

<p>Une accélération foudroyante la propulse dans votre direction.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `Vous lui jetez le filet de la sorcière.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("far-net-surface");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `Vous écrasez les perles noires en votre possession.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("i-hate-pearls-3");
          },
          "conditional": true,
        });
      }

      const deathText = `Vous tentez désespérément de lui échapper.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        }
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "i-hate-pearls-3": {
    "text": `
<p>Vous écrasez toutes les perles dont vous disposez et un nuage noir impénétrable se répand autour de vous. Totalement aveugle, vous vous dirigez vers la surface pour pouvoir enfin respirer.</p>

<p>Après quelques brasses vigoureuses, l’obscurité commence à perdre son opacité : vous pouvez de nouveau distinguer vos propres membres, puis les reflets du soleil au-dessus de vous.</p>

<p>Mais lorsque l’eau achève de redevenir transparente, c’est pour vous révéler la forme souple et fuselée de Raiahui, juste en-dessous de vous ! Devinant peut-être que vous manquiez d’air, elle s’est également rapprochée de la surface. Elle se dirige droit vers vous aussitôt qu’elle vous aperçoit de nouveau.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `Vous lui jetez le filet de la sorcière.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("far-net-surface");
          },
          "conditional": true,
        });
      }

      const deathText = `Vous tentez désespérément de lui échapper.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        }
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "surface-close": {
    "text": `
<p>Votre tête émerge brusquement à la surface et une profonde inspiration fait de nouveau affluer l’air dans vos poumons. Mais la peur qui vous tenaille ne vous laisse pas éprouver le moindre soulagement. Les reflets du soleil contre les vagues ne vous permettent pas de bien scruter les eaux de la passe, mais vous savez que Raiahui se trouve quelque part en-dessous de vous. Vous espérez qu’elle ne vous a pas vu remonter à la surface, mais cela ne vous accorde qu’un faible répit. Elle ne peut pas perdre totalement votre trace alors que vous n’avez qu’une seule destination possible.</p>

<p>L’îlot de sable se trouve droit devant vous, à une distance qui vous paraîtrait négligeable dans des circonstances normales, mais qui vous emplit actuellement d’une incertitude glaçante. Même en nageant aussi vite que vous en êtes capable, pouvez-vous vraiment la franchir sans être rattrapée ?</p>

<p>Une alternative vous vient soudain à l’esprit : vous pourriez plonger de nouveau vers le fond de la passe — de façon à être plus difficilement repérable  — puis nager jusqu’à l’îlot en suivant une trajectoire indirecte, qui vous rapprocherait de l’intérieur du lagon. Raiahui aura peut-être plus de mal à vous repérer si vous ne suivez pas le chemin le plus bref jusqu’à votre destination.</p>
    `,
    "next": (goToSection) => {
      const choices = [
        {
          "text": `Vous restez à la surface et nagez de toutes vos forces vers l’îlot.`,
          "action": () => {goToSection("final-stretch-straight")},
        },
        {
          "text": `Vous plongez de nouveau et essayez d’atteindre l’îlot sans être repérée.`,
          "action": () => {goToSection("final-stretch-oblique")},
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "final-stretch-straight": {
    "text": `
<p>La distance qui vous sépare de votre destination diminue à une vitesse qui vous exalterait lors d’une course ordinaire, mais qui est loin de suffire à vous donner espoir en ce moment. Jamais vous n’avez à ce point perçu l’eau comme un milieu étranger et vos mouvements de nage comme une imitation dérisoire de ses véritables habitants.</p>

<p>Pire que tout, vous pouvez sentir qu’un début d’épuisement est en train de vous gagner.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Vous vous efforcez désespérément de maintenir votre allure malgré tout.`;

      if (flags.boostedByFruit) {
        const action = () => {
          updateFlag("boostedByFruit", false);
          goToSection("trial-saved-by-fruit");
        };

        return (
          <Funnel action={action} text={text} />
        );
      }

      if (flags.drunk || flags.weakened) {
        const action = () => {goToSection("exhausted")};

        return (
          <Funnel text={text} action={action} />
        );
      }

      const amulet = flags.inventory.dolphin;
      if (amulet.acquired && !amulet.used) {
        const action = () => {
          useItem("dolphin", updateFlag);
          goToSection("trial-saved-by-dolphin");
        };

        return (
          <Funnel action={action} text={text} />
        );
      }

      if (flags.wellRested) {
        const action = () => {goToSection("trial-saved-by-sloth")};

        return (
          <Funnel action={action} text={text} />
        );
      }

      const action = () => {goToSection("exhausted")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "final-stretch-oblique": {
    "text": `
<p>Vous plongez de nouveau et nagez vigoureusement pour atteindre le fond de la passe. Vous ne parvenez pas à distinguer où se trouve Raiahui et vous ne pouvez qu’espérer que l’inverse est également vrai.</p>

<p>Ne pas suivre le trajet le plus rapide jusqu’à la terre ferme révolte votre instinct de survie, mais vous vous forcez à le faire malgré tout. Vous ne pouvez qu’espérer que vous parviendrez à retenir votre respiration suffisamment longtemps.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Vous nagez aussi vite que vous en êtes capable vers le lagon.`;

      if (flags.bleeding) {
        const action = () => {goToSection("final-stretch-oblique-bleeding")}

        return (
          <Funnel text={text} action={action} />
        );
      }

      const dolphin = flags.inventory.dolphin;
      if (dolphin.acquired && !dolphin.used) {
        const action = () => {
          useItem("dolphin", updateFlag);
          goToSection("final-stretch-oblique-dolphin");
        }

        return (
          <Funnel text={text} action={action} />
        );
      }

      if (flags.drunk || flags.weakened) {
        const action = () => {goToSection("final-stretch-oblique-weak")}

        return (
          <Funnel text={text} action={action} />
        );
      }

      if (flags.wellRested) {
        const action = () => {goToSection("final-stretch-oblique-strong")}

        return (
          <Funnel text={text} action={action} />
        );
      }

      const action = () => {goToSection("final-stretch-oblique-default")}

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "final-stretch-oblique-bleeding": {
    "text": `
<p>Alors que vous jugez vous être suffisamment éloignée pour vous diriger de nouveau vers l’îlot qui constitue votre destination, un frémissement de terreur vous parcourt tout à coup. Raiahui vient d’apparaître sur votre droite et vous la voyez se diriger vers vous à vive allure !</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `Vous lui jetez le filet de la sorcière.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("final-stretch-oblique-bleeding-net");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `Vous écrasez les perles noires en votre possession.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("final-stretch-oblique-bleeding-pearls");
          },
          "conditional": true,
        });
      }

      const deathText = `Vous nagez de toutes vos forces en direction de l’îlot.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        },
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "final-stretch-oblique-bleeding-net": {
    "text": `
<p>Saisissant le filet que vous aviez entouré autour de votre taille, vous le jetez en hâte vers Raiahui. Votre geste n’a ni la force ni la précision qui seraient normalement nécessaire, mais le filet de la sorcière n’a pas perdu sa vertu : il se déploie de lui-même et enveloppe étroitement votre poursuivante juste au moment où celle-ci allait vous atteindre. Raiahui se contorsionne furieusement, déchiquetant les mailles serrées pour parvenir à se libérer.</p>

<p>Il n’est plus question de discrétion à présent ! Vous remontez en toute hâte vers la surface. Votre tête émerge bientôt à l’air libre.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Vous prenez tout juste le temps d’inspirer profondément avant de nager de toutes vos forces vers l’îlot sablonneux.`,
        "final-stretch-straight",
      );
    }
  },
  "final-stretch-oblique-bleeding-pearls": {
    "text": `
<p>Vous écrasez toutes les perles dont vous disposez et un nuage noir impénétrable se répand autour de vous. Totalement aveugle, vous nagez dans la direction approximative de l’îlot, espérant échapper au péril mortel que vous savez être tout proche.</p>

<p>Après quelques brasses énergiques, vous parvenez de nouveau à distinguer vos propres membres, puis la pâleur du fond sablonneux. Le manque d’air commence à devenir difficile à supporter.</p>

<p>L’eau achève de redevenir transparente autour de vous. Mais au lieu de remonter à la surface pour y respirer, vous vous immobilisez soudain, frappée par la terreur en voyant la forme souple et fuselée de Raiahui passer lentement devant vous. Elle est à une certaine distance, mais vous repère au moment même où vous la apercevez et oblique brusquement dans votre direction.</p>

<p>Vous réalisez qu’elle est parvenue à rester à l’extérieur du nuage opaque. Même s’il vous a temporairement dérobée à ses yeux, elle n’a pas eu de mal à deviner dans quelle direction vous vous dirigiez et à vous couper la route.</p>

<p>Une accélération foudroyante la propulse vers vous, sa gueule entrouverte dévoilant ses nombreuses dents effilées.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `Vous lui jetez le filet de la sorcière.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("final-stretch-oblique-bleeding-net");
          },
          "conditional": true,
        });
      }

      choices.push({
        "text": `Vous nagez de toutes vos forces en direction de l’îlot.`,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end");
        },
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "final-stretch-oblique-dolphin": {
    "text": `
<p>Une fois que vous jugez vous être suffisamment éloignée, vous vous dirigez de nouveau vers l’îlot qui constitue votre destination.</p>

<p>Vous avez franchi la moitié de la distance qui vous en sépare encore lorsqu’il vous semble tout à coup qu’une profonde bouffée d’air pur s’infiltre dans vos poumons. La tentation grandissante de remonter à la surface se volatilise et vous vous sentez capable de retenir votre respiration au moins aussi longtemps que vous l’avez déjà fait. À votre cou, l’amulette en forme de dauphin se désagrège et vous devinez qu’elle vient d’épuiser pour vous ses derniers pouvoirs.</p>

<p>Vous n’êtes plus guère éloignée de l’îlot lorsque vous apercevez soudain la forme fuselée de Raiahui sur votre droite. Elle vous a finalement repérée et se dirige vers vous à une vitesse foudroyante !</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Terrifiée à l’idée d’être rattrapée au dernier instant, vous remontez à la surface et nagez aussi vite que vous en êtes capable pour atteindre enfin la terre ferme.`,
        "final-island",
      );
    }
  },
  "final-stretch-oblique-weak": {
    "text": `
<p>Une fois que vous jugez vous être suffisamment éloignée, vous vous dirigez de nouveau vers l’îlot qui constitue votre destination.</p>

<p>Vous avez franchi un peu plus de la moitié de la distance qui vous en sépare encore lorsque la brûlure de vos poumons commence à devenir insupportable. Vous redoublez d’effort, mais c’est en vain. Vous réalisez que vous ne pourrez pas retenir votre respiration jusqu’à l’îlot.</p>

<p>Vous remontez rapidement vers la surface… et, alors que vous êtes sur le point de l’atteindre, vous apercevez tout à coup tout à coup Raiahui se dirigeant droit sur vous à une vitesse effrayante !</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `Vous lui jetez le filet de la sorcière.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("final-stretch-oblique-weak-net");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `Vous écrasez les perles noires en votre possession.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("final-stretch-oblique-weak-pearls");
          },
          "conditional": true,
        });
      }

      const deathText = `Vous nagez de toutes vos forces en une tentative désespérée pour lui échapper.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        },
      });

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "final-stretch-oblique-weak-net": {
    "text": `
<p>Saisissant le filet que vous aviez entouré autour de votre taille, vous le jetez en hâte vers Raiahui. Votre geste n’a ni la force ni la précision qui seraient normalement nécessaire, mais le filet de la sorcière n’a pas perdu sa vertu : il se déploie de lui-même et enveloppe étroitement votre poursuivante juste au moment où celle-ci allait vous atteindre. Raiahui se contorsionne furieusement, déchiquetant les mailles serrées pour parvenir à se libérer.</p>

<p>Il n’est plus question de discrétion à présent !</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Votre tête émerge à l’air libre et vous prenez tout juste le temps d’inspirer profondément avant de nager de toutes vos forces pour atteindre enfin l’îlot sablonneux.`,
        "final-island",
      );
    }
  },
  "final-stretch-oblique-weak-pearls": {
    "text": `
<p>Vous écrasez toutes les perles dont vous disposez et un nuage noir impénétrable se répand autour de vous. L’espace d’un bref instant, vous êtes totalement aveugle. Puis votre tête émerge à l’air libre et vous pouvez de nouveau voir et respirer.</p>

<p>La zone de noirceur opaque s’étend sur une large surface et vous êtes incapable de deviner où se trouve actuellement Raiahui. Vous ne pouvez qu’espérer que l’inverse est également vrai.</p>
    `,
    "next": (goToSection) => {
      const text = `Vous nagez aussi vite que vous en êtes capable pour atteindre enfin l’îlot sablonneux.`;
      const action = () => {goToSection("final-island")};

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "final-stretch-oblique-strong": {
    "text": `
<p>Une fois que vous jugez vous être suffisamment éloignée, vous vous dirigez de nouveau vers l’îlot qui constitue votre destination.</p>

<p>À mesure que vous vous en rapprochez, vous éprouvez la tentation grandissante de remonter à l’air libre ne serait-ce que pour un bref moment. Mais vous êtes une nageuse expérimentée, habituée à retenir votre respiration pendant de longues périodes. Vous restez près du fond sablonneux et continuez à progresser régulièrement vers votre objectif.</p>

<p>Vous n’êtes plus guère éloignée de l’îlot lorsque vous apercevez soudain la forme fuselée de Raiahui sur votre droite. Elle vous a finalement repérée et se dirige vers vous à une vitesse foudroyante !</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Terrifiée à l’idée d’être rattrapée au dernier instant, vous remontez à la surface et nagez aussi vite que vous en êtes capable pour atteindre enfin la terre ferme.`,
        "final-island",
      );
    }
  },
  "final-stretch-oblique-default": {
    "text": `
<p>Une fois que vous jugez vous être suffisamment éloignée, vous vous dirigez de nouveau vers l’îlot qui constitue votre destination.</p>

<p>Vous avez franchi un peu plus de la moitié de la distance qui vous en sépare encore lorsque la brûlure de vos poumons commence à devenir très pénible. Êtes-vous vraiment capable de retenir votre respiration jusqu’à cet îlot ?</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous vous forcez à rester sous l’eau jusqu’au bout.`,
          "action": () => {
            updateFlag("weakened", true);
            goToSection("final-stretch-oblique-default-force");
          },
        },
        {
          "text": `Vous prenez le risque de remonter à la surface pour respirer.`,
          "action": () => {goToSection("final-stretch-oblique-default-interrupt")},
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "final-stretch-oblique-default-force": {
    "text": `
<p>Vous nagez vigoureusement, malgré la brûlure qui dévore désormais vos poumons et les ombres qui s’amoncellent devant vos yeux. Votre mâchoire est crispée par l’effort de résister au réflexe mortel qui vous ferait tenter de prendre une inspiration.</p>

<p>Un brouillard noir et rouge est en train de remplir votre crâne lorsque vous réalisez que vous n’êtes plus qu’à une faible distance de l’îlot. Au même instant, vous apercevez soudain la forme fuselée de Raiahui sur votre droite. Elle vous a finalement repérée et se dirige vers vous à une vitesse foudroyante !</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Terrifiée à l’idée d’être rattrapée au dernier instant, vous remontez à la surface et, prenant à peine le temps de respirer, vous nagez aussi vite que vous en êtes capable pour atteindre enfin la terre ferme.`,
        "final-island",
      );
    }
  },
  "final-stretch-oblique-default-interrupt": {
    "text": `
<p>Vous remontez rapidement vers la surface… et, alors que vous êtes sur le point de l’atteindre, vous apercevez tout à coup tout à coup Raiahui se dirigeant droit sur vous à une vitesse terrifiante !</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `Vous lui jetez le filet de la sorcière.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("final-stretch-oblique-weak-net");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `Vous écrasez les perles noires en votre possession.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("final-stretch-oblique-weak-pearls");
          },
          "conditional": true,
        });
      }

      const deathText = `Vous nagez de toutes vos forces en une tentative désespérée pour lui échapper.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        },
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "exhausted": {
    "text": `
<p>La panique ne parvient plus à vous faire ignorer votre fatigue. Vos membres sont lourds, votre respiration difficile et vos mouvements se font inexorablement plus lents. Jetant un coup d’œil angoissé derrière vous, vous voyez à travers l’eau transparente Raiahui se rapprocher rapidement. Vous n’aurez pas le temps d’atteindre l’île avant qu’elle ne vous rattrape ! Allez-vous échouer si près du but ?</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `Vous lui jetez le filet de la sorcière.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("trial-exhausted-net");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `Vous écrasez les perles noires en votre possession.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("trial-exhausted-pearls");
          },
          "conditional": true,
        });
      }

      choices.push({
        "text": `Vous tentez désespérément de nager assez vite pour lui échapper.`,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end");
        },
      });

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "trial-exhausted-net": {
    "text": `
<p>Le désespoir est en train de vous envahir lorsque vous vous souvenez tout à coup du filet que vous avez enroulé autour de votre taille. Vous vous en emparez en hâte et le jetez vers Raiahui. Votre geste n’a presque aucune force, mais le filet de la sorcière n’a pas perdu sa vertu : il se déploie de lui-même et enveloppe étroitement votre poursuivante alors qu’elle allait vous atteindre. Raiahui se contorsionne furieusement, déchiquetant les mailles serrées pour parvenir à se libérer.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Avec un sursaut d’énergie, vous nagez vers l’île sablonneuse aussi vite que vous le pouvez encore.`,
        "final-island",
      );
    },
  },
  "trial-exhausted-pearls": {
    "text": `
<p>Le désespoir est en train de vous envahir lorsque vous vous souvenez tout à coup des perles noires que vous transportez. Vous vous en emparez en hâte et les écrasez toutes à la fois. Les eaux qui vous entourent deviennent soudain d’un noir impénétrable, vous dissimulant aux yeux de Raiahui avant qu’elle ne puisse vous atteindre.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Avec un sursaut d’énergie, vous nagez vers l’île sablonneuse aussi vite que vous le pouvez encore.`,
        "final-island",
      );
    },
  },
  "trial-calabashes": {
    "text": (flags) => {
      return `
<p>Plusieurs des calebasses qui jonchent la plage sont déjà vides, mais vous n’avez pas trop de difficulté à en trouver une de pleine. Vous en reniflez le contenu, ce qui vous permet de confirmer qu’il s’agit bel et bien de vin de palme. Ce n’est normalement pas un alcool bien fort et en boire une gorgée ou deux n’aurait guère d’effet sur vous, mais il vous semble inutile de prendre ce risque juste avant une course.</p>

<p>Raiahui ne partage clairement pas cette prudence, car vous la voyez boire sans aucune retenue au milieu des autres adolescents !</p>

${flags.tastedFruit? ``: `<p>Vous laissez la calebasse où elle se trouve et réfléchissez à ce qu’il convient de faire à présent.</p>`}
      `;
    },
    "next": preludeNext,
  },
  "trial-brew-fire": {
    "text": `
<p>Vous écrasez facilement tous les fruits rouges qui vous restent et en mélangez le jus avec le contenu de la calebasse. Le simple fait d’entamer un seul d’entre eux ayant suffi à vous mettre la gorge en feu, le breuvage que vous préparez ainsi devrait avoir quelques similarités avec la lave en fusion. Raiahui va très rapidement se rendre compte qu’il ne s’agit pas de vin de palme ordinaire, mais pas avant d’en avoir avalé une gorgée ou deux.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Il est à présent temps d’aller trouver votre concurrente.`,
        "trial-raiahui"
      );
    },
  },
  "raiahui-poisoned": {
    "text": `
<div class="conversation">
<p>— Ce n’est pas moi qui vais t’empêcher de te saoûler, dites-vous en lui tendant votre calebasse. Tiens, vide aussi celle-ci, si tu t’imagines vraiment que tu pourras me battre à la course ensuite !</p>
</div>

<p>Votre défi fait courir des exclamations amusées parmi la jeune assistance. Raiahui accepte votre présent avec un sourire de confiance totale. L’idée que vous lui tendiez un piège ne lui effleure visiblement pas l’esprit.</p>

<p>Ne tenant pas à vous attarder, vous descendez ensuite la plage d’un pas rapide. Juste au moment où vous atteignez la rive, un sursaut de brouhaha vous fait vous retourner : au milieu des autres adolescents, étonnés et quelquefois moqueurs, Raiahui est courbée en deux, la main pressée contre sa bouche comme si elle allait vomir.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Désormais assurée de disposer d’une avance confortable, vous plongez.`;

      return trueStartFunnel(text, goToSection, flags, updateFlag);
    }
  },
  "trial-raiahui-slow": {
    "text": `
<div class="conversation">
<p>— Si tu n’es pas pressée, je ne le suis pas non plus, déclarez-vous en ramassant l’une des calebasses de vin de palme éparpillées sur le sol.</p>
</div>

<p>Raiahui affecte d’accueillir cette décision avec désinvolture, mais vous sentez que votre présence a subtilement modifiée l’atmosphère qui règne parmi les adolescents. Les paroles deviennent plus brèves et plus espacées, les plaisanteries s’échangent à demi-mot, les rires restent tout aussi fréquents mais se font moins sonores, des coups d’œil incessants tissent une toile de communication muette dont vous êtes le centre.</p>

<p>Quelques instants s’écoulent. Vous portez périodiquement la calebasse à vos lèvres et faites mine de boire. En réalité, c’est à peine si vous laissez à chaque fois une minuscule quantité de vin de palme traverser votre bouche. L’excitation sous-jacente qui vous entoure est telle que personne ne remarque ce subterfuge.</p>

<p>Raiahui laisse tomber sa calebasse vide sur le sable, vous adresse un regard inquisiteur, puis se cherche ostensiblement autre chose à boire. Il est désormais très clair qu’elle ne souhaite pas entamer la course en même temps que vous. Vous allez devoir prendre l’initiative.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [
        {
          "text": `Vous entamez la course sans attendre davantage.`,
          "action": () => {
            cleanInventoryBeforeRace(flags, updateFlag);
            updateFlag("eatenByRaiahui", true);
            goToSection("trial-copypaste-1");
          },
        },
        {
          "text": `Vous provoquez Raiahui pour qu’elle parte en même temps que vous.`,
          "action": () => {
            cleanInventoryBeforeRace(flags, updateFlag);
            updateFlag("eatenByRaiahui", true);
            goToSection("trial-copypaste-2");
          },
        },
        {
          "text": `Vous prétextez un besoin naturel pour vous éclipser parmi les arbres, puis entamer la course sans qu’elle puisse vous voir.`,
          "action": () => {
            updateFlag("playedTheFool", true);
            goToSection("trial-bathroom-break");
          },
        },
        {
          "text": `Vous essayez de dérober le couteau en ivoire accroché à son pagne.`,
          "action": () => {
            goToSection("trial-copypaste-3");
          },
        },
      ];

      const alcohol = flags.inventory.alcohol;
      if (alcohol.acquired && !alcohol.used) {
        choices.push({
          "text": `Vous lui offrez votre propre calebasse d’alcool fort.`,
          "action": () => {
            useItem("alcohol", updateFlag);
            goToSection("trial-copypaste-4");
          },
          "conditional": true,
        });
      }

      const calabash = flags.inventory.fieryCalabash;
      if (calabash.acquired && !calabash.used) {
        choices.push({
          "text": `Vous lui offrez la calebasse à laquelle vous avez mélangé le jus des fruits rouges.`,
          "action": () => {
            useItem("fieryCalabash", updateFlag);
            goToSection("trial-copypaste-5");
          },
          "conditional": true,
        });
      }

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "trial-copypaste-1": {
    "text": `
<p>Vous saisissez mal les raisons du comportement de Raiahui, mais à quoi bon refuser l’avance qu’elle s’obstine à vouloir vous accorder ? Vous quittez le groupe sans un mot et vous dirigez à grands pas vers la rive, ignorant les gloussements qui vous poursuivent. Vous jetez de côté votre calebasse encore presque pleine et plongez sans plus attendre dans les eaux tièdes de la passe. Quelques brasses vigoureuses sous la surface vous propulsent en direction de l’île sablonneuse. Lorsque vous refaites surface, un rapide regard en arrière vous apprend que Raiahui se tient toujours sur la plage, entourée des autres adolescents. Elle ne semble même pas regarder dans votre direction.</p>

<p>Vous avez déjà accompli le quart du trajet lorsque des exclamations excitées vous parviennent aux oreilles depuis la plage. Votre concurrente vient sans doute enfin de se lancer à votre poursuite. Vous vous contentez d’accélérer légèrement le rythme de vos mouvements. Quand bien même Raiahui serait vraiment meilleure nageuse que vous-même, il vous suffit de ne pas épuiser vos forces trop vite pour que votre avance vous garantisse virtuellement la victoire.</p>

<p>Et pourtant, une inquiétude irrationnelle s’est insinuée en vous. Vous jetez de manière espacée quelques coups d’oeil furtifs en arrière, mais ils ne vous permettent pas d’apercevoir où se trouve Raiahui, comme si elle nageait sans jamais remonter à la surface. Saisie tout à coup d’une peur sans motif apparent, vous hâtez la cadence de votre nage plus tôt que vous n’en aviez l’intention, alors que vous n’avez pas tout à fait accompli la moitié du trajet.</p>

<p>Mais le pressentiment glaçant qui ne cesse de grandir dans votre esprit vous dit que cela ne change rien.</p>

<p>Il vous semble désormais, à chaque nouveau mouvement de vos membres, que le point d’arrivée s’éloigne un peu plus et que se rapproche inexorablement quelque chose d’horrible.</p>

<hr/>
    ` + raiahuiGoodEndText,
    "next": endGame,
  },
  "trial-copypaste-2": {
    "text": `
<div class="conversation">
<p>— Nous avons assez bu, il est temps de commencer la course.</p>
<p>— J’ai encore un peu soif, fait Raiahui en souriant. Vas-y, je te rattraperai.</p>
<p>— Je ne suis pas là pour jouer ! Si tu ne débutes pas cette course tout de suite, en même temps que moi, je renonce à participer à ton rite de passage et tu pourras attendre la venue du prochain étranger !</p>
</div>

<p>Une expression à la fois alarmée et vexée passe sur le visage de Raiahui. Elle regarde les adolescents qui l’entourent comme si elle en espérait un conseil, puis hausse finalement les épaules.</p>

<div class="conversation">
<p>— Comme tu veux, mais c’est tant pis pour toi.</p>
</div>

<p>Vous descendez ensemble vers la rive, suivies de toute la jeune assistance, que la scène semble beaucoup amuser. Des plaisanteries s’échangent autour de vous, mais vous n’y prêtez guère attention. Votre adversaire affiche quant à elle une désinvolture ostensible et vous la voyez même prendre quelques gorgées d’alcool supplémentaires au goulot d’une calebasse.</p>

<p>Les eaux tièdes de la passe se referment en même temps sur vous deux, mais quelques brasses vigoureuses vous permettent de passer devant Raiahui. Vous savez que la distance à franchir va vous imposer d’économiser vos forces, mais le fait de se retrouver d’entrée de jeu derrière vous devrait ébranler la confiance en elle-même de votre concurrente.</p>

<p>Votre tête émerge finalement à la surface et vous êtes alors presque assourdie par la cacophonie de cris des adolescents restés sur la plage. Raiahui est toujours sous l’eau, mais vous ne perdez pas un instant à essayer de déterminer sa position exacte. A présent que la course a commencé, l’habitude vous fait faire abstraction de tout ce qui est extérieur à vos mouvements de nage.</p>

<p>Mais cet état de concentration ne dure que jusqu’à votre inspiration suivante. Quelque chose ne va pas. Raiahui n’a toujours pas reparu et les cris provenant de la plage sont en train d’atteindre un sommet d’excitation stridente.</p>

<p>Sans savoir pourquoi, vous sentez grandir en vous le pressentiment glaçant d’avoir commis une terrible erreur.</p>

<hr/>
    ` + raiahuiGoodEndText,
    "next": endGame,
  },
  "trial-bathroom-break": {
    "text": `
<p>Des éclats de rire explosent tout autour de vous quand, feignant l’embarras, vous laissez entendre que vous avez un besoin urgent à satisfaire.</p>

<div class="conversation">
<p>— Vas-y, vas-y, vous dit Raiahui en étouffant un gloussement. Ne t’inquiète pas, je ne partirai pas en douce pendant que tu es occupée.</p>
</div>

<p>Vous vous hâtez de disparaître parmi les palmiers, suivie par les regards amusés des adolescents. Sitôt qu’ils ne peuvent plus vous apercevoir, vous vous débarrassez de la calebasse – encore presque pleine – et traversez en courant la végétation jusqu’à un point de la plage suffisamment éloigné. Ce point de départ alternatif augmentera à peine la distance que vous avez à franchir pour atteindre l’îlot qui constitue la destination de la course.</p>

<p>Dissimulée derrière un tronc suffisamment épais, vous jetez un coup d’œil rapide dans la direction où se trouvent Raiahui et les autres adolescents de la tribu. L’un d’entre eux pourrait peut-être vous apercevoir pendant que vous traverserez la plage, mais leur état de dissipation vous fait juger que les chances sont en votre faveur. Vous espérez qu’il retardera par ailleurs le moment où votre concurrente réalisera que votre absence s’est trop prolongée.</p>

<p>Vous prenez plusieurs profondes inspirations, puis vous quittez votre cachette et traversez en quelques enjambées rapides la distance qui vous sépare de la rive. Les eaux tièdes et transparentes de la passe se referment sur vous lorsque vous plongez. Vous glissez un instant, portée par l’élan de votre plongeon, avant de vous mettre à nager. Pour ne pas risquer d’être aperçue avant d’avoir acquis une solide avance, vous prévoyez de ne remonter à la surface que le plus tard possible.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      return trueStartFunnel(
        `Vous nagez à une allure modérée, de manière à conserver l’essentiel de vos forces.`,
        goToSection,
        flags,
        updateFlag,
      );
    }
  },
  "trial-copypaste-3": {
    "text": `
<p>Vous profitez de ce que Raiahui se penche pour ramasser une nouvelle calebasse pour lui subtiliser adroitement son couteau. Mais elle s’en rend compte immédiatement et il n’y a plus la moindre trace d’amusement dans le regard qu’elle dirige sur vous.</p>

<div class="conversation">
<p>— Rends-moi ça ! Rends-moi ça tout de suite !</p>
</div>

<p>Laissant tomber la calebasse sur le sable, elle se jette sur vous pour récupérer sa possession.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous jetez le couteau dans le lagon.`,
          "action": () => {
            cleanInventoryBeforeRace(flags, updateFlag);
            updateFlag("eatenByRaiahui", true);
            goToSection("knife-sea");
          },
        },
        {
          "text": `Vous jetez le couteau parmi les arbres qui bordent la plage.`,
          "action": () => {
            goToSection("knife-land");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "trial-copypaste-4": {
    "text": `
<div class="conversation">
<p>— J’ai vraiment assez bu, prétendez-vous. Pas toi ?</p>
<p>— Pas du tout, répond Raiahui avec assurance. Je tiens très bien l’alcool.</p>
<p>— Eh bien, je n’ai pas de raison de t’empêcher de te saoûler, dites-vous en lui tendant votre calebasse. Tiens, vide aussi celle-ci, si tu t’imagines vraiment que tu pourras me battre à la course ensuite !</p>
</div>

<p>Votre défi fait courir des exclamations amusées parmi la jeune assistance. Raiahui accepte votre présent avec un sourire de confiance totale. Même si elle réalise que cette boisson est autrement plus forte que du simple vin de palme, vous soupçonnez qu’elle videra tout de même l’essentiel de la calebasse, ne serait-ce que pour ne pas perdre la face.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      return trueStartFunnel(
        `Laissant votre concurrente s’enivrer plus qu’elle ne devrait, vous traversez rapidement la plage en direction de la rive.`,
        goToSection,
        flags,
        updateFlag,
      );
    },
  },
  "trial-copypaste-5": {
    "text": `
<div class="conversation">
<p>— J’ai vraiment assez bu, prétendez-vous. Pas toi ?</p>
<p>— Pas du tout, répond Raiahui avec assurance. Je tiens très bien l’alcool.</p>
<p>— Eh bien, je n’ai pas de raison de t’empêcher de te saoûler, dites-vous en lui tendant votre calebasse. Tiens, vide aussi celle-ci, si tu t’imagines vraiment que tu pourras me battre à la course ensuite !</p>
</div>

<p>Votre défi fait courir des exclamations amusées parmi la jeune assistance. Raiahui accepte votre présent avec un sourire de confiance totale. L’idée que vous lui tendiez un piège ne lui effleure visiblement pas l’esprit.</p>

<p>Ne tenant pas à vous attarder, vous descendez ensuite la plage d’un pas rapide. Juste au moment où vous atteignez la rive, un sursaut de brouhaha vous fait vous retourner : au milieu des autres adolescents, étonnés et quelquefois moqueurs, Raiahui est courbée en deux, la main pressée contre la bouche comme si elle allait vomir.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      return trueStartFunnel(
        `Désormais assurée de disposer d’une avance confortable, vous plongez.`,
        goToSection,
        flags,
        updateFlag,
      );
    },
  },
  "trial-hide-closer": {
    "text": `
<p>Vous prenez une profonde inspiration et plongez à nouveau. Quelques brasses énergiques vous permettent de vous enfoncer rapidement sous la surface. Un frémissement d’espoir vous saisit lorsque vous découvrez, juste au-dessus du sol sabloneux, un renfoncement dans les formes baroques du récif le plus proche. Vous vous glissez sans attendre dans cette cachette et restez aussi immobile que possible, entourée par les mille couleurs extravagantes du corail.</p>

<p>Quelques instants plus tard, la forme effilée de Raiahui vient se découper contre la surface ensoleillée de l’eau, à la verticale exacte de votre position. Vous redoutez de la voir obliquer aussitôt dans votre direction, mais elle n’en fait rien, continuant d’avancer dans la même direction. Ses mouvements fluides sont désormais d’une lenteur qui vous paraît presque moqueuse.</p>

<p>Vous n’imaginez pas un instant qu’elle prévoit de gagner la course simplement en atteignant l’îlot avant vous. Peut-être, cependant, n’a-t-elle pas une idée claire de l’endroit où vous avez trouvé refuge.</p>

<p>Vous réfléchissez rapidement. Le renfoncement vous rend sans doute difficile à apercevoir, mais vous seriez une proie facile si cela ne suffisait pas, car il est trop peu profond pour vous mettre hors de portée d’une mâchoire de requin. Sur votre gauche, à une distance modeste, un autre récif de corail émerge du fond sablonneux ; il n’offre aucun abri comparable à celui où vous vous trouvez, mais il est juste assez grand pour vous dissimuler aux yeux de Raiahui si vous l’interposez entre elle et vous. Sur votre droite, un récif de taille plus importante vous semble offrir de meilleures cachettes, mais il est nettement plus éloigné.</p>

<p>L’allure de Raiahui se ralentit encore et vous craignez qu’elle ne continue pas davantage à s’éloigner.</p>
    `,
    "next": (goToSection) => {
      const choices = [
        {
          "text": `Vous restez prudemment abritée dans votre cachette actuelle.`,
          "action": () => {goToSection("trial-hide-closer-1")},
        },
        {
          "text": `Vous quittez votre cachette et nagez jusqu’au récif de gauche.`,
          "action": () => {goToSection("trial-hide-closer-2")},
        },
        {
          "text": `Vous quittez votre cachette et nagez de toutes vos forces pour atteindre le récif de droite.`,
          "action": () => {goToSection("trial-hide-closer-3")},
        },
      ];

      return (
        <Crossroads choices={choices} />
      )
    }
  },
  "trial-hide-closer-1": {
    "text": `
<p>Un instant plus tard, comme vous le redoutiez, Raihui fait demi-tour et revient dans votre direction. Elle s’approche cette fois tout près du récif et entreprend de tourner autour. Si elle sait que vous êtes là, vous réalisez qu’elle n’a pas besoin de découvrir votre cachette précise : il lui suffit d’attendre que le manque d’air vous force à tenter de rejoindre la surface !</p>

<p>Raiahui décrit un premier cercle… un deuxième cercle… puis elle disparaît de votre champ de vision et n’y revient plus.</p>

<p>Le ventre noué par la peur, vous hésitez à saisir cette occasion.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const doll = flags.inventory.doll;
      if (doll.acquired && !doll.used) {
        const text = `Avant que vous ne puissiez prendre une décision, il se passe quelque chose de totalement inattendu.`;
        const action = () => {
          useItem("doll", updateFlag);
          goToSection("trial-hide-closer-1-doll");
        };

        return (
          <Funnel text={text} action={action} />
        );
      }

      let choices = [];

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `Vous écrasez les perles noires en votre possession avant de quitter votre cachette.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("trial-hide-closer-1-pearls");
          },
          "conditional": true,
        });
      }

      choices.push({
        "text": `Vous restez immobile.`,
        "action": () => {goToSection("trial-hide-closer-1-still")},
      });
      choices.push({
        "text": `Vous quittez votre cachette et vous éloignez le plus vite possible.`,
        "action": () => {goToSection("trial-hide-closer-1-fast")},
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "trial-hide-closer-1-doll": {
    "text": `
<p>La figurine de bois, que vous aviez attachée à votre taille, commence à s’agiter furieusement. Craignant quelque sorcellerie, vous essayez de vous en débarrasser, mais elle se délivre d’elle-même et, d’un mouvement convulsif, se propulse à l’extérieur de votre cachette. Sous vos yeux ébahis, la création du crocodile se met alors à grandir et à changer de couleur jusqu’à ce que vous ayiez devant vous une réplique très exacte de vous-même !</p>

<p>Votre double vous adresse un sourire amusé, puis se met à nager vigoureusement vers l’extérieur de l’atoll. Elle n’a pas franchi une distance bien importante lorsque la forme redoutée de Raiahui surgit au-dessus du récif de corail et se lance à sa poursuite. Vous n’attendez pas davantage pour vous propulser hors de votre cachette et vous enfuir vers l’îlot en nageant de toutes vos forces.</p>

<p>Un rapide coup d’œil sur le côté vous permet de voir l’accélération fulgurante avec laquelle Raiahui rattrape celle qu’elle croit être sa proie. Aussitôt que les dents acérées se referment sur votre étrange jumelle, celle-ci se désagrège en une myriade de minuscules fragments de bois. Cette diversion inespérée n’aura pas duré longtemps, mais vous espérez que la stupéfaction fera perdre quelques instants supplémentaires à Raiahui.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Ne pouvant pas vous passer d’air beaucoup plus longtemps, vous remontez à l’air libre.`,
        "surface-close",
      );
    }
  },
  "trial-hide-closer-1-pearls": {
    "text": `
<p>Vous écrasez toutes les perles dont vous disposez et un nuage noir impénétrable se répand autour de vous. Sans attendre davantage, vous vous propulsez hors de votre cachette et vous enfuyez dans la direction approximative de l’îlot.</p>

<p>La zone d’obscurité totale n’englobe que le récif de corail et ses environs immédiat. Après quelques brasses énergiques, vous parvenez de nouveau à distinguer vos propres membres, puis la pâleur du fond sablonneux. Le manque d’air est en train de devenir difficile à supporter.</p>

<p>L’eau achève de redevenir transparente autour de vous. Mais au lieu de remonter à la surface pour y respirer, vous vous immobilisez soudain, frappée par la terreur en voyant la forme souple et fuselée de Raiahui passer lentement devant vous. Elle est à une certaine distance, mais vous repère au moment même où vous l’apercevez et oblique brusquement dans votre direction.</p>

<p>Vous réalisez tout à coup que votre usage des perles noires a eu pour principal effet de confirmer à Raiahui votre position et de l’avertir de votre tentative de fuite. Elle s’est facilement tenue à l’extérieur du nuage opaque et, même s’il l’a d’abord empêchée de vous repérer, elle n’a eu aucun mal à deviner dans quelle direction vous vous dirigiez et à vous couper la route.</p>

<p>Une accélération foudroyante la propulse vers vous, sa gueule entrouverte dévoilant ses nombreuses dents effilées.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `Vous lui jetez le filet de la sorcière.`,
          "action": () => {
            useItem("net", updateFlag);
            goToSection("trial-hide-closer-net");
          },
          "conditional": true,
        })
      }

      const deathText = `Vous nagez de toutes vos forces en une tentative désespérée pour lui échapper.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        },
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "trial-hide-closer-1-still": {
    "text": `
<p>Vous restez le plus immobile possible. Les instants s’écoulent sans que Raiahui ne reparaisse dans votre champ de vision. S’est-elle réellement éloignée ou vous tend-elle un piège ? Le manque d’air est en train de devenir douloureux. Vous êtes capable de retenir très longtemps votre respiration, mais vous n’êtes pas un poisson !</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous tentez votre chance en quittant votre cachette.`,
          "action": () => {
            goToSection("trial-hide-closer-1-still-exit");
          },
        },
        {
          "text": `Vous restez où vous êtes.`,
          "action": () => {
            const dolphin = flags.inventory.dolphin;
            if (dolphin.acquired && !dolphin.used) {
              useItem("dolphin", updateFlag);
              return goToSection("trial-hide-closer-1-still-dolphin");
            }

            updateFlag("weakened", true);
            goToSection("trial-hide-closer-1-still-asphyxia");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "trial-hide-closer-1-still-exit": {
    "text": `
<p>Vous vous glissez prudemment hors du renfoncement, regardant tout autour de vous. Un tressaillement de frayeur vous saisit lorsque vous apercevez tout à coup la forme fuselée de Raiahui. Mais elle s’est éloignée vers le grand récif que vous avez remarqué sur votre droite et ne regarde pas dans votre direction.</p>

<p>Réalisant que vous n’aurez pas de meilleure occasion, vous abandonnez définitivement votre cachette et vous éloignez sans perdre un instant.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Vous restez sous l’eau autant que possible, mais vous devez finalement remonter à l’air libre.`,
        "surface-close",
      );
    }
  },
  "trial-hide-closer-1-still-dolphin": {
    "text": `
<p>Il vous semble tout à coup qu’une profonde bouffée d’air pur s’infiltre dans vos poumons. Le réflexe mortel qui allait bientôt vous faire ouvrir la bouche s’éloigne et vous vous sentez capable de retenir votre respiration au moins aussi longtemps que vous l’avez déjà fait. À votre cou, l’amulette en forme de dauphin se désagrège et vous devinez qu’elle vient d’épuiser pour vous ses derniers pouvoirs.</p>

<p>Vous ne pouvez cependant pas rester dans cette cachette éternellement. Après un assez long moment, vous vous risquez enfin à la quitter. Il ne vous faut pas longtemps pour apercevoir la forme fuselée de Raiahui, qui s’est éloignée vers une zone où les récifs sont plus denses. Votre patience a apparemment réussi à la tromper pour l’instant.</p>

<p>Vous ne perdez pas un instant de plus : abandonnant définitivement votre cachette, vous nagez vigoureusement en direction de l’îlot.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `L’effet de l’amulette finit par s’estomper et vous devez remonter à l’air libre.`,
        "surface-close",
      );
    }
  },
  "trial-hide-closer-1-still-asphyxia": {
    "text": `
<p>Vous vous contraignez à rester dans votre cachette, malgré la sensation de brûlure qui dévore vos poumons et les ombres qui s’amoncellent devant vos yeux. Vous plaquez une main contre votre bouche pour retenir le réflexe mortel qui vous ferait tenter de prendre une inspiration.</p>

<p>Les instants passent. Votre crâne s’est rempli d’un brouillard noir et rouge qui ne cesse de s’épaissir davantage. Finalement, vous réalisez que vous n’avez plus le choix : vous devez prendre le risque de remonter à la surface ou mourir noyée.</p>

<p>Vous jaillissez hors de votre cachette sans plus attendre. Votre vision obscurcie ne distingue plus avec précision ce qui vous entoure, mais Raiahui n’est pas à proximité. Il vous semble apercevoir sa forme fuselée à une certaine distance, au-dessus d’une zone où les récifs de corail sont plus denses.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Vous remontez à l’air libre aussi vite que vos forces vous le permettent.`,
        "surface-close",
      );
    }
  },
  "trial-hide-closer-1-fast": {
    "text": `
<p>Vous vous propulsez hors de votre cachette. Mais vous avez à peine esquissé une brasse lorsque Raiahui surgit tout à coup au-dessus du récif de corail ! Elle vous guettait !</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      return repeatingFunnel(
        goToSection,
        `Une accélération foudroyante la propulse dans votre direction, ne vous laissant pas le temps de tenter quoi que ce soit.`,
        () => {
          updateFlag("eatenByRaiahui", true);
          return "raiahui-good-end";
        },
      );
    }
  },
  "trial-hide-closer-net": {
    "text": `
<p>Saisissant le filet que vous aviez entouré autour de votre taille, vous le jetez en hâte vers Raiahui. Votre geste n’a ni la force ni la précision qui seraient normalement nécessaire, mais le filet de la sorcière n’a pas perdu sa vertu : il se déploie de lui-même et enveloppe étroitement votre poursuivante juste au moment où celle-ci allait vous atteindre. Raiahui se contorsionne furieusement, déchiquetant les mailles serrées pour parvenir à se libérer.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Vous nagez de toutes vos forces en direction de l’îlot, tout en remontant progressivement à l’air libre.`,
        "surface-close",
      );
    }
  },
  "trial-hide-closer-2": {
    "text": `
<p>Le cœur battant à tout rompre, vous vous glissez hors de ce renfoncement providentiel et nagez vers votre objectif. Vous l’atteignez juste à temps : Raiahui est en train de faire demi-tour ! Vous vous tapissez derrière le récif, espérant que cela suffira à vous faire échapper à ses yeux.</p>

<p>De minces espaces entre les excroissances colorés du corail vous permettent de suivre Raiahui à mesure qu’elle se rapproche. Elle passe à une faible distance, apparemment sans vous remarquer. Vous la voyez s’approcher très près du récif où vous aviez précédemment trouvé refuge, puis commencer à en faire le tour.</p>

<p>Votre instinct vous dit que vous n’aurez pas de meilleure occasion ; profitant de ce qu’elle est momentanément incapable de vous apercevoir, vous quittez votre deuxième cachette et nagez en direction de l’îlot, restant proche du fond sablonneux dans l’espoir que cela vous rendra un peu plus difficile à repérer.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Ne pouvant pas retenir indéfiniment votre souffle, il vient cependant un moment où vous devez remonter à l’air libre.`,
        "surface-close",
      );
    },
  },
  "trial-hide-closer-3": {
    "text": `
<p>Le cœur battant à tout rompre, vous vous glissez hors du renfoncement et nagez de toutes vos forces vers votre objectif. Vous avez franchi la moitié de la distance qui vous en sépare lorsque Raiahui fait tout à coup demi-tour !</p>

<p>Il est immédiatement clair qu’elle vous a aperçu : d’un mouvement puissant de sa queue, elle se propulse dans votre direction à une vitesse bien supérieure à l’allure paresseuse qu’elle avait adopté. Vous redoublez d’efforts pour atteindre le récif de corail, dans l’espoir d’y trouver un refuge providentiel. Mais vous réalisez avec effroi que vous n’y parviendrez pas à temps : Raiahui vient d’accélèrer de façon foudroyante, sa gueule entrouverte dévoilant ses nombreuses dents effilées.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `Vous lui jetez le filet de la sorcière.`,
          "action": () => {
            useItem("net", updateFlag);
            goToSection("trial-hide-closer-net");
          },
          "conditional": true,
        })
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `Vous écrasez les perles noires que vous transportez.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            updateFlag("bleeding", true);
            goToSection("trial-hide-closer-3-pearls");
          },
          "conditional": true,
        })
      }

      const deathText = `Vous tentez désespérément de lui échapper malgré tout.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        },
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "trial-hide-closer-3-pearls": {
    "text": `
<p>Juste à temps, vous vous souvenez des perles noires en votre possession. Vous les écrasez d’un geste convulsif, sans même les retirer du sachet accroché à votre taille, et un épais nuage de ténèbres impénétrables vous enveloppe instantanément.</p>

<p>Totalement aveugle, vous nagez droit devant vous dans l’espoir d’échapper au péril mortel que vous savez être tout proche. Vous éprouvez soudain un impact cuisant contre votre cuisse ! Raiahui n’est pas parvenue à vous mordre, mais elle vient de vous cingler involontairement avec sa queue, vous écorchant sans doute la peau.</p>

<p>Refoulant immédiatement la terreur qui menace de vous faire perdre vos moyens, vous descendez plus profondément, jusqu’à effleurer le sol sablonneux, puis vous vous mettez à nager dans la direction opposée à celle que vous suiviez auparavant.</p>

<p>L’eau qui vous entoure retrouve sa transparence à mesure que vous vous éloignez de l’endroit où vous avez écrasé les perles. Vous distinguez de nouveau vos propres membres, puis les reflets du soleil contre la surface, puis les récifs de corail et l’îlot qui constitue votre destination. Risquant un regard en arrière, vers la zone d’obscurité qui s’étire et se dilue avec une grande lenteur, vous ne parvenez pas à apercevoir Raiahui.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Incapable de retenir votre respiration beaucoup plus longtemps, vous remontez à l’air libre.`,
        "surface-close",
      );
    }
  },
  "ending-credits": {
    //TODO Complete with links, thanks message etc.
    "text": `
<h1>Au Cœur d’un Cercle de Sable et d’Eau</h1>

<div class="ending-credits">
<p>Une aventure d’Outremer.</p>

<p>Texte d’Outremer.</p>

<p>Code par Skarn.</p>

<p>Illustrations de Klaus Pillon.</p>
</div>
    `,
    "next": trueEnd,
  },
};

export default trial;
