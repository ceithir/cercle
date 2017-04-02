const achievements = [
  {
    "key": "fact-checking",
    "name": `Croiser ses sources`,
    "description": `Vous avez obtenu des informations concordantes sur certains occupants du lagon d'au moins deux personnes différentes.`,
    "condition": (flags) => {return (flags.toldAboutFaanaruaByRaiahui && flags.toldAboutFaanaruaByVarenui) || (flags.toldAboutAtollByRaiahui && flags.toldAboutWitchByMonkey) || (flags.toldAboutAtollByRaiahui && flags.toldAboutLazyOneByAriinea);},
  },
  {
    "key": "tried-to-escape",
    "name": `Liberté surveillée`,
    "description": `Vous pensiez être libre de quitter le lagon dès que vous en auriez envie. Vous vous trompiez.`,
    "condition": (flags) => {return flags.triedToFlee;},
  },
  {
    "key": "death-under-water",
    "name": `Un plongeon dans l’inconnu`,
    "description": `Vous avez plongé dans l’eau en toute innocence. Vous n’en êtes jamais ressortie.`,
    "condition": (flags) => {return flags.eatenByFaanarua || flags.eatenByRaiahui;},
  },
  {
    "key": "the-witch-cup",
    "name": `Une boisson trop forte pour vous`,
    "description": `Vous avez bu ce que la sorcière vous offrait. Votre confiance en les lois sacrées de l’hospitalité vous honore.`,
    "condition": (flags) => {return flags.drunkAtTheWitchCup;},
  },
  {
    "key": "a-cursed-item",
    "name": `Au contact de la sorcellerie`,
    "description": `Vous avez essayé de vous emparer d’un objet magique. L’objet ne s’est pas laissé faire.`,
    "condition": (flags) => {return flags.touchedACursedItem;},
  },
  {
    "key": "the-witch-net",
    "name": `Une belle prise`,
    "description": `La sorcière a encore attrapé quelqu’un dans son filet. Ce quelqu’un était vous.`,
    "condition": (flags) => {return flags.caughtInAWitchNet;},
  },
  {
    "key": "the-crocodile-meal",
    "name": `Un conte de votre enfance`,
    "description": `Il parlait bien. Il avait de grandes dents. Il vous a croqué.`,
    "condition": (flags) => {return flags.eatenByCrocodile;},
  },
  {
    "key": "raiahui-good-end",
    "name": `Une digne célébration`,
    "description": `L’histoire s’est bien terminée. Pour Raiahui du moins.`,
    "condition": (flags) => {return flags.eatenByRaiahui;},
  },
  {
    "key": "sore-raiahui",
    "name": `La femme est un requin pour la femme`,
    "description": `Vous avez réchappé aux centaines de dents de Raiahui. Pas à son unique poignard.`,
    "condition": (flags) => {return flags.stabbedToDeath;},
  },
  {
    "key": "victory",
    "name": `Un rêve d’écume`,
    "description": `Vous êtes sortie victorieuse (et vivante) de l’épreuve.`,
    "condition": (flags) => {return flags.survivedTheTrial;},
  },
  {
    "key": "just-let-me-sleep",
    "name": `Pas motivée aujourd’hui`,
    "description": `Vous vous êtes levée, vous avez marché jusqu’à votre pirogue, vous avez contemplé l’océan. Et vous êtes retournée vous coucher.`,
    "condition": (flags) => {return 0 === flags.time && (flags.eatenByRaiahui || flags.stabbedToDeath || flags.survivedTheTrial);},
  },
  {
    "key": "catch-them-all",
    "name": `Collectionneuse`,
    "description": `En à peine une journée dans ce lagon, vous avez mis la main sur pas moins de trois objets distincts qui pourraient être qualifiés de magique.`,
    "condition": (flags) => {return flags.inventory.dolphin.acquired && flags.inventory.doll.acquired && flags.inventory.pearls.acquired;},
  },
  {
    "key": "prisoner-of-my-web",
    "name": `Pêcheuse émérite`,
    "description": `Vous avez attrapé un bien gros poisson dans votre filet.`,
    "condition": (flags) => {return flags.caughtARaiahui;},
  },
  {
    "key": "drunk-victory",
    "name": `L'attrait de la boisson`,
    "description": `Ce n'est pas encore tout à fait remise de votre dernière dégustation d'une spécialité locale que vous avez accepté d'en consommer une autre.`,
    "condition": (flags) => {return flags.drunk && flags.survivedTheTrial;},
  },
  {
    "key": "speedrun",
    "name": `La victoire par l’inaction`,
    "description": `Votre journée de farniente vous aura ouvert les portes d’une soirée de triomphe.`,
    "condition": (flags) => {return 0 === flags.time && flags.survivedTheTrial;},
  },
  {
    "key": "funny-coincidence",
    "name": `La réalité rejoint la fiction`,
    "description": `Vous pensiez avoir menti au crocodile. Et pourtant, ce que vous lui aviez annoncé s'est réalisé.`,
    "condition": (flags) => {return flags.inventory.doll.acquired && flags.aVillagerOnCrocodileIsland;},
  },
];

export default achievements;
