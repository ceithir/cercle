export const getHint = (flags) => {
  if (flags.triedToFlee) {
    return `
<p>Vous pouvez réussir cette aventure en explorant les diverses îles de l’atoll, en y faisant des rencontres et des découvertes utiles. Vous pouvez aussi la réussir en vous contentant de faire la sieste pendant l’essentiel de la journée.</p>

<p>Vous ne pouvez pas — comme vous venez de le découvrir — la réussir en quittant l’atoll avant votre course contre Raiahui.</p>
    `;
  }

  if (flags.eatenByFaanarua) {
    return `
<p>La femme qui vous a envoyé pêcher dans le lagon s’est installée sur cette île parce qu’elle ne supporte plus le contact et la conversation des membres de sa propre tribu. Pour vous concilier ses bonnes grâces, il serait judicieux de vous démarquer d’eux autant que possible.</p>
    `;
  }

  if (flags.caughtInAWitchNet || flags.drunkAtTheWitchCup || flags.touchedACursedItem) {
    return `
<p>Les objets magiques que possède la sorcière sont d’une efficacité redoutable, mais ils ne s’affranchissent pas totalement des limites que leur impose leur forme même.</p>
    `;
  }

  return "";
};
