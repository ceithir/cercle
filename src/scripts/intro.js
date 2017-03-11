import React from "react";
import Crossroads from "./../components/Crossroads.js";

const arrivalChoice = function (key, text, goToSection, flags, updateFlag) {
  return {
    "text": text,
    "onClick": () => {
      let actions = flags.arrivalActions.slice();
      actions.push(key);
      updateFlag("arrivalActions", actions);
      return goToSection(key);
    },
  };
}

const arrivalActions = function (goToSection, flags, updateFlag) {
  let choices = [];

  if (!flags.arrivalActions.includes("visit")) {
    choices.push(
      arrivalChoice("visit", "En visitant le village ?", goToSection, flags, updateFlag)
    );
  };

  if (!flags.arrivalActions.includes("repair")) {
    choices.push(
      arrivalChoice("repair", "En vous consacrant à l’entretien de votre pirogue ?", goToSection, flags, updateFlag)
    );
  };

  if (!flags.arrivalActions.includes("raiahui-trial")) {
    choices.push(
      arrivalChoice("raiahui-trial", "En discutant avec Raiahui de son épreuve d’initiation ?", goToSection, flags, updateFlag)
    );
  };

  if (!flags.arrivalActions.includes("raiahui-atoll")) {
    choices.push(
      arrivalChoice("raiahui-atoll", "En demandant à Raiahui de vous décrire l’atoll ?", goToSection, flags, updateFlag)
    );
  };

  return choices;
}

const arrivalNext = function(goToSection, flags, updateFlag) {
  if (flags.arrivalActions.length <= 1) {
    const description = `Il vous reste encore un peu de temps avant le festin. Allez-vous vous l’exploiter…`;

    return (
      <Crossroads text={description} choices={arrivalActions(goToSection, flags, updateFlag)} />
    );
  }

  const context = `Raiahui vous informe que le festin devrait commencer sous peu.`;
  const action = `Vous lui emboîtez le pas.`;
  const choices = [{
    "text": action,
    "onClick": () => {
      //TODO
    }
  }];

  return (
    <Crossroads text={context} choices={choices} />
  );
}

const intro = {
  "prelude": {
    "text":
`
<p>Vous pagayez avec une régularité fluide, sans réfléchir ni rêver à rien, absorbée par les sensations purement physiques de vos muscles qui travaillent, de l'air humide emplissant vos narines et de la caresse ardente du soleil sur votre dos nu. Votre petite pirogue et son mince flotteur ne font naître que des traînées éphémères et insignifiantes à la surface de l'énorme océan, dont les vagues paisibles vous laissent pareillement en repos. Dans le ciel tout aussi immense, les points minuscules que sont les oiseaux ressortent nettement sur l'azur limpide. C'est en suivant leur vol des yeux que vous avez deviné l'existence d'une île peu distante dans cette direction. Cette théorie a été confirmée vers le milieu de la journée, lorsque son contour aplati a commencé à se détacher de l'horizon. Si votre estimation de la distance est correcte, vous devriez atteindre l'île bien avant le crépuscule.</p>

<p>Au fil de votre approche, tandis que le trait clair d'une plage apparaît entre le bleu sombre de l'eau et le foisonnement vert des arbres, votre esprit abandonne son état de détachement pour appréhender de nouveau le futur. Cette île sera-t-elle habitée ? Depuis que vous avez laissé derrière vous la petite partie de l'archipel que vous connaissiez, vous avez fait beaucoup d'escales en des lieux qui se sont révélés absolument déserts. Vous n'étiez pas habituée à une telle solitude avant d'entamer ce voyage et, même si elle ne s'est pas révélée aussi désagréable que vous auriez pu le penser, vous appréciez tout de même les occasions de l'interrompre.</p>

<p>Que l'île soit habitée ou non, elle offrira l'occasion de renouveler vos provisions, qui se limitent actuellement à une petite quantité de tubercules cuits d'igname et de patate douce, agrémentée de quelques bananes. Une source d'eau fraîche serait la bienvenue : l'une de vos deux gourdes est totalement vide. Réparer ou remplacer certains de vos outils ne serait par ailleurs pas un luxe si vous êtes en mesure de prolonger un peu votre escale : votre couteau en os n'est plus guère tranchant et vous avez récemment brisé le manche de votre hachette de pierre.</p>

<p>Et ensuite ? A moins que, par un fait improbable, cette île ne recèle la totalité de ce que vous recherchez, il ne vous restera plus qu'à choisir une nouvelle direction dans laquelle poursuivre votre errance.</p>

<p>Vous vous appelez Mananuiva et, depuis le jour de votre naissance, la saison des pluies est revenue dix-sept fois. Au cours de ces années, vous n'avez connu que votre île natale, ses voisines immédiates et les flots qui les entourent. Mais vous avez finalement atteint l'âge auquel les jeunes gens de votre tribu accomplissent leur rite de passage à l'âge adulte : s'embarquer seul sur une pirogue et partir au large. La tradition appelle cela "partir pour l'horizon" et bien des légendes ont pour point de départ un jeune garçon s'aventurant à cette occasion jusqu'à une île lointaine et étrange. Mais la réalité actuelle de cette coutume est que les adolescents ne font que se rendre à l'une des îles habitées situées à moins d'une journée de voyage et y prendre du bon temps pendant une dizaine de jours. Il est courant que des liaisons romantiques se créent à l'occasion de ces séjours et c'est ainsi que naissent bien des mariages entre des personnes qui auraient pu ne jamais se rencontrer.</p>

<p>Au cours des mois qui ont précédé, vous avez passé de nombreuses soirées à rêvasser à la manière dont se déroulerait votre propre rite de passage, remuant l'espérance imprécise qu'il vous apprendrait quelque chose d'inestimable sur vous-même et sur le monde. Et, le jour venu, votre île natale n'avait pas encore disparu derrière vous lorsqu'une révélation soudaine vous est effectivement venue... celle que la vie d'adulte qui vous attend à l'issue de ce voyage ne recèle aucune perspective qui vous plaise. Vous n'avez pas envie de devenir une femme raisonnable et rangée, pas envie de vous marier et d'avoir beaucoup d'enfants, pas envie de mener une vie comme celle de vos parents et de vos cinq frères et soeurs plus âgés.</p>

<p>Cela remonte à près de deux mois. Depuis, vous avez visité bien des îles à la recherche d'un signe, d'une vision ou d'un oracle qui vous révélera une voie qui vous vous convienne. Vous n'êtes toujours pas certaine de la raison pour laquelle vous avez refusé l'avenir qui vous était promis : votre vie jusqu'alors n'avait pas été malheureuse, tout au plus teintée parfois d'une certaine insatisfaction. Mais vous n'avez jamais douté d'avoir fait le bon choix.</p>

<p>Vous n'êtes désormais plus qu'à quelques coups de pagaie de la plage où viennent expirer les vagues, mais vous n'accostez pas encore. Vous soupçonnez que vous n'avez pas affaire à une île unique, mais à un atoll, auquel cas accéder au lagon intérieur vous offrira une bien meilleure vue d'ensemble.</p>

<p>Vous êtes en train de vous demander dans quelle direction il serait préférable de longer la plage lorsqu'un bruit d'éclaboussures vous fait tourner la tête. Surgie de l'eau, les deux bras posés sur le flotteur de votre pirogue, une jeune fille vous observe avec une curiosité ravie.</p>

<div class="conversation">
<p>— Salut, vous dit-elle d'un ton enjoué. Tu viens de loin ?</p>
<p>— Assez loin, répondez-vous une fois votre surprise surmontée. Tu veux monter ?</p>
<p>— Attends un moment. J'ai lâché quelque chose en remontant et je préfère le récupérer tout de suite.</p>
</div>

<p>Elle plonge sans attendre de réponse et, à travers l'eau claire, vous la voyez qui s'enfonce vers un foisonnement de récifs coralliens. Quelques brefs instants plus tard, elle refait surface et se hisse alors sans se faire prier à bord de votre pirogue. Elle tient à la main un couteau en ivoire qui est sans doute l'objet qu'elle avait perdu. L'idée vous effleure qu'elle était en train de ramasser des coquillages ou des crustacés sous l'eau lorsque vous êtes arrivée, mais elle possèderait dans ce cas un filet où ranger ses prises et elle n'a absolument rien sur elle.</p>

<div class="conversation">
<p>— Je m'appelle Raiahui. Et toi ?</p>
<p>— Mananuiva. Ton village est loin d'ici ?</p>
<p>— Il est du côté du lagon. Je vais te montrer la passe la plus proche.</p>
</div>

<p>Raiahui a à peu près le même âge que vous. Elle est un peu plus grande, un peu plus mince et sa peau brune est légèrement plus claire. Ses cheveux noirs ont été coupés de manière curieusement courte, ne lui tombant même pas jusqu'aux épaules.</p>

<p>Vous dirigez votre pirogue alourdie suivant ses instructions. La langue que parle Raiahui est essentiellement la même que la vôtre et son accent n'est pas plus difficile à saisir que beaucoup de ceux que vous avez rencontré au cours de votre voyage. Certaines des expressions qu'elle emploie ne vous sont pas familières, mais cela ne gêne guère votre compréhension mutuelle.</p>

<p>Vous accédez bientôt à la passe et vous y engagez. Sur votre gauche, l'île que vous avez longé jusqu'ici est restée couverte d'un enchevêtrement de nombreux palmiers. Sur votre droite, vous distinguez à une certaine distance une autre île de l'atoll, qui n'est guère plus qu'une bande de sable nu. En-dessous de votre pirogue, l'eau est d'une limpidité qui contraste avec le bleu profond de l'océan comme du lagon.</p>

<div class="conversation">
<p>— Est-ce que tu es une bonne nageuse ? vous demande soudain Raiahui.</p>
<p>— Très bonne.</p>
</div>
`
    ,
    "next": function(goToSection) {
      const context = `Votre réponse la fait sourire, mais elle ne vous explique pas pourquoi.`;
      const action = `Perplexe, vous reportez votre attention sur l'île vers laquelle vous naviguez.`;
      const choices = [{
        "text": action,
        "onClick": () => {
          goToSection("arrival");
        }
      }];

      return (
        <Crossroads text={context} choices={choices} />
      )
    }
  },
  "arrival": {
    "text":
`
<p>Le village de Raiahui se révèle d’entrée de jeu fort modeste : il ne consiste qu’en quelques huttes très simples, disposées sans ordre parmi les arbres. Les premiers habitants que vous apercevez - et qui vous aperçoivent - sont de jeunes enfants en train de jouer avec animation sur le sable et dans les vagues. Leurs exclamations excitées ne tardent pas à faire paraître quelques adultes, qui se prélassaient jusque-là dans des hamacs voisins.</p>

<p>Lorsque vous parvenez tout près de la plage, Raiahui saute hors de la pirogue pour vous aider à accoster. Une vingtaine de spectateurs de tous âges se sont approchés pour vous observer avec des yeux curieux et il en arrive encore davantage. Vous soutenez de votre mieux toute cette attention ; vous avez visité d’autres îles où le passage d’étrangers est si rare que votre venue faisait figure d’évènement.</p>

<p>La foule s’écarte soudain pour laisser passer un homme aux cheveux presque ras, dont le corps noueux est marqué de diverses cicatrices.</p>

<div class="conversation">
<p>— C’est le chef de la tribu, Ataroa, vous glisse Raiahui tandis que vous descendez à votre tour de la pirogue.</p>
</div>

<p>Vous vous inclinez et vous présentez respectueusement, espérant que l’étiquette locale n’est pas plus exigeante. Ataroa vous examine pendant un instant, sans que ses traits rudes ne laissent filtrer la moindre expression. Puis il hoche la tête.</p>

<div class="conversation">
<p>— Tu es la bienvenue parmi nous. Es-tu venue y chercher quelque chose ?</p>
<p>— J’accomplis mon voyage d’initiation, répondez-vous. Je suis à la recherche d’un signe pour guider mon avenir.</p>
</div>

<p>Cette explication vous a valu un certain nombre de regards étonnés depuis le début de votre voyage : les rites de passage à l’âge adulte prennent des formes très variées à travers l’archipel, mais leur rôle véritable reste d’intégrer les adolescents à la communauté des adultes, non de les lancer dans le genre de quête mystique que pourrait entreprendre un chamane. Si votre réponse surprend Ataroa, il n’en laisse cependant rien paraître.</p>

<p>— La coïncidence est heureuse, dit-il. Il y a également dans notre tribu quelqu’un qui doit accomplir son rite de passage, mais elle devait attendre pour cela la venue d’un étranger.</p>

<p>D’un geste de la main, il désigne Raiahui, qui a clairement du mal à contenir son excitation.</p>

<div class="conversation">
<p>— En quoi consiste ce rite ? demandez-vous, quelque peu étonnée.</p>
<p>— Il s’agit d’une simple course entre l’île où nous sommes et sa voisine, rien de plus. Si Raiahui gagne, elle pourra rejoindre les adultes de la tribu. Si tu gagnes…</p>
</div>

<p>Il s’arrête brièvement pour réfléchir, puis reprend :</p>

<div class="conversation">
<p>— Il y a une boisson sacrée, appelée l’Ecume des Profondeurs, que nous ne préparons presque jamais tant les ingrédients sont difficiles à rassembler. Celui qui en boit entre en contact avec le monde des esprits et en reçoit sagesse et connaissance. Mes prédécesseurs recouraient à l’Ecume des Profondeurs lorsque la tribu était en danger ; moi-même, je n’ai pas eu l’occasion de le faire jusqu’à présent. Si tu remportes la course, tu pourras en boire. Acceptes-tu ?</p>
</div>

<p>La mention de cette récompense a suscité quelques exclamations de surprise au sein de l’assistance. Cette Ecume des Profondeurs vous apportera-t-elle vraiment les réponses que vous recherchez ? La magie réelle n’est pas une chose aussi commune que les légendes le font croire, ainsi que vous avez pu l’observer depuis le début de votre voyage. D’un autre côté, si vous ne saisissez pas toutes les opportunités qui se présentent, il est probable que votre quête n’aboutira jamais à rien.</p>

<p>D’un point de vue beaucoup plus pratique, vous soupçonnez que la tribu ne vous accordera pas l’hospitalité si vous refusez de participer à cette course et vous n’éprouvez aucune envie de repartir sur votre pirogue avant une bonne nuit de sommeil.</p>

<div class="conversation">
<p>— J’accepte de participer à ce rite de passage, dites-vous.</p>
</div>

<p>Un gloussement joyeux échappe à Raiahui avant même que vous n’ayiez achevé la phrase ; un murmure de contentement général lui fait écho au sein de la foule.</p>

<div class="conversation">
<p>— C’est parfait, dit Ataroa. La course aura lieu d’ici une journée et nous tiendrons ce soir un festin en cet honneur.</p>
</div>

<p>Il distribue des instructions autour de lui et les spectateurs se dispersent tous pour aller préparer le repas. Raiahui s’absente brièvement pour aller passer un pagne, puis revient vous trouver, un large sourire toujours peint sur le visage. Vous observez sa souple musculature d’un oeil calculateur, vous demandant à quel point elle sera difficile à battre. Vous êtes restée en deçà de la vérité en lui disant que vous étiez une très bonne nageuse : vous n’avez jamais rencontré une jeune fille de votre âge capable de vous surpasser.</p>
`
    ,
    "next": (goToSection, flags, updateFlag) => {
      const description = `Il va sans doute s’écouler un certain temps avant que le festin ne puisse commencer. Comment allez-vous l’occuper ?`;

      return (
        <Crossroads text={description} choices={arrivalActions(goToSection, flags, updateFlag)} />
      );
    }
  },
  "visit": {
    "text":
`
<p>Raiahui vous fait visiter son village. Les quelques huttes qui le composent se révèlent rudimentaires et peu élégantes, même si vous gardez bien entendu cette opinion pour vous. La végétation qui s’étend tout autour est abondante, mais de taille limitée, comme c’est fréquemment le cas sur les atolls : même si les palmiers s’élèvent nettement au-dessus de votre tête, ils restent d’une épaisseur fort modeste.</p>

<p>Le centre du village vous réserve cependant une surprise impressionnante. Non loin de l’espace que certains des habitants sont en train de préparer pour le festin s’élève un monument fait de très nombreux trophées de pêche. Vous observez des carapaces de tortues, des rostres d’espadon, de nombreux crânes allongés de dauphins… Au centre s’élève une mâchoire mince et allongée, dont la longueur dépasse le double de votre taille ; elle est hérissée de dents épaisses et pointues.</p>

<div class="conversation">
<p>— C’est la mâchoire d’un cachalot, vous explique Raiahui, souriant de votre étonnement.</p>
</div>

<p>Vous avez entendu parler de ces animaux énormes, mais vous n’en avez jamais vu aucun, ce dont vous vous félicitez à la vue de ce vestige.</p>

<div class="conversation">
<p>— Comment est-ce que vous avez réussi à pêcher une chose pareille ?</p>
<p>— Je n’étais pas très grande à l’époque et je me souviens surtout d’avoir mangé du cachalot pendant plusieurs jours. Ils étaient une vingtaine de chasseurs et ils ont eu énormément de mal à séparer l’animal du groupe dont il faisait partie et à le faire s’échouer près de l’atoll. C’est dommage que tu ne puisses pas entendre Faanarua t’expliquer comment ils ont fait.</p>
<p>— Qui est Faanarua ?</p>
<p>— C’était l’une des meilleures chasseuses de la tribu… et elle racontait vraiment très bien les histoires. Mais elle est devenue un peu bizarre et on ne la voit plus souvent. Je crois qu’elle est de passage en ce moment, mais je ne pense pas qu’elle aura envie de venir ce soir.</p>
</div>
`
    ,
    "next": arrivalNext,
  },
  "repair": {
    "text":
`
<p>Vérifier à chaque escale le bon état de votre pirogue est une habitude que vous avez eu le bon sens de prendre dès le début de votre voyage. Sa faible taille vous permet de la manoeuvrer seule, mais la rendrait plus vulnérable si le ciel et la mer cessaient d’être aussi favorables. Elle serait mise à rude épreuve si vous veniez à être surprise en pleine mer par un coup de vent sérieux.</p>

<p>Sous le regard curieux de Raiahui, vous examinez donc votre embarcation sous toutes les coutures, vous assurant que rien ne menace son étanchéité et que les liens maintenant en place le flotteur sont toujours solides.</p>

<p>Aucun sujet de préoccupation ne s’étant présenté à vos yeux, vous mettez finalement un terme à votre inspection. Mais, au moment où vous vous redressez, vous remarquez subitement quelque chose d’étonnant : sur la plage longeant le village, il n’y a - en plus de la vôtre - que deux pirogues, d’ailleurs fort frêles. Même si les habitants de l’atoll ne s’aventurent guère en mer, la simple activité de pêcher devrait exiger bien plus d’embarcations que cela. Les autres pirogues de la tribu sont-elles conservées ailleurs ? Vous décidez que la question n’est tout de même pas essentielle au point de mériter une investigation immédiate.</p>
`
    ,
    "next": arrivalNext,
  },
  "raiahui-trial": {
    "text":
`
<div class="conversation">
<p>— Si j'ai bien compris, tu ne pouvais pas accomplir ton rite de passage sans la venue d'un étranger ?</p>
<p>— C'est ça. Mais il faut que ce soit quelqu'un en bonne santé et suffisamment robuste, bien sûr, ou ce serait trop facile.</p>
<p>— Vous avez souvent des visiteurs ?</p>
<p>— Pas tellement, non. J'attends quelqu'un depuis le début de la saison sèche. S'il ne vient personne qui convienne pendant une année entière, quelques adultes emmènent ceux qui ont atteint l'âge nécessaire jusqu'à l'une des îles habitées les plus proches, pour y trouver des gens qui acceptent de participer à la course. Mais grâce à toi, je vais pouvoir devenir une adulte dès demain soir. Je suis vraiment contente.</p>
<p>— Il y a d'abord notre course, ne pouvez-vous vous empêcher de lui faire remarquer.</p>
</div>

<p>Le sourire qui se dessine sur le visage de Raiahui vous dévoile toutes ses dents.</p>

<div class="conversation">
<p>— Je suis désolée pour ta quête, Mananuiva, mais c'est moi qui gagnerai.
</div>
`
    ,
    "next": arrivalNext
  },
  "raiahui-atoll": {
    "text":
`
<p>À en juger par la direction dans laquelle le soleil décline, l'île où se trouve le village est située à l'extrémité sud de l'atoll. Depuis la plage où a accosté votre pirogue, vous pouvez distinguer les contours des autres îles, mais pas en déterminer le nombre exact. Raiahui vous dessine un plan sommaire sur le sable.</p>

<div class="conversation">
<p>— Nous sommes ici, dit-elle en traçant un trait légèrement courbe. Juste à droite, c'est la passe par laquelle nous sommes entrées dans le lagon et, de l'autre côté, c'est le point d'arrivée de notre course. Tu as dû voir au passage à quoi ça ressemble : il n'y a même pas un buisson !
Son doigt continue à tracer des formes sans grande précision, faisant progresser la représentation vers le nord.</p>
<p>— Après, il y a un îlot tout petit, qui donne l'impression qu'il va disparaître à chaque fois que revient la saison des pluies. Et ensuite, il y a l'île où habite le Vieux Fainéant. C'est là qu'on trouve les plus gros arbres de l'atoll, mais je ne te conseille pas d'aller les voir de près : le Vieux n'est pas sincèrement accueillant. Il est assez malin pour nous laisser tranquille, mais les étrangers, c'est une autre histoire.</p>
</div>

<p>Vous allez lui demander des précisions, mais elle est déjà en train de passer à la suite :</p>
<div class="conversation">
<p>— Et là, c'est la demeure de la sorcière !</p>
<p>— Une sorcière ?</p>
</div>

<p>Vous vous demandez si Raiahui n'est pas en train de se moquer de vous, mais elle semble tout à fait sincère et très désireuse de vous fournir davantage de détails.</p>

<div class="conversation">
<p>- Lorsque j'étais encore petite, raconte-t-elle avec une excitation nostalgique, il n'y avait rien qui émergeait de l'eau à cet endroit de l'atoll. Et puis, un beau matin, il y a une île qui est apparue là ! Certains pensent qu'elle est venue en flottant, d'autres qu'elle est en fait sur le dos d'un crabe géant au service de la sorcière. L'eau est très sombre tout autour, alors on ne peut pas bien voir... Enfin bon, il y a plusieurs adultes qui sont partis explorer l'île et ils ne sont jamais revenus. Depuis, bien sûr, personne n'y va.</p>
<p>— Mais comment est-ce que vous savez qu'il y a une sorcière, dans ce cas ?</p>
<p>— On l'aperçoit de loin, de temps en temps. Elle est très grosse, avec des cheveux hérissés comme des épines d'oursins, et elle porte beaucoup de bijoux dorés bizarres. Elle a souvent l'air occupée, mais personne ne sait vraiment ce qu'elle fait.</p>
</div>

<p>Les trois îles qui complètent l'atoll du côté ouest sont visiblement loin d'inspirer autant d'intérêt à Raiahui, qui les expédie en quelques mots :</p>
<div class="conversation">
<p>— Celle-ci est très petite et il n'y a presque rien. Les deux dernières sont de taille moyenne et elles ont beaucoup de palmiers, comme cette île-ci.</p>
</div>
`
    ,
    "next": arrivalNext,
  }
};


export default intro;
