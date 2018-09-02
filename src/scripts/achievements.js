const achievements = [
  {
    "key": "fact-checking",
    "name": `Cross-reference information`,
    "description": `You obtained consistent information about some of the atoll’s inhabitants from different sources.`,
    "condition": (flags) => {return (flags.toldAboutFaanaruaByRaiahui && flags.toldAboutFaanaruaByVarenui) || (flags.toldAboutAtollByRaiahui && flags.toldAboutWitchByMonkey) || (flags.toldAboutAtollByRaiahui && flags.toldAboutLazyOneByAriinea);},
  },
  {
    "key": "my-precious",
    "name": `A little bit of magic`,
    "description": `You acquired a magical object (or at least an object you think is magical).`,
    "condition": (flags) => {return flags.inventory.dolphin.acquired || flags.inventory.pearls.acquired || flags.inventory.doll.acquired || flags.inventory.net.acquired;},
  },
  {
    "key": "the-truth",
    "name": `That’s cleared up`,
    "description": `You discovered the truth about the atoll’s inhabitants.`,
    "condition": (flags) => {return flags.seenRaiahuiTrueForm;},
  },
  {
    "key": "tried-to-escape",
    "name": `Conditional freedom`,
    "description": `You thought you were free to leave the atoll if you simply wanted to. You were mistaken.`,
    "condition": (flags) => {return flags.triedToFlee;},
  },
  {
    "key": "death-under-water",
    "name": `A dive into the unknown`,
    "description": `You readily dived into the water. You never came out of it.`,
    "condition": (flags) => {return flags.eatenByFaanarua || flags.eatenByRaiahui;},
  },
  {
    "key": "the-witch-cup",
    "name": `It goes straight to your head`,
    "description": `You drank the beverage offered by the witch. Your trust in the sacred laws of hospitality honors you.`,
    "condition": (flags) => {return flags.drunkAtTheWitchCup;},
  },
  {
    "key": "a-cursed-item",
    "name": `Hazardous magic`,
    "description": `You tried to acquire a magical object. The object wouldn’t let you.`,
    "condition": (flags) => {return flags.touchedACursedItem;},
  },
  {
    "key": "the-witch-net",
    "name": `A nice catch`,
    "description": `Once again, the witch caught someone in her net. That someone was you.`,
    "condition": (flags) => {return flags.caughtInAWitchNet;},
  },
  {
    "key": "the-crocodile-meal",
    "name": `Straight out of a folk tale`,
    "description": `The beast had big teeth in its big mouth. The better to eat you with.`,
    "condition": (flags) => {return flags.eatenByCrocodile;},
  },
  {
    "key": "raiahui-good-end",
    "name": `A well-deserved celebration`,
    "description": `The story ended well, as far as Raiahui’s concerned.`,
    "condition": (flags) => {return flags.eatenByRaiahui;},
  },
  {
    "key": "sore-raiahui",
    "name": `It’s only an island if you look at it from the water`,
    "description": `You survived Raiahui’s countless teeth. Not her one and only knife.`,
    "condition": (flags) => {return flags.stabbedToDeath;},
  },
  {
    "key": "victory",
    "name": `Dream of the future`,
    "description": `You survived and won the race.`,
    "condition": (flags) => {return flags.survivedTheTrial;},
  },
  {
    "key": "just-let-me-sleep",
    "name": `I don’t feel like doing anything`,
    "description": `You got up, went to your canoe and looked at the lagoon. And then you decided you’d rather take a nap.`,
    "condition": (flags) => {return 0 === flags.time && (flags.eatenByRaiahui || flags.stabbedToDeath || flags.survivedTheTrial);},
  },
  {
    "key": "catch-them-all",
    "name": `Collector`,
    "description": `In less than a day, you acquired three objects that could be described as magical.`,
    "condition": (flags) => {return flags.inventory.dolphin.acquired && flags.inventory.doll.acquired && flags.inventory.pearls.acquired;},
  },
  {
    "key": "prisoner-of-my-web",
    "name": `Accomplished fisherwoman`,
    "description": `You caught a fairly large fish in your net.`,
    "condition": (flags) => {return flags.caughtARaiahui;},
  },
  {
    "key": "drunk-victory",
    "name": `Drinking is no problem`,
    "description": `Your tasting of a local specialty had unpleasant consequences, but that didn’t dissuade you or stop you.`,
    "condition": (flags) => {return flags.drunk && flags.survivedTheTrial;},
  },
  {
    "key": "speedrun",
    "name": `Victory through inaction`,
    "description": `You lazed almost the entire day away. When the evening came, you won anyway.`,
    "condition": (flags) => {return 0 === flags.time && flags.survivedTheTrial;},
  },
  {
    "key": "funny-coincidence",
    "name": `Fiction becomes reality`,
    "description": `You thought you’d lied to the crocodile. But what you told him actually happened.`,
    "condition": (flags) => {return flags.inventory.doll.acquired && flags.aVillagerOnCrocodileIsland;},
  },
];

export default achievements;
