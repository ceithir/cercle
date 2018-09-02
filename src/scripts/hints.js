export const getHint = (flags) => {
  if (flags.triedToFlee) {
    return `
<p>In this adventure, you can win by exploring the islands of the atoll, meeting unusual people and making useful discoveries. You can also win after lazying in a hammock for most of the day.</p>

<p>You cannot – as you’ve just discovered – win by leaving the atoll before your race against Raiahui.</p>
    `;
  }

  if (flags.eatenByFaanarua) {
    return `
<p>The woman who asked you to bring her seafood is staying on this island because she really dislikes interacting with the members of her own tribe. If you want to ingratiate yourself with her, try to seem as different from them as possible.</p>
    `;
  }

  if (flags.caughtInAWitchNet || flags.drunkAtTheWitchCup || flags.touchedACursedItem) {
    return `
<p>The magical objects owned by the witch are dangerous, but their efficiency is somewhat constrained by their very shapes.</p>
    `;
  }

  if (flags.eatenByCrocodile) {
    return `
<p>As old and patient as it may be, the crocodile is mainly ruled by urges. Its three main motivations – in descending order of importance – are hunger, treachery and resentment.</p>
    `;
  }

  if (flags.eatenByRaiahui) {
    if (!flags.seenRaiahuiTrueForm) {
      if (flags.gotAHeadStart) {
        return `
<p>In an ordinary race, remaining on the surface and paying attention to nothing but the arrival point would have been sensible.</p>

<p>Not in this race.</p>
        `;
      }

      return `
<p>Raiahui isn’t as sporting as she pretends to be. Don’t play fair either.</p>
      `;
    }

    return `
<p>A shark is gifted with very specific senses, and able to detect certain things a human would remain completely unaware of. A human is gifted with high intelligence, and able to anticipate and to plan much better than a shark ever could. You need to escape both at the same time.</p>
    `;
  }

  if (flags.stabbedToDeath) {
    return `
<p>So close! This final showdown is easier if you reach it without being too exhausted.</p>
    `;
  }

  return "";
};
