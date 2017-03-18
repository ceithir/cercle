const computeAchievements = function(flags) {
  let achievements = [];

  if (flags.triedToFlee) {
    achievements.push({
      "key": "tried-to-escape",
      "name": `Liberté surveillée`,
      "description": `Vous pensiez être libre de quitter le lagon dès que vous en auriez envie. Vous vous trompiez.`,
    });
  }

  if (flags.eatenByFaanarua) {
    achievements.push({
      "key": "death-under-water",
      "name": `Un plongeon dans l'inconnu`,
      "description": `Vous avez plongé dans l'eau en toute innocence. Vous n'en êtes jamais ressortie.`,
    });
  }

  return achievements;
};

export default computeAchievements;
