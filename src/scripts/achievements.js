const achievements = [
  {
    "key": "tried-to-escape",
    "name": `Liberté surveillée`,
    "description": `Vous pensiez être libre de quitter le lagon dès que vous en auriez envie. Vous vous trompiez.`,
    "condition": (flags) => {return flags.triedToFlee;},
  },
  {
    "key": "death-under-water",
    "name": `Un plongeon dans l'inconnu`,
    "description": `Vous avez plongé dans l'eau en toute innocence. Vous n'en êtes jamais ressortie.`,
    "condition": (flags) => {return flags.eatenByFaanarua || flags.eatenByRaiahui;},
  },
  {
    "key": "the-witch-cup",
    "name": `Une boisson trop forte pour vous`,
    "description": `Vous avez bu ce que la sorcière vous offrait. Votre confiance en les lois sacrées de l'hospitalité vous honore.`,
    "condition": (flags) => {return flags.drunkAtTheWitchCup;},
  },
  {
    "key": "a-cursed-item",
    "name": `Au contact de la sorcellerie`,
    "description": `Vous avez essayé de vous emparer d'un objet magique. L'objet ne s'est pas laissé faire.`,
    "condition": (flags) => {return flags.touchedACursedItem;},
  },
  {
    "key": "the-witch-net",
    "name": `Une belle prise`,
    "description": `La sorcière a encore attrapé quelqu'un dans son filet. Ce quelqu'un était vous.`,
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
    "description": `L'histoire s'est bien terminée. Pour Raiahui du moins.`,
    "condition": (flags) => {return flags.eatenByRaiahui;},
  },
];

export default achievements;
