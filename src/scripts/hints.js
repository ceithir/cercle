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

  if (flags.eatenByCrocodile) {
    return `
<p>Bien qu’il soit vieux et patient, le crocodile est avant tout gouverné par ses impulsions. Ses trois motivations principales – par ordre décroissant d’importance – sont la faim, la perfidie et la rancœur.</p>
    `;
  }

  if (flags.eatenByRaiahui) {
    if (!flags.seenRaiahuiTrueForm) {
      if (flags.gotAHeadStart) {
        return `
<p>Dans une course ordinaire, rester à la surface et ne prêter attention à rien d’autre qu’à votre destination aurait été un comportement sensé.</p>

<p>Pas dans cette course-ci.</p>
        `;
      }

      return `
<p>Raiahui n’est pas aussi fair-play qu’elle veut bien le laisser paraître. Veillez à ne pas l’être non plus.</p>
      `;
    }

    return `
<p>Un requin possède des sens bien particuliers, capable de détecter certaines choses dont un être humain n’aurait aucune conscience. Un être humain possède une intelligence développée, capable d’anticiper et de planifier à un degré qu’un requin serait incapable d’atteindre. Vous devez échapper aux deux à la fois.</p>
    `;
  }

  if (flags.stabbedToDeath) {
    return `
<p>Si proche ! Cette ultime confrontation est plus facile si vous y parvenez sans être trop épuisée.</p>
    `;
  }

  return "";
};
