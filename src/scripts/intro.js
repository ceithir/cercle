import React from "react";
import Crossroads from "./../components/Crossroads.js";
import Funnel from "./../components/Funnel.js";

const noRepeatedAction = function(flagName, actions, goToSection, flags, updateFlag) {
  const choice = function(key, text) {
    return {
      "text": text,
      "onClick": () => {
        let actions = flags[flagName].slice();
        actions.push(key);
        updateFlag(flagName, actions);
        return goToSection(key);
      },
    };
  }

  return actions.filter(function(action){
      return !flags[flagName].includes(action.key);
    }).map(function(action){
      return choice(action.key, action.text);
    });
}

const arrivalActions = function(goToSection, flags, updateFlag) {
  return noRepeatedAction(
    "arrivalActions",
    [
      {
        "key": "visit",
        "text": `Vous en profitez pour visiter le village.`,
      },
      {
        "key": "repair",
        "text": `Vous procédez à l’entretien de votre pirogue.`,
      },
      {
        "key": "raiahui-trial",
        "text": `Vous discutez avec Raiahui de son épreuve d’initiation.`,
      },
      {
        "key": "raiahui-atoll",
        "text": `Vous demandez à Raiahui de vous décrire l’atoll.`,
      },
    ],
    goToSection,
    flags,
    updateFlag,
  );
}

const arrivalNext = function(goToSection, flags, updateFlag) {
  if (flags.arrivalActions.length <= 1) {
    const description = `Il vous reste encore un peu de temps avant le festin.`;

    return (
      <Crossroads text={description} choices={arrivalActions(goToSection, flags, updateFlag)} />
    );
  }

  const context = `Raiahui vous informe que le festin devrait commencer sous peu.`;
  const text = `Vous lui emboîtez le pas.`;
  const action = () => {goToSection("feast");};

  return (
    <Funnel context={context} text={text} action={action} />
  );
}

const feastActions = function(goToSection, flags, updateFlag) {
  return noRepeatedAction(
    "feastActions",
    [
      {
        "key": "feast-chief",
        "text": `Le chef Ataroa.`,
      },
      {
        "key": "feast-men",
        "text": `Les hommes.`,
      },
      {
        "key": "feast-women",
        "text": `Les femmes.`,
      },
      {
        "key": "feast-boys",
        "text": `Les adolescents.`,
      },
      {
        "key": "feast-girls",
        "text": `Les adolescentes.`,
      },
    ],
    goToSection,
    flags,
    updateFlag,
  );
}

const feastNext = function(goToSection, flags, updateFlag) {
  if (flags.feastActions.length <= 1) {
    const description = `Avec qui désirez-vous discuter maintenant ?`;

    return (
      <Crossroads text={description} choices={feastActions(goToSection, flags, updateFlag)} />
    );
  }

  const context = `La fête touche à sa fin.`;
  const text = `Vous en observez les derniers instants en dodelinant de la tête.`;
  const action = () => {goToSection("night");};

  return (
    <Funnel context={context} text={text} action={action} />
  );
}

const intro = {
  "prelude": {
    "text":
`
<p>Vous pagayez avec une régularité fluide, sans réfléchir ni rêver à rien, absorbée par les sensations purement physiques de vos muscles qui travaillent, de l’air humide emplissant vos narines et de la caresse ardente du soleil sur votre dos nu. Votre petite pirogue et son mince flotteur ne font naître que des traînées éphémères et insignifiantes à la surface de l’énorme océan, dont les vagues paisibles vous laissent pareillement en repos. Dans le ciel tout aussi immense, les points minuscules que sont les oiseaux ressortent nettement sur l’azur limpide. C’est en suivant leur vol des yeux que vous avez deviné l’existence d’une île peu distante dans cette direction. Cette théorie a été confirmée vers le milieu de la journée, lorsque son contour aplati a commencé à se détacher de l’horizon. Si votre estimation de la distance est correcte, vous devriez atteindre l’île bien avant le crépuscule.</p>

<p>Au fil de votre approche, tandis que le trait clair d’une plage apparaît entre le bleu sombre de l’eau et le foisonnement vert des arbres, votre esprit abandonne son état de détachement pour appréhender de nouveau le futur. Cette île sera-t-elle habitée ? Depuis que vous avez laissé derrière vous la petite partie de l’archipel que vous connaissiez, vous avez fait beaucoup d’escales en des lieux qui se sont révélés absolument déserts. Vous n’étiez pas habituée à une telle solitude avant d’entamer ce voyage et, même si elle ne s’est pas révélée aussi désagréable que vous auriez pu le penser, vous appréciez tout de même les occasions de l’interrompre.</p>

<p>Que l’île soit habitée ou non, elle offrira l’occasion de renouveler vos provisions, qui se limitent actuellement à une petite quantité de tubercules cuits d’igname et de patate douce, agrémentée de quelques bananes. Une source d’eau fraîche serait la bienvenue : l’une de vos deux gourdes est totalement vide. Réparer ou remplacer certains de vos outils ne serait par ailleurs pas un luxe si vous êtes en mesure de prolonger un peu votre escale : votre couteau en os n’est plus guère tranchant et vous avez récemment brisé le manche de votre hachette de pierre.</p>

<p>Et ensuite ? A moins que, par un fait improbable, cette île ne recèle la totalité de ce que vous recherchez, il ne vous restera plus qu’à choisir une nouvelle direction dans laquelle poursuivre votre errance.</p>

<p>Vous vous appelez Mananuiva et, depuis le jour de votre naissance, la saison des pluies est revenue dix-sept fois. Au cours de ces années, vous n’avez connu que votre île natale, ses voisines immédiates et les flots qui les entourent. Mais vous avez finalement atteint l’âge auquel les jeunes gens de votre tribu accomplissent leur rite de passage à l’âge adulte : s’embarquer seul sur une pirogue et partir au large. La tradition appelle cela « partir pour l’horizon » et bien des légendes ont pour point de départ un jeune garçon s’aventurant à cette occasion jusqu’à une île lointaine et étrange. Mais la réalité actuelle de cette coutume est que les adolescents ne font que se rendre à l’une des îles habitées situées à moins d’une journée de voyage et y prendre du bon temps pendant une dizaine de jours. Il est courant que des liaisons romantiques se créent à l’occasion de ces séjours et c’est ainsi que naissent bien des mariages entre des personnes qui auraient pu ne jamais se rencontrer.</p>

<p>Au cours des mois qui ont précédé, vous avez passé de nombreuses soirées à rêvasser à la manière dont se déroulerait votre propre rite de passage, remuant l’espérance imprécise qu’il vous apprendrait quelque chose d’inestimable sur vous-même et sur le monde. Et, le jour venu, votre île natale n’avait pas encore disparu derrière vous lorsqu’une révélation soudaine vous est effectivement venue… celle que la vie d’adulte qui vous attend à l’issue de ce voyage ne recèle aucune perspective qui vous plaise. Vous n’avez pas envie de devenir une femme raisonnable et rangée, pas envie de vous marier et d’avoir beaucoup d’enfants, pas envie de mener une vie comme celle de vos parents et de vos cinq frères et soeurs plus âgés.</p>

<p>Cela remonte à près de deux mois. Depuis, vous avez visité bien des îles à la recherche d’un signe, d’une vision ou d’un oracle qui vous révélera une voie qui vous vous convienne. Vous n’êtes toujours pas certaine de la raison pour laquelle vous avez refusé l’avenir qui vous était promis : votre vie jusqu’alors n’avait pas été malheureuse, tout au plus teintée parfois d’une certaine insatisfaction. Mais vous n’avez jamais douté d’avoir fait le bon choix.</p>

<p>Vous n’êtes désormais plus qu’à quelques coups de pagaie de la plage où viennent expirer les vagues, mais vous n’accostez pas encore. Vous soupçonnez que vous n’avez pas affaire à une île unique, mais à un atoll, auquel cas accéder au lagon intérieur vous offrira une bien meilleure vue d’ensemble.</p>

<p>Vous êtes en train de vous demander dans quelle direction il serait préférable de longer la plage lorsqu’un bruit d’éclaboussures vous fait tourner la tête. Surgie de l’eau, les deux bras posés sur le flotteur de votre pirogue, une jeune fille vous observe avec une curiosité ravie.</p>

<div class="conversation">
<p>— Salut, vous dit-elle d’un ton enjoué. Tu viens de loin ?</p>
<p>— Assez loin, répondez-vous une fois votre surprise surmontée. Tu veux monter ?</p>
<p>— Attends un moment. J’ai lâché quelque chose en remontant et je préfère le récupérer tout de suite.</p>
</div>

<p>Elle plonge sans attendre de réponse et, à travers l’eau claire, vous la voyez qui s’enfonce vers un foisonnement de récifs coralliens. Quelques brefs instants plus tard, elle refait surface et se hisse alors sans se faire prier à bord de votre pirogue. Elle tient à la main un couteau en ivoire qui est sans doute l’objet qu’elle avait perdu. L’idée vous effleure qu’elle était en train de ramasser des coquillages ou des crustacés sous l’eau lorsque vous êtes arrivée, mais elle possèderait dans ce cas un filet où ranger ses prises et elle n’a absolument rien sur elle.</p>

<div class="conversation">
<p>— Je m’appelle Raiahui. Et toi ?</p>
<p>— Mananuiva. Ton village est loin d’ici ?</p>
<p>— Il est du côté du lagon. Je vais te montrer la passe la plus proche.</p>
</div>

<p>Raiahui a à peu près le même âge que vous. Elle est un peu plus grande, un peu plus mince et sa peau brune est légèrement plus claire. Ses cheveux noirs ont été coupés de manière curieusement courte, ne lui tombant même pas jusqu’aux épaules.</p>

<p>Vous dirigez votre pirogue alourdie suivant ses instructions. La langue que parle Raiahui est essentiellement la même que la vôtre et son accent n’est pas plus difficile à saisir que beaucoup de ceux que vous avez rencontré au cours de votre voyage. Certaines des expressions qu’elle emploie ne vous sont pas familières, mais cela ne gêne guère votre compréhension mutuelle.</p>

<p>Vous accédez bientôt à la passe et vous y engagez. Sur votre gauche, l’île que vous avez longé jusqu’ici est restée couverte d’un enchevêtrement de nombreux palmiers. Sur votre droite, vous distinguez à une certaine distance une autre île de l’atoll, qui n’est guère plus qu’une bande de sable nu. En-dessous de votre pirogue, l’eau est d’une limpidité qui contraste avec le bleu profond de l’océan comme du lagon.</p>

<div class="conversation">
<p>— Est-ce que tu es une bonne nageuse ? vous demande soudain Raiahui.</p>
<p>— Très bonne.</p>
</div>

<p>Votre réponse la fait sourire, mais elle ne vous explique pas pourquoi.</p>
`
    ,
    "next": function(goToSection) {
      const context = `Perplexe, vous reportez votre attention sur l’île vers laquelle vous naviguez.`;
      const text = `Vous pouvez maintenant apercevoir le village promis.`;
      const action = () => {goToSection("arrival");};

      return (
        <Funnel context={context} text={text} action={action} />
      );
    }
  },
  "arrival": {
    "text":
`
<p>Le village de Raiahui se révèle d’entrée de jeu fort modeste : il ne consiste qu’en quelques huttes très simples, disposées sans ordre parmi les arbres. Les premiers habitants que vous apercevez - et qui vous aperçoivent - sont de jeunes enfants en train de jouer avec animation sur le sable et dans les vagues. Leurs exclamations excitées ne tardent pas à faire paraître quelques adultes, qui se prélassaient jusque-là dans des hamacs voisins.</p>

<p>Lorsque vous parvenez tout près de la plage, Raiahui saute hors de la pirogue pour vous aider à accoster. Une vingtaine de spectateurs de tous âges se sont approchés pour vous observer avec des yeux curieux et il en arrive encore davantage. Vous soutenez de votre mieux toute cette attention ; vous avez visité d’autres îles où le passage d’étrangers est si rare que votre venue faisait figure d’évènement.</p>

<p>La foule s’écarte soudain pour laisser passer un homme aux cheveux presque ras, dont le corps noueux est marqué de diverses cicatrices.</p>

<div class="conversation">
<p>— C’est le chef de la tribu, Ataroa, vous glisse Raiahui tandis que vous descendez à votre tour de la pirogue.</p>
</div>

<p>Vous vous inclinez et vous présentez respectueusement, espérant que l’étiquette locale n’est pas plus exigeante. Ataroa vous examine pendant un instant, sans que ses traits rudes ne laissent filtrer la moindre expression. Puis il hoche la tête.</p>

<div class="conversation">
<p>— Tu es la bienvenue parmi nous. Es-tu venue y chercher quelque chose ?</p>
<p>— J’accomplis mon voyage d’initiation, répondez-vous. Je suis à la recherche d’un signe pour guider mon avenir.</p>
</div>

<p>Cette explication vous a valu un certain nombre de regards étonnés depuis le début de votre voyage : les rites de passage à l’âge adulte prennent des formes très variées à travers l’archipel, mais leur rôle véritable reste d’intégrer les adolescents à la communauté des adultes, non de les lancer dans le genre de quête mystique que pourrait entreprendre un chamane. Si votre réponse surprend Ataroa, il n’en laisse cependant rien paraître.</p>

<p>— La coïncidence est heureuse, dit-il. Il y a également dans notre tribu quelqu’un qui doit accomplir son rite de passage, mais elle devait attendre pour cela la venue d’un étranger.</p>

<p>D’un geste de la main, il désigne Raiahui, qui a clairement du mal à contenir son excitation.</p>

<div class="conversation">
<p>— En quoi consiste ce rite ? demandez-vous, quelque peu étonnée.</p>
<p>— Il s’agit d’une simple course entre l’île où nous sommes et sa voisine, rien de plus. Si Raiahui gagne, elle pourra rejoindre les adultes de la tribu. Si tu gagnes…</p>
</div>

<p>Il s’arrête brièvement pour réfléchir, puis reprend :</p>

<div class="conversation">
<p>— Il y a une boisson sacrée, appelée l’Écume des Profondeurs, que nous ne préparons presque jamais tant les ingrédients sont difficiles à rassembler. Celui qui en boit entre en contact avec le monde des esprits et en reçoit sagesse et connaissance. Mes prédécesseurs recouraient à l’Écume des Profondeurs lorsque la tribu était en danger ; moi-même, je n’ai pas eu l’occasion de le faire jusqu’à présent. Si tu remportes la course, tu pourras en boire. Acceptes-tu ?</p>
</div>

<p>La mention de cette récompense a suscité quelques exclamations de surprise au sein de l’assistance. Cette Écume des Profondeurs vous apportera-t-elle vraiment les réponses que vous recherchez ? La magie réelle n’est pas une chose aussi commune que les légendes le font croire, ainsi que vous avez pu l’observer depuis le début de votre voyage. D’un autre côté, si vous ne saisissez pas toutes les opportunités qui se présentent, il est probable que votre quête n’aboutira jamais à rien.</p>

<p>D’un point de vue beaucoup plus pratique, vous soupçonnez que la tribu ne vous accordera pas l’hospitalité si vous refusez de participer à cette course et vous n’éprouvez aucune envie de repartir sur votre pirogue avant une bonne nuit de sommeil.</p>

<div class="conversation">
<p>— J’accepte de participer à ce rite de passage, dites-vous.</p>
</div>

<p>Un gloussement joyeux échappe à Raiahui avant même que vous n’ayiez achevé la phrase ; un murmure de contentement général lui fait écho au sein de la foule.</p>

<div class="conversation">
<p>— C’est parfait, dit Ataroa. La course aura lieu d’ici une journée et nous tiendrons ce soir un festin en cet honneur.</p>
</div>

<p>Il distribue des instructions autour de lui et les spectateurs se dispersent tous pour aller préparer le repas. Raiahui s’absente brièvement pour aller passer un pagne, puis revient vous trouver, un large sourire toujours peint sur le visage. Vous observez sa souple musculature d’un œil calculateur, vous demandant à quel point elle sera difficile à battre. Vous êtes restée en deçà de la vérité en lui disant que vous étiez une très bonne nageuse : vous n’avez jamais rencontré une jeune fille de votre âge capable de vous surpasser.</p>
`
    ,
    "next": (goToSection, flags, updateFlag) => {
      const description = `Il va sans doute s’écouler un certain temps avant que le festin ne puisse commencer. À quoi allez-vous l’occuper ?`;

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
<p>— C’est la mâchoire d’un cachalot, vous explique Raiahui, souriant de votre étonnement.</p>
</div>

<p>Vous avez entendu parler de ces animaux énormes, mais vous n’en avez jamais vu aucun, ce dont vous vous félicitez à la vue de ce vestige.</p>

<div class="conversation">
<p>— Comment est-ce que vous avez réussi à pêcher une chose pareille ?</p>
<p>— Je n’étais pas très grande à l’époque et je me souviens surtout d’avoir mangé du cachalot pendant plusieurs jours. Ils étaient une vingtaine de chasseurs et ils ont eu énormément de mal à séparer l’animal du groupe dont il faisait partie et à le faire s’échouer près de l’atoll. C’est dommage que tu ne puisses pas entendre Faanarua t’expliquer comment ils ont fait.</p>
<p>— Qui est Faanarua ?</p>
<p>— C’était l’une des meilleures chasseuses de la tribu… et elle racontait vraiment très bien les histoires. Mais elle est devenue un peu bizarre et on ne la voit plus souvent. Je crois qu’elle est de passage en ce moment, mais je ne pense pas qu’elle aura envie de venir ce soir.</p>
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

<p>Aucun sujet de préoccupation ne s’étant présenté à vos yeux, vous mettez finalement un terme à votre inspection. Mais, au moment où vous vous redressez, vous remarquez subitement quelque chose d’étonnant : sur la plage longeant le village, il n’y a — en plus de la vôtre — que deux pirogues, d’ailleurs fort frêles. Même si les habitants de l’atoll ne s’aventurent guère en mer, la simple activité de pêcher devrait exiger bien plus d’embarcations que cela. Les autres pirogues de la tribu sont-elles conservées ailleurs ? Vous décidez que la question n’est tout de même pas essentielle au point de mériter une investigation immédiate.</p>
`
    ,
    "next": arrivalNext,
  },
  "raiahui-trial": {
    "text":
`
<div class="conversation">
<p>— Si j’ai bien compris, tu ne pouvais pas accomplir ton rite de passage sans la venue d’un étranger ?</p>
<p>— C’est ça. Mais il faut que ce soit quelqu’un en bonne santé et suffisamment robuste, bien sûr, ou ce serait trop facile.</p>
<p>— Vous avez souvent des visiteurs ?</p>
<p>— Pas tellement, non. J’attends quelqu’un depuis le début de la saison sèche. S’il ne vient personne qui convienne pendant une année entière, quelques adultes emmènent ceux qui ont atteint l’âge nécessaire jusqu’à l’une des îles habitées les plus proches, pour y trouver des gens qui acceptent de participer à la course. Mais grâce à toi, je vais pouvoir devenir une adulte dès demain soir. Je suis vraiment contente.</p>
<p>— Il y a d’abord notre course, ne pouvez-vous vous empêcher de lui faire remarquer.</p>
</div>

<p>Le sourire qui se dessine sur le visage de Raiahui vous dévoile toutes ses dents.</p>

<div class="conversation">
<p>— Je suis désolée pour ta quête, Mananuiva, mais c’est moi qui gagnerai.
</div>
`
    ,
    "next": arrivalNext
  },
  "raiahui-atoll": {
    "text":
`
<p>À en juger par la direction dans laquelle le soleil décline, l’île où se trouve le village est située à l’extrémité sud de l’atoll. Depuis la plage où a accosté votre pirogue, vous pouvez distinguer les contours des autres îles, mais pas en déterminer le nombre exact. Raiahui vous dessine un plan sommaire sur le sable.</p>

<div class="conversation">
<p>— Nous sommes ici, dit-elle en traçant un trait légèrement courbe. Juste à droite, c’est la passe par laquelle nous sommes entrées dans le lagon et, de l’autre côté, c’est le point d’arrivée de notre course. Tu as dû voir au passage à quoi ça ressemble : il n’y a même pas un buisson !
Son doigt continue à tracer des formes sans grande précision, faisant progresser la représentation vers le nord.</p>
<p>— Après, il y a un îlot tout petit, qui donne l’impression qu’il va disparaître à chaque fois que revient la saison des pluies. Et ensuite, il y a l’île où habite le Vieux Fainéant. C’est là qu’on trouve les plus gros arbres de l’atoll, mais je ne te conseille pas d’aller les voir de près : le Vieux n’est pas sincèrement accueillant. Il est assez malin pour nous laisser tranquille, mais les étrangers, c’est une autre histoire.</p>
</div>

<p>Vous allez lui demander des précisions, mais elle est déjà en train de passer à la suite :</p>
<div class="conversation">
<p>— Et là, c’est la demeure de la sorcière !</p>
<p>— Une sorcière ?</p>
</div>

<p>Vous vous demandez si Raiahui n’est pas en train de se moquer de vous, mais elle semble tout à fait sincère et très désireuse de vous fournir davantage de détails.</p>

<div class="conversation">
<p>— Lorsque j’étais encore petite, raconte-t-elle avec une excitation nostalgique, il n’y avait rien qui émergeait de l’eau à cet endroit de l’atoll. Et puis, un beau matin, il y a une île qui est apparue là ! Certains pensent qu’elle est venue en flottant, d’autres qu’elle est en fait sur le dos d’un crabe géant au service de la sorcière. L’eau est très sombre tout autour, alors on ne peut pas bien voir… Enfin bon, il y a plusieurs adultes qui sont partis explorer l’île et ils ne sont jamais revenus. Depuis, bien sûr, personne n’y va.</p>
<p>— Mais comment est-ce que vous savez qu’il y a une sorcière, dans ce cas ?</p>
<p>— On l’aperçoit de loin, de temps en temps. Elle est très grosse, avec des cheveux hérissés comme des épines d’oursins, et elle porte beaucoup de bijoux dorés bizarres. Elle a souvent l’air occupée, mais personne ne sait vraiment ce qu’elle fait.</p>
</div>

<p>Les trois îles qui complètent l’atoll du côté ouest sont visiblement loin d’inspirer autant d’intérêt à Raiahui, qui les expédie en quelques mots :</p>
<div class="conversation">
<p>— Celle-ci est très petite et il n’y a presque rien. Les deux dernières sont de taille moyenne et elles ont beaucoup de palmiers, comme cette île-ci.</p>
</div>
`
    ,
    "next": arrivalNext,
  },
  "feast": {
    "text":
`
<p>Le ciel commence à s’assombrir lorsque Raiahui vous amène à l’endroit préparé pour le festin. Une nourriture abondante, empalée sur une multitude de broches, est en train de rôtir autour d’un grand feu, emplissant l’air d’une odeur qui vous met instantanément l’eau à la bouche. Le bruit vif et régulier de tambours à l’unisson vient donner un rythme à la soirée qui débute.</p>

<p>Toute la tribu semble rassemblée pour l’occasion : un peu moins d’une centaine de personnes, dont une moitié d’enfants et d’adolescents. Soucieuse de donner une bonne impression, vous avez revêtu le paréo aux couleurs vives que vous conserviez à bord de votre pirogue, mais il semble que ce n’était guère nécessaire : même parmi les femmes, personne n’est vêtu d’autre chose qu’un simple pagne et c’est à peine si vous remarquez çà et là quelques bijoux simples. Vous êtes accueillie par de nombreux regards curieux.</p>

<p>Le festin débute sans cérémonie. En tant qu’invitée d’honneur, vous êtes invitée à vous servir la première, ce que votre estomac vous fait accepter avec plaisir. Une assiette en feuilles de palmier tressées vous est offerte et vous faites votre choix parmi les victuailles abondantes, qui incluent de la viande d’oiseau et de tortue, des oeufs, des crustacés, des coquillages et quelques fruits. Une noix de coco verte, au sommet percé, vous est offerte pour que vous puissiez vous désaltérer.</p>

<p>Une fois que vous êtes allée vous asseoir, les membres de la tribu vont à leur tour se servir, avec un enthousiasme désordonné qui laisse supposer que ces festins ne sont pas choses courantes. A l’exception des très jeunes enfants, vous remarquez qu’ils portent tous des couteaux en ivoire courbes et légèrement dentelés, qu’ils utilisent dextrement. A en juger par l’aisance avec laquelle ils découpent la nourriture, le tranchant en est autrement plus aiguisé que celui de votre vieux couteau en os.</p>

<p>Vous saisissez vite pourquoi il y a une telle abondance de nourriture en observant la voracité avec  laquelle mangent les gens qui vous entourent. Vous entendez fréquemment craquer sous leurs dents des morceaux de carapace ou de petits os d’oiseau qu’ils n’ont pas pris la peine de recracher.</p>

<p>Raiahui vous a déserté pour aller retrouver d’autres adolescents, que vous voyez la féliciter - certains avec une envie perceptible - de son passage prochain à l’âge adulte. De toute évidence, ils présument sa victoire lors de votre course de demain !</p>
`
    ,
    "next": (goToSection, flags, updateFlag) => {
      const description = `Ce festin est une occasion rêvée pour lier connaissance avec les habitants de l’île. Sur qui votre attention se porte-t-elle ?`;

      return (
        <Crossroads text={description} choices={feastActions(goToSection, flags, updateFlag)} />
      );
    }
  },
  "feast-chief": {
    "text":
`
<p>Ataroa est un homme des plus inexpressifs, mais il n’a rien de hautain et ne considère visiblement pas qu’il possède une supériorité innée sur ceux qui l’entourent. C’est un contraste plaisant avec les nombreux chefs de tribu qui prétendent descendre des dieux et imposent le respect de rituels pesants afin de le rappeler à chaque instant. Depuis le début de votre voyage, vous avez à deux reprises dû mettre un terme précipité à votre séjour sur une île parce que vous aviez sans le vouloir enfreint tel ou tel tabou aussi dénué de sens qu’absolu.</p>

<p>Après quelques questions anodines, vous vous aventurez à l’interroger sur le rite de passage qu’impose sa tribu pour accéder au statut d’adulte :</p>

<div class="conversation">
<p>—  Pourquoi est-ce que la venue d’un étranger est nécessaire ? Est-ce qu’il ne serait pas plus simple d’organiser chaque année une course entre les adolescents qui sont assez âgés ?</p>
<p>— Tous les jeunes de la tribu ont l’habitude d’être en compétition les uns avec les autres depuis leur enfance, vous répond Ataroa tout en décortiquant adroitement un crabe de la pointe de son couteau. Cela ne peut plus rien leur apprendre. En les confrontant à quelqu’un qu’ils ne connaissent pas, le rite les place dans une situation incertaine, où ils doivent anticiper et s’adapter. L’épreuve est loin d’être purement physique. Si tu veux la victoire, tu ne l’obtiendras que par l’intelligence.</p>
<p>— Raiahui a l’air certaine qu’elle va gagner.</p>
</div>

<p>Ataroa a un bref hochement de tête.</p>

<div class="conversation">
<p>— Si elle perd, ce sera à cause de cette présomption. Ne commets pas la même erreur lorsqu’il faudra commencer la course.</p>
</div>
`
    ,
    next: feastNext
  },
  "feast-men": {
    "text":
`
<p>La plupart des hommes sont occupés à satisfaire leur appétit, mais certains d’entre eux se révèlent curieux d’en savoir davantage sur vous. Leurs questions portent surtout sur vos capacités de nageuse et cherchent clairement à déterminer si vous vous montrerez à la hauteur lors de la compétition du lendemain. Vous restez modeste dans votre description de vous-même : ce que vous dites parviendra peut-être aux oreilles de Raiahui et il vous semble préférable qu’elle vous sous-estime.</p>

<div class="conversation">
<p>— Est-ce que ta tribu organise également des compétitions traditionnelles ? vous demande un homme du nom de Harumu.</p>
<p>— Oui. Chaque année, beaucoup d’oiseaux viennent pondre sur une toute petite île proche de la nôtre et il y a une course dont le but est d’être le premier à en rapporter des oeufs.</p>
<p>— Est-ce qu’il t’est arrivé de gagner ?</p>
<p>— Oh, il n’y a que les hommes qui participent.</p>
</div>

<p>Une expression étonnée se peint sur les traits de Harumu.</p>

<div class="conversation">
<p>— C’est une coutume étrange, commente-t-il. Est-ce qu’elle a une raison particulière ?</p>
</div>

<p>Ne vous sentant pas en mesure d’apporter à cette question la réponse complexe qu’il lui faudrait, vous vous contentez d’une justification purement technique :</p>
<div class="conversation">
<p>— Les hommes nagent plus vite, donc ce ne serait pas une course équitable.</p>
<p>— Oh… Oui, évidemment…</p>
</div>

<p>À en juger par la perplexité que laisse paraître son visage, cette raison n’a en réalité rien d’évidente pour lui.</p>
`
    ,
    "next": feastNext,
  },
  "feast-women": {
    "text":
`
<p>Lorsque vous engagez la conversation avec quelques-unes des femmes présentes, vous vous attendez à ce que cela vous fournisse un aperçu de la vie domestique de la tribu. Mais, comme vous ne tardez pas à vous en rendre compte, elles ont davantage envie de vous parler de sujets tels que les plus gros poissons qu’il leur est arrivé d’attraper. Certaines des descriptions qu’elles vous font vous laissent pour le moins dubitative !</p>

<div class="conversation">
<p>— Est-ce qu’il vous arrive de pêcher simplement dans le lagon ? finissez-vous par demander, car elles mentionnent fréquemment qu’elles réalisent leurs prises au large.</p>
</div>

<p>La question fait rire une femme du nom d’Ariinea, qui était il y a à peine un instant en train de vous parler d’un espadon d’une taille improbable.</p>

<div class="conversation">
<p>— Assez souvent, par paresse, vous répond-elle, mais ce n’est pas très excitant. La plupart des poissons du lagon ne sont pas très gros. On se lasse vite de ne manger que ça, à moins d’être le Vieux Fainéant.</p>
<p>— Le Vieux Fainéant ?</p>
<p>— Il habite sur une île de l’autre côté de l’atoll, vous dit Ariinea, et il passe tout son temps à faire le moins d’effort possible.</p>
<p>— Il peut tout de même être dangereux, intervient une autre femme, surtout lorsqu’on ne le connaît pas. Je te conseille de ne pas approcher de cette partie de l’atoll, Mananuiva.</p>
</div>

<p>Ariinea fait la moue, mais ne conteste pas la validité de cette recommandation.</p>
`
    ,
    "next": feastNext,
  },
  "feast-boys": {
    "text":
`
<p>La tribu compte un certain nombre de garçons ayant plus ou moins votre âge. Vous vous mêlez à eux, discutant un peu avec chacun. Après quelques instants, vous êtes forcée de parvenir à la conclusion plutôt vexante qu’aucun d’eux n’éprouve le désir de flirter avec vous. Lors de vos escales précédentes sur des îles habitées, votre statut d’étrangère vous conférait un charme exotique qui piquait l’intérêt des adolescents. Cela ne vous rapprochait pas de ce que vous cherchez, mais cela ne nuisait pas à votre amour-propre.</p>

<p>Un jeune garçon du nom de Varenui se montre en revanche intéressé par le récit de votre voyage. Tout lui raconter serait bien long, mais vous prenez le temps de lui décrire quelques-uns des lieux les plus mémorables qu’il vous est arrivé de visiter. Il prête une attention fascinée au moindre détail et pose de nombreuses questions.</p>

<div class="conversation">
<p>— Tu n’as jamais visité une autre île habitée ? finissez-vous par lui demander.
<p>— Non. Même les adultes ne le font presque jamais… enfin, à part Faanarua, mais c’est à peine si elle fait encore partie de la tribu.
<p>— Qui est-ce ?
<p>— C’est… quelqu’un de bizarre. Elle s’est construit une pirogue avec une voile pour voyager et visiter autant d’autres îles que possible. Elle ne passe généralement ici que quelques jours par an. Elle est justement revenue avant-hier et je voulais lui demander de me raconter ses voyages, mais elle m’a envoyé promener.
<p>— Elle assiste au festin ? demandez-vous en regardant autour de vous.</p>
<p>— Non, elle n’est même pas au village. Elle s’est installée sur l’île de l’atoll qui se trouve le plus à l’ouest et elle ne voit presque personne.</p>
</div>
`
    ,
    "next": feastNext,
  },
  "feast-girls": {
    "text":
`
<p>Vous abordez quelques adolescentes qui ne sont pas pour le moment en train d’entourer Raiahui. La conversation est d’abord hésitante et gênée : elles ne savent visiblement pas comment s’y prendre pour discuter avec une étrangère à la tribu. Mais, après avoir tâtonné quelque peu, vous réussissez à les décrisper en leur faisant un récit à peine exagéré des coutumes et des traditions étranges que vous avez découvertes au cours de votre voyage. Elles n’ont visiblement qu’une idée fort confuse de la manière dont vivent les autres tribus ; les bizarreries que vous leur révélez ne vont pas leur en donner une image beaucoup plus exacte, mais elles ne tardent pas à les faire rire.</p>

<p>Après avoir décrit à votre audience amusée quelques-unes des fêtes traditionnelles les plus extravagantes que vous avez observées, vous faites une pause pour reprendre votre souffle. Une jeune fille appelée Runuhati va aussitôt vous chercher une moitié de langouste, présumant visiblement que manger vous donnera la force de poursuivre votre récit. Vous acceptez avec reconnaissance, mais, si votre appétit est resté aiguisé, il n’en va pas de même de votre couteau en os, qui n’est plus en état de découper grand-chose.</p>

<div class="conversation">
<p>— Est-ce que je peux t’emprunter ton couteau ? demandez-vous à Runuhati.</p>
</div>

<p>La jeune fille ouvre aussitôt de grands yeux, avec une expression presque affolée.</p>

<div class="conversation">
<p>— Je… Non… C’est…</p>
</div>

<p>Une fille un peu plus âgée vient à son aide :</p>

<div class="conversation">
<p>— C’est quelque chose d’entièrement personnel, que nous ne prêtons jamais, même entre nous. Donne-moi ta langouste, je vais te la décortiquer.</p>
</div>

<p>Après vous être restaurée et avoir ajouté quelques récits encore plus fantaisistes aux précédents, vous prenez congé des jeunes filles.</p>
`
    ,
    "next": feastNext,
  },
  "night": {
    "text":
`
<p>La nuit est tombée depuis un bon moment lorsque le festin s’achève. Le feu en train d’agoniser vous laisse distinguer au-dessus de votre tête le foisonnement immense des étoiles. Alors que les membres de la tribu se dispersent peu à peu, Raiahui vous emmène jusqu’à un hamac accroché entre deux palmiers, non loin de la plage. Vous vous y allongez avec plaisir. La fatigue de votre journée de voyage est en train de s’appesantir sur vous et vous ne tardez pas à vous endormir, bercée par le murmure de l’eau et un souffle d’air tiède.</p>

<p>Le soleil matinal filtrant entre les palmes vous réveille. Tout est calme. Vous vous prélassez mollement quelques instants avant de vous décider à vous lever. Il n’y a pas d’autre bruit que le chant de quelques oiseaux, ce qui vous laisse supposer que la plupart de la tribu est encore en train de dormir.</p>

<p>Raiahui est allongée dans un hamac peu distant du vôtre. Elle ouvre un oeil tandis que vous entreprenez de vous étirer.</p>

<div class="conversation">
<p>— Déjà levée ? fait-elle d’une voix pâteuse. Tu devrais te reposer pour la course de ce soir.</p>
<p>— Je ne vais pas rester ici toute la journée à ne rien faire qu’attendre.</p>
<p>— Comme tu veux, répond-elle en bâillant, mais ne t’approche pas des deux îles au nord de l’atoll…</p>
</div>

<p>En l’espace d’à peine quelques respirations, elle s’est déjà rendormie.</p>
`
    ,
    "next": function(goToSection) {
      //TODO
    }
  }
};


export default intro;
