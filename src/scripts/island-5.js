import React from "react";
import Crossroads from "./../components/Crossroads.js";
import Funnel from "./../components/Funnel.js";
import {endGame, useItem, acquireItem} from "./helpers.js";

const escapeTheWitch = (goToSection, flags, updateFlag) => {
  const choices = [
    {
      "text": `Vous essayez de l’esquiver et de filer par la porte.`,
      "action": () => {
        updateFlag("caughtInAWitchNet", true);
        goToSection("witch-thief-doomed-escape");
      },
    },
    {
      "text": `Vous vous jetez à travers la fenêtre ronde qui s’ouvre dans le mur opposé.`,
      "action": () => {
        goToSection("witch-window-escape");
      },
    },
  ];

  return (
    <Crossroads choices={choices} />
  );
};

const sneakingIntoIslandText = `
<p>Il vous semble probable que, si cette île recèle quoi que ce soit d’intéressant, c’est dans la hutte située à son sommet que vous le trouverez. Mais les nombreux fétiches disposés le long des pentes vous mettent mal à l’aise : il vous revient à l’esprit des récits parlant de statues créées par des sorciers pour les avertir de la présence des intrus.</p>

<p>Jetant un coup d’oeil prudent hors de l’endroit où vous êtes dissimulée, il vous semble possible de parvenir jusqu’au sommet sans vous exposer aux yeux figés des fétiches. La végétation qui couvre l’île est peu élevée, mais suffisamment dense.</p>

<p>Mettant votre idée à exécution, vous entreprenez de ramper à l’abri des broussailles. Votre progression est lente, mais aucun signe ne permet de penser que vous avez été repérée.</p>

<p>Votre trajet nécessairement sinueux vous fait passer dans un buisson situé juste derrière l’un des fétiches. Vous observez avec méfiance les motifs étranges gravés dans le bois. La statue est immobile, mais vous ne pouvez vous défaire de l’impression qu’elle va d’un moment à l’autre s’animer et se tourner vers vous.</p>
`;

const sneakingIntoIslandCrossroads = (goToSection, flags, updateFlag) => {
  const choices = [
    {
      "text": `Vous poussez le fétiche de manière à ce qu’il se renverse.`,
      "action": () => {
        updateFlag("feeble", true);
        goToSection("witch-fetish-embrace");
      },
    },
    {
      "text": `Vous l’ignorez et poursuivez votre lente ascension comme auparavant .`,
      "action": () => {
        if (flags.swumUnderWitchIsland) {
          acquireItem("pearls", updateFlag);
          goToSection("witch-master-thief");
        } else {
          goToSection("witch-poor-thief");
        }
      },
    },
  ];

  return (
    <Crossroads choices={choices} />
  );
};

const ascensionText = `
<p>Au terme d’une progression patiente, vous atteignez enfin le sommet de l’île. A quelques pas de vous s’élève la hutte, d’où ne s’échappe pas le moindre son. Est-elle vraiment vide ? Il est impossible d’en distinguer l’intérieur de là où vous vous trouvez.</p>
`;

const island5 = {
  "island-5": {
    "text": `
<p> Vue de plus près, l’île se distingue encore davantage du reste de l’atoll. Ses pentes curieusement régulières sont couvertes d’une végétation peu élevée, parmi lesquelles se dressent de nombreuses statues de bois sombre. Moitié moins grandes que vous, elles vous font penser à certains types de fétiches qu’il vous est arrivé d’observer sur d’autres îles. Les personnages impassibles qu’elles représentent ont tous le regard tourné vers l’extérieur.</p>

<p>Au sommet de l’île, vous distinguez une large hutte ronde et il vous semble apercevoir fugitivement une silhouette en train d’y entrer.</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const context = `Tous vos instincts vous incitent à la prudence.`;

      const choices = [
        {
          "text": `Vous les ignorez et abordez normalement, en face de la hutte.`,
          "action": () => {
            goToSection("witch-bold-approach");
          },
        },
        {
          "text": `Vous abordez dans un endroit discret, de manière à ne pas être repérée.`,
          "action": () => {
            goToSection("witch-sneaky-approach");
          },
        },
        {
          "text": `Vous utilisez votre ancre rudimentaire pour fixer votre pirogue où elle se trouve et vous rendre ensuite sur l’île en nageant sous l’eau.`,
          "action": () => {
            updateFlag("swumUnderWitchIsland", true);
            goToSection("witch-underwater-approach");
          },
        },
        {
          "text": `Vous renoncez à visiter cette île.`,
          "action": () => {
            goToSection("back-to-hub");
          },
        },
      ];

      return (
        <Crossroads context={context} choices={choices} />
      );
    }
  },
  "witch-bold-approach": {
    "text": `
<p>Le contour de l’île est rocailleux, mais vous parvenez néanmoins à accoster sans trop de mal. Vous gravissez ensuite la pente sous le regard impassible des nombreux fétiches. Alors que vous êtes sur le point d’atteindre la hutte, il en sort soudain une grosse femme enroulée dans un paréo pourpre. Ses cheveux courts sont hérissés comme des piquants et, de la tête aux chevilles, elle porte de nombreux bijoux en or d’une élégance que vous avez rarement observée. A sa taille sont accrochés un sac à demi-plein, un filet gris et un petit couteau en métal. Elle tient à la main une coupe remplie d’un liquide clair.</p>

<div class="conversation">
<p>— Une visiteuse ! s’exclame-t-elle d’une voix ravie. Quel plaisir ! Cela faisait si longtemps que personne n’était venu…</p>
</div>

<p>Son accent ne ressemble pas à celui de la tribu, ni à aucun autre de votre connaissance. Elle vous tend la coupe avec tant d’énergie que son contenu vous gicle presque dans la figure et poursuit sans vous laisser le temps de placer un mot :</p>
<div class="conversation">
<p>— Il faut célébrer cela ! C’est la tradition !</p>
</div>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [
        {
          "text": `Vous acceptez de boire.`,
          "action": () => {
            updateFlag("drunkAtTheWitchCup", true);
            goToSection("witch-drink");
          },
        },
      ];

      const alcohol = flags.inventory.alcohol;
      if (alcohol.acquired && !alcohol.used) {
        choices.push({
          "text": `Vous lui offrez en échange le contenu de votre propre calebasse.`,
          "action": () => {
            useItem("alcohol", updateFlag);
            goToSection("witch-my-alcohol");
          },
          "conditional": true,
        });
      }

      choices.push({
        "text": `Vous fichez le camp d’ici à toutes jambes.`,
        "action": () => {
          updateFlag("caughtInAWitchNet", true);
          goToSection("witch-doomed-escape");
        }
      });

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "witch-sneaky-approach": {
    "text":`
<p>Longeant l’île à bonne distance, vous finissez par apercevoir un endroit où la végétation est un peu plus dense et les fétiches plus rares. Vous en prenez la direction de quelques coups de pagaie.  Le contour de l’île est rocailleux, mais vous parvenez néanmoins à accoster sans trop de mal. Vous tirez votre pirogue sur la rive et la dissimulez de votre mieux derrière un épais buisson.</p>
    ` + sneakingIntoIslandText,
    "next": sneakingIntoIslandCrossroads,
  },
  "witch-underwater-approach": {
    "text":`
<p>Le lagon est peu profond à l’endroit où vous êtes et les récifs de corail offrent des prises faciles auxquelles accrocher votre ancre. Cela fait, vous prenez une profonde inspiration avant de plonger dans les eaux tièdes.</p>

<p>Vous nagez vigoureusement, mais sans précipitation. La pêche aux coquillages que vous pratiquiez autour de votre île natale vous a habituée à retenir votre souffle pendant de longues périodes.</p>

<p>Approchant de votre destination, vous êtes surprise de remarquer que l’eau perd à cet endroit sa transparence cristalline et devient presque opaque en-dessous d’une faible profondeur. Mettant cela sur le compte des particularités de l’île, vous poursuivez votre approche sans vous démonter. Un instant plus tard, vous émergez juste devant la rive rocailleuse. Sortant de l’eau sans perdre de temps, vous allez vous dissimuler derrière un épais buisson.</p>
    ` + sneakingIntoIslandText,
    "next": sneakingIntoIslandCrossroads,
  },
  "witch-fetish-embrace": {
    "text":`
<p>Une douleur aiguë vous transperce le bras au moment où vous touchez la statue et, aussitôt, tous les fétiches de l’île émettent un cri d’alarme strident. Paniquée et à demi assourdie, vous abandonnez toute idée de discrétion et vous redressez pour dévaler la pente en courant. Un coup d’oeil en arrière vous fait apercevoir une large silhouette sortant de la hutte, mais elle est heureusement trop loin pour pouvoir vous arrêter. Vous vous hâtez de rejoindre votre pirogue où vous l’avez laissée et de vous éloigner de l’île.</p>

<p>La douleur est passée, mais, maintenant que votre panique s’apaise, vous remarquez qu’un certain engourdissement s’est emparé de votre bras. Vous espérez que cette faiblesse n’est que temporaire.</p>
    `,
    "next": (goToSection) => {
      const text = `Pour le moment, vous faites avec.`;
      const action = () => {goToSection("back-to-hub")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "witch-drink": {
    "text": `
<p>Le liquide clair n’a presque aucun goût, mais il a à peine franchi le seuil de votre gorge qu’un terrible sentiment de lourdeur s’empare de vos membres. La grosse femme éclate de rire, mais c’est à peine si vous l’entendez : tout ce qui vous entoure est en train de s’éloigner avec une folle rapidité. Vous avez totalement perdu connaissance avant même de heurter le sol.</p>

<p>La sorcière ne vous tuera pas et elle finira même par vous rendre une forme de liberté, mais ce que vous aurez subi entre ses mains ne vous laissera pas en mesure de poursuivre encore la moindre quête.</p>`,
    "next": endGame,
  },
  "witch-my-alcohol": {
    "text": `
<div class="conversation">
<p>— Je vous suis très reconnaissante de votre accueil ! vous exclamez-vous chaleureusement. Et, pour honorer la tradition, j’ai également une excellente boisson à vous offrir !</p>
</div>

<p>La grosse femme paraît désarçonnée par votre geste. Après vous avoir remis la coupe — que vous n’avez aucune intention de boire — elle accepte néanmoins la calebasse que vous lui tendez. La débouchant, elle l’approche de ses narines et son expression s’éclaircit aussitôt. Oubliant tout le reste, elle porte la calebasse à ses lèvres et se met à boire goulûment l’alcool qu’elle contient.</p>
    `,
    "next": (goToSection) => {
      const context = `C’est le moment d’agir. Profitant de l’occasion, vous…`;

      const choices = [
        {
          "text": `Vous glissez à l’intérieur de la hutte.`,
          "action": () => {
            goToSection("in-the-witch-house");
          },
        },
        {
          "text": `Déguerpissez d’ici.`,
          "action": () => {
            goToSection("witch-drunk-escape");
          },
        },
      ];

      return (
        <Crossroads context={context} choices={choices} />
      );
    },
  },
  "in-the-witch-house": {
    "text": `
<p>L’intérieur de la hutte est encombré d’un invraisemblable fatras d’objets étranges. Ils sont accrochés aux murs, suspendus au plafond, disposés sur des meubles en bois ou éparpillés sur le sol terreux. Mais vous n’avez pas le temps de les examiner tous, loin de là ! Le cri furieux de la grosse femme vient vous frapper les oreilles et vous l’entendez s’approcher à grands pas.</p>

<div class="conversation">
<p>— Sale petite voleuse ! Tu vas avoir ce que tu mérites !</p>
</div>

<p>Pressée par l’urgence, n’ayant aucune idée de ce qui peut vous être utile, vous posez par hasard les yeux sur les objets disposés sur une petite table voisine. Et refermez votre poigne sur l’un d’eux.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Une parure décoratives faite de plumes jaunes et rouges.`,
          "action": () => {
            goToSection("witch-feathers");
          },
        },
        {
          "text": `Une sorte de sceptre sculpté dans un os blanc comme la craie.`,
          "action": () => {
            updateFlag("touchedACursedItem", true);
            goToSection("witch-sceptre");
          },
        },
        {
          "text": `Une poignée de perles d’un noir profond.`,
          "action": () => {
            acquireItem("pearls", updateFlag);
            goToSection("witch-pearls");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "witch-feathers": {
    "text": `
<p>Les plumes se désagrègent au contact de vos doigts. Vous n’avez pas le temps de faire un autre choix : la grosse femme vient d’entrer dans la hutte et se dirige droit sur vous en vociférant des menaces.</p>
    `,
    "next": escapeTheWitch,
  },
  "witch-pearls": {
    "text": `
<p>Les perles glissent dans votre paume sans se faire prier. Vous n’avez pas le temps de vous intéresser à autre chose : la grosse femme vient d’entrer dans la hutte et se dirige droit sur vous en vociférant des menaces.</p>
    `,
    "next": escapeTheWitch,
  },
  "witch-sceptre": {
    "text": `
<p>Une douleur glaciale vous foudroie lorsque vous refermez la main sur le sceptre en os. Toute énergie déserte instantanément vos membres et vous vous effondrez au sol, au bord de l’évanouissement.</p>

<p>Respirant avec difficulté, incapable du moindre mouvement, vous voyez la grosse femme s’approcher sans hâte et s’accroupir à côté de vous.</p>

<div class="conversation">
<p>— Voilà ce qui arrive quand on touche à n’importe quoi sans savoir ce que c’est, fait-elle en vous prenant le visage entre ses doigts épais. Mais, puisque tu t’intéresses à la sorcellerie, je vais prendre tout le temps nécessaire pour te montrer ce qu’elle permet d’accomplir.</p>
</div>

<p>La sorcière ne vous tuera pas et elle finira même par vous rendre une forme de liberté, mais ce que vous aurez subi entre ses mains ne vous laissera pas en mesure de poursuivre encore la moindre quête.</p>
    `,
    "next": endGame,
  },
  "witch-window-escape": {
    "text": `
<p>Vous vous précipitez vers la fenêtre. La grosse femme se lance à vos trousses, mais vous êtes beaucoup plus rapide et agile. En moins de temps qu’il n’en faut pour le dire, vous vous êtes glissée hors de la hutte par cette sortie improvisée. Vous dévalez ensuite la pente à toutes jambes, pressée de quitter cette île au plus vite.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Vous retrouvez votre pirogue avec bonheur.`;
      const action = () => {
        updateFlag("time", flags.time+1);
        updateFlag("survivedWitchIsland", true);
        goToSection("back-to-hub");
      };

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "witch-doomed-escape": {
    "text": `
<p>Vous tournez les talons et dévalez la pente en courant, mais vous n’avez franchi qu’une faible distance lorsque le filet gris de la grosse femme, traversant l’air, vient vous envelopper et vous faire chuter brutalement. Vous essayez de vous en dépêtrer, mais il vous retient aussi étroitement prisonnière qu’un insecte enveloppé de soie par une araignée.</p>

<p>À peine capable du moindre mouvement, vous voyez la grosse femme s’approcher sans hâte et s’accroupir à côté de vous.</p>

<div class="conversation">
<p>— Quelle jolie prise, fait-elle, vous prenant le visage entre ses doigts épais. Elle va certainement m’occuper pendant bien des jours.</p>
</div>

<p>La sorcière ne vous tuera pas et elle finira même par vous rendre une forme de liberté, mais ce que vous aurez subi entre ses mains ne vous laissera pas en mesure de poursuivre encore la moindre quête.</p>
    `,
    "next": endGame,
  },
  "witch-thief-doomed-escape": {
    "text": `
<p>Échappant agilement aux doigts qui cherchent à vous saisir, vous jaillissez en courant hors de la hutte et entreprenez de dévaler la pente. Mais vous n’avez franchi qu’une faible distance lorsque le filet gris de la grosse femme, traversant l’air, vient vous envelopper et vous faire chuter brutalement. Vous essayez de vous en dépêtrer, mais il vous retient aussi étroitement prisonnière qu’un insecte enveloppé de soie par une araignée.</p>

<p>À peine capable du moindre mouvement, vous voyez la grosse femme s’approcher sans hâte et s’accroupir à côté de vous.</p>

<div class="conversation">
<p>— J’ai toujours beaucoup d’idées à expérimenter sur les gens qui me tombent entre les mains, fait-elle, vous prenant le visage entre ses doigts épais. Mais, pour une petite voleuse dans ton genre, je vais me donner plus de mal que d’ordinaire.</p>
</div>

<p>La sorcière ne vous tuera pas et elle finira même par vous rendre une forme de liberté, mais ce que vous aurez subi entre ses mains ne vous laissera pas en mesure de poursuivre encore la moindre quête.</p>
    `,
    "next": endGame,
  },
  "witch-master-thief": {
    "text": ascensionText + `
<p>Vous êtes sur le point de quitter votre cachette lorsqu’une grosse femme enroulée dans un paréo pourpre apparaît à peu de distance. Ses cheveux courts sont hérissés comme des piquants et, de la tête aux chevilles, elle porte de nombreux bijoux en or d’une élégance que vous avez rarement observée. A sa taille sont accrochés un sac à demi-plein, un filet gris et un petit couteau en métal.</p>

<p>Vous êtes soulagée de voir qu’elle semble totalement ignorer la présence en ce moment d’une intruse sur son île. Elle passe tout près de l’endroit où vous êtes dissimulée et s’éloigne ensuite dans une autre direction. Enhardie, vous attendez qu’elle ait disparu pour vous faufiler sans bruit jusqu’à la hutte et vous glisser à l’intérieur.</p>

<p>Un invraisemblable fatras d’objets étranges accueille aussitôt votre regard. Ils sont accrochés aux murs, suspendus au plafond, disposés sur des meubles en bois ou éparpillés sur le sol terreux. Vous les examinez des yeux, vous abstenant prudemment de les toucher. Beaucoup d’entre eux dégagent une impression extrêmement désagréable.</p>

<p>Vous êtes en train de regarder quelques perles d’un noir extrêmement profond lorsqu’un bruit de pas vous parvient aux oreilles. La grosse femme est déjà en train de revenir ! Il n’est plus question de poursuivre votre inspection, mais vous vous emparez néanmoins des perles noires, qui ont piqué votre intérêt.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const doll = flags.inventory.doll;
      if (doll.acquired && !doll.used) {
        const text = `Vos possessions sont soudain bien remuantes.`;
        const action = () => {
          useItem("doll", updateFlag);
          acquireItem("net", updateFlag);
          goToSection("witch-versus-root");
        };

        return (
          <Funnel text={text} action={action} conditional={true} />
        );
      }

      const text = `Vous essayez de vous éclipser avant d’être remarquée, mais il est trop tard.`;
      const action = () => {
        goToSection("witch-thief-honeypot");
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "witch-thief-honeypot": {
    "text": `
<p>La grosse femme apparaît à l’entrée de la hutte et ses yeux se posent instantanément sur vous.</p>

<div class="conversation">
<p>— Sale petite voleuse ! crache-t-elle. D’où sors-tu ?</p>
</div>

<p>Elle se dirige droit sur vous en vociférant des menaces.</p>
    `,
    "next": escapeTheWitch,
  },
  "witch-poor-thief": {
    "text": ascensionText + `
<p>Vous vous glissez à pas prudents jusqu’à l’entrée de la hutte. Un coup d’oeil rapide à l’intérieur vous apprend qu’elle est effectivement vide. Vous êtes sur le point d’y pénétrer lorsqu’un bruit de pas vous fait vous retourner : une grosse femme enroulée dans un paréo pourpre est en train de regagner la hutte. Ses cheveux courts sont hérissés comme des piquants et elle est chargée de nombreux bijoux en or. À sa taille, vous remarquez un filet gris et un petit couteau en métal. Il est trop tard pour regagner votre cachette, elle vous a vue.</p>

<div class="conversation">
<p>— Tiens, tiens, tiens, fait-elle d’une voix peu affable. J’étais partie chercher mon intruse et je la trouve sur le seuil de chez moi…</p>
</div>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous vous engouffrez à l’intérieur de la hutte.`,
          "action": () => {
            goToSection("in-the-witch-house");
          },
        },
        {
          "text": `Vous prenez de suite la fuite.`,
          "action": () => {
            updateFlag("caughtInAWitchNet", true);
            goToSection("witch-doomed-escape");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "witch-versus-root": {
    "text": `
<p>Alors que vous cherchez un moyen de vous enfuir, les membres de la figurine de bois sont saisis de mouvements convulsifs. Sous vos yeux ébahis, la création du crocodile se lève sur ses deux jambes et se met à grandir et à changer de couleur jusqu’à ce que vous ayiez devant vous une réplique très exacte de vous-même !</p>

<p>Votre double vous adresse un sourire amusé, puis elle jaillit hors de la hutte, passant juste devant la grosse femme qui arrivait. Celle-ci n’est surprise qu’un instant : s’emparant du filet gris qui se trouve à sa taille, elle le jette après l’intruse d’un geste furieux. Vous étant approchée de la porte de  la hutte, vous voyez le filet traverser l’air avec une précision parfaite et s’enrouler étroitement autour de votre sosie. Prise au piège, la figurine reprend aussitôt son aspect d’origine, puis se désagrège en un nuage de poussière. Saisissant l’occasion, vous passez en courant à côté de la grosse femme ébahie, vous emparez au passage du filet et continuez sans ralentir votre fuite jusqu’à ce que vous ayez regagné votre pirogue.</p>`,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Vous examinerez votre dernière trouvaille une fois que vous serez loin d’ici.`;
      const action = () => {
        updateFlag("time", flags.time+1);
        updateFlag("survivedWitchIsland", true);
        goToSection("back-to-hub");
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "witch-drunk-escape": {
    "text": `
<p>Vous dévalez la pente à toutes jambes. Derrière vous s’élève le cri furieux de la grosse femme, mais vous vous glissez à cet instant derrière un épais buisson qui vous dissimule à sa vue.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const doll = flags.inventory.doll;
      if (doll.acquired && !doll.used) {
        const text = `Vos possessions sont soudain bien remuantes.`;
        const action = () => {
          useItem("doll", updateFlag);
          acquireItem("net", updateFlag);
          goToSection("witch-versus-root-alt");
        };

        return (
          <Funnel text={text} action={action} conditional={true} />
        );
      }

      const text = `Courrant à toutes jambes, vous regagnez votre pirogue avant qu’elle ne retrouve votre piste.`;
      const action = () => {
        updateFlag("time", flags.time+1);
        updateFlag("survivedWitchIsland", true);
        goToSection("back-to-hub");
      };

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "witch-versus-root-alt": `
<p>Alors que vous vous apprêtez à poursuivre votre descente, les membres de la figurine de bois sont saisis de mouvements convulsifs. Sous vos yeux ébahis, la création du crocodile se lève sur ses deux jambes et se met à grandir et à changer de couleur jusqu’à ce que vous ayiez devant vous une réplique très exacte de vous-même !</p>

<p>Votre double vous adresse un sourire amusé, puis elle sort de derrière le buisson et se met à courir en terrain exposé. Un instant plus tard, vous voyez le filet gris de la grosse femme traverser l’air avec une précision parfaite et s’enrouler étroitement autour d’elle. Prise au piège, la figurine reprend aussitôt son aspect d’origine, puis se désagrège en un nuage de poussière. Saisissant l’occasion, vous courez vous emparer du filet, puis reprenez votre fuite.</p>
  `,
  "next": (goToSection, flags, updateFlag) => {
    const text = `Quelques instants plus tard, vous avez regagné votre pirogue.`;
    const action = () => {
      updateFlag("time", flags.time+1);
      updateFlag("survivedWitchIsland", true);
      goToSection("back-to-hub");
    };

    return (
      <Funnel text={text} action={action} />
    );
  },
}

export default island5;
