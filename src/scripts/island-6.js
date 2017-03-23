import React from "react";
import Crossroads from "./../components/Crossroads.js";
import Funnel from "./../components/Funnel.js";
import {endGame, acquireItem} from "./helpers.js";

const crocodileLastWords = `
<p>Les échos d’un rire guttural vous parviennent tandis que vous vous enfuyez.</p>

<div class="conversation">
<p>— Tu ne peux pas me reprocher d’avoir essayé, délicieuse fille humaine ! vous crie le crocodile. Mais je vais te donner un véritable conseil pour humilier cette tribu de voleurs. Trouve l’un des fruits rouges qui poussent sur cette île et mange-le juste avant ta course, il te donnera des forces. Tu auras également besoin d’astuce, mais ce n’est pas quelque chose qui s’acquiert aussi facilement !</p>
</div>

<p>Sa voix disparaît derrière vous, mais vous ne ralentissez guère l’allure avant d’avoir regagné votre pirogue. En chemin, vous observez quelques arbustes qui portent en effet de petits fruits ovales d’une couleur écarlate. Il s’agit sans doute de ce dont parlait le crocodile, mais pouvez-vous lui faire confiance cette fois-ci ?</p>
`;

const crocodileLastCrossroads = (goToSection, flags, updateFlag) => {
  const choices = [
    {
      "text": `Vous en ramassez quand même un au cas où.`,
      "action": () => {
        acquireItem("fruit", updateFlag);
        updateFlag("time", flags.time+1);
        goToSection("back-to-hub");
      },
    },
    {
      "text": `Vous choisissez d’ignorer son conseil.`,
      "action": () => {
        updateFlag("time", flags.time+1);
        goToSection("back-to-hub");
      },
    },
  ];

  return (
    <Crossroads choices={choices} />
  );
};

const island6 = {
  "island-6": {
    "text": `
<p>Cette île est couverte d’une abondance de palétuviers, dont les racines enchevêtrées recouvrent totalement le sol. Cà et là, quelques coins de plage résistent non sans mal à l’étouffement. L’île fait une bonne taille — sans être aussi grande que celle où se trouve le village — et son coeur vous est totalement masqué par la végétation.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous accostez sur l’une des bandes de sable.`,
          "action": () => {
            goToSection("exploring-island-6");
          },
        },
        {
          "text": `Vous longez d’abord l’île en pirogue.`,
          "action": () => {
            goToSection("observing-island-6");
          },
        },
        {
          "text": `Vous repartez immédiatement.`,
          "action": () => {
            goToSection("back-to-hub");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "exploring-island-6": {
    "text": `
<p>Vous accostez sur une minuscule plage et vous enfoncez vers le coeur de l’île. Les racines tapissent le sol comme une épaisse toile d’araignée, ce qui rend la marche malaisée et vous fait presque perdre l’équilibre à plusieurs reprises. A mesure que vous vous enfoncez vers l’intérieur, les arbres se font progressivement plus épais, mais vous ne remarquez toujours aucune vie animale. Le silence - que vous trouviez d’abord reposant - ne tarde pas à vous paraître quelque peu oppressant.</p>

<p>Après de longs moments qui ne vous font rien découvrir d’intéressant, vous commencez à vous lasser de cette exploration. Il semble de moins en moins probable qu’il y ait quoi que ce soit qui puisse vous être utile sur cette île. Ne sachant plus bien de quelle direction vous êtes venue, vous décidez de regagner simplement le lagon et de le longer ensuite jusqu’à retrouver votre pirogue. Il vous suffit de quelques instants pour atteindre l’une des petites plages qui entourent l’île, presque étranglée par les racines qui l’entourent.</p>

<p>Votre sang se refroidit dans vos veines. Etendu sur le sable, juste devant vous, il y a un crocodile qui fait quatre fois votre taille.</p>

<p>L’animal est immobile comme un tronc d’arbre abattu. On pourrait croire qu’il est mort. Vous êtes sur le point de détaler à toutes jambes lorsqu’une voix rocailleuse vient vous heurter les oreilles :</p>
<div class="conversation">
<p>— Attends.</p>
</div>
    `,
    "next": (goToSection) => {
      const text = `Sous l’effet de la surprise, vous obtempérez.`;
      const action = () => {goToSection("crocodile");};

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "observing-island-6": {
    "text": `
<p>Plongée dans l’ombre des palétuviers, vous faites progresser votre pirogue à coups de pagaie réguliers. Tout ce qui se trouve sur l’île semble plongé dans une profonde torpeur, que ne vient pas troubler le moindre chant d’oiseau. L’immobilité générale vous inspire progressivement l’impression que rien d’animé ne se trouve ici. Et, pour cette raison, vous ne remarquez l’unique habitant de l’île que très tardivement.</p>

<p>Le sang se refroidit dans vos veines. Etendu sur une bande de sable garrottée d’épaisses racines, si proche que vous pourriez l’atteindre en deux coups de pagaie, il y a un crocodile qui fait quatre fois votre taille.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const context = `Il ne bouge pas d’un pouce et vous ne distinguez pas si ses yeux sont ouverts.`;

      const choices = [
        {
          "text": `Vous vous éloignez précipitamment.`,
          "action": () => {
            goToSection("crocodile-swift-paddling");
          },
        },
        {
          "text": `Vous vous éloignez silencieusement.`,
          "action": () => {
            updateFlag("damagedBoat", true);
            goToSection("crocodile-quiet-paddling");
          },
        },
      ];

      return (
        <Crossroads context={context} choices={choices} />
      );
    }
  },
  "crocodile-swift-paddling": {
    "text": `
<p>Faisant brutalement virer votre pirogue vers le centre du lagon, vous pagayez de toutes vos forces pour vous éloigner au plus vite de ce monstre cuirassé. Il s’écoule un bon moment avant que vous n’osiez vous arrêter, au bord de l’essoufflement. Jetant alors un coup d’oeil en arrière, vous voyez que le crocodile est toujours au même emplacement, aussi immobile qu’un tronc abattu.</p>
    `,
    "next": (goToSection) => {
      const context = `Ce dangereux obstacle entre vous et l’île vous incite tout autant à la prudence qu’il titille votre curiosité.`;

      const choices = [
        {
          "text": `Vous préférez ne pas tenter le diable.`,
          "action": () => {
            goToSection("back-to-hub");
          },
        },
        {
          "text": `Vous ne lâchez pas l’affaire aussi facilement.`,
          "action": () => {
            goToSection("island-6-take-two");
          },
        },
      ];

      return (
        <Crossroads context={context} choices={choices} />
      );
    },
  },
  "crocodile-quiet-paddling": {
    "text": `
<p>Plongeant votre pagaie dans l’eau de manière à ne faire aucun bruit, vous dirigez lentement votre pirogue vers le centre du lagon, malgré la peur qui crispe vos muscles. Mais le crocodile, jusque-là immobile comme un tronc d’arbre abattu, se met alors en mouvement avec une soudaineté foudroyante, se précipitant vers vous dans un grand bruit d’éclaboussures ! Transpercée par la terreur, vous vous mettez aussitôt à pagayer de toutes vos forces, mais le reptile a déjà atteint votre embarcation. Un choc violent vous fait presque tomber à l’eau lorsque sa mâchoire puissante se referme sur votre flotteur. Le crocodile essaie de se servir de cette prise pour renverser votre pirogue, mais il emploie une telle violence qu’il arrache totalement le flotteur, vous donnant une chance de lui échapper. Vous ne la laissez pas passer, pagayant plus énergiquement que vous ne l’avez jamais fait de votre vie jusqu’à vous sentir au bord de l’évanouissement.</p>

<p>Lorsque vous vous arrêtez enfin, le coeur battant à tout rompre, un coup d’oeil en arrière vous apprend que le monstre ne vous a pas poursuivie. Encore sous le choc d’avoir vu la mort vous frôler de si près, il faut un moment pour que cette constatation vous inspire un véritable soulagement.</p>

<p>Vos moyens finissent par vous revenir et vous décidez de faire route vers une autre île. Mais la perte de son flotteur rend votre pirogue beaucoup moins stable et il vous faudra la piloter avec davantage de prudence. Ce qui vous ralentira d’autant.</p>
    `,
    "next": (goToSection) => {
      const text = `Il va bien falloir faire avec.`;
      const action = () => {goToSection("back-to-hub");};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "island-6-take-two": {
    "text": `
<p>Vous prenez soin d’accoster sur une plage située à bonne distance de celle sur laquelle vous avez observé l’énorme crocodile avant d’entamer une exploration prudente de l’île.</p>

<p>Les racines tapissent le sol comme une épaisse toile d’araignée, ce qui rend la marche malaisée et vous fait presque perdre l’équilibre à plusieurs reprises. A mesure que vous vous enfoncez vers l’intérieur, les arbres se font progressivement plus épais, mais vous ne remarquez toujours aucune vie animale. Loin d’être reposant, le silence ne tarde pas à vous paraître oppressant.</p>

<p>Après de longs moments qui ne vous font rien découvrir d’intéressant, vous ne pouvez vous empêcher d’être gagnée par une certaine nervosité. Et si le crocodile avait quitté sa plage et attendait désormais à proximité de votre pirogue ? Vous seriez prise au piège !</p>

<p>Vous décidez que vous êtes restée suffisamment longtemps sur cette île, où il n’y a de toute évidence rien qui puisse vous être utile. Mais avant d’en partir, vous jugez prudent de vous assurer que le crocodile n’a pas bougé de l’endroit où vous l’avez vu. C’est clairement un risque, mais il vous fait moins peur que de ne pas être certaine de l’endroit exact où se trouve ce monstre.</p>

<p>Vous vous dirigez avec une extrême prudence vers la plage où vous avez vu le crocodile, prête à vous enfuir à toutes jambes au moindre signe alarmant. Votre coeur cogne dans votre poitrine avec une violence assourdissante et votre appréhension croît jusqu’à une intensité telle que vous êtes bien près de partir en courant rejoindre votre pirogue, lorsque la bande de sable se dévoile soudain juste devant vous.</p>

<p>Le crocodile est toujours au même endroit, figé comme une statue. On pourrait croire qu’il est mort. Ayant vérifié son emplacement, vous vous apprêtez à vous esquiver discrètement lorsqu’une voix rocailleuse vient vous heurter les oreilles :</p>

<div class="conversation">
<p>— Attends.</p>
</div>
    `,
    "next": (goToSection) => {
      const text = `Sous l’effet de la surprise, vous obtempérez.`;
      const action = () => {goToSection("crocodile");};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "crocodile": {
    "text": `
<p>Le corps massif et cuirassé du crocodile n’a pas perdu son immobilité pesante, mais il a légèrement tourné la tête pour vous regarder de ses yeux jaunes. La voix qui s’échappe de sa gueule à peine entrouverte est à la fois rauque et grondante, ce qui rend presque difficile de saisir ce qu’elle dit :</p>

<div class="conversation">
<p>— N’aie pas peur, je ne te ferai aucun mal. Je veux t’être utile, au contraire. Approche-toi un peu pour que nous parlions, car j’entends difficilement les voix humaines.</p>
</div>

<p>La plupart des légendes de votre tribu mettent en scène des animaux doués de l’esprit et de la parole. Lors de vos moments de rêverie, vous avez souvent imaginé votre rencontre avec une telle créature. Mais vous ne vous attendiez certes pas à ce qu’elle se déroule ainsi !</p>

<p>Votre stupéfaction ne vous ôte cependant pas votre prudence instinctive.</p>
    `,
    "next": (goToSection) => {
      const context = `Vous vous trouvez à quatre bonnes enjambées du crocodile.`;
      const choices = [
        {
          "text": `Vous vous rapprochez — très légèrement — de lui, comme il le demande.`,
          "action": () => {
            goToSection("crocodile-closer");
          },
        },
        {
          "text": `Vous restez exactement où vous êtes.`,
          "action": () => {
            goToSection("crocodile-close-enough");
          },
        },
      ];

      return (
        <Crossroads context={context} choices={choices} />
      );
    },
  },
  "crocodile-closer": {
    "text": `
<p>Vous faites un pas prudent en avant, prête à vous enfuir à la moindre alerte. Mais le corps énorme du crocodile reste aussi immobile que le sable sur lequel il repose.</p>

<div class="conversation">
<p>— C’est bien, tu apprends à ne pas te fier aux apparences. Je veux sincèrement t’aider, comme tu en as besoin. Réfléchis : que veux-tu savoir ?</p>
</div>
    `,
    "next": (goToSection) => {
      const choices = [
        {
          "text": `Vous l’interrogez sur la course que vous allez devoir livrer.`,
          "action": () => {
            goToSection("crocodile-trial");
          },
        },
        {
          "text": `Vous le questionnez sur le sujet de la tribu.`,
          "action": () => {
            goToSection("crocodile-bitterness");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "crocodile-bitterness": {
    "text": `
<div class="conversation">
<p>— Ces voleurs… J’étais le seul maître de l’atoll avant que leur misérable tribu ne décide de s’y installer ! Aujourd’hui, il ne me reste plus que cette seule île et une petite partie du lagon pour y chasser. Mais je suis patient, je sais attendre pendant des saisons et des saisons… Un jour, ils apprendront que je conserve bien des secrets et des pouvoirs cachés, mais il sera trop tard ce jour-là !</p>
</div>

<p>Il est difficile d’identifier clairement des émotions dans une voix aussi inhumaine, mais vous ne doutez pas de la rancoeur vengeresse que nourrit jalousement le reptile.</p>
    `,
    "next": (goToSection) => {
      const choices = [
        {
          "text": `Vous l’enjoignez d’apporter une preuve des pouvoirs qu’il est censé posséder.`,
          "action": () => {
            goToSection("crocodile-power");
          },
        },
        {
          "text": `Vous lui demandez s’il peut vous aider à gagner votre course contre Raiahui.`,
          "action": () => {
            goToSection("crocodile-help");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "crocodile-power": {
    "text": `
<div class="conversation">
<p>— Tu doutes peut-être de ce que je te raconte ? dit le crocodile. Tu es encore jeune et ignorante. Je vais te montrer ce que je peux faire.</p>
</div>

<p>Son corps massif se met à bouger et vous vous raidissez aussitôt, alarmée, mais il ne se dirige pas vers vous. Sa mâchoire puissante se referme sur une racine voisine et en arrache un tronçon épais, qu’elle semble ensuite mastiquer longuement. Puis le crocodile se retourne vers vous et recrache sur le sable le morceau de bois.</p>

<div class="conversation">
<p>— Regarde, voici l’un de mes pouvoirs !</p>
</div>

<p>Son séjour dans la gueule du crocodile a donné une forme étrange au fragment de racine : il ressemble désormais à une figurine humaine. Et, bien que la forme en soit très grossière et les détails inexistants, la certitude étrange apparaît dans votre esprit que c’est vous qu’elle représente. Vos yeux la fixent avec une fascination croissante.</p>

<div class="conversation">
<p>— Cela te plaît, non ? dit le crocodile d’une voix presque susurrante. Et elle te serait profondément utile. Viens la chercher… Viens… Approche…</p>
</div>

<p>Le désir de posséder la figurine s’est totalement emparé de votre esprit et vous êtes prête à défier la mort pour vous en emparer. Mais, bien que vous soyez incapable de résister au charme qu’elle exerce sur vous, votre bon sens n’est pas totalement engourdi. Vous réalisez que les actions du crocodile n’ont pas d’autre but que de faire de vous son repas.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const context = `La figurine se trouve à mi-chemin entre vous deux. Une longue branche, épaisse comme votre cheville, gît sur le sol à côté de vous.`;
      const choices = [
        {
          "text": `Vous ramassez la branche et vous en servez pour tenir à distance le crocodile.`,
          "action": () => {
            updateFlag("eatenByCrocodile", true);
            goToSection("crocodile-branch");
          },
        },
        {
          "text": `Vous essayez de le distraire en faisant semblant d’apercevoir un membre de la tribu qu’il déteste tant.`,
          "action": () => {
            acquireItem("doll", updateFlag);
            goToSection("crocodile-look-out");
          },
        },
      ];

      return (
        <Crossroads context={context} choices={choices} />
      );
    },
  },
  "crocodile-branch": {
    "text": `
<p>Vous vous avancez rapidement vers la figurine, tenant la branche devant vous comme une lance. Le crocodile reste immobile jusqu’au moment où vous devez vous baisser pour ramasser la figurine. C’est à ce moment-là qu’il se jette sur vous avec une soudaineté effrayante. Sa gueule terrible se referme sur votre branche et vous l’arrache violemment des mains, vous déséquilibrant par la même occasion. Vous essayez de vous redresser pour vous enfuir, mais il est trop tard : le crocodile, qui passe l’essentiel de ses journées sans le moindre mouvement, est capable d’une explosion de vélocité lorsqu’il s’agit de s’emparer d’une proie. Pour la première fois depuis bien longtemps, il va pouvoir se repaître de chair humaine.</p>
    `,
    "next": endGame,
  },
  "crocodile-look-out": {
    "text": `
<div class="conversation">
<p>— On dirait que je ne vais pas avoir le temps, dites-vous avec un geste de main vers le lagon. Je vois qu’on vient déjà me chercher pour la course. Ce sera pour…</p>
</div>

<p>L’efficacité de votre mensonge dépasse vos espérances : le corps massif se tourne avec une vélocité stupéfiante vers les nouveaux arrivants imaginaires et la gueule hérissée de dents s’ouvre en grand, de la manière la plus menaçante possible.</p>

<p>Vous ne laissez pas passer cette occasion fabuleuse : le temps que le monstre saisisse votre subterfuge, vous avez franchi l’espace vous séparant de la figurine, vous en êtes emparée et repartez en courant à toutes jambes. Il se jette rageusement à vos trousses, mais vous le distancez sans peine, prenant garde de ne pas trébucher sur l’une des innombrables racines qui parsèment l’île.</p>

<p>Quelques instants plus tard, atteignant votre pirogue, vous prenez le temps d’examiner la figurine grossière. Le charme qui vous avait inspiré le désir irrésistible de la posséder s’est dissipé, mais une intuition vous dit qu’elle pourrait véritablement se révéler utile.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Toutefois, en ce moment, vous envisagez surtout d’augmenter la distance entre vous et son créateur en quelques vigoureux coups de pagaie.`;
      const action = () => {
        updateFlag("time", flags.time+1);
        goToSection("back-to-hub");
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "crocodile-help": {
    "text":`
<div class="conversation">
<p>— Je dois participer à une course pour le rite de passage d’une jeune fille de la tribu, dites-vous à l’énorme reptile. Vous connaissez peut-être un moyen de m’aider ? Si je gagne, cela embarrassera la tribu toute entière.</p>
</p>

<p>Le crocodile médite la suggestion pendant un long moment avant de finalement répondre :</p>
<div class="conversation">
<p>— Ne te fais pas d’illusion : cette course est davantage une cérémonie qu’une épreuve pour ton adversaire. Les traditions de cette tribu bâtarde n’ont pour raison d’être que de leur rappeler leur prétendue supériorité. Lorsque cette course débutera, dis-toi bien que tu n’auras une chance qu’en faisant preuve de ruse et de vigilance. Mais je veux t’aider à humilier ces voleurs. Ecoute bien, je vais te révéler l’un de mes secrets…</p>
</div>

<p>Il s’échappe de sa gueule un bruit étrange, très grave, à mi-chemin entre un grondement et un chant. Son rythme, qui ne ressemble à aucune musique que vous connaissez, exerce sur vous un attrait fascinant.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous continuez de l’écouter.`,
          "action": () => {
            updateFlag("eatenByCrocodile", true);
            goToSection("crocodile-song");
          },
        },
        {
          "text": `Redoutant un piège, vous choisissez plutôt de vous enfuir.`,
          "action": () => {
            goToSection("crocodile-siren");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "crocodile-song": {
    "text": `
<p>Le son lancinant s’insinue peu à peu dans tout votre esprit, étouffant votre instinct et paralysant vos pensées. Vous êtes bientôt tout à fait immobile, les bras ballants et le regard fixe. Et alors, le crocodile interrompt son chant et, soulevant sa masse pesante du lieu où il était étendu, s’avance sans hâte vers vous, qui n’en avez aucune conscience. Sa satisfaction est grande, car cela fait bien longtemps qu’il n’a pas eu l’occasion de dévorer un être humain. Vous allez reprendre vos esprits d’ici un instant, mais il sera bien trop tard.</p>
    `,
    "next": endGame,
  },
  "crocodile-siren": {
    "text": `
<p>Vous tournez les talons pour vous enfuir. Le bruit cesse aussitôt et l’immobilité monolithique du crocodile explose en un jaillissement fulgurant qui le précipite vers vous, la gueule grande ouverte ! Heureusement, vous n’êtes déjà plus à l’endroit où les puissantes mâchoires se referment en claquant. Sans vous retourner, vous vous lancez en courant de toutes vos forces parmi les arbres.</p>
    ` + crocodileLastWords,
    "next": crocodileLastCrossroads,
  },
  "crocodile-close-enough": {
    "text": `
<p>Un rire saccadé et grinçant s’échappe de la gueule puissante du reptile.</p>
<div class="conversation">
<p>— Tu es bien méfiante ! J’imagine que les apparences sont contre moi. Mais tu as pourtant bien d’autres sujets de préoccupation. Veux-tu que je te fasse part de ma sagesse malgré tout ?</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous l’interrogez sur la course que vous allez devoir livrer.`,
          "action": () => {
            goToSection("crocodile-trial");
          },
        },
        {
          "text": `Vous le questionnez sur le sujet de la tribu.`,
          "action": () => {
            goToSection("crocodile-angry");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "crocodile-angry": {
    "text": `
<div class="conversation">
<p>— Je hais ces misérables voleurs, siffle le crocodile avec animosité. L’atoll tout entier m’appartenait avant que leur tribu bâtarde ne décide de s’y installer. Mais il viendra un jour où…</p>
</div>

<p>L’immobilité monolithique du crocodile explose en un jaillissement fulgurant qui le précipite vers vous, la gueule grande ouverte ! Heureusement, vous n’aviez pas relâché votre vigilance et vous avez juste le temps de vous enfuir à toutes jambes.</p>
    ` + crocodileLastWords,
    "next": crocodileLastCrossroads,
  },
  "crocodile-trial": {
    "text": `
<div class="conversation">
<p>— Ne t’y trompe pas : les membres arrogants de cette tribu bâtarde ne pensent pas que tu as la moindre chance de remporter leur course traditionnelle. Ce n’est pour eux qu’une cérémonie, pas une véritable épreuve. Mais cela me plaierait d’humilier ces voleurs en te faisant gagner malgré tout. Regarde parmi les racines de l’arbre qui se trouve à côté de toi, il y a un objet qui pourrait t’être bien utile.</p>
</div>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous suivez ses indications et fouillez les racines.`,
          "action": () => {
            goToSection("crocodile-tree");
          },
        },
        {
          "text": `Vous vous abstenez, soupçonnant un piège.`,
          "action": () => {
            goToSection("crocodile-unmasked");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "crocodile-tree": {
    "text": `
<p>Les racines de l’arbre en question sont un écheveau inextricable. Vous vous baissez pour le fouiller à l’aide de vos mains.</p>
<p>L’immobilité monolithique du crocodile explose en un jaillissement fulgurant qui le précipite vers vous, la gueule grande ouverte ! Prise par surprise, vous avez à peine le temps de réagir.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `Vous vous jetez en arrière.`,
          "action": () => {
            updateFlag("eatenByCrocodile", true);
            goToSection("crocodile-meal");
          },
        },
        {
          "text": `Vous plongez sur le côté.`,
          "action": () => {
            goToSection("crocodile-escape");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "crocodile-meal": {
    "text": `
<p>Votre bond convulsif en arrière vous dérobe aux mâchoires puissantes, mais seulement pour un instant. Votre pied heurte l’une des innombrables racines et vous tombez brutalement à la renverse. L’énorme crocodile, avide d’un repas qu’il n’escomptait pas, ne vous laissera pas l’occasion de vous relever.</p>
    `,
    "next": endGame,
  },
  "crocodile-escape": {
    "text": `
<p>La détente convulsive de vos jambes vous projette sur le côté juste à temps pour que les puissantes mâchoires du crocodile se referment sur le vide. Vous roulez sur le sol, vous meurtrissant les bras et le dos contre les épaisses racines, mais l’énergie que vous insuffle la terreur vous remet presque aussitôt sur vos pieds et vous vous enfuyez en courant. La plage se trouve déjà loin derrière vous lorsque vous vous souvenez de respirer.</p>
    ` + crocodileLastWords,
    "next": crocodileLastCrossroads,
  },
  "crocodile-unmasked": {
    "text": `
<p>L’immobilité monolithique du crocodile explose en un jaillissement fulgurant qui le précipite vers vous, la gueule grande ouverte ! Heureusement, vous n’aviez pas relâché votre vigilance et vous avez juste le temps de vous enfuir à toutes jambes.</p>
    ` + crocodileLastWords,
    "next": crocodileLastCrossroads,
  },
}

export default island6;
