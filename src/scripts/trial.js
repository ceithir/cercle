import React from "react";
import Crossroads from "./../components/Crossroads.js";
import Funnel from "./../components/Funnel.js";
import {endGame, useItem} from "./helpers.js";

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

const raceEnd = (goToSection) => {
  const text = `Et vous atteignez enfin un semblant de terre.`;
  const action = () => {
    goToSection("final-island");
  };

  return (
    <Funnel text={text} action={action} />
  );
};

const facingRaiahuiUnderwater = (goToSection, flags, updateFlag) => {
  const net = flags.inventory.net;
  if (net.acquired && !net.used) {
    const text = `Et vous avez de quoi l’accueillir.`;
    const action = () => {
      useItem("net", updateFlag);
      updateFlag("caughtARaiahui", true);
      goToSection("caught-a-raiahui");
    }

    return (
      <Funnel text={text} action={action} conditional={true} />
    );
  }

  const text = `Et vous n’avez aucun moyen de vous défendre.`
  const action = () => {
    updateFlag("eatenByRaiahui", true);
    goToSection("raiahui-good-end");
  };

  return (
    <Funnel text={text} action={action} />
  );
};

const cleanInventoryBeforeRace = (flags, updateFlag) => {
  useItem("alcohol", updateFlag);
  useItem("pearls", updateFlag);
  useItem("fruit", updateFlag);
  if (flags.droppedDoll) {
    useItem("doll", updateFlag);
  }
}

const trial = {
  "trial": {
    "text": `
<p>À la suite du jeune garçon, vous arrivez sur la plage bordant l’extrémité de l’île, où toute la tribu est en train de s’assembler. Vous apercevez Raiahui en compagnie des adolescents de son âge, formant un groupe un peu à part du reste de la foule ; un large sourire se dessine sur son visage lorsque ses yeux se posent sur vous.</p>

<p>La clarté du jour, qui ne touche pas encore à sa fin, vous permet de distinguer clairement les récifs de corail recouvrant le fond de la passe que vous avez traversé la veille pour pénétrer dans le lagon. De l’autre côté se trouve l’île sablonneuse qui servira de point d’arrivée à votre course.</p>

<p>Les murmures qui parcouraient la foule s’éteignent lorsqu’Ataroa fait signe à Raiahui et à vous-même de vous tenir devant lui.</p>

<div class="conversation">
<p>— Vous connaissez toutes les deux les détails dont vous avez besoin, déclare-t-il sans que son visage rude ne manifeste aucune expression. Aucun membre de la tribu ne viendra interférer. La course commence dès maintenant.</p>
</div>

<p>Il ponctue cette déclaration laconique d’un hochement de tête, puis, sans rien ajouter, il quitte la plage pour retourner vers le village. Sous votre regard interloqué, l’essentiel de la tribu lui emboîte le pas. Il ne reste bientôt plus que vous-même, Raiahui et les autres adolescents.</p>
    `,
    "next": (goToSection) => {
      const text = `Vous vous tenez prête à partir, tous vos muscles frémissant.`;
      const action = () => {goToSection("trial-preparation");};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-preparation": {
    "text": (flags) => {
      let items = ``;

      const amulet = flags.inventory.dolphin;
      if (amulet.acquired && !amulet.used) {
        items += `<p class="text-info">Vous ajustez l’amulette autour de votre cou. Vous ne ressentez rien de spécial, et ignorez si elle vous sera d’une quelconque utilité. En tout cas, votre nouvel ornement ne semble intéresser personne.</p>`
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        items += `<p class="text-info">Vous avez rangé les perles qui vous restent dans un petit sac de toile accroché à votre taille ; vous pourrez certainement leur trouver un usage pendant votre course.</p>`
      }

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        items += `<p class="text-info">Si l’épreuve devait dégénérer d’une quelconque façon, avoir un filet magique sous la main pourrait se révéler salvateur. Aussi l’enroulez-vous autour de votre taille.</p>`
      }

      return `
<p>La course a-t-elle vraiment commencé ? L’ambiance qui vous entoure n’en donne pas l’impression. Les adolescents chahutent, rient et font circuler des calebasses remplies de vin de palme. Raiahui est au coeur de cette sorte de célébration anticipée, savourant visiblement l’attention dont elle est l’objet et ne vous accordant pas un regard.</p>

<p>Vous jetez un coup d’œil vers votre point d’arrivée. Il y a une certaine distance à parcourir, mais il ne s’agira pas d’une épreuve d’endurance : si vous partiez avec quelques instants d’avance, même un excellent nageur aurait peu de chances de vous rattraper.</p>

<p>Déstabilisée par l’étrangeté de la situation, vous vous raccrochez à des questions plus concrètes, vérifiant que vous êtes dans de bonnes conditions pour nager.</p>

<p>Vous commencez par vous débarasser de votre pagne, qui vous ralentirait terriblement.</p>

${items}

<p>Vous faites ensuite jouer vos articulations en un échauffement sommaire, plus pour rappeler à Raiahui que vous prenez cette épreuve au sérieux que par réel besoin physique.</p>
      `;
    },
    "next": (goToSection, flags, updateFlag) => {
      const fruit = flags.inventory.fruit;
      if (fruit.acquired && !fruit.used) {
        const context = `Vous avez encore en votre possession le fruit conseillé par le crocodile.`;
        const choices = [
          {
            "text": `Vous mordez dedans.`,
            "action": () => {
              useItem("fruit", updateFlag);
              if (flags.drunk) {
                updateFlag("drunk", false);
                updateFlag("refreshedByFruit", true);
              } else {
                updateFlag("boostedByFruit", true);
              }
              goToSection("trial-eat-fruit");
            },
          },
          {
            "text": `Trop risqué. Et puis vous n’avez pas besoin de ça pour gagner.`,
            "action": () => {
              goToSection("trial-still-not-started");
            },
          },
        ];

        return (
          <Crossroads context={context} choices={choices} />
        );
      }

      const doll = flags.inventory.doll;
      if (doll.acquired && !doll.used) {
        const context = `Vous avez encore en votre possession le figurine sculptée par le crocodile. Dont vous ignorez tout.`;
        const choices = [
          {
            "text": `Vous l’accrochez à votre taille, au cas où.`,
            "action": () => {
              goToSection("trial-still-not-started");
            },
          },
          {
            "text": `Vous la laissez sur le rivage avec vos autres affaires dispensables.`,
            "action": () => {
              updateFlag("droppedDoll", true);
              goToSection("trial-still-not-started");
            },
          },
        ];

        return (
          <Crossroads context={context} choices={choices} />
        );
      }

      const text = `Vous êtes aussi prête que vous pouvez l’être.`;
      const action = () => {goToSection("trial-still-not-started")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-eat-fruit": {
    "text": `
<p>Vous ingérez le petit fruit d’une bouchée et faites la grimace aussitôt que son jus acide vient vous brûler la gorge. L’espace d’un moment, vous n’éprouvez rien d’autre. Puis votre coeur se met à cogner violemment dans votre poitrine, des frémissements convulsifs parcourent votre peau et une sueur glacée naît sur votre front. Terrifiée, il vous vient la pensée que vous venez de vous empoisonner, trompée par le dernier mensonge du crocodile.</p>

<p>Puis le malaise se dissipe. Quelques tremblements vous agitent encore, mais ils ne sont plus dûs qu’à un reste de peur. Vous ne vous sentez pas plus mal qu’auparavant.</p>
    `,
    "next": (goToSection, flags) => {
      const action = () => {goToSection("trial-still-not-started")};

      if (flags.refreshedByFruit) {
        const text = `En fait, votre migraine avinée s’en est même allée !`;
        return (
          <Funnel text={text} action={action} conditional={true} />
        );
      }

      const text = `Mais pas en meilleure forme non plus.`;

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "trial-still-not-started": {
    "text": `
<p>Que vous soyez fin prête ne semble pas intéresser Raiahui le moins du monde.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous entamez la course dès maintenant, sans l’attendre.`,
          "action": () => {
            cleanInventoryBeforeRace(flags, updateFlag);
            updateFlag("eatenByRaiahui", true);
            goToSection("trial-surprise");
          },
        },
        {
          "text": `Vous interrogez quelqu’un pour obtenir des explications.`,
          "action": () => {
            goToSection("trial-explanations");
          } ,
        },
        {
          "text": `Vous allez voir Raiahui.`,
          "action": () => {
            goToSection("trial-raiahui");
          } ,
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "trial-surprise": {
    "text": `
<p>Vous ne saisissez pas clairement les raisons du comportement de Raiahui, mais la chose la plus sensée à faire vous semble être de saisir l’occasion. Vous assurant que personne ne vous prête attention, vous vous approchez de la rive et vous immergez aussi silencieusement que possible dans les eaux tièdes de la passe. Quelques brasses vigoureuses sous la surface vous propulsent en direction de l’île sablonneuse. Lorsque vous refaites surface, un rapide regard en arrière vous apprend que Raiahui se tient toujours sur la plage, entourée des autres adolescents. Elle ne semble pas avoir remarqué votre départ.</p>

<p>Vous avez déjà accompli le quart du trajet lorsque des exclamations excitées vous parviennent aux oreilles depuis la plage. Votre concurrente vient sans doute enfin d’entamer la course à son tour. Vous vous contentez d’accélérer légèrement le rythme de vos mouvements. Quand bien même Raiahui serait vraiment meilleure nageuse que vous-même, il vous suffit de ne pas épuiser vos forces trop vite pour que votre avance vous garantisse virtuellement la victoire.</p>

<p>Et pourtant, une inquiétude irrationnelle s’est insinuée en vous. Vous jetez de manière espacée quelques coups d’œil furtifs en arrière, mais ils ne vous permettent pas d’apercevoir où se trouve Raiahui, comme si elle nageait sans jamais remonter à la surface. Saisie tout à coup d’une peur sans motif apparent, vous hâtez plus tôt que vous n’en aviez l’intention la cadence de votre nage, mais le pressentiment glaçant qui ne cesse de grandir dans votre esprit vous dit que cela ne change rien. Vous avez accompli la moitié du trajet, mais il vous semble désormais, à chaque nouveau mouvement de vos membres, que le point d’arrivée s’éloigne un peu plus et que se rapproche inexorablement quelque chose d’horrible.</p>

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
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous suivez son conseil et partez sans plus tergiverser.`,
          "action": () => {
            cleanInventoryBeforeRace(flags, updateFlag);
            updateFlag("eatenByRaiahui", true);
            goToSection("trial-surprise");
          },
        },
        {
          "text": `Vous allez voir Raiahui.`,
          "action": () => {
            goToSection("trial-raiahui");
          } ,
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
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

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "trial-surprise-alt": {
    "text": `
<p>Vous ne saisissez pas bien les raisons du comportement de Raiahui, mais la chose la plus sensée à faire vous semble être de saisir effectivement l’occasion. Vous vous dirigez à grands pas vers la rive et plongez sans attendre dans les eaux tièdes de la passe. Quelques brasses vigoureuses sous la surface vous propulsent en direction de l’île sablonneuse. Lorsque vous refaites surface, un rapide regard en arrière vous apprend que Raiahui se tient toujours sur la plage, entourée des autres adolescents. Elle ne semble même pas regarder dans votre direction.</p>

<p>Vous avez déjà accompli le quart du trajet lorsque des exclamations excitées vous parviennent aux oreilles depuis la plage. Votre concurrente vient sans doute enfin de se lancer à votre poursuite. Vous vous contentez d’accélérer légèrement le rythme de vos mouvements. Quand bien même Raiahui serait vraiment meilleure nageuse que vous-même, il vous suffit de ne pas épuiser vos forces trop vite pour que votre avance vous garantisse virtuellement la victoire.</p>

<p>Et pourtant, une inquiétude irrationnelle s’est insinuée en vous. Vous jetez de manière espacée quelques coups d’œil furtifs en arrière, mais ils ne vous permettent pas d’apercevoir où se trouve Raiahui, comme si elle nageait sans jamais remonter à la surface. Saisie tout à coup d’une peur sans motif apparent, vous hâtez plus tôt que vous n’en aviez l’intention la cadence de votre nage, mais le pressentiment glaçant qui ne cesse de grandir dans votre esprit vous dit que cela ne change rien. Vous avez accompli la moitié du trajet, mais il vous semble désormais, à chaque nouveau mouvement de vos membres, que le point d’arrivée s’éloigne un peu plus et que se rapproche inexorablement quelque chose d’horrible.</p>

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

<p>Mais cet état de concentration ne dure que jusqu’à votre inspiration suivante. Quelque chose ne va pas. Raiahui n’a toujours pas reparu, les cris provenant de la plage sont en train d’atteindre un sommet d’excitation stridente et, sans savoir pourquoi, vous sentez grandir en vous le pressentiment glaçant d’avoir commis une terrible erreur.</p>

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
          "text": `Et vous, vous jetez son couteau dans le lagon.`,
          "action": () => {
            cleanInventoryBeforeRace(flags, updateFlag);
            updateFlag("eatenByRaiahui", true);
            goToSection("knife-sea");
          },
        },
        {
          "text": `Et vous, vous jetez son couteau dans les arbres qui bordent la plage.`,
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

<p>Vous avez déjà parcouru presque le quart du trajet lorsque le bruit d’exclamation vous parvient aux tympans. Un bref regard en arrière vous apprend que les adolescents présents sur la plage sont en train d’agiter les bras en poussant des cris d’encouragement. Raiahui a dû enfin se lancer à votre poursuite, soit que la chance lui ait permis de retrouver rapidement son couteau parmi les coraux du lagon, soit qu’elle ait décidé de s’en occuper plus tard. Cela n’a pas une grande importance : quand bien même elle serait vraiment meilleure nageuse que vous, l’avance que vous avez acquise vous garantit virtuellement la victoire.</p>

<p>Et pourtant, une inquiétude irrationnelle s’est insinuée en vous. Vous jetez de manière espacée quelques coups d’œil furtifs derrière vous, mais ils ne vous permettent pas d’apercevoir où se trouve Raiahui, comme si elle nageait sans jamais remonter à la surface. Saisie tout à coup d’une peur sans motif apparent, vous hâtez plus tôt que vous n’en aviez l’intention la cadence de votre nage, mais le pressentiment glaçant qui ne cesse de grandir dans votre esprit vous dit que cela ne change rien. Vous avez accompli la moitié du trajet, mais il vous semble désormais, à chaque nouveau mouvement de vos membres, que le point d’arrivée s’éloigne un peu plus et que se rapproche inexorablement quelque chose d’horrible.</p>

<hr/>
    ` + raiahuiGoodEndText,
    "next": endGame,
  },
  "knife-land": {
    "text": `
<p>Le couteau d’ivoire décrit une ample courbe et disparaît silencieusement parmi les palmiers. Avec une exclamation furieuse, Raiahui se détourne aussitôt de vous et se précipite dans cette direction. Vous n’allez pas laisser passer cette occasion ! Sous le regard absolument stupéfait des adolescents qui vous entourent, vous franchissez en trois enjambées la distance qui vous sépare de la rive.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Et vous plongez.`;
      const action = () => {
        cleanInventoryBeforeRace(flags, updateFlag);
        goToSection("the-trial-begins");
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "raiahui-drunk": {
    "text": `
<div class="conversation">
<p>— Ce n’est pas moi qui vais t’empêcher de te saoûler, dites-vous en lui tendant votre calebasse. Tiens, vide aussi celle-ci, si tu t’imagines vraiment que tu pourras me battre à la course ensuite !</p>
</div>

<p>Votre défi fait courir des exclamations amusées parmi la jeune assistance. Raiahui accepte votre présent avec un sourire de confiance totale. Même si elle réalise que cette boisson est autrement plus forte que du simple vin de palme, vous soupçonnez qu’elle videra tout de même l’essentiel de la calebasse, ne serait-ce que pour ne pas perdre la face.</p>

<p>Laissant votre concurrente s’enivrer plus qu’elle ne devrait, vous traversez la plage d’un pas rapide en direction de la rive.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Et vous plongez.`;
      const action = () => {
        cleanInventoryBeforeRace(flags, updateFlag);
        goToSection("the-trial-begins");
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "the-trial-begins": {
    "text": `
<p>Les eaux tièdes et transparentes de la passe se referment sur vous. Vous glissez un instant, portée par l’élan de votre plongeon, puis vous commencez à nager sans remonter tout de suite à la surface. Vous adoptez un rythme énergique, mais pas précipité, de manière à conserver une partie de vos forces.</p>

<p>Votre tête émerge finalement à l’air libre. Vous adoptez un style de natation un peu plus rapide, mais sans forcer encore l’allure. Plongée dans l’exécution de vos mouvements souples et réguliers, vous oubliez presque la compétition un instant pour ne plus éprouver que le plaisir sans mélange que vous apporte toujours le simple fait de nager.</p>

<p>Vous avez franchi près de la moitié de la distance vous séparant de votre destination lorsqu’un concert d’exclamations vous parvient aux oreilles. Jetant un coup d’œil en arrière sans perdre votre allure, vous voyez que tous les adolescents se sont assemblés près de la rive. Leurs gesticulations vous laissent deviner que Raiahui vient enfin de plonger à son tour.</p>

<p>Vous n’augmentez pas immédiatement la cadence de vos mouvements. Vous avez après tout une avance considérable. Vous prenez la précaution de jeter par la suite des coups d’œil périodiques en arrière, mais, curieusement, ils ne vous apprennent rien : vous ne voyez à aucun moment la tête de Raiahui émerger au-dessus des vagues et sa position vous reste absolument inconnue.</p>
    `,
    "next": (goToSection) => {
      const choices = [
        {
          "text": `Vous accélérez votre rythme de nage.`,
          "action": () => {
            goToSection("trial-straightforward");
          },
        },
        {
          "text": `Vous plongez sous l’eau pour essayer de distinguer où se trouve Raiahui.`,
          "action": () => {
            goToSection("trial-underwater");
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
      const doll = flags.inventory.doll;
      if (doll.acquired && !doll.used) {
        const text = `Vous sentez soudain une gêne au niveau de votre taille.`;
        const action = () => {
          useItem("doll", updateFlag);
          goToSection("trial-doll");
        };

        return (
          <Funnel text={text} action={action} conditional={true} />
        );
      }

      const text = `Vous misez tout sur votre habileté de nageuse.`;
      const action = () => {
        updateFlag("eatenByRaiahui", true);
        goToSection("raiahui-good-end");
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

<p>Vous vous débattez furieusement, mais la figurine vous a déjà relâchée et a disparu. Soulagée, vous êtes sur le point de remonter à la surface.</p>
    `,
    "next": (goToSection) => {
      const text = `Quant votre regard accroche ce qui se trouve derrière vous.`;
      const action = () => {
        goToSection("trial-underwater");
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-underwater": {
    "text": `
<p>Avez-vous deviné que la tribu apparemment si dénuée de moyens vous dissimulait sa vraie nature ? Avez-vous soupçonné que cette course n’était pas une simple compétition, à l’issue de laquelle le perdant ne connaîtrait rien de pire que la vexation de l’échec ? Vous est-il revenu en mémoire de vieilles légendes parlant d’humains qui étaient en même temps autre chose ?</p>

<p>Tout cela n’a plus aucune importance à présent, car la transparence de l’eau vous permet de distinguer sans aucun mal la seconde apparence de Raiahui tandis qu’elle réduit à vive allure la distance qui vous sépare. Propulsé par les mouvements puissants de sa queue, son corps marbré de rayures sombres est plus à l’aise dans l’élément aquatique que vous ne pourrez jamais l’être. Sa gueule paraît presque inoffensive pour le moment, mais vous avez déjà vu des mâchoires de requin-tigre et les nombreuses dents tranchantes dont elles sont garnies.</p>

<p>Vous remontez à la surface pour respirer. Une terreur horrible s’est répandue dans tout votre être, mais elle ne vous prive pas encore de vos moyens.</p>
    `,
    "next": (goToSection) => {
      const context = `L’île marquant la fin de l’épreuve n’est désormais plus à une grande distance.`;

      const choices = [
        {
          "text": `Vous nagez de toutes vos forces dans sa direction.`,
          "action": () => {
            goToSection("trial-rush");
          },
        },
        {
          "text": `Vous plongez à nouveau et vous réfugiez parmi les récifs de corail.`,
          "action": () => {
            goToSection("trial-hide");
          },
        },
      ];

      return (
        <Crossroads context={context} choices={choices} />
      );
    },
  },
  "trial-rush": {
    "text": `
<p>La panique anime vos membres d’une énergie bouillonnante, vous faisant nager plus vite que vous n’en avez jamais été capable. Mais Raiahui reste beaucoup trop rapide. Un coup d’œil angoissé en arrière vous permet de voir qu’elle est sur le point de vous rejoindre.</p>
    `,
    "next": facingRaiahuiUnderwater,
  },
  "caught-a-raiahui": {
    "text": `
<p>Saisissant le filet que vous aviez entouré autour de votre taille, vous le jetez en hâte vers Raiahui. Votre geste n’a ni la force ni la précision qui seraient normalement nécessaire, mais le filet de la sorcière n’a pas perdu sa vertu : il se déploie de lui-même et enveloppe étroitement votre poursuivante juste au moment où celle-ci allait vous atteindre. Raiahui se contorsionne furieusement, déchiquetant les mailles étroites pour parvenir à se libérer.</p>
    `,
    "next": (goToSection) => {
      const text = `Vous vous éloignez d’elle avec toute la vitesse possible.`;
      const action = () => {goToSection("arrival-in-sight")};

      return (
        <Funnel text={text} action={action} />
      );
    },
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
<p>Il vous semble tout à coup qu’une profonde bouffée d’air pur s’infiltre dans vos poumons. La faiblesse qui commençait à alourdir vos membres se dissipe comme si elle n’avait jamais existé et vous continuez sans mal à nager à une vitesse étourdissante. À votre cou, l’amulette en forme de dauphin se désagrège, ayant épuisé pour vous ses derniers pouvoirs.</p>
    `,
    "next": raceEnd,
  },
  "trial-saved-by-fruit": {
    "text": `
<p>Alors que la panique vous saisit à l’idée de défaillir si près de votre but, une énergie brûlante naît soudain dans le creux de votre ventre et se répand dans tous vos muscles avec la vivacité de la foudre. N’éprouvant plus rien de l’épuisement qui alourdissait vos membres il y a un instant, vous continuez de nager à une vitesse étourdissante.</p>
    `,
    "next": raceEnd,
  },
  "trial-saved-by-sloth": {
    "text": `
<p>Vous puisez dans toutes vos ressources pour franchir la distance qui vous sépare encore de votre but. Là où la panique ne suffit plus, c’est votre volonté qui contraint vos muscles à dépasser l’épuisement et à vous propulser vers l’île, toujours plus près, sans ralentir un instant.</p>
    `,
    "next": raceEnd,
  },
  "final-island": {
    "text": `
<p>Une bouffée d’espoir délirant vous saisit lorsque vous sentez enfin le sable sous vos pieds. Vous vous hâtez de vous redresser. L’eau ne vous parvient qu’à la taille et il vous suffira de quelques enjambées pour atteindre enfin l’île.</p>

<p>Un grand bruit d’éclaboussures vous fait vous retourner : Raiahui vient d’émerger de l’eau à son tour. L’espace d’un fugitif instant, vous la voyez sous une curieuse forme hybride, à mi-chemin entre ses deux apparences. Puis sa peau reprend une couleur brune uniforme, son visage retrouve un aspect humain et ses membres antérieurs se terminent à nouveau par des mains, dont l’une serre un couteau couleur d’ivoire.</p>

<p>L’instant suivant, elle se précipite vers vous avec un hurlement enragé, son arme tendue devant elle.</p>
    `,
    "next": (goToSection) => {
      const choices = [
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
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "raiahui-fight": {
    "text": `
<p>Vous essayez d’attraper le poignet de Raiahui pour le tordre, mais vous n’êtes pas assez rapide. Elle essaie de vous transpercer le ventre, mais vous vous tordez sur le côté et le tranchant aiguisé du couteau ne vous inflige qu’une légère estafilade.</p>
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
            updateFlag("stabbedToDeath", true);
            goToSection("raiahui-grapple");
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
<p>Votre coup surprend Raiahui, qui n’a pas le réflexe de l’esquiver. Vous la frappez en plein ventre et elle vacille légèrement en arrière, mais elle tend son couteau devant elle pour vous empêcher d’en profiter.</p>
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
          "text": `Vous conservez vos forces, guettant l’occasion propice de vous dégager et de reprendre votre fuite.`,
          "action": () => {
            updateFlag("stabbedToDeath", true);
            goToSection("raiahui-backstab");
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
  "raiahui-struggle": {
    "text": `
<p>Votre terreur a atteint son point d’ébullition et elle se vaporise soudain en une rage brûlante.</p>

<div class="conversation">
<p>— LÂCHE-MOI, ESPÈCE DE…</p>
</div>

<p>Vous hurlez un mot que votre mère n’aurait pas été heureuse d’entendre, le ponctuez d’un violent coup de tête qui frappe votre adversaire en plein visage et lui mordez ensuite sauvagement l’avant-bras. Raiahui pousse un cri de douleur perçant et laisse presque échapper son précieux couteau. Vous lui écrasez votre poing sur la figure et, tandis qu’elle titube en arrière, vous franchissez enfin la distance qui vous séparait de la rive sablonneuse.</p>

<p>Raiahui retrouve son équilibre et elle se précipite à vos trousses, mais, avant qu’elle ne puisse vous rejoindre, de nombreuses silhouettes surgissent tout autour de vous et des mains viennent la retenir. Et une voix que vous reconnaissez comme celle d’Ataroa énoncent enfin les quelques mots que vous n’espériez plus :</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `L’épreuve est terminée.`;
      const action = () => {
        updateFlag("survivedTheTrial", true);
        goToSection("victory");
      };

      return (
        <Funnel text={text} action={action} />
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

<p>Cette nuit, vous allez rêver. Et demain, vous allez repartir.</p>
    `,
    "next": endGame,
  },
  "trial-hide": {
    "text": `
<p>Quelques brasses puissantes vous permettent de vous enfoncer rapidement sous la surface. Vous vous abritez parmi les formes découpées du corail, vous dissimulant de votre mieux au regard de Raiahui. Un coup d’œil prudent vous permet de voir qu’elle a ralenti son allure et qu’elle semble hésitante. Elle a sans aucun doute saisi votre manoeuvre, mais ne semble pas savoir exactement où vous vous êtes réfugiée. Votre appréhension ne décroît guère pour autant : sa forme actuelle la fait peut-être bénéficier de sens qui vous échappent.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [
        {
          "text": `Vous attendez sans bouger.`,
          "action": () => {
            goToSection("trial-holding-breath");
          },
        },
        {
          "text": `Vous continuez votre progression vers l’île sablonneuse en restant cachée du mieux possible.`,
          "action": () => {
            goToSection("trial-sneaking-around");
          },
        },
      ];

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `Vous recourrez aux perles.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("trial-coral-pearls");
          },
          "conditional": true,
        });
      }

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "trial-holding-breath": {
    "text": `
<p>Vous restez absolument immobile, regardant votre poursuivante passer lentement au-dessus des récifs de corails. Quelques petits poissons colorées passent près de vous, mais filent aussitôt se cacher en apercevant Raiahui.</p>

<p>Un moment interminable s’écoule et vous vous demandez avec une certaine panique combien de temps vous allez encore pouvoir tenir. Vous êtes capable de retenir très longtemps votre respiration, mais vous n’êtes pas un poisson !</p>

<p>Heureusement, Raiahui descend à ce moment inspecter un renfoncement entre deux récifs. Vous n’hésitez pas : abandonnant votre cachette, vous regagnez en hâte la surface. Votre tête émerge à l’air libre le temps d’une inspiration.</p>
    `,
    "next": (goToSection) => {
      const text = `Puis vous reprenez sans attendre votre course.`;
      const action = () => {goToSection("arrival-in-sight")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-sneaking-around": {
    "text": `
<p>Vous reprenez votre progression vers l’île, nageant aussi vite que cela vous est possible sans vous exposer. Vous ne voyez plus Raiahui et vous espérez qu’elle s’est éloignée dans une mauvaise direction.</p>

<p>Malheureusement pour vous, ce n’est pas du tout le cas : au moment où le manque d’air vous force enfin à remonter vers la surface, vous voyez avec terreur votre poursuivante apparaître entre deux récifs de corail voisins et foncer droit sur vous ! Il ne lui faudra qu’un instant pour vous atteindre.</p>
    `,
    "next": facingRaiahuiUnderwater,
  },
  "trial-coral-pearls": {
    "text": `
<p>Vous écrasez toutes les perles dont vous disposez et un nuage noir impénétrable se répand autour de vous. Vous réalisez soudain que votre idée n’était peut-être pas si bonne : Raiahui ne risque certes plus de vous apercevoir, mais vous ne pouvez plus rien voir du tout ! Plongée dans cette obscurité opaque, vous essayez malgré tout de nager dans la direction de l’île sablonneuse, mais le corail qui vous entoure est devenu un piège invisible, contre lequel vous vous blessez les bras et les jambes.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const doll = flags.inventory.doll;
      if (doll.acquired && !doll.used) {
        const text = `Vous sentez un mouvement au niveau de votre taille.`;
        const action = () => {
          useItem("doll", updateFlag);
          goToSection("trial-coral-doll");
        };

        return (
          <Funnel text={text} action={action} conditional={true} />
        );
      }

      const text = `Malgré la terreur que cette perspective vous inspire, vous allez devoir remonter vers la surface…`;
      const action = () => {
        updateFlag("eatenByRaiahui", true);
        goToSection("raiahui-good-end");
      };

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "trial-coral-doll": {
    "text": `
<p>Vous sentez tout à coup la figurine être agitée de mouvements convulsifs, jusqu’à se détacher de la lanière par laquelle elle était retenue à votre taille. Vous ne saisissez pas ce qui est en train d’arriver, mais, un instant plus tard, vous sentez une main en bois — de taille tout à fait humaine — se refermer autour de la vôtre pour vous tirer dans une direction nouvelle. Totalement aveugle, vous vous laissez guider, accompagnant à peine le mouvement de petits battements de jambes.</p>

<p>Quelques instants plus tard, la main vous relâche et vous émergez hors de l’épais nuage. La surface est toute proche et votre tête émerge bientôt à l’air libre.</p>
    `,
    "next": (goToSection) => {
      const text = `Mais vous ne prenez pas le temps de récupérez votre souffle et poursuivez aussitôt votre course.`;
      const action = () => {goToSection("arrival-in-sight")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "exhausted": {
    "text": `
<p>La panique ne parvient plus à vous faire ignorer votre fatigue. Vos membres sont lourds, votre respiration difficile et vos mouvements se font inexorablement plus lents. Jetant un coup d’œil angoissé derrière vous, vous voyez à travers l’eau transparente Raiahui se rapprocher rapidement. Vous n’aurez pas le temps d’atteindre l’île avant qu’elle ne vous rattrape ! Allez-vous échouer si près du but ?</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const context = `Vous cherchez désespérément quelque chose qui pourrait vous aider.`;

      let choices = [];
      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `Vous avez encore le filet de la sorcière.`,
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
          "text": `Il vous reste toujours les perles de la sorcière.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("trial-exhausted-pearls");
          },
          "conditional": true,
        });
      }

      if (0 === choices.length) {
        const text = `Et vous ne trouvez rien.`;
        const action = () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end");
        };

        return (
          <Funnel text={text} action={action} context={context} />
        );
      }

      return (
        <Crossroads context={context} choices={choices} />
      );
    },
  },
  "trial-exhausted-net": {
    "text": `
<p>Le désespoir est en train de vous envahir lorsque vous vous souvenez tout à coup du filet que vous avez enroulé autour de votre taille. Vous vous en emparez en hâte et le jetez vers Raiahui. Votre geste n’a presque aucune force, mais le filet de la sorcière n’a pas perdu sa vertu : il se déploie de lui-même et enveloppe étroitement votre poursuivante alors qu’elle allait vous atteindre. Raiahui se contorsionne furieusement, déchiquetant les mailles étroites pour parvenir à se libérer. Avec un sursaut d’énergie, vous nagez vers l’île sablonneuse aussi vite que vous le pouvez encore.</p>
    `,
    "next": raceEnd,
  },
  "trial-exhausted-pearls": {
    "text": `
<p>Le désespoir est en train de vous envahir lorsque vous vous souvenez tout à coup des perles noires que vous transportez. Vous vous en emparez en hâte et les écrasez toutes à la fois. Les eaux qui vous entourent deviennent soudain d’un noir impénétrable, vous dissimulant aux yeux de Raiahui alors qu’elle allait vous atteindre. Avec un sursaut d’énergie, vous nagez vers l’île sablonneuse aussi vite que vous le pouvez encore.</p>
    `,
    "next": raceEnd,
  },
};

export default trial;
