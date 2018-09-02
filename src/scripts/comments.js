const comments = (flags) => {
  let comments = [];

  if (flags.wellRested) {
    comments.push({
      "text": `You’re in great form, ready for anything.`,
      "color": "success",
    });
  }

  if (flags.drunk) {
    comments.push({
      "text": `You feel dizzy.`,
      "color": "warning",
    });
  }

  return comments;
};

export default comments;
