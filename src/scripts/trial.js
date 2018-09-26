import React from "react";
import Crossroads from "./../components/Crossroads.js";
import Funnel from "./../components/Funnel.js";
import {endGame, trueEnd, useItem, acquireItem, repeatingFunnel, coatSentence, itemUpdateFeedback} from "./helpers.js";
import squaleImage from "./../images/squale.jpg";
import raiahuiFriendsImage from "./../images/raiahui-friends.jpg";
import sunsetImage from "./../images/sunset.jpg";
import credits from "./credits.js";

const cleanInventoryBeforeRace = (flags, updateFlag) => {
  useItem("alcohol", updateFlag);
  useItem("pearls", updateFlag);
  useItem("fruit", updateFlag);
  useItem("fieryCalabash", updateFlag);
}

const preludeChoices = (goToSection, flags, updateFlag) => {
  let choices = [];

  const fruit = flags.inventory.fruit;
  if (fruit.acquired && !fruit.used && !flags.tastedFruit) {
    choices.push({
      "text": `You taste one of the red fruits you picked on the crocodile's island.`,
      "action": () => {
        updateFlag("tastedFruit", true);
        goToSection("trial-eat-fruit");
      },
      "conditional": true,
    });
  }

  if (flags.tastedFruit && flags.examinedTrialCalabashes && !flags.inventory.fieryCalabash.acquired) {
    choices.push({
      "text": `You mix the juice of the red fruits with the contents of a calabash.`,
      "action": () => {
        useItem("fruit", updateFlag);
        acquireItem("fieryCalabash", updateFlag);
        goToSection("trial-brew-fire");
      },
      "conditional": true,
    });
  }

  choices.push({
    "text": `You dive into the water and start the race immediately.`,
    "action": () => {
      cleanInventoryBeforeRace(flags, updateFlag);
      updateFlag("eatenByRaiahui", true);
      goToSection("trial-surprise");
    },
  });

  if (!flags.talkedToPerfectlyUselessDrunkGirl) {
    choices.push({
      "text": `You ask someone for explanations.`,
      "action": () => {
        updateFlag("talkedToPerfectlyUselessDrunkGirl", true);
        goToSection("trial-explanations");
      } ,
    });
  }

  if (!flags.examinedTrialCalabashes) {
    choices.push({
      "text": `You examine one of the many calabashes lying here and there.`,
      "action": () => {
        updateFlag("examinedTrialCalabashes", true);
        goToSection("trial-calabashes");
      },
    });
  }

  choices.push({
    "text": `You go see Raiahui.`,
    "action": () => {
      goToSection("trial-raiahui");
    },
  });

  return choices;
}

const preludeNext = (goToSection, flags, updateFlag) => {
  return (
    <Crossroads choices={preludeChoices(goToSection, flags, updateFlag)} />
  );
}

const trueStartFunnel = (text, goToSection, flags, updateFlag) => {
  const action = () => {
    cleanInventoryBeforeRace(flags, updateFlag);
    updateFlag("gotAHeadStart", true);
    return "the-trial-begins";
  };

  return repeatingFunnel(
    goToSection,
    text,
    action
  );
}

const savePointAction = (text, goToSection, flags, updateFlag) => {
  updateFlag("seenRaiahuiTrueForm", true);
  updateFlag("flagsBeforeActualTrial", Object.assign({}, flags, {"seenRaiahuiTrueForm": true}));
  return goToSection("trial-underwater", coatSentence(text));
}

const raiahuiGoodEndText = `
<p>The sun is about to reach the horizon. The race ended a few moments ago and a succinct ceremony is now happening on the sandy island, unobserved by any outsider.</p>

<div class="conversation">
<p>"I congratulate you, Raiahui," Ataroa says. "You've won the trial and proven that you were worthy of becoming an adult."</p>
</div>

<p>Sounds of approval can be heard among the men and women gathered here. Raiahui nods, with a mix of respect, pride and happiness.</p>

<div class="conversation">
<p>"Have you learned from the trial?" the chieftain asks.</p>
<p>"It has taught me much."</p>
<p>"I hope that you won't forget Mananuiva in the future. Though she took part in the rite for different reasons, it's because of her that you're now an adult."</p>
<p>"I won't forget her."</p>
</div>

<p>Nothing else needs to be said. One by one, the adults who've witnessed the ceremony leave the island and return to the village. Soon, only Raiahui is left, feeling strangely exhausted and contemplative now that the trial is over. Almost dreamily, she touches her lips with the tips of her fingers. Then she sits on the still-warm sand. On the other side of the lagoon, the sun is setting. Raiahui watches it until the last bloody hues have disappeared from the surface of the water.</p>
`;

const trial = {
  "trial": {
    "text": `
<p>Following the young boy, you reach the beach at the end of the island, where the entire tribe is now gathering. You see that the adolescents are standing slightly apart from the rest of the crowd; a smile appears on Raiahui's face when she spots you.</p>

<p>The day is on the wane, but there's enough light left for the water to remain very clear. You can distinctly see how the bottom of the channel - the very channel you went through yesterday to enter the lagoon - is partly covered with coral. On the other side is the sandy island that'll serve as the arrival point for your race.</p>

<p>Murmurs die down among the crowd as Ataroa gestures for Raiahui and yourself to stand before him.</p>

<div class="conversation">
<p>"You both know all the details you need," he says, his rough face expressionless. "No member of the tribe will interfere. The race begins right now."</p>
</div>

<p>He concludes that laconic statement with a nod, then turns and leaves the beach to return to the village. Dumbfounded, you see most of the tribe follow him.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Soon, there's no one left but yourself, Raiahui and the other adolescents.`;
      const action = () => {
        updateFlag("reachedTheTrial", true);
        goToSection("trial-preparation");
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-preparation": {
    "text": (flags) => {
      let equipment = ``;

      const amulet = flags.inventory.dolphin;
      if (amulet.acquired && !amulet.used) {
        equipment += `<p class="text-conditional">You wear the dolphin-shaped pendant around your neck. It's impossible to miss, but Raiahui and the other adolescents don't seem to pay any attention to it.</p>`;
      }

      let items = ``;

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        items += `<p class="text-conditional">You've however tied the witch's net around your waist, as you expect that it could be very useful to you.</p>`;
      }

      const doll = flags.inventory.doll;
      if (doll.acquired && !doll.used) {
        items += `<p class="text-conditional">You've however tied the wooden figurine to your waist with a thong, trusting the intuition that tells you it could be very useful.</p>`;
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        if (doll.acquired && !doll.used) {
          items += `<p class="text-conditional">Next to it, you also carry a tiny purse, holding the witch's pearls.`;
        } else {
          if (net.acquired && !net.used) {
            items += `<p class="text-conditional">You're also bringing her pearls`;
          } else {
            items += `<p class="text-conditional">You're bringing the witch's pearls`;
          }
          items += `, stored in a tiny purse tied to your waist with a thong.`;
        }
        items += `</p>`;
      }

      return `
<p>Has the trial really started? The mood around you doesn't give that impression. The adolescents are having fun, laughing, and passing around calabashes full of palm wine. In the middle of that premature celebration, Raiahui's obviously enjoying the attention she receives and not even glancing in your direction.</p>

<img src="${raiahuiFriendsImage}" class="img-responsive text-img tall" alt=""/>

<p>You look at the arrival point. The distance separating you from it isn't exactly short, but this won't be an endurance test: if you had a decent head start, even an excellent swimmer would stand little chance of catching up to you.</p>

<p>Unsettled by the weirdness of the situation, you cling to more practical matters, making sure that you're in the best possible conditions to swim.</p>

${equipment}

<p>You get rid of your clothes, as they would unnecessarily slow you down.</p>

${items}

<p>You stretch a bit, more to remind Raiahui that you're taking this trial seriously than out of any real need.</p>
      `;
    },
    "next": preludeNext,
  },
  "trial-eat-fruit": {
    "text": `
<p>Hoping it will help you during the race, as the crocodile said it would, you taste the smallest of the red fruits… but your teeth have barely grazed its juicy flesh when a terrible burning feel sets your entire throat ablaze.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `You spit out the fruit immediately.`,
          "action": () => {
            updateFlag("boostedByFruit", true);
            goToSection("trial-spit-fruit");
          },
        },
        {
          "text": `You nevertheless swallow the fruit.`,
          "action": () => {
            if (flags.drunk) {
              updateFlag("drunk", false);
              return goToSection("trial-swallow-fruit-drunk");
            }

            updateFlag("drunk", true);
            goToSection("trial-swallow-fruit");
          } ,
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "trial-spit-fruit": {
    "text": `
<p>You hurriedly spit out the fruit on the sand of the beach. The burning feel persists and even seems to spread to the rest of your body, creating tiny drops of sweat on your skin.</p>

<p>You take deep breaths and, after a few moments, the phenomenon fortunately begins to dissipate, leaving only a vague impression of heat in your stomach.</p>

<p>Tasting another one of those fruits is obviously out of the question!</p>
    `,
    "next": preludeNext,
  },
  "trial-swallow-fruit-drunk": {
    "text": `
<p>Grimacing, you make yourself swallow the red fruit. For a moment, there's nothing more than the burning feel persisting in your throat. Then your innards start twisting, convulsive quivering shakes your limbs, and a cold sweat appears on your brow. Terrified, you think you've just poisoned yourself, deceived by the crocodile's final lie.</p>

<p>Just as suddenly as it had appeared, the queasiness vanishes. You keep quivering for a moment, but it's now merely the aftermath of fear. You don't feel any worse than you did before. On the contrary, you realize that the unpleasant aftereffects of alcohol, that were still tormenting you when you arrived to this beach, have completely dissipated!</p>

<p>You nevertheless deem it unwise to eat another one of those fruits.</p>
    `,
    "next": preludeNext,
  },
  "trial-swallow-fruit": {
    "text": `
<p>Grimacing, you make yourself swallow the red fruit. For a moment, there's nothing more than the burning feel persisting in your throat. Then your innards start twisting, convulsive quivering shakes your limbs, and a cold sweat appears on your brow. Terrified, you think you've just poisoned yourself, deceived by the crocodile's final lie.</p>

<p>After a few panicked moments, the queasiness fortunately subsides. But not completely: persisting dizziness makes you unsteady on your feet, and bouts of nausea periodically give you the impression that you're about to throw up.</p>

<p>There's nothing to do but curse the giant reptile for his irrational treachery. You're going to need willpower and resourcefulness to win the race in your current state.</p>

<p>Tasting another one of those blasted fruits is of course out of the question!</p>
    `,
    "next": preludeNext,
  },
  "trial-surprise": {
    "text": `
<p>You don't really understand the reasons for Raiahui's behavior, but the most sensible thing to do is probably to seize this occasion. Making sure that nobody's paying any attention to you, you walk to the shore and get into the warm water of the channel as silently as possible. A few vigorous breaststrokes under the surface propel you toward the sandy island. When you come back to the surface, a quick glance behind you reveals that Raiahui's still on the beach, surrounded by the other adolescents. She doesn't seem to have noticed your departure.</p>

<p>You've covered a fourth of the distance when excited cries reach your ears, coming from the beach. You opponent must have finally started the race. You do little more than increase your pace slightly. Even if Raiahui really is a better swimmer than you are, your head start virtually ensures your victory, as long as you don't exhaust yourself too quickly.</p>

<p>And yet, irrational anxiety is creeping in your mind. From time to time, you cast glances behind you, but you're unable to spot Raiahui, as if she were swimming underwater without ever surfacing. Unable to put a name on your fear, you force the pace earlier than you'd intended, before you've even reached the halfway point. But a chilling foreboding tells you that it changes nothing.</p>

<p>With each stroke, it now seems that the arrival point is getting a bit farther, and that something horrible is getting a bit closer.</p>

<hr/>` + raiahuiGoodEndText,
    "next": endGame,
  },
  "trial-explanations": {
    "text": `
<p>A girl is drinking palm wine not far from you. You grab her by the arm.</p>

<div class="conversation">
<p>"What's going on?" you ask. "If the race has really begun, why aren't we both getting into the water? Are we supposed to wait for something?</p>
</div>

<p>The girl giggles. Judging from the look on her face, her calabash must already be rather empty.</p>

<div class="conversation">
<p>"Don't worry, don't worry," she says, giving you a clumsy pat on the shoulder. "Raiahui's going to start the race, but you don't need to wait for her. Getting a head start can be useful!"</p>
</div>

<p>You don't get anything else out of her.</p>
    `,
    "next": preludeNext,
  },
  "trial-raiahui": {
    "text": `
<p>Raiahui is the beaming center of a circle of adolescents, whose merry chatting is punctuated with many laughs.</p>

<div class="conversation">
<p>"Mananuiva!" she exclaims when she sees you. "I thought you'd already started the race. Don't wait for me: I'm just going to drink a bit more and then I'll catch up to you!"</p>
</div>

<p>The other adolescents watch you with amused looks on their faces, but they don't say anything. An empty calabash is already lying at Raiahui's feet.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [
        {
          "text": `You follow her advice and start the race immediately.`,
          "action": () => {
            cleanInventoryBeforeRace(flags, updateFlag);
            updateFlag("eatenByRaiahui", true);
            goToSection("trial-surprise-alt");
          },
        },
        {
          "text": `You insist that she start the race at the same time as you do.`,
          "action": () => {
            cleanInventoryBeforeRace(flags, updateFlag);
            updateFlag("eatenByRaiahui", true);
            goToSection("trial-fair");
          },
        },
        {
          "text": `You stay with her for a while.`,
          "action": () => {
            goToSection("trial-raiahui-slow");
          },
        },
        {
          "text": `You try to steal the ivory knife hanging from her waist.`,
          "action": () => {
            goToSection("trial-knife");
          },
        },
      ];

      const alcohol = flags.inventory.alcohol;
      if (alcohol.acquired && !alcohol.used) {
        choices.push({
          "text": `You give her your calabash full of hard liquor.`,
          "action": () => {
            useItem("alcohol", updateFlag);
            goToSection("raiahui-drunk");
          },
          "conditional": true,
        });
      }

      const calabash = flags.inventory.fieryCalabash;
      if (calabash.acquired && !calabash.used) {
        choices.push({
          "text": `You give her the calabash of palm wine mixed with the juice of the red fruits.`,
          "action": () => {
            useItem("fieryCalabash", updateFlag);
            goToSection("raiahui-poisoned");
          },
          "conditional": true,
        });
      }

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "trial-surprise-alt": {
    "text": `
<p>You don't really understand the reasons for Raiahui's behavior, but seizing this occasion seems to be the most sensible thing to do. You walk to the shore and, without waiting any further, dive into the warm water of the channel. A few vigorous breaststrokes under the surface propel you toward the sandy island. When you come back to the surface, a quick glance behind you reveals that Raiahui's still on the beach, surrounded by the other adolescents. She doesn't even seem to be looking in your direction.</p>

<p>You've covered a fourth of the distance when excited cries reach your ears, coming from the beach. You opponent must have finally started the race. You do little more than increase your pace slightly. Even if Raiahui really is a better swimmer than you are, your head start virtually ensures your victory, as long as you don't exhaust yourself too quickly.</p>

<p>And yet, irrational anxiety is creeping in your mind. From time to time, you cast glances behind you, but you're unable to spot Raiahui, as if she were swimming underwater without ever surfacing. Unable to put a name on your fear, you force the pace earlier than you'd intended, before you've even reached the halfway point. But a chilling foreboding tells you that it changes nothing.</p>

<p>With each stroke, it now seems that the arrival point is getting a bit farther, and that something horrible is getting a bit closer.</p>

<hr/>
    ` + raiahuiGoodEndText,
    "next": endGame,
  },
  "trial-fair": {
    "text": `
<div class="conversation">
<p>"For someone who expects to become an adult today, you're really behaving like a kid! I'm not here for your amusement! If you don't start the race right now, at the same time as I do, then I'm no longer taking part in your rite of passage, and you can just wait for the next outsider!</p>
</div>

<p>Raiahui looks startled and offended at the same time. She glances at the adolescents around her as though she didn't quite know how to react, then shrugs.</p>

<div class="conversation">
<p>"As you wish, but it's your loss."</p>
</div>

<p>You both head for the shore, followed by all of the young spectators, who seem highly amused by the whole thing. Jokes are being exchanged around you, but you pay little attention to them. Your opponent is ostensibly behaving in a nonchalant manner, and you even see her drink a bit more palm wine from a calabash.</p>

<p>The warm water of the channel close around both of you at the same time, but a few vigorous breaststrokes enable you to get ahead of Raiahui. You know that you'll need to save your strength during the first half of the race, but finding herself behind you right from the start should shake your opponent's self-confidence.</p>

<p>Your head finally emerges above the water and you're nearly deafened by the cries coming from the beach. Raiahui's still underwater, but you don't waste time trying to determine her exact position. Now that the race has started, force of habit makes you focus on nothing but your swimming strokes.</p>

<p>But your concentration only lasts until the next time you take a breath in. Something's wrong. Raiahui still hasn't resurfaced and the cries coming from the beach are reaching a peak of shrill excitement.</p>

<p>Though you don't know why, a chilling foreboding is telling you that you've made a terrible mistake.</p>

<hr/>
    ` + raiahuiGoodEndText,
    "next": endGame,
  },
  "trial-knife": {
    "text": `
<p>As Raiahui starts drinking from a new calabash, you deftly steal her knife. But she realizes it immediately and amusement vanishes from her eyes.</p>

<div class="conversation">
<p>"Give it back! Give it back right now!"</p>
</div>

<p>Dropping the calabash on the sand, she springs toward you to reclaim the item.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `You throw the knife into the lagoon.`,
          "action": () => {
            cleanInventoryBeforeRace(flags, updateFlag);
            updateFlag("eatenByRaiahui", true);
            goToSection("knife-sea");
          },
        },
        {
          "text": `You throw the knife among the trees close to the beach.`,
          "action": () => {
            goToSection("knife-land");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "knife-sea": {
    "text": `
<p>The ivory knife swirls through the air and disappears into the lagoon with a slight splash. With an annoyed exclamation, Raiahui turns away from you and runs in that direction. You're not going to let such a chance slip away! Under the astonished eyes of the other adolescents, you quickly cross the distance separating you from the shore and dive into the warm water of the channel.</p>

<p>A few vigorous breaststrokes propel you toward the sandy beach. When you come back to the surface, Raiahui's no longer in sight, but most of the spectators have gathered close to the lagoon, probably to see whether your opponent manages to find her precious knife. You start swimming at a moderate pace, in order to save your strength.</p>

<p>You've nearly covered a fourth of the distance when exclamations reach your ears. Glancing back, you see the adolescents on the beach waving their arms and screaming their support. Either Raiahui was lucky enough to quickly find her knife at the bottom of the lagoon or she's decided to recover it later; in any case, it's clear that she's finally set off after you. It doesn't matter much: even if she really is a better swimmer than you are, your head start virtually ensures your victory.</p>

<p>And yet, irrational anxiety is creeping in your mind. From time to time, you cast glances behind you, but you're unable to spot Raiahui, as if she were swimming underwater without ever surfacing. Unable to put a name on your fear, you force the pace earlier than you'd intended, before you've even reached the halfway point. But a chilling foreboding tells you that it changes nothing.</p>

<p>With each stroke, it now seems that the arrival point is getting a bit farther, and that something horrible is getting a bit closer.</p>

<hr/>
    ` + raiahuiGoodEndText,
    "next": endGame,
  },
  "knife-land": {
    "text": `
<p>The ivory knife swirls through the air and silently disappears among the trees. With a furious exclamation, Raiahui turns away from you and runs in that direction. You're not going to let such a chance slip away!</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Under the astonished eyes of the other adolescents, you cross the distance separating you from the shore in three strides.`;

      return trueStartFunnel(text, goToSection, flags, updateFlag);
    },
  },
  "raiahui-drunk": {
    "text": `
<div class="conversation">
<p>"I'm certainly not going to dissuade you from getting drunk," you say, handing your calabash to her. "Here, empty this one too, if you really trust that you'll be able to beat me afterwards!</p>
</div>

<p>Your challenge causes amused exclamations among the young audience. Raiahui accepts your gift with a supremely confident smile. Even if she realizes that this beverage is much stronger than mere palm wine, you suspect that she'll still drink at least most of it to avoid losing face.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Letting your opponent drink more than she should, you quickly head for the shore.`;

      return trueStartFunnel(text, goToSection, flags, updateFlag);
    },
  },
  "the-trial-begins": {
    "text": (flags) => {
      let intro = `
<p>The warm, clear water of the channel closes around you. You slide for a moment, carried by the momentum of your dive, then you start swimming under the surface. You adopt a moderate pace, in order to save most of your strength for later.</p>
      `;

      if (flags.playedTheFool) {
        intro = ``;
      }

      return `
${intro}

<p>Your head finally emerges above the water. You increase your speed slightly, but it's much too early to really force the pace. Focused on your steady swimming strokes, you nearly forget about the race for a while, feeling nothing but the unmitigated pleasure swimming always brings you.</p>

<p>You're nearly halfway when many loud exclamations reach your ears. Glancing back without slowing down, you see that all the adolescents have gathered close to the shore. Judging from the excited way they wave their arms, Raiahui has only just dived into the water.</p>

<p>You don't increase your pace immediately. After all, your head start is considerable. Out of caution, you cast a few glances behind you afterward, but they strangely fail to reveal anything: at no point do you spot Raiahui's head above the surface and her position is a complete mystery.</p>

<p>How can she hold her breath for so long?</p>
      `;
    },
    "next": (goToSection, flags, updateFlag) => {
      const diveText = `You dive under the surface to see where Raiahui is.`;
      const choices = [
        {
          "text": `You quicken your pace.`,
          "action": () => {
            const doll = flags.inventory.doll;
            if (doll.acquired && !doll.used) {
              useItem("doll", updateFlag);
              return goToSection("trial-doll");
            }

            const amulet = flags.inventory.dolphin;
            if (amulet.acquired && !amulet.used) {
              useItem("dolphin", updateFlag);
              return goToSection("trial-early-amulet");
            }

            goToSection("trial-straightforward");
          },
        },
        {
          "text": diveText,
          "action": () => {
            savePointAction(diveText, goToSection, flags, updateFlag);
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "trial-straightforward": {
    "text": `
<p>You increase your speed and are soon swimming as fast as you can. Barely more than a third of the distance remains before you. How could anyone catch up to you now?</p>

<p>And yet, a heavy foreboding has crept in your mind and now keeps growing, every time you finish a stroke, every time you take a new breath.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Though you don't understand why, it feels like your time is quickly running out.`;
      const action = () => {
        updateFlag("eatenByRaiahui", true);
        goToSection("raiahui-good-end", coatSentence(text));
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "raiahui-good-end": {
    "text": raiahuiGoodEndText,
    "next": endGame,
  },
  "trial-doll": {
    "text": `
<p>As you increase your speed, the figurine you've tied to your waist starts thrashing about wildly. Fearing some witchcraft, you try to get rid of it, but it frees itself and grabs your arm. Suddenly, its weight becomes considerable: you barely have time to take a breath in before it pulls you under the surface.</p>

<p>You struggle, but the figurine has already released you and disappeared.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Relieved, you're about to get back to the surface, but you briefly look behind you.`;
      const action = () => {
        savePointAction(text, goToSection, flags, updateFlag);
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-early-amulet": {
    "text": `
<p>As you increase your speed, a multitude of barely audible sounds starts reaching you, filling your head until it feels nearly saturated. In a way you couldn't possibly explain, you suddenly possess a new way of perceiving the things that surround you. You're perfectly aware of the sandy bottom of the channel, detecting all the coral reefs that cover it without needing to see them.</p>

<p>But more importantly, you sense a shape that's located behind you and keeps getting closer. You can't interpret its sleek forms, but they fill you with instinctive dread.</p>

<p>Your additional sense vanishes as suddenly as it had appeared, and at the same time, the pendant around your neck disintegrates.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Intuitively guessing that it has just exhausted its remaining powers to give you a warning, you dive under the surface to see what's following you.`;
      const action = () => {
        savePointAction(text, goToSection, flags, updateFlag);
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-underwater": {
    "text": `
<p>Did you guess that the tribe, seemingly so primitive, was hiding its true nature? Did you suspect that this race wasn't a simple trial, after which the loser would face nothing worse than the humiliation of defeat? Did you remember old legends speaking of humans who were also something else?</p>

<p>None of that matters anymore, for the clear water gives you a perfect view of Raiahui's second shape as she gets closer and closer to you.</p>

<img src="${squaleImage}" class="img-responsive text-img" alt=""/>

<p>Propelled by its powerful tail, her striped body is more comfortable in water than you could ever be. Her mouth seems almost harmless for now, but you've seen the jaws of tiger sharks before, as well as the many sharp teeth that cover them.</p>

<p>You get back to the surface and take a breath in. Horrible dread has filled your entire being, but you're still thinking clearly. A third of the distance still separates you from the islet that's your arrival point. Below, a few coral reefs emerge from the sandy bottom of the channel, here and there. To your right, closer to the ocean, the reefs become much larger.</p>
    `,
    "next": (goToSection) => {
      const choices = [
        {
          "text": `You swim as fast as you can toward the islet.`,
          "action": () => {
            goToSection("trial-rush");
          },
        },
        {
          "text": `You dive toward the coral reefs right under you.`,
          "action": () => {
            goToSection("trial-hide-closer");
          },
        },
        {
          "text": `You try to reach the reefs to your right, which are larger but twice as distant.`,
          "action": () => {
            goToSection("trial-hide");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "trial-rush": {
    "text": `
<p>Panic fills your limbs with searing strength and you swim faster than you ever have. But Raiahui's speed remains much higher. A distressed glance behind you reveals that she's about to catch up to you.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `You throw the witch's net at her.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("caught-a-raiahui");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `You crush the black pearls.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("killed-by-pearls");
          },
          "conditional": true,
        });
      }

      const escapeText = `You desperately try to outdistance her.`;
      choices.push({
        "text": escapeText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(escapeText));
        }
      });

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "caught-a-raiahui": {
    "text": `
<p>Grabbing the net you've tied around your waist, you throw it in Raiahui's direction. Your gesture has very little strength, but the witch's net has retained its powers: it spreads out by itself and wraps around your pursuer as she was about to reach you. Raiahui thrashes about wildly, ripping up the tight mesh in order to free herself.</p>
    `,
    "next": (goToSection) => {
      const text = `You get away from her as fast as you can.`;
      const action = () => {goToSection("arrival-in-sight")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "killed-by-pearls": {
    "text": `
<p>You hurriedly crush the pearls, and the clear water around you suddenly becomes completely opaque.</p>

<p>You keep swimming as fast as you can, but you feel a stinging impact against your leg a short moment later. A rough-skinned body has just brushed past you!</p>

<p>Under your horrified eyes, a brown fin emerges from the dark water right before you.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      return repeatingFunnel(
        goToSection,
        `It sharply turns in your direction.`,
        () => {
          updateFlag("eatenByRaiahui", true);
          return "raiahui-good-end";
        },
      );
    }
  },
  "arrival-in-sight": {
    "text": `
<p>The sandy island is now close. You keep swimming as fast as you can, but your fear-fueled efforts are taking their toll. You feel close to exhaustion.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      if (flags.drunk) {
        const text = `Your stomach twists painfully and an aftertaste of alcohol comes to your mouth.`
        const action = () => {
          goToSection("exhausted");
        };

        return (
          <Funnel text={text} action={action} conditional={true} />
        );
      }

      const amulet = flags.inventory.dolphin;
      if (amulet.acquired && !amulet.used) {
        const text = `The pendant is quivering around your neck.`
        const action = () => {
          useItem("dolphin", updateFlag);
          goToSection("trial-saved-by-dolphin");
        };

        return (
          <Funnel action={action} text={text} conditional={true} />
        );
      }

      if (flags.boostedByFruit) {
        const text = `Your stomach is growling strangely.`
        const action = () => {
          goToSection("trial-saved-by-fruit");
        };

        return (
          <Funnel action={action} text={text} conditional={true} />
        );
      }

      if (flags.wellRested) {
        const text = `You're stronger than exhaustion.`
        const action = () => {
          goToSection("trial-saved-by-sloth");
        };

        return (
          <Funnel action={action} text={text} conditional={true} />
        );
      }

      const text = `You gather your remaining strength.`
      const action = () => {
        goToSection("exhausted");
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-saved-by-dolphin": {
    "text": `
<p>A deep breath of pure air suddenly seems to fill your lungs. The tiredness making your limbs heavy vanishes as though it had never existed, and you keep swimming as quickly as you ever have.</p>
    `,
    "next": (goToSection) => {
      const text = `Around your neck, the dolphin-shaped pendant disintegrates, having exhausted its remaining powers.`;
      const action = () => {goToSection("final-island")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-saved-by-fruit": {
    "text": `
<p>As you're close to panic, burning strength suddenly appears in your stomach, spreading to your limbs as fast as lightning.</p>
    `,
    "next": (goToSection) => {
      const text = `No longer feeling any tiredness, you keep swimming as fast as you ever have.`;
      const action = () => {goToSection("final-island")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-saved-by-sloth": {
    "text": `
<p>You draw on your inner resources to cross the distance still separating you from your goal.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Stronger than panic, your willpower makes your muscles overcome exhaustion, and keep propelling you toward the island, ever closer, without ever slowing down.`,
        "final-island",
      );
    },
  },
  "final-island": {
    "text": `
<p>A surge of wild hope fills your mind when you finally feel the sand under your feet. You quickly stand up. Water only comes to your waist and a few strides will be enough for you to reach the island.</p>

<p>A great splashing sound makes you turn around: Raiahui has emerged from the water in turn. For a brief moment, you see her as a weird hybrid being, halfway between her two shapes. Then her skin becomes uniformly brown, her face is human again, and her upper limbs have hands, one of which holds an ivory knife.</p>

<p>Holding her weapon before her, Raiahui rushes toward you with an enraged scream.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `You throw the witch's net at her.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("net-on-sand");
          },
          "conditional": true,
        });
      }

      choices = choices.concat([
        {
          "text": `You try to disarm her.`,
          "action": () => {
            goToSection("raiahui-fight");
          },
        },
        {
          "text": `You run toward the island.`,
          "action": () => {
            goToSection("run-to-finish");
          },
        },
      ]);

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "raiahui-fight": {
    "text": `
<p>You fail to grab Raiahui's wrist. She tries to stab you in the stomach, but you manage to twist aside just in time, and the sharp edge of the knife only inflicts a light cut.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `You punch her.`,
          "action": () => {
            goToSection("raiahui-punch");
          },
        },
        {
          "text": `You get a hold on her.`,
          "action": () => {
            if (flags.drunk || flags.weakened) {
              updateFlag("stabbedToDeath", true);
              return goToSection("raiahui-grapple");
            }

            goToSection("raiahui-grapple-strong");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "raiahui-punch": {
    "text": `
<p>Raiahui fails to dodge your punch in time. You hit her in the stomach and she staggers back slightly, but she holds her knife before her to prevent you from pressing your advantage.</p>
    `,
    "next": (goToSection) => {
      const text = `Realizing that the situation is not to your advantage, you seize the occasion and run toward the island.`;
      const action = () => {
        goToSection("run-to-finish");
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "raiahui-grapple": {
    "text": `
<p>You try to grab your opponent in a way that'll prevent her from using her weapon, but water makes her skin too slippery. You briefly lose your balance and, this time, you're unable to dodge Raiahui's knife: its sharp blade buries into your chest and you fall backward, suddenly deprived of all your strength. The last thing you see, as the reddening water closes above your face, is your murderer staring at you.</p>
    `,
    "next": endGame,
  },
  "raiahui-grapple-strong": {
    "text": `
<p>You try to grab your opponent in a way that'll prevent her from using her weapon, but water makes her skin too slippery. You briefly lose your balance, and barely manage to get a hold on Raiahui's arm before she can stab you.</p>

<p>You fight as best you can, but your hold is poor and you can't get the upper hand.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `You push Raiahui away with all your strength.`,
          "action": () => {
            updateFlag("stabbedToDeath", true);
            goToSection("raiahui-grapple-strong-death");
          },
        },
        {
          "text": `You claw at her eyes.`,
          "action": () => {
            goToSection("raiahui-grapple-strong-escape");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      )
    }
  },
  "raiahui-grapple-strong-death": {
    "text": `
<p>You make Raiahui lose her balance, but she grabs your wrist, taking you down with her! You tumble into the water together, and a chaotic, frantic fight ensues. Eventually, Raiahui's knife buries into your chest and the fiery pain immediately takes away all of your strength. The last thing you see, as a thick red spreads in the clear water, is the face of your murderer right next to your own.</p>
    `,
    "next": endGame,
  },
  "raiahui-grapple-strong-escape": {
    "text": `
<p>Seeing your stretched fingers aiming for her eyes, Raiahui reflexively tries to dodge. Seizing this occasion, you manage to get free and push her away. Raiahui's briefly out of balance, but she holds her knife before her to prevent you from pressing your advantage.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Realizing that you're unlikely to get the upper hand in this fight, you run toward the island.`,
        "run-to-finish",
      );
    }
  },
  "net-on-sand": {
    "text": `
<p>You throw the witch's net toward Raiahui, but she's so close that the net can't spread out properly, and it only wraps itself around her arm. Though it doesn't really hinder her, she's momentarily surprised; you seize the occasion and run toward the sandy shore.</p>

<p>You don't manage to reach it: after only a few splashing strides, you're violently shoved from behind and you fall into the water. Quickly getting to your feet, you turn just in time to grab Raiahui's wrist, stopping the tip of her knife very close to your face. The water is still at mid-thigh. Raiahui's free hand grabs your arm and you fight furiously, splashing water all around you, less than three strides away from the shore.</p>

<p>The knife grazes you several times, and you can tell that Raiahui's trying to drag you back toward the channel, where the water will be deeper.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `You fight as fiercely as you can.`,
          "action": () => {
            goToSection("raiahui-struggle");
          },
        },
        {
          "text": `You wait for an occasion to free yourself and run toward the island.`,
          "action": () => {
            if (flags.drunk || flags.weakened) {
              updateFlag("stabbedToDeath", true);
              return goToSection("raiahui-backstab");
            }

            goToSection("raiahui-knife-close");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "run-to-finish": {
    "text": `
<p>You run toward the sandy shore as best you can. But, after only a few splashing strides, you're violently shoved from behind and you fall into the water. Quickly getting to your feet, you turn just in time to grab Raiahui's wrist, stopping the tip of her knife very close to your face. The water is still at mid-thigh. Raiahui's free hand grabs your arm and you fight furiously, splashing water all around you, less than three strides away from the shore. The knife grazes you several times, and you can tell that Raiahui's trying to drag you back toward the channel, where the water will be deeper.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `You fight as fiercely as you can.`,
          "action": () => {
            goToSection("raiahui-struggle");
          },
        },
        {
          "text": `You wait for an occasion to free yourself and run toward the island.`,
          "action": () => {
            if (flags.drunk || flags.weakened) {
              updateFlag("stabbedToDeath", true);
              return goToSection("raiahui-backstab");
            }

            goToSection("raiahui-knife-close");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "raiahui-backstab": {
    "text": `
<p>You finally manage to escape from your opponent's hold and you run toward the island, hoping to finally reach it. But Raiahui catches up to you and buries her knife into your back. Struck as though by lightning, you crumple forward. The shore is at arm's reach, but all of your strength has deserted you. The last thing you see is the water brushing against your face, as it slowly becomes tinged with red.</p>
    `,
    "next": endGame,
  },
  "raiahui-knife-close": {
    "text": `
<p>You finally manage to escape from your opponent's hold and you turn, hoping to finally reach the sandy shore. But Raiahui remains too close and she reacts too quickly. Out of the corner of your eye, you see that she's about to stab you. You manage to twist aside just in time, and the ivory knife only inflicts a light wound instead of burying into your back.</p>

<p>Raiahui grabs your hair and pulls you back. You manage to elbow her in the stomach; it's not enough to make her lose her grip, but it enables you to grab her wrist with both hands before her ivory knife can slit your throat.</p>

<p>For a brief moment, you both remain motionless, panting, watching out for an occasion to gain the upper hand in this weird fight. Very close to your face, you can distinctly see drops of your blood running off the milky edge of the knife.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `You strike Raiahui as hard as you can.`,
          "action": () => {goToSection("raiahui-struggle-alt")},
        },
        {
          "text": `You twist her arm in order to disarm her.`,
          "action": () => {
            updateFlag("stabbedToDeath", true);
            goToSection("raiahui-struggle-death");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "raiahui-struggle-death": {
    "text": `
<p>For a brief moment, you manage to push away the tip of the ivory knife. Then Raiahui's free arm gets a hold on your neck, her leg wraps around yours, and she abruptly pulls you backward. You tumble into the water together, and a chaotic, frantic fight ensues. Eventually, Raiahui's knife buries into your chest and the fiery pain immediately takes away all of your strength. The last thing you see, as a thick red spreads in the clear water, is the face of your murderer right next to your own.</p>
    `,
    "next": endGame,
  },
  "raiahui-struggle": {
    "text": `
<p>Your fear has reached its boiling point and suddenly evaporates into burning rage.</p>

<div class="conversation">
<p>"LET GO OF ME, YOU…"</p>
</div>

<p>You scream a word your mother wouldn't approve of, then hit your opponent with a violent headbutt, and savagely bite her forearm. Raiahui lets out a piercing scream of pain and almost drops her precious knife. You punch her in the face and, as she staggers back, you finally cross the distance separating you from the sandy shore.</p>

<p>Raiahui regains her balance and runs after you. But as she reaches the shore, many figures appear all around you, and hands restrain her.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      return repeatingFunnel(
        goToSection,
        `"The trial is over," Ataroa says.`,
        () => {
          updateFlag("survivedTheTrial", true);
          return "victory";
        },
      );
    },
  },
  "raiahui-struggle-alt": {
    "text": `
<p>Your fear has reached its boiling point and suddenly evaporates into burning rage.</p>

<div class="conversation">
<p>"LET GO OF ME, YOU…"</p>
</div>

<p>You scream a word your mother wouldn't approve of, then hit your opponent with a violent backward headbutt, and savagely bite her forearm. Raiahui lets out a piercing scream of pain, loses her grip on your hair, and almost drops her precious knife. You elbow her in the chest and, as she staggers back, you finally cross the distance separating you from the sandy shore.</p>

<p>Raiahui regains her balance and runs after you. But as she reaches the shore, many figures appear all around you, and hands restrain her.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      return repeatingFunnel(
        goToSection,
        `"The trial is over," Ataroa says.`,
        () => {
          updateFlag("survivedTheTrial", true);
          return "victory";
        },
      );
    }
  },
  "victory": {
    "text": `
<p>The adults of the tribe are gathered in a thick circle, and studying you with much closer attention than they did yesterday. You're too exhausted to really feel afraid anymore; anyway, their faces show no signs of hostility, merely deep curiosity.</p>

<div class="conversation">
<p>"You've deserved our respect, Mananuiva," Ataroa says with almost perceptible admiration. "It's not often that an outsider wins one of our races."</p>
</div>

<p>A few cutting remarks come to your mind, but even if you dared to speak them, you simply feel too tired to do so.</p>

<div class="conversation">
<p>"You're free to go," the chieftain adds, and he points at your outrigger canoe, waiting at the other end of the islet with a new mast and a sail quivering in the evening breeze. "We've taken care of your craft and filled it with the supplies you may need. As for your reward…"</p>
</div>

<p>He gestures and another man approaches, bearing a bowl full of a greyish beverage.</p>

<div class="conversation">
<p>"The Foam of the Deep is yours. There's only one ingredient left to add, and we'll take care of that right now. It's normally provided by the one who'll drink the Foam, but given the circumstances, it's only fair that it comes from somebody else."</p>
</div>

<p>Two adults come forward, holding an obviously terrified Raiahui between them. Ataroa grabs her wrist and cuts her palm deeply with his knife. Blood trickles into the bowl, and the beverage immediately takes a bright silvery hue.</p>

<div class="conversation">
<p>"The Foam of the Deep is ready," says Ataroa, presenting it to you. "Drink it this evening, and you'll visit the world of spirits during your sleep."</p>
</div>

<p>He now turns toward your trembling opponent.</p>

<div class="conversation">
<p>"Raiahui," he says in a cold voice, "you don't deserve to become an adult. You've failed your trial out of arrogance, by underestimating your opponent. I'm sure you won't take your next test so lightly."</p>
</div>

<p>He grabs the young woman's knife and throws it far away into the lagoon.</p>

<div class="conversation">
<p>"If you manage to get back to the village, your foolishness will be forgiven."</p>
</div>

<p>The hands that were holding Raiahui suddenly release her. The young woman casts a frightened look at the adults surrounding her. Then she runs toward the shore and dives into the lagoon. You watch as she swims as fast as possible toward the spot where her knife has sunk. Trapped in her human shape, she remains a very good swimmer, but you're sure that you could have beaten her in a normal race.</p>

<p>Ataroa turns toward you and nods his farewell.</p>

<div class="conversation">
<p>"I hope you'll find what you seek, Mananuiva."</p>
</div>

<p>Then all of the adults head for the shore and dive in turn. In the clear water, you see their sleek shapes chasing after Raiahui.</p>

<p>You don't want to know what's going to happen in the lagoon; you're not even sure that you have a preference for one of the two possible outcomes. You cross the sandy island and sit in front of the ocean. The steady sound of the waves relaxes you, easing the tension from your muscles. It won't be long before the sun reaches the horizon behind you.</p>

<p>You look at the Foam of the Deep, its shining surface vaguely reflecting your face. Is this worth all your efforts and the dangers you've faced? It doesn't matter now: your adventure on this atoll already belongs to the past, and your quest is far from over.</p>

<p>You settle comfortably and bring the bowl to your lips.</p>
    `,
    "next": (goToSection) => {
      const text = `Tonight, you'll dream. And tomorrow, you'll set off again.`;
      const action = () => {
        goToSection("ending-credits");
      };

      return (
        <div className="true-end-link">
          <Funnel text={text} action={action} />
        </div>
      );
    },
  },
  "trial-hide": {
    "text": `
<p>You remain on the surface for a while, swimming as fast as you can to get closer to the reefs. Then you take a deep breath and dive.</p>

<p>A few vigorous strokes bring you close to the bottom of the channel. Between two extravagantly shaped masses of coral, you spot a vertical, uneven crevice, that seems too narrow for Raiahui.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `You try to reach it as quickly as possible.`,
          "action": () => {
            goToSection("trial-not-looking-back");
          },
        },
        {
          "text": `You cast a glance behind you to see where Raiahui is now.`,
          "action": () => {
            goToSection("trial-looking-back");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "trial-not-looking-back": {
    "text": `
<p>You don't need to see Raiahui to know that she's after you and that the distance between you is ever decreasing. Turning your head would needlessly slow you down.</p>

<p>You swim as fast as you can. Six more strokes and you'll reach the crevice where you hope to find shelter. Then five. Then four. Raiahui can't be very far now. Three. Two. You're almost there. One. You're there!</p>

<p>As you slip inside the crevice, you see out of the corner of your eye that Raiahui's about to catch up to you, her half-open mouth revealing her many sharp teeth.</p>
    `,
    "next": (goToSection) => {
      const text = `You quickly get deeper among the reefs, out of her reach.`;
      const action = () => {goToSection("far-corals")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "trial-looking-back": {
    "text": `
<p>Turning your head, you quiver with fear as you discover that Raiahui's much closer than she was mere moments ago. The distance between you is quickly diminishing. Can you really reach the coral reefs before she reaches you?</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `You throw the witch's net at her.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("far-corals-net");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `You crush your black pearls.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("far-corals-pearls");
          },
          "conditional": true,
        });
      }

      choices.push({
        "text": `You swim as fast as you can toward the crevice you've spotted.`,
        "action": () => {
          if (flags.boostedByFruit) {
            updateFlag("boostedByFruit", false);
            return goToSection("far-corals-doped");
          }

          updateFlag("bleeding", true);
          goToSection("far-corals-wound");
        }
      });

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "far-corals-pearls": {
    "text": `
<p>You crush all the pearls you have and a thick, opaque cloud immediately spreads around you. Completely blind, you keep swimming in the approximate direction of the crevice.</p>

<p>A few strokes later, you're able to see your hands again, then the brightly colored coral.</p>

<p>You reach completely clear water. Turning your head, you spot Raiahui's sleek shape. She's managed to stay outside of the opaque cloud, but it's cost her some time. The crevice where you hope to find shelter is now very close.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `You reach it and slip inside immediately.`,
        "far-corals",
      );
    }
  },
  "far-corals-net": {
    "text": `
<p>Grabbing the net you've tied around your waist, you throw it in Raiahui's direction. Your gesture has little strength and precision, but the witch's net has retained its powers: it spreads out by itself and wraps around your pursuer as she was about to reach you. Raiahui thrashes about wildly, ripping up the tight mesh in order to free herself.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `This gives you more than enough time to reach the coral reefs and slip inside the crevice.`,
        "far-corals",
      );
    },
  },
  "far-corals-doped": {
    "text": `
<p>You swim as fast as you can, but growing fear whispers that it won't be enough.</p>

<p>Burning strength suddenly appears in your stomach, spreading to your limbs as fast as lightning. Your strokes become quicker and more powerful. You cross the remaining distance with amazing speed!</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `The abnormal vigor vanishes as you reach the crevice; you slip inside immediately.`,
        "far-corals",
      );
    }
  },
  "far-corals-wound": {
    "text": `
<p>You swim as fast as you can, but growing fear whispers that it won't be enough.</p>

<p>Six more strokes and you'll reach the crevice where you hope to find shelter. Then five. Then four. How close is Raiahui now? Three. All the time, you expect her jaws to suddenly close on your leg. Two. You're almost there. One. You're there!</p>

<p>As a final stroke propels you inside the crevice, you feel a sudden impact against your foot. Terrified, you hasten to get deeper among the colorful reefs.</p>

<p>Once you're certain that you're out of Raiahui's reach - at least for the moment - you examine your foot. There's a small cut on your heel, too shallow to be very painful. A bit of blood flows out of the wound, dissolving almost immediately in the clear water.</p>

<p>Quivering, you realize what happened: just as you were reaching the crevice, Raiahui tried to grab you by the ankle. She barely missed, but your feet hit her mouth. The cut was caused by the sharp edge of one of her teeth.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `You were lucky, and this cut isn't enough to hinder your swimming, but you're certainly not out of trouble yet.`,
        "far-corals",
      );
    }
  },
  "far-corals": {
    "text": `
<p>The light coming from the surface briefly dims as Raiahui's sleek shape passes above you, swimming at ostensibly slow speed.</p>

<p>You know that time isn't on your side. Raiahui can't reach you, but she knows exactly where you are; and unlike her, you can't remain underwater indefinitely.</p>

<p>The narrow crevice between the two masses of coral is longer than you thought; with a burst of hope, you realize that it's more or less oriented toward the islet. Maybe you can get closer to your goal without exposing yourself to your pursuer.</p>

<p>You deftly move along the crevice. The walls of coral are at first so close together than you're sometimes forced to contort yourself to pass through without scratching your skin. But then they start edging away from each other, up to the point where you begin to feel dangerously exposed.</p>

<p>You halt for a moment, feeling hesitant. You can see that the coral walls eventually get closer again. But while you cross the distance between your current position and that spot - something that'll require half a dozen strokes - the crevice will be wide enough for a shark to slip into it. You can't see Raiahui, but it doesn't mean that she's very far.</p>
    `,
    "next": (goToSection) => {
      const choices = [
        {
          "text": `You cross that distance as quickly as you can.`,
          "action": () => {goToSection("far-corals-quick")},
        },
        {
          "text": `You cross that distance as stealthily as possible.`,
          "action": () => {goToSection("far-corals-sneaky")},
        },
      ];

      return (
        <Crossroads choices={choices} />
      )
    }
  },
  "far-corals-quick": {
    "text": `
<p>You propel yourself forward as fast as this confined space allows. But you've barely crossed half the distance when Raiahui suddenly appears to your left! She swiftly slips inside the crevice, her fins grazing the walls of coral. You can see with terrifying clarity the teeth filling her half-open mouth as she gets close to your legs.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `You throw the witch's net at her.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("far-corals-net-2");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `You crush your black pearls.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("far-corals-pearls-2");
          },
          "conditional": true,
        });
      }

      choices.push({
        "text": `You kick her in a desperate attempt to keep her away.`,
        "action": () => {
          updateFlag("bleeding", true);
          goToSection("far-corals-fight");
        }
      });

      const deathText = `You keep swimming as fast as you can.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        }
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "far-corals-net-2": {
    "text": `
<p>Raiahui's too close for the net to spread out completely. But it wraps around her head, entangling in her sharp teeth.</p>

<p>She thrashes about wildly, ripping up the tight mesh to rid herself of that hindrance. This grants you just enough time to reach the point where the crevice narrows down too much for her to follow.</p>

<p>Casting a glance behind you, you see Raiahui tear to pieces the remains of the net, then head up and disappear out of your sight.</p>
    `,
    "next": (goToSection) => {
      const text = `You keep moving forward without wasting any time.`;
      const action = () => {goToSection("far-corals-last")};

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "far-corals-fight": {
    "text": `
<p>You frantically kick her snout with fear-fueled strength. That doesn't harm Raiahui in any way, but your resistance makes it more difficult for her to grab you. Her frightful jaws open and close several times right next to your ankles, but don't manage to seize either of them.</p>

<p>If the space around you were wider, you couldn't possibly defend yourself like this. But the reefs confine Raiahui's movements, and she's unable to take advantage of her speed and mobility.</p>

<p>Holding her back as best you can, you keep slowly moving along the crevice. Completely focused on your assailant, you scratch yourself several times against the coral, but you barely notice the pain.</p>

<p>Finally, almost without realizing it, you reach the point where the crevice once again becomes too narrow for your pursuer. With disbelieving relief, you see Raiahui suddenly head up and disappear out of your sight.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `You keep moving forward without wasting any time.`,
        "far-corals-last"
      );
    }
  },
  "far-corals-pearls-2": {
    "text": `
<p>You crush all the pearls you have and a thick, opaque cloud immediately spreads around you.</p>

<p>Your relief is short-lived: Raiahui can no longer see you, but you find yourself completely blind! The reefs around you, far from offering protection, are now an invisible trap, where you're at constant risk of hurting yourself against the coral's sharp edges.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const doll = flags.inventory.doll;
      if (doll.acquired && !doll.used) {
        const text = `Before you can attempt anything, something completely unexpected happens.`;
        const action = () => {
          useItem("doll", updateFlag);
          goToSection("far-corals-doll");
        }

        return (
          <Funnel text={text} action={action} />
        );
      }

      const dolphin = flags.inventory.dolphin;
      if (dolphin.acquired && !dolphin.used) {
        const text = `Before you can attempt anything, something completely unexpected happens.`;
        const action = () => {
          useItem("dolphin", updateFlag);
          goToSection("far-corals-amulet");
        }

        return (
          <Funnel text={text} action={action} />
        );
      }

      const deathText = `You keep moving along the crevice as best you can.`;
      const choices = [
        {
          "text": deathText,
          "action": () => {
            updateFlag("eatenByRaiahui", true);
            goToSection("raiahui-good-end", coatSentence(deathText));
          },
        },
        {
          "text": `You head for the surface.`,
          "action": () => {
            updateFlag("bleeding", true);
            goToSection("i-hate-pearls");
          }
        }
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "far-corals-doll": {
    "text": `
<p>The figurine created by the crocodile suddenly starts thrashing about wildly, quickly freeing itself from the thong that was tying it to your waist. You don't understand what's happening, but a moment later, you feel a wooden hand - quite human-sized - close on yours and drag you upward. Completely blind but filled with a strange trust, you let yourself be led, kicking slowly.</p>

<p>A few moments later, the hand releases you and you soon leave the thick cloud. The bright surface is only a short distance above you. Under your feet, the coral reefs remain partly hidden by the strange darkness. You can't tell where Raiahui is, but you can't hold your breath for much longer anyway.</p>
    `,
    "next": (goToSection) => {
      const text = `You head for the surface.`;
      const action = () => {goToSection("surface-close")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "far-corals-amulet": {
    "text": `
<p>A multitude of barely audible sounds is reaching you, filling your head until it feels nearly saturated. Suddenly, you're no longer blind. You eyes remain unable to see through the darkness, but in a way you couldn't possibly explain, you feel the shape of everything around you, from the coral reefs to Raiahui herself, who's still very close.</p>

<p>You don't try to understand this miracle and you quickly move away from your pursuer. A few moments are enough for you to reach the point where the crevice becomes too narrow for her to follow. You keep moving forward without wasting any time.</p>

<p>The water around you slowly clears up: you can see your hands again, then the bright colors of the reefs. As your sight return, your strange additional sense starts to fade. When it disappears completely, you see the pendant around your neck suddenly disintegrate. What happened to you must have been its work, but it exhausted all the power it had left.</p>

<p>Behind you, the darkness is nowhere close to disappearing. You can't tell where Raiahui is.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `You keep moving forward without wasting any time.`,
        "far-corals-last"
      );
    },
  },
  "i-hate-pearls": {
    "text": `
<p>You scratch your leg against one of the coral's invisible edges, but you still manage to head for the surface. The darkness around you slowly becomes less opaque: you can see your hands again, then the reflection of the sun above your head.</p>

<p>But when the water completely clears up, it reveals the sleek shape of Raiahui, just below you! Whether she expected you to do that or was simply trying to get out of the thick cloud, she headed up at the same time as you did.</p>

<p>She heads straight for you as soon as she spots you.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `You throw the witch's net at her.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("far-net-surface");
          },
          "conditional": true,
        });
      }

      const deathText = `You desperately try to outdistance her.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        }
      });

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "far-net-surface": {
    "text": `
<p>Grabbing the net you've tied around your waist, you throw it in Raiahui's direction. Your gesture has little strength and precision, but the witch's net has retained its powers: it spreads out by itself and wraps around your pursuer as she was about to reach you. Raiahui thrashes about wildly, ripping up the tight mesh in order to free herself.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `You quickly move away from her, while slowly heading for the surface.`,
        "surface-close",
      );
    },
  },
  "far-corals-sneaky": {
    "text": `
<p>You move forward slowly, staying very close to one of the reefs, in order to make yourself as difficult to spot as possible should Raiahui pass above your position. The fear gnawing at you makes this deliberate slowness almost unbearable, but you force yourself not to quicken your pace.</p>

<p>After a few seemingly very long moments, you reach the spot where the crevice once again becomes narrow enough to offer some amount of security. You cast a glance behind you, but you're still unable to see where Raiahui is.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `You keep moving forward without wasting any time.`,
        "far-corals-last",
      );
    }
  },
  "far-corals-last": {
    "text": `
<p>The crevice curves to the left and becomes even narrower. The two masses of coral surrounding you are now so close that they begin to merge. After a while, the space between them is no longer large enough to allow you passage. You'll have to head upward.</p>

<p>The lack of air is becoming a problem anyway. You can hold your breath for a very long time, but you're not a fish!</p>

<p>Cautiously rising up to the edge of the crevice, you see that your swimming among the coral reefs didn't get you as close to the sandy islet as you were hoping. At least, it helped you get away from Raiahui. You try to see where she currently is, but without success.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `You abandon your shelter and head for the surface.`,
          "action": () => {
            goToSection("far-corals-last-out-quick");
          },
        },
        {
          "text": `You stay where you are, even though your lungs are beginning to burn.`,
          "action": () => {
            const dolphin = flags.inventory.dolphin;
            if (dolphin.acquired && !dolphin.used) {
                useItem("dolphin", updateFlag);
                return goToSection("far-corals-last-out-slow-amulet");
            }

            updateFlag("weakened", true);
            goToSection("far-corals-last-out-slow")
          }
        },
      ];

      return (
        <Crossroads choices={choices} />
      )
    }
  },
  "far-corals-last-out-quick": {
    "text": `
<p>You leave your shelter and head for the surface. Only then do you spot Raiahui, some distance away, searching for you among the coral reefs. She's not looking in your direction for the moment. You hope that'll last long enough for you to get farther away from her.</p>
    `,
    "next": (goToSection) => {
      const text = `You quickly cross the distance remaining between you and the surface.`;
      const action = () => {goToSection("surface-close")};

      return (
        <Funnel text={text} action={action} />
      )
    }
  },
  "far-corals-last-out-slow-amulet": {
    "text": `
<p>A deep breath of pure air suddenly seems to fill your lungs. The growing temptation to head back for the surface vanishes, and you feel capable of remaining underwater as long as you already have. Around your neck, the dolphin-shaped pendant disintegrates; you surmise that it's just exhausted its remaining powers to help you.</p>

<p>Time goes by and you still can't see Raiahui. Waiting indefinitely is unlikely to increase your chances; you must head up despite the risks.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `You leave your shelter and head for the surface.`;
      const action = () => {
        if (flags.bleeding) {
          return goToSection("far-corals-last-out-slow-amulet-bleeding");
        }

        goToSection("far-corals-last-out-quick");
      }

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "far-corals-last-out-slow-amulet-bleeding": {
    "text": `
<p>You've barely left your shelter when Raiahui suddenly appears to your right! She knew where you were hiding and was waiting for you to finally head for the surface!</p>

<p>A sudden burst of acceleration propels her in your direction.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `You throw the witch's net at her.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("far-net-surface");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `You crush your black pearls.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("i-hate-pearls-2");
          },
          "conditional": true,
        });
      }

      const deathText = `You desperately try to outdistance her.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        }
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "i-hate-pearls-2": {
    "text": `
<p>Just in time, you remember the black pearls you carry. You crush them all without even taking them out of their small purse, and a thick, opaque cloud immediately spreads around you.</p>

<p>Completely blind, you mean to head straight for the surface, but you realize that Raiahui will probably expect you to do just that. Fortunately, the effects of the pendant allow you to remain underwater for a while longer. Instead of heading up, you start swimming vigorously in a direction perpendicular to the one your pursuer was coming from.</p>

<p>The water clears up as you get farther from the point where you crushed the pearls. You can see your hands again, then the reflection of the sun above you, as well as the islet that's your goal. You cast a glance behind you: the opaque cloud is stretching and thinning down very slowly, and you can't spot Raiahui.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `The effects of the amulet have completely faded and you have to head for the surface.`,
        "surface-close",
      );
    }
  },
  "far-corals-last-out-slow": {
    "text": `
<p>You force yourself to remain where you are, still trying to spot Raiahui in spite of the shadows that begin to form before your eyes. You put your hand against your mouth to ensure that you won't reflexively try to take a breath.</p>

<p>Time goes by and your pursuer is still nowhere to be seen. Red and black mist has filled your head and is becoming ever thicker. Finally, you realize you can no longer wait: you must head for the surface or drown.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `You leave your shelter and swim toward the surface as fast as you can.`;
      const action = () => {
        if (flags.bleeding) {
          return goToSection("far-corals-last-out-slow-bleeding");
        }

        goToSection("surface-close");
      };

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "far-corals-last-out-slow-bleeding": {
    "text": `
<p>You've barely left your shelter when Raiahui suddenly appears to your right! She knew where you were hiding and was waiting for you to finally head for the surface!</p>

<p>A sudden burst of acceleration propels her in your direction.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `You throw the witch's net at her.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("far-net-surface");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `You crush your black pearls.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("i-hate-pearls-3");
          },
          "conditional": true,
        });
      }

      const deathText = `You desperately try to outdistance her.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        }
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "i-hate-pearls-3": {
    "text": `
<p>You crush all of the pearls without even taking them out of their small purse, and a thick, opaque cloud immediately spreads around you. Completely blind, you head for the surface so you can finally breathe.</p>

<p>After a few strokes, the darkness begins to fade: you can see your hands again, then the reflection of the sun above your head.</p>

<p>But when the water becomes completely clear, it reveals that Raiahui's just below you! Probably surmising that you needed air, she also got closer to the surface. She heads straight for you as soon as she spots you.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `You throw the witch's net at her.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("far-net-surface");
          },
          "conditional": true,
        });
      }

      const deathText = `You desperately try to outdistance her.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        }
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "surface-close": {
    "text": `
<p>Your head suddenly emerges above the surface and a deep breath fills your lungs with air. But the fear that keeps gnawing at you leaves no room for relief. The reflection of the sun on the waves makes the water less transparent, but you know that Raiahui's somewhere below you. You hope that she didn't see you surfacing, but you're far from safe even if that's the case. She can't lose your track for good when she knows exactly where you're headed for.</p>

<p>The distance separating you from the sandy islet would seem negligible in normal circumstances, but it fills you with chilling uncertainty. Even if you swim as fast as possible, can you reach it before Raiahui catches up to you?</p>

<p>Another option suddenly comes to your mind: you could dive again toward the bottom of the channel - in order to be more difficult to spot - and then swim for the islet by following an indirect route that'll bring you closer to the lagoon. Raiahui may have a harder time spotting you if you don't head directly for your goal.</p>
    `,
    "next": (goToSection) => {
      const choices = [
        {
          "text": `You stay on the surface and swim as fast as you can toward the islet.`,
          "action": () => {goToSection("final-stretch-straight")},
        },
        {
          "text": `You dive again and try to reach the islet without getting spotted.`,
          "action": () => {goToSection("final-stretch-oblique")},
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "final-stretch-straight": {
    "text": `
<p>The distance separating you from your goal is decreasing at a speed you would find exhilarating in a normal race, but that's far from sufficient to give you hope right now. Never before have you perceived the water to be such an alien environment, and your swimming strokes to be such pitiful imitations of its real inhabitants.</p>

<p>Worse than everything, you now feel close to exhaustion.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `You desperately try to maintain the same pace.`;

      if (flags.boostedByFruit) {
        const action = () => {
          updateFlag("boostedByFruit", false);
          goToSection("trial-saved-by-fruit");
        };

        return (
          <Funnel action={action} text={text} />
        );
      }

      if (flags.drunk || flags.weakened) {
        const action = () => {goToSection("exhausted")};

        return (
          <Funnel text={text} action={action} />
        );
      }

      const amulet = flags.inventory.dolphin;
      if (amulet.acquired && !amulet.used) {
        const action = () => {
          useItem("dolphin", updateFlag);
          goToSection("trial-saved-by-dolphin");
        };

        return (
          <Funnel action={action} text={text} />
        );
      }

      if (flags.wellRested) {
        const action = () => {goToSection("trial-saved-by-sloth")};

        return (
          <Funnel action={action} text={text} />
        );
      }

      const action = () => {goToSection("exhausted")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "final-stretch-oblique": {
    "text": `
<p>You dive again and swim vigorously toward the bottom of the channel. You can't see Raiahui, and hopefully she can't see you either.</p>

<p>Not heading straight for the shore goes completely against your survival instinct, but you force yourself to do so. You can only hope you'll be able to hold your breath long enough.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `You swim as fast as you can toward the lagoon.`;

      if (flags.bleeding) {
        const action = () => {goToSection("final-stretch-oblique-bleeding")}

        return (
          <Funnel text={text} action={action} />
        );
      }

      const dolphin = flags.inventory.dolphin;
      if (dolphin.acquired && !dolphin.used) {
        const action = () => {
          useItem("dolphin", updateFlag);
          goToSection("final-stretch-oblique-dolphin");
        }

        return (
          <Funnel text={text} action={action} />
        );
      }

      if (flags.drunk || flags.weakened) {
        const action = () => {goToSection("final-stretch-oblique-weak")}

        return (
          <Funnel text={text} action={action} />
        );
      }

      if (flags.wellRested) {
        const action = () => {goToSection("final-stretch-oblique-strong")}

        return (
          <Funnel text={text} action={action} />
        );
      }

      const action = () => {goToSection("final-stretch-oblique-default")}

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "final-stretch-oblique-bleeding": {
    "text": `
<p>Just as you deem to be far enough to finally head for the islet, a shiver of dread runs through you. Raiahui has just appeared on your right and is rushing toward you!</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `You throw the witch's net at her.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("final-stretch-oblique-bleeding-net");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `You crush your black pearls.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("final-stretch-oblique-bleeding-pearls");
          },
          "conditional": true,
        });
      }

      const deathText = `You swim as fast as you can toward the islet.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        },
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "final-stretch-oblique-bleeding-net": {
    "text": `
<p>Grabbing the net you've tied around your waist, you throw it in Raiahui's direction. Your gesture has little strength and precision, but the witch's net has retained its powers: it spreads out by itself and wraps around your pursuer as she was about to reach you. Raiahui thrashes about wildly, ripping up the tight mesh in order to free herself.</p>

<p>Stealth is now out of the question! You quickly head for the surface, and your head soon emerges above the water.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `You barely take the time to breathe deeply before you start swimming toward the sandy islet as fast as you can.`,
        "final-stretch-straight",
      );
    }
  },
  "final-stretch-oblique-bleeding-pearls": {
    "text": `
<p>You crush all the pearls you carry and a thick, opaque cloud immediately spreads around you. Completely blind, you swim in the general direction of the islet, hoping to escape from the deadly peril you know is so close.</p>

<p>After a few vigorous strokes, you can see your hands again, then the pale color of the sand. Holding your breath is becoming difficult.</p>

<p>The water is now completely clear around you. But instead of heading for the surface, you freeze in terror as you see the sleek shape of Raiahui slowly pass before you. She's some distance away, but she spots you immediately and sharply turns in your direction.</p>

<p>You realize that she was able to stay outside of the opaque cloud. Even though you were temporarily invisible to her, she easily surmised where you were heading and moved to bar your path.</p>

<p>A sudden burst of acceleration propels her in your direction, her half-open mouth revealing her many sharp teeth.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `You throw the witch's net at her.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("final-stretch-oblique-bleeding-net");
          },
          "conditional": true,
        });
      }

      choices.push({
        "text": `You swim as fast as you can toward the islet.`,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end");
        },
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "final-stretch-oblique-dolphin": {
    "text": `
<p>Once you deem to be far enough, you start heading straight for the islet.</p>

<p>You've crossed half the distance when a deep breath of pure air suddenly seems to fill your lungs. The growing temptation to head back to the surface vanishes, and you feel capable of remaining underwater as long as you already have. Around your neck, the dolphin-shaped pendant disintegrates; you surmise that it's just exhausted its remaining powers to help you.</p>

<p>You're very close to the islet when you suddenly see Raiahui's sleek shape appear to your right. She's finally spotted you and is rushing in your direction at great speed!</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Terrified at the thought that she might catch up to you at the last moment, you surface and swim as fast as you can toward the shore.`,
        "final-island",
      );
    }
  },
  "final-stretch-oblique-weak": {
    "text": `
<p>Once you deem to be far enough, you start heading straight for the islet.</p>

<p>You've crossed a bit more than half the distance separating you from it when the burning of your lungs becomes unbearable. You try to swim faster, but it's in vain. You realize you won't be able to hold your breath until you reach the islet.</p>

<p>You quickly head for the surface… and just before you reach it, you suddenly spot Raiahui rushing in your direction at terrifying speed!</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `You throw the witch's net at her.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("final-stretch-oblique-weak-net");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `You crush your black pearls.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("final-stretch-oblique-weak-pearls");
          },
          "conditional": true,
        });
      }

      const deathText = `You swim as fast as you can in a desperate attempt to outdistance her.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        },
      });

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "final-stretch-oblique-weak-net": {
    "text": `
<p>Grabbing the net you've tied around your waist, you throw it in Raiahui's direction. Your gesture has little strength and precision, but the witch's net has retained its powers: it spreads out by itself and wraps around your pursuer as she was about to reach you. Raiahui thrashes about wildly, ripping up the tight mesh in order to free herself.</p>

<p>Stealth is now out of the question!</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Your head emerges above the water; you barely take the time to breathe deeply before you start swimming toward the sandy islet as fast as you can.`,
        "final-island",
      );
    }
  },
  "final-stretch-oblique-weak-pearls": {
    "text": `
<p>You crush all the pearls you carry and a thick, opaque cloud immediately spreads around you. For a brief moment, you find yourself completely blind. Then your head emerges above the surface, and you can again see and breathe.</p>

<p>The area of total darkness spreads spreads widely around you, and you're completely unable to tell where Raiahui is. You can only hope she can't tell where you are either.</p>
    `,
    "next": (goToSection) => {
      const text = `You swim as fast as you can toward the sandy islet.`;
      const action = () => {goToSection("final-island")};

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "final-stretch-oblique-strong": {
    "text": `
<p>Once you deem to be far enough, you start heading straight for the islet.</p>

<p>As you get closer to it, you feel the growing temptation to surface, if only for a moment. But you're an experienced swimmer, used to holding your breath for long periods of time. You stay close to the sandy bottom and keep swimming steadily toward your goal.</p>

<p>You're very close to the islet when you suddenly see Raiahui's sleek shape appear to your right. She's finally spotted you and is rushing in your direction at great speed!</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Terrified at the thought that she might catch up to you at the last moment, you surface and swim as fast as you can toward the shore.`,
        "final-island",
      );
    }
  },
  "final-stretch-oblique-default": {
    "text": `
<p>Once you deem to be far enough, you start heading straight for the islet.</p>

<p>You've crossed a bit more than half the distance separating you from it when the burning of your lungs starts becoming very painful. Can you really hold your breath until you reach the islet?</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `You force yourself to remain underwater until the end.`,
          "action": () => {
            updateFlag("weakened", true);
            goToSection("final-stretch-oblique-default-force");
          },
        },
        {
          "text": `You head for the surface, despite the risks.`,
          "action": () => {goToSection("final-stretch-oblique-default-interrupt")},
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "final-stretch-oblique-default-force": {
    "text": `
<p>You keep swimming vigorously, in spite of the consuming pain in your lungs and the shadows forming before your eyes. Your jaw is tense with the effort it takes to resist your instinctive need to take a breath.</p>

<p>As a red and black mist starts filling your head, you suddenly realize you're now very close to the islet. At the same time, you suddenly see Raiahui's sleek shape appear to your right. She's finally spotted you and is rushing in your direction at great speed!</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Terrified at the thought that she might catch up to you at the last moment, you surface and swim as fast as you can toward the shore.`,
        "final-island",
      );
    }
  },
  "final-stretch-oblique-default-interrupt": {
    "text": `
<p>You quickly head for the surface… and just before you reach it, you suddenly spot Raiahui rushing in your direction at terrifying speed!</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `You throw the witch's net at her.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("final-stretch-oblique-weak-net");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `You crush your black pearls.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("final-stretch-oblique-weak-pearls");
          },
          "conditional": true,
        });
      }

      const deathText = `You desperately attempt to outdistance her.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        },
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "exhausted": {
    "text": `
<p>Panic is no longer sufficient to make you ignore your exhaustion. Your limbs are heavy, you breathe with difficulty, and your strokes are growing ever slower. Casting a fearful glance behind you, you see Raiahui rushing in your direction. You won't be able to reach the islet before she catches up to you! Are you going to fail so close to your goal?</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `You throw the witch's net at her.`,
          "action": () => {
            useItem("net", updateFlag);
            updateFlag("caughtARaiahui", true);
            goToSection("trial-exhausted-net");
          },
          "conditional": true,
        });
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `You crush your black pearls.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("trial-exhausted-pearls");
          },
          "conditional": true,
        });
      }

      choices.push({
        "text": `You desperately attempt to outdistance her.`,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end");
        },
      });

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "trial-exhausted-net": {
    "text": `
<p>You're close to despair when you suddenly remember the net you've tied around your waist. You quickly grab it and you throw it in Raiahui's direction. Your gesture has very little strength, but the witch's net has retained its powers: it spreads out by itself and wraps around your pursuer as she was about to reach you. Raiahui thrashes about wildly, ripping up the tight mesh in order to free herself.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `With a burst of strength, you swim toward the sandy islet as fast as you still can.`,
        "final-island",
      );
    },
  },
  "trial-exhausted-pearls": {
    "text": `
<p>You're close to despair when you suddenly remember the black pearls you carry. You quickly crush them all, without even taking them out of their purse. The water around you immediately becomes utterly dark, hiding you from Raiahui's eyes before she can reach you.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `With a burst of strength, you swim toward the sandy islet as fast as you still can.`,
        "final-island",
      );
    },
  },
  "trial-calabashes": {
    "text": (flags) => {
      return `
<p>Several of the calabashes lying on the beach are already empty, but you easily find one that's still full, and sniff its contents. Palm wine, just like you thought. It's not very strong alcohol, and drinking a small quantity wouldn't affect you much, but it seems unnecessary to take any risk before a race.</p>

<p>Raiahui clearly doesn't share your caution, for you see her drinking quite unrestrainedly among the other adolescents!</p>

${flags.tastedFruit? ``: `<p>You leave the calabash where it is and think about what you should do now.</p>`}
      `;
    },
    "next": preludeNext,
  },
  "trial-brew-fire": {
    "text": (flags) => {
      return `
<p>You easily crush all the red fruits you have left, and mix their juice with the contents of the calabash. Merely tasting one of those fruits was enough to set your throat on fire, so the beverage you're preparing should have some similarities with molten lava. Raiahui will very quickly realize it's not ordinary palm wine, but not before she's swallowed a mouthful or two.</p>

${itemUpdateFeedback(flags.inventory.alcohol.name)}
      `;
    },
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `It's now time to go see your opponent.`,
        "trial-raiahui"
      );
    },
  },
  "raiahui-poisoned": {
    "text": `
<div class="conversation">
<p>"I'm certainly not going to dissuade you from getting drunk," you say, handing your calabash to her. "Here, empty this one too, if you really trust that you'll be able to beat me afterwards!"</p>
</div>

<p>Your challenge causes amused exclamations among the young audience. Raiahui accepts your gift with a supremely confident smile. The though that it might be a trap is clearly the furthest thing from her mind.</p>

<p>Tarrying any longer wouldn't be to your advantage, and you quickly cross the beach. Just as you reach the shore, the hubbub becomes louder and you cast a glance behind you: surrounded by the other adolescents, some of them startled, others mocking her, Raiahui is bent forward and holding her hand against her mouth as if she were about to throw up.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `Now certain that you'll have a comfortable head start, you dive.`;

      return trueStartFunnel(text, goToSection, flags, updateFlag);
    }
  },
  "trial-raiahui-slow": {
    "text": `
<div class="conversation">
<p>"If you're not in any hurry, neither am I," you say, picking up one of the calabashes lying on the sand.</p>
</div>

<p>Raiahui affects indifference, but you can tell that your presence has subtly transformed the mood reigning among the adolescents. Words become sparser, jokes are only half-spoken, laughter remains just as frequent but not quite as loud, repeated glances weave a web of silent communication around you.</p>

<p>A few moments go by. You frequently bring the calabash to your lips and pretend to drink. In truth, you barely ever let a few drops of palm wine reach your throat. The underlying excitement is such that nobody notices your subterfuge.</p>

<p>Raiahui drops her empty calabash on the sand, gives you an inquisitive look, then ostensibly looks for something else to drink. It's now very clear that she doesn't wish to start the race at the same time as you do. You'll have to take the initiative.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [
        {
          "text": `You start the race without waiting any further.`,
          "action": () => {
            cleanInventoryBeforeRace(flags, updateFlag);
            updateFlag("eatenByRaiahui", true);
            goToSection("trial-copypaste-1");
          },
        },
        {
          "text": `You insist that Raiahui start the race at the same time as you do.`,
          "action": () => {
            cleanInventoryBeforeRace(flags, updateFlag);
            updateFlag("eatenByRaiahui", true);
            goToSection("trial-copypaste-2");
          },
        },
        {
          "text": `You pretend you need to relieve yourself, disappear among the trees, and then start the race out of her sight.`,
          "action": () => {
            updateFlag("playedTheFool", true);
            goToSection("trial-bathroom-break");
          },
        },
        {
          "text": `You try to steal the ivory knife hanging from her waist.`,
          "action": () => {
            goToSection("trial-copypaste-3");
          },
        },
      ];

      const alcohol = flags.inventory.alcohol;
      if (alcohol.acquired && !alcohol.used) {
        choices.push({
          "text": `You give her your calabash full of hard liquor.`,
          "action": () => {
            useItem("alcohol", updateFlag);
            goToSection("trial-copypaste-4");
          },
          "conditional": true,
        });
      }

      const calabash = flags.inventory.fieryCalabash;
      if (calabash.acquired && !calabash.used) {
        choices.push({
          "text": `You give her the calabash of palm wine mixed with the juice of the red fruits.`,
          "action": () => {
            useItem("fieryCalabash", updateFlag);
            goToSection("trial-copypaste-5");
          },
          "conditional": true,
        });
      }

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "trial-copypaste-1": {
    "text": `
<p>You don't really understand the reasons for Raiahui's behavior, but why you should you refuse the head start she clearly wants to give you? You leave the group without a word and head for the shore, ignoring the sniggers that follow you. Throwing aside your calabash, you dive into the warm water of the channel. A few vigorous breaststrokes under the surface propel you toward the sandy island. When you come back to the surface, a quick glance behind you reveals that Raiahui's still on the beach, surrounded by the other adolescents. She doesn't even seem to be looking in your direction.</p>

<p>You've covered a fourth of the distance when excited cries reach your ears, coming from the beach. You opponent must have finally started the race. You do little more than increase your pace slightly. Even if Raiahui really is a better swimmer than you are, your head start virtually ensures your victory, as long as you don't exhaust yourself too quickly.</p>

<p>And yet, irrational anxiety is creeping in your mind. From time to time, you cast glances behind you, but you're unable to spot Raiahui, as if she were swimming underwater without ever surfacing. Unable to put a name on your fear, you force the pace earlier than you'd intended, before you've even reached the halfway point.</p>

<p>But an ever-growing foreboding tells you that it changes nothing.</p>

<p>With each stroke, it now seems that the arrival point is getting a bit farther, and that something horrible is getting a bit closer.</p>

<hr/>
    ` + raiahuiGoodEndText,
    "next": endGame,
  },
  "trial-copypaste-2": {
    "text": `
<div class="conversation">
<p>"Enough drinking, it's time to start the race."</p>
<p>"I'm still a bit thirsty," Raiahui says, smiling. "Go ahead, I'll catch up to you."</p>
<p>"I'm not here to play around! If you don't start the race right now, at the same time as I do, then I'm no longer taking part in your rite of passage, and you can just wait for the next outsider!"</p>
</div>

<p>Raiahui looks startled and offended at the same time. She glances at the adolescents around her as though she didn't quite know how to react, then shrugs.</p>

<div class="conversation">
<p>"As you wish, but it's your loss."</p>
</div>

<p>You both head for the shore, followed by all of the young spectators, who seem highly amused by the whole thing. Jokes are being exchanged around you, but you pay little attention to them. Your opponent is ostensibly behaving in a nonchalant manner, and you even see her drink a bit more palm wine from a calabash.</p>

<p>The warm water of the channel close around both of you at the same time, but a few vigorous breaststrokes enable you to get ahead of Raiahui. You know that you'll need to save your strength during the first half of the race, but finding herself behind you right from the start should shake your opponent's self-confidence.</p>

<p>Your head finally emerges above the water and you're nearly deafened by the cries coming from the beach. Raiahui's still underwater, but you don't waste time trying to determine her exact position. Now that the race has started, force of habit makes you focus on nothing but your swimming strokes.</p>

<p>But your concentration only lasts until the next time you take a breath in. Something's wrong. Raiahui still hasn't resurfaced and the cries coming from the beach are reaching a peak of shrill excitement.</p>

<p>Though you don't know why, a chilling foreboding is telling you that you've made a terrible mistake.</p>

<hr/>
    ` + raiahuiGoodEndText,
    "next": endGame,
  },
  "trial-bathroom-break": {
    "text": `
<p>Laughter erupts all around you when, feigning embarrassment, you imply that you need to pass water urgently.</p>

<div class="conversation">
<p>"Got for it," Raiahui says, muffling a snigger. "Don't worry, I won't start the race while you're busy."</p>
</div>

<p>You quickly disappear among the palm trees, followed by the amused eyes of the adolescents. Once you're sure they can no longer see you, you throw away the calabash - still almost full - and run toward a part of the beach that's sufficiently far away. This alternative starting point will barely increase the distance you need to cross to reach the sandy islet that's your goal.</p>

<p>Hidden behind a tree, you cast a quick glance in the direction of the tribe's adolescents. One of them might spot you while you cross the beach, but their unruly merrymaking doesn't make it very likely. You hope that it'll also delay the moment when your opponent realizes that you've been absent for too long.</p>

<p>You take several deep breaths, then leave your hiding place and run toward the shore. The warm, clear water of the channel closes around you. You slide for a moment, carried by the momentum of your dive, then you start swimming. To decrease your chances of being spotted before you have a solid head start, you intend to surface as late as possible.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      return trueStartFunnel(
        `You adopt a moderate pace, in order to save most of your strength for later.`,
        goToSection,
        flags,
        updateFlag,
      );
    }
  },
  "trial-copypaste-3": {
    "text": `
<p>As Raiahui bends down to pick up another calabash, you deftly steal her knife. But she realizes it immediately and amusement vanishes from her eyes.</p>

<div class="conversation">
<p>"Give it back! Give it back right now!"</p>
</div>

<p>Dropping the calabash on the sand, she springs toward you to reclaim the item.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `You throw the knife into the lagoon.`,
          "action": () => {
            cleanInventoryBeforeRace(flags, updateFlag);
            updateFlag("eatenByRaiahui", true);
            goToSection("knife-sea");
          },
        },
        {
          "text": `You throw the knife among the trees close to the beach.`,
          "action": () => {
            goToSection("knife-land");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "trial-copypaste-4": {
    "text": `
<div class="conversation">
<p>"I've had enough to drink," you lie. "Haven't you?"</p>
<p>"Not at all," Raiahui answers with self-assurance. "I know how to hold my liquor."</p>
<p>"Well, I'm certainly not going to dissuade you from getting drunk," you say, handing your calabash to her. "Here, empty this one too, if you really trust that you'll be able to beat me afterwards!"</p>
</div>

<p>Your challenge causes amused exclamations among the young audience. Raiahui accepts your gift with a supremely confident smile. Even if she realizes that this beverage is much stronger than mere palm wine, you suspect that she'll still drink at least most of it to avoid losing face.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      return trueStartFunnel(
        `Letting your opponent drink more than she should, you quickly head for the shore.`,
        goToSection,
        flags,
        updateFlag,
      );
    },
  },
  "trial-copypaste-5": {
    "text": `
<div class="conversation">
<p>"I've had enough to drink," you lie. "Haven't you?"</p>
<p>"Not at all," Raiahui answers with self-assurance. "I know how to hold my liquor."</p>
<p>"Well, I'm certainly not going to dissuade you from getting drunk," you say, handing your calabash to her. "Here, empty this one too, if you really trust that you'll be able to beat me afterwards!"</p>
</div>

<p>Your challenge causes amused exclamations among the young audience. Raiahui accepts your gift with a supremely confident smile. The though that it might be a trap is clearly the furthest thing from her mind.</p>

<p>Tarrying any longer wouldn't be to your advantage, and you quickly cross the beach. Just as you reach the shore, the hubbub becomes louder and you cast a glance behind you: surrounded by the other adolescents, some of them startled, others mocking her, Raiahui is bent forward and holding her hand against her mouth as if she were about to throw up.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      return trueStartFunnel(
        `Now certain that you'll have a comfortable head start, you dive.`,
        goToSection,
        flags,
        updateFlag,
      );
    },
  },
  "trial-hide-closer": {
    "text": `
<p>You take a deep breath and dive again. A few vigorous strokes quickly take you well below the surface. With a sudden burst of hope, you spot a recess in the closest reef, just above the sandy bottom of the channel. You slip inside it and remain as still as possible, surrounded by the many extravagant hues of the coral.</p>

<p>A few moments later, you see Raiahui pass right above you: a dark, sleek shape against the bright surface of the water. You're afraid that she'll suddenly turn in your direction, but she does nothing of the sort and keeps moving forward. Her flexible movements seem almost mockingly slow.</p>

<p>You don't imagine for a moment that she intends to win the race by simply reaching the islet before you do. However, it's possible that she doesn't quite know where you've hidden yourself.</p>

<p>You take a very brief moment to consider the situation. The recess does make you hard to spot, but you'd be easy prey if that didn't prove to be enough, for it's too shallow to put you out of reach of a shark's jaws. To your left, not very far, another coral reef emerges from the sandy bottom; it doesn't have any recesses, but it's just large enough to hide you as long as you keep it between Raiahui and yourself. To your right, a larger reef seems to offer better hiding places, but it's much farther.</p>

<p>Raiahui's pace slows down even more and you fear that it won't be long before she turns back.</p>
    `,
    "next": (goToSection) => {
      const choices = [
        {
          "text": `You cautiously remain in your current hiding place.`,
          "action": () => {goToSection("trial-hide-closer-1")},
        },
        {
          "text": `You leave your hiding place and swim toward the reef to your left.`,
          "action": () => {goToSection("trial-hide-closer-2")},
        },
        {
          "text": `You leave your hiding place and swim as fast as you can toward the reef to your right.`,
          "action": () => {goToSection("trial-hide-closer-3")},
        },
      ];

      return (
        <Crossroads choices={choices} />
      )
    }
  },
  "trial-hide-closer-1": {
    "text": `
<p>A moment later, as you feared, Raiahui turns around and heads back in your direction. She comes very close to the reef and starts circling it. If she knows you're here, you realize that she doesn't need to discover precisely where you're hiding: she can simply wait until the lack of air forces you to head for the surface!</p>

<p>Raiahui circles the reef once… twice… then she leaves your sight and doesn't reappear.</p>

<p>Your stomach knotted with fear, you wonder if you should seize this occasion.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const doll = flags.inventory.doll;
      if (doll.acquired && !doll.used) {
        const text = `Before you can make a decision, something completely unexpected happens.`;
        const action = () => {
          useItem("doll", updateFlag);
          goToSection("trial-hide-closer-1-doll");
        };

        return (
          <Funnel text={text} action={action} />
        );
      }

      let choices = [];

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `You crush your black pearls before leaving your hiding place.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            goToSection("trial-hide-closer-1-pearls");
          },
          "conditional": true,
        });
      }

      choices.push({
        "text": `You remain still.`,
        "action": () => {goToSection("trial-hide-closer-1-still")},
      });
      choices.push({
        "text": `You leave your hiding place and move away as fast as you can.`,
        "action": () => {goToSection("trial-hide-closer-1-fast")},
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "trial-hide-closer-1-doll": {
    "text": `
<p>The figurine you've tied to your waist starts thrashing about wildly. Fearing some witchcraft, you try to get rid of it, but it frees itself and propels itself out of the hiding place. Under your astonished eyes, the creation of the crocodile then grows up and changes color until it becomes a perfect copy of yourself!</p>

<p>Your twin gives you an amused smile, then starts swimming vigorously in the direction of the ocean. She hasn't gotten far when the frightful shape of Raiahui appears above the reef and starts chasing after her. You don't waste any time: propelling yourself out of your hiding place, you start swimming toward the islet as fast as you can.</p>

<p>Casting a glance to the side, you see Raiahui, with a sudden burst of acceleration, catch up to the thing she believes to be her prey. As soon as her sharp teeth close on your strange copy, it disintegrates into dust. That miraculous distraction didn't last very long, but you hope that sheer surprise will cost Raiahui a bit more time.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Unable to hold your breath any longer, you head for the surface.`,
        "surface-close",
      );
    }
  },
  "trial-hide-closer-1-pearls": {
    "text": `
<p>You crush all the pearls you have and a thick, opaque cloud immediately spreads around you. Without waiting any further, you propel yourself out of your hiding place and start swimming in the approximate direction of the islet.</p>

<p>The total darkness only encompasses the area surrounding the reef. After a few vigorous strokes, you can see your own hands again, then the pale sandy bottom. Lack of air is becoming hard to endure.</p>

<p>The water is now completely clear around you. But instead of heading for the surface, you freeze in terror as you see the sleek shape of Raiahui slowly pass before you. She's some distance away, but she spots you immediately and sharply turns in your direction.</p>

<p>You suddenly realize that using the black pearls has only resulted in confirming your position and warning Raiahui of your attempt to escape. She had no trouble remaining outside of the opaque cloud, and though you were temporarily invisible to her, she easily surmised where you were heading and moved to bar your path.</p>

<p>A sudden burst of acceleration propels her in your direction, her half-open mouth revealing her many sharp teeth.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `You throw the witch's net at her.`,
          "action": () => {
            useItem("net", updateFlag);
            goToSection("trial-hide-closer-net");
          },
          "conditional": true,
        })
      }

      const deathText = `You desperately attempt to outdistance her.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        },
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "trial-hide-closer-1-still": {
    "text": `
<p>You remain as motionless as possible. Time goes by and Raiahui still doesn't reappear. Did she really move away from the reef or is it a trap? Lack of air is becoming painful. You can hold your breath for a long time, but you're not a fish!</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `You decide to leave your hiding place.`,
          "action": () => {
            goToSection("trial-hide-closer-1-still-exit");
          },
        },
        {
          "text": `You remain where you are.`,
          "action": () => {
            const dolphin = flags.inventory.dolphin;
            if (dolphin.acquired && !dolphin.used) {
              useItem("dolphin", updateFlag);
              return goToSection("trial-hide-closer-1-still-dolphin");
            }

            updateFlag("weakened", true);
            goToSection("trial-hide-closer-1-still-asphyxia");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "trial-hide-closer-1-still-exit": {
    "text": `
<p>You cautiously slip out of the recess, looking all around you. With a shiver of fear, you suddenly spot Raiahui. But she's moved away, toward the larger reef to your right, and is not looking in your direction.</p>

<p>Realizing you'll get not better chance, you abandon your hiding place for good and swim away as fast as you can.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `You remain underwater as long as possible, but you finally have to head for the surface.`,
        "surface-close",
      );
    }
  },
  "trial-hide-closer-1-still-dolphin": {
    "text": `
<p>A deep breath of pure air suddenly seems to fill your lungs. The growing temptation to head back for the surface vanishes, and you feel capable of remaining underwater as long as you already have. Around your neck, the dolphin-shaped pendant disintegrates; you surmise that it's just exhausted its remaining powers to help you.</p>

<p>Nevertheless, you can't remain in this hiding place forever. After a fairly long while, you decide to leave it. It doesn't take you long to spot Raiahui: she's wandered away toward an area where the reefs are thicker. Your patience has seemingly managed to deceive her, at least for now.</p>

<p>You don't waste any time: abandoning your hiding place for good, you swim vigorously toward the islet.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `The effects of the pendant eventually vanish and you have to head for the surface.`,
        "surface-close",
      );
    }
  },
  "trial-hide-closer-1-still-asphyxia": {
    "text": `
<p>You force yourself to remain in your hiding place, in spite of the consuming pain in your lungs and the shadows forming before your eyes. You put your hand against your mouth to ensure that you won't reflexively try to take a breath.</p>

<p>Time goes by. Red and black mist has filled your head and is becoming ever thicker. Finally, you realize you can no longer wait: you must head for the surface or drown.</p>

<p>You propel yourself out of your hiding place. You can't perceive things very clearly, but Raiahui's nowhere near. You spot something that looks like her some distance away, above an area where the reefs are thicker.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `You head for the surface as fast as you can.`,
        "surface-close",
      );
    }
  },
  "trial-hide-closer-1-fast": {
    "text": `
<p>You propel yourself out of your hiding place. But you've barely taken a stroke when Raiahui suddenly appears just above the coral reef! She was waiting for you!</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      return repeatingFunnel(
        goToSection,
        `A sudden burst of acceleration propels her in your direction before you can do anything.`,
        () => {
          updateFlag("eatenByRaiahui", true);
          return "raiahui-good-end";
        },
      );
    }
  },
  "trial-hide-closer-net": {
    "text": `
<p>Grabbing the net you've tied around your waist, you throw it in Raiahui's direction. Your gesture has little strength and precision, but the witch's net has retained its powers: it spreads out by itself and wraps around your pursuer as she was about to reach you. Raiahui thrashes about wildly, ripping up the tight mesh in order to free herself.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `You swim as fast as you can toward the islet, while also heading back for the surface.`,
        "surface-close",
      );
    }
  },
  "trial-hide-closer-2": {
    "text": `
<p>Your heart beating wildly, you slip out of the recess and swim toward your goal. You reach it just in time: Raiahui's turning around! You hide behind the reef, desperately hoping that she won't spot you.</p>

<p>Narrow spaces between the colorful coral growths let you watch Raiahui as she gets closer. She passes by without seeming to notice you. You see her come very close to the reef where you were previously hiding, then start circling it.</p>

<p>Your instinct tells you there won't be a better occasion; while she's behind the reef, you leave your new hiding place and swim toward the islet, remaining close to the sandy bottom in the hope that it'll make you slightly more difficult to spot.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `You can't hold your breath forever and you eventually have to head for the surface.`,
        "surface-close",
      );
    },
  },
  "trial-hide-closer-3": {
    "text": `
<p>Your heart beating wildly, you slip out of the recess and swim toward your goal as fast as you can. You've crossed half the distance when Raiahui suddenly turns around!</p>

<p>It's immediately clear that she's spotted you: her tail propels her in your direction at a pace much faster than previously. You try to reach the coral reef, hoping it'll provide you with some sort of shelter. But you fearfully realize that you won't reach it in time: Raiahui's now rushing toward you at blinding speed, her half-open mouth revealing her many sharp teeth.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [];

      const net = flags.inventory.net;
      if (net.acquired && !net.used) {
        choices.push({
          "text": `You throw the witch's net at her.`,
          "action": () => {
            useItem("net", updateFlag);
            goToSection("trial-hide-closer-net");
          },
          "conditional": true,
        })
      }

      const pearls = flags.inventory.smokePearls;
      if (pearls.acquired && !pearls.used) {
        choices.push({
          "text": `You crush your black pearls.`,
          "action": () => {
            useItem("smokePearls", updateFlag);
            updateFlag("bleeding", true);
            goToSection("trial-hide-closer-3-pearls");
          },
          "conditional": true,
        })
      }

      const deathText = `You desperately try to outdistance her.`;
      choices.push({
        "text": deathText,
        "action": () => {
          updateFlag("eatenByRaiahui", true);
          goToSection("raiahui-good-end", coatSentence(deathText));
        },
      });

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "trial-hide-closer-3-pearls": {
    "text": `
<p>Just in time, you remember the black pearls you carry. You crush them all without even taking them out of their small purse, and a thick, opaque cloud immediately spreads around you.</p>

<p>Completely blind, you keep swimming forward, hoping to escape from the lethal peril you know is so close. Suddenly, you feel a stinging impact against your thigh! Raiahui didn't manage to bite you, but she's unintentionally hit you with her tail, probably scratching your skin.</p>

<p>As terrified as you are, you're still thinking clearly. You head downward, until you brush against the sandy bottom of the pass, then you start swimming in a completely different direction.</p>

<p>The water clears up as you get farther and farther away from the spot where you've crushed the pearls. You can see your hands again, then the bright surface, then the coral reefs and the islet. You cast a glance behind you: the opaque cloud is stretching and thinning down very slowly, and you can't spot Raiahui.</p>
    `,
    "next": (goToSection) => {
      return repeatingFunnel(
        goToSection,
        `Unable to hold your breath for much longer, you head for the surface.`,
        "surface-close",
      );
    }
  },
  "ending-credits": {
    "text": `
<h1>Within a Circle of Water and Sand</h1>

<img src="${sunsetImage}" class="img-responsive text-img tall left" alt=""/>

${credits}
    `,
    "next": trueEnd,
  },
};

export default trial;
