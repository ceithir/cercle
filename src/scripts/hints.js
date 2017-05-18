export const getHint = (flags) => {
  if (flags.triedToFlee) {
    return `
<p>Vous pouvez réussir cette aventure en explorant les diverses îles de l’atoll, en y faisant des rencontres et des découvertes utiles. Vous pouvez aussi la réussir en vous contentant de faire la sieste pendant l’essentiel de la journée.</p>

<p>Vous ne pouvez pas — comme vous venez de le découvrir — la réussir en quittant l’atoll avant votre course contre Raiahui.</p>
    `;
  }

  return "";
};
