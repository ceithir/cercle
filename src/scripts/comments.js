const comments = (flags) => {
  let comments = [];

  if (flags.wellRested) {
    comments.push({
      "text": `Vous vous sentez en pleine forme, prête à en découdre.`,
      "color": "success",
    });
  }

  if (flags.drunk) {
    comments.push({
      "text": `Vous avez la tête qui tourne.`,
      "color": "warning",
    });
  }

  return comments;
};

export default comments;
