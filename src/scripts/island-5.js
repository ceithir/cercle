import React from "react";
import Crossroads from "./../components/Crossroads.js";
import Funnel from "./../components/Funnel.js";
import {endGame, useItem, acquireItem, coatSentence, repeatingFunnel, secondTimeToIsland, itemAcquisitionFeedback} from "./helpers.js";
import witchImage from "./../images/witch.jpg";

const escapeTheWitch = (goToSection, flags, updateFlag) => {
  const choices = [
    {
      "text": `You get past her and flee through the door.`,
      "action": () => {
        updateFlag("caughtInAWitchNet", true);
        goToSection("witch-thief-doomed-escape");
      },
    },
    {
      "text": `You escape through the round window in the opposite wall.`,
      "action": () => {
        goToSection("witch-window-escape");
      },
    },
  ];

  return (
    <Crossroads choices={choices} />
  );
};

const sneakingIntoIslandText = `
<p>If there’s anything of interest on this island, it seems likely that it’ll be found in the hut at the top. But the many fetishes set on the slopes are worrying: you remember stories about sorcerers creating enchanted statues to keep watch for intruders.</p>

<p>Casting a cautious glance upward, you deem it possible to reach the top without exposing yourself to the motionless eyes of the fetishes. The vegetation of the island is not very high, but it’s dense enough.</p>

<p>Putting your plan into action, you start crawling among the bushes. Your progress is slow, but you seem to remain unnoticed by anyone or anything.</p>

<p>The route you follow is fairly roundabout. At one point, it brings you right behind one of the fetishes. You warily examine the strange symbols carved into the wood. The statue is completely still, but you can’t get rid of the impression that it’s about to come to life and turn in your direction.</p>
`;

const sneakingIntoIslandCrossroads = (goToSection, flags, updateFlag) => {
  const choices = [
    {
      "text": `You push the fetish in order to make it fall over.`,
      "action": () => {
        goToSection("witch-fetish-embrace");
      },
    },
    {
      "text": `You ignore it and keep moving slowly toward the top.`,
      "action": () => {
        if (flags.swumUnderWitchIsland) {
          acquireItem("pearls", updateFlag);
          goToSection("witch-master-thief");
        } else {
          goToSection("witch-poor-thief");
        }
      },
    },
  ];

  return (
    <Crossroads choices={choices} />
  );
};

const ascensionText = `
<p>Crawling patiently, you finally reach the top of the island. The hut is but a few steps away, completely silent. Is it really empty? It’s impossible to see the inside from where you are.</p>
`;

const island5 = {
  "island-5": {
    "text": (flags) => {
      if (secondTimeToIsland("island-5", flags)) {
        return `
<p>The dark wood statues still stand guard silently on the slopes of the island. The figure you thought you spotted near the round hut at the top is nowhere to be seen.</p>
        `;
      }

      return `
<p>From up close, the island looks even more different from the rest of the atoll. Its curiously even slopes are covered with fairly low vegetation and studded with dark wood statues. Only half your height, the statues remind you of certain types of fetishes that you’ve observed on other islands. The impassive characters they represent are all looking outward.</p>

<p>At the top of the island is a large round hut, and you glimpse a figure that seems to be entering it.</p>
      `;
    },
    "next": function(goToSection, flags, updateFlag) {
      const leaveText = `You decide against visiting this island.`;

      const choices = [
        {
          "text": `You land normally and head straight for the hut.`,
          "action": () => {
            updateFlag("friendlyWithWitch", true);
            goToSection("witch-bold-approach");
          },
        },
        {
          "text": `You land in a discret spot and try to avoid being noticed.`,
          "action": () => {
            goToSection("witch-sneaky-approach");
          },
        },
        {
          "text": `You anchor your canoe where it is and swim underwater to reach the island.`,
          "action": () => {
            updateFlag("swumUnderWitchIsland", true);
            goToSection("witch-underwater-approach");
          },
        },
        {
          "text": leaveText,
          "action": () => {
            goToSection("back-to-hub", coatSentence(leaveText));
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "witch-bold-approach": {
    "text": `
<p>The shore is stony, but you manage to land without too much trouble. Then you climb the slope under the impassive eyes of the many fetishes. Just before you reach the hut, a fat woman wrapped in a purple pareo suddenly comes out of it. Her short hair is bristling like spines and, from her head to her ankles, she wears many splendid pieces of golden jewelry. Tied around her waist, you observe a half-full bag, a grey fishing net and a small metal knife. She’s holding a cup full of a clear beverage.</p>

<img src="${witchImage}" class="img-responsive text-img tall left" alt=""/>

<div class="conversation">
<p>“A visitor!" she exclaims in a delighted voice. "How nice! It’s been such a long time…”</p>
</div>

<p>Her accent is unlike any you’ve ever heard. She holds out the cup so suddenly that its contents almost splash your face and, before you can even say a word, she adds:</p>
<div class="conversation">
<p>“We must celebrate! It’s tradition!”</p>
</div>
    `,
    "next": (goToSection, flags, updateFlag) => {
      let choices = [
        {
          "text": `You drink the beverage.`,
          "action": () => {
            updateFlag("drunkAtTheWitchCup", true);
            goToSection("witch-drink");
          },
        },
      ];

      const alcohol = flags.inventory.alcohol;
      if (alcohol.acquired && !alcohol.used) {
        choices.push({
          "text": `You offer her the calabash of hard liquor you carry.`,
          "action": () => {
            useItem("alcohol", updateFlag);
            goToSection("witch-my-alcohol");
          },
          "conditional": true,
        });
      }

      choices.push({
        "text": `You decide to flee.`,
        "action": () => {
          updateFlag("caughtInAWitchNet", true);
          goToSection("witch-doomed-escape");
        }
      });

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "witch-sneaky-approach": {
    "text":`
<p>Paddling along the shore at a good distance, you finally spot an area where the vegetation is a bit denser and the fetishes are a bit fewer. You head for it. The shore is stony, but you manage to land without too much trouble. You then hide your canoe as best you can.</p>
    ` + sneakingIntoIslandText,
    "next": sneakingIntoIslandCrossroads,
  },
  "witch-underwater-approach": {
    "text":`
<p>The lagoon is fairly shallow around here, and the coral reefs offer plenty of holds for your rudimentary anchor. That being taken care of, you take a deep breath and dive into the warm water.</p>

<p>You swim vigorously, but without undue haste. You often fished for shellfish when you were younger, and you’re used to holding your breath for long periods of time.</p>

<p>As you get closer to your goal, you’re surprised to notice that the water is no longer clear, and becomes nearly opaque below you. Surmising it to be one of the island’s peculiarities, you keep swimming without letting it fluster you. A bit later, you surface very close to the stony shore. Quickly getting out of the water, you hide behind a thick bush.</p>
    ` + sneakingIntoIslandText,
    "next": sneakingIntoIslandCrossroads,
  },
  "witch-fetish-embrace": {
    "text":`
<p>Sharp pain pierces your arm when you touch the statue, and all the fetishes of the island cry out stridently. Frightened and almost deafened, you give up on stealth, stand up and run toward the shore. Casting a glance behind you, you see a wide figure coming out of the hut, but the unknown person is fortunately too far to be able to stop you. You quickly get back to your canoe and move away from the island.</p>

<p>The pain has passed, but now that you’re no longer in a panic, you notice that your arm has become somewhat numb. Hopefully, it’s just a temporary effet.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `You patiently massage your arm until it has recovered all of its sensitivity before you set out again.`;
      const action = () => {
        updateFlag("time", flags.time+1);
        return "back-to-hub";
      };

      return repeatingFunnel(
        goToSection,
        text,
        action,
      );
    },
  },
  "witch-drink": {
    "text": `
<p>The clear beverage is nearly tasteless, but as soon as it goes through your throat, your limbs start feeling terribly heavy. The fat woman laughs, but you can barely even hear her anymore: everything around you is moving away at great speed. You lose consciousness before your body even hits the ground.</p>

<p>The witch won’t kill you, and she’ll even release you after a while. But what you’ll suffer in her hands before that will make it impossible for you to pursue any quest.</p>`,
    "next": endGame,
  },
  "witch-my-alcohol": {
    "text": `
<div class="conversation">
<p>“I’m very grateful for your welcome!" you answer warmly. "And, to honor tradition, I’d also like to present you with an excellent drink!”</p>
</div>

<p>The fat woman seems disconcerted by your offer. After giving you the cup – that you have absolutely no intention of drinking – she nevertheless accepts the calabash you’re holding out to her. Uncorking it, she takes a sniff, and a wide smile immediately appears on her face. Forgetting everything else, she brings the calabash to her mouth and starts guzzling the alcoholic beverage.</p>
    `,
    "next": (goToSection) => {
      const sneakText = `You seize this occasion to slip into the hut.`;

      const choices = [
        {
          "text": `You seize this occasion to run away.`,
          "action": () => {
            goToSection("witch-drunk-escape");
          },
        },
        {
          "text": sneakText,
          "action": () => {
            goToSection("in-the-witch-house", coatSentence(sneakText));
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "in-the-witch-house": {
    "text": `
<p>The inside of the hut is full of an incredible clutter of weird objects, tied to the walls, hanging from the ceiling, scattered on the wooden furniture or lying on the floor. But you don’t have time to examine them all, far from it! An angry exclamation reaches your ears and you can hear the fat woman coming closer.</p>

<div class="conversation">
<p>“Nasty little thief! You’re about to get what you deserve!”</p>
</div>

<p>Pressed for time, unable to guess what could be of use to you, you look at the items lying on the closest table.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const feathers = `a decorative headdress made of yellow and red feathers`;
      const scepter = `a sinister-looking scepter carved from a bone as white as chalk`;
      const pearls = `a handful of perfectly black pearls`;

      const feathersAction = () => {
        goToSection("witch-feathers")
      };
      const scepterAction = () => {
        updateFlag("touchedACursedItem", true);
        goToSection("witch-sceptre");
      };
      const pearlsAction = () => {
        acquireItem("pearls", updateFlag);
        goToSection("witch-pearls");
      };

      const cap = (string) => {
        return string.charAt(0).toUpperCase() + string.substr(1) + ".";
      };

      const choices = [
        {
          "text": cap(feathers),
          "action": feathersAction,
        },
        {
          "text": cap(scepter),
          "action": scepterAction,
        },
        {
          "text": cap(pearls),
          "action": pearlsAction,
        }
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "witch-feathers": {
    "text": `
<p>The feathers disintegrate between your fingers. You don’t have time to make another choice: the fat woman has entered the hut and is heading straight for you, shouting threats.</p>
    `,
    "next": escapeTheWitch,
  },
  "witch-pearls": {
    "text": (flags) => {
      return `
<p>You grab the pearls. You don’t have time to steal anything else: the fat woman has entered the hut and is heading straight for you, shouting threats.</p>

${itemAcquisitionFeedback(flags.inventory.pearls.name)}
      `;
    },
    "next": escapeTheWitch,
  },
  "witch-sceptre": {
    "text": `
<p>Chilling pain erupts in your body as soon as you grab the bone scepter. All strength immediately deserts your limbs and you fall to the ground, feeling close to fainting.</p>

<p>Breathing with difficulty, unable to move a finger, you see the fat woman come closer and crouch next to you.</p>

<div class="conversation">
<p>“That’s what happens when you touch something without knowing what it is,” she says, grabbing your chin between her thick fingers. “But since you’re interested in witchcraft, I’m going to take plenty of time to show you what it can do.”</p>
</div>

<p>The witch won’t kill you, and she’ll even release you after a while. But what you’ll suffer in her hands before that will make it impossible for you to pursue any quest.</p>
    `,
    "next": endGame,
  },
  "witch-window-escape": {
    "text": `
<p>You run toward the window. The fat woman chases after you, but you’re much faster and more agile. It takes you but an instant to slip out of the hut through that improvised exit.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `You then run down toward the shore, eager to leave this island.`;
      const action = () => {
        updateFlag("time", flags.time+1);
        updateFlag("survivedWitchIsland", true);
        return "back-to-hub";
      };

      return repeatingFunnel(
        goToSection,
        text,
        action
      );
    }
  },
  "witch-doomed-escape": {
    "text": `
<p>You turn and start running down the slope, but you’ve only crossed a short distance when the fat woman’s grey net flies through the air and wraps around you, making you suddenly fall to the ground. You try to disentangle yourself from it, but it holds you tight, like an insect caught in a spider’s web.</p>

<p>Barely able to move, you see the fat woman come closer and crouch next to you.</p>

<div class="conversation">
<p>“What a nice catch,” she says, grabbing your chin between her thick fingers. “I’m sure she’ll keep me occupied for quite a few days.”</p>
</div>

<p>The witch won’t kill you, and she’ll even release you after a while. But what you’ll suffer in her hands before that will make it impossible for you to pursue any quest.</p>
    `,
    "next": endGame,
  },
  "witch-thief-doomed-escape": {
    "text": `
<p>You deftly dodge the hands trying to grab you, rush out of the hut and start running down the slope. But you’ve only crossed a short distance when the fat woman’s grey net flies through the air and wraps around you, making you suddenly fall to the ground. You try to disentangle yourself from it, but it holds you tight, like an insect caught in a spider’s web.</p>

<p> Barely able to move, you see the fat woman come closer and crouch next to you.</p>

<div class="conversation">
<p>“I always have plenty of ideas to experiment on the people I catch,” she says, grabbing your chin between her thick fingers. “But for a little thief like you, I’ll put in extra effort.”</p>
</div>

<p>The witch won’t kill you, and she’ll even release you after a while. But what you’ll suffer in her hands before that will make it impossible for you to pursue any quest.</p>
    `,
    "next": endGame,
  },
  "witch-master-thief": {
    "text": (flags) => {
      return ascensionText + `
<p>You’re about to leave your hiding place when a fat woman wrapped in a purple pareo appears a short distance away. Her short hair is bristling like spines and, from her head to her ankles, she wears many splendid pieces of golden jewelry. Tied around her waist, you observe a half-full bag, a grey fishing net and a small metal knife.</p>

<p>You’re relieved to notice that she seems completely unaware of the presence of an outsider on her island. Before long, she wanders away. Feeling bold, you wait until she’s disappeared, then noiselessly head for the hut and slip inside.</p>

<p>An incredible clutter of weird objects immediately greets your eyes; they’re tied to the walls, hanging from the ceiling, scattered on the wooden furniture or lying on the floor. You examine them, but make sure not to touch anything. Many of the objects give off an extremely disquieting impression.</p>

<p>You’re looking at a handful of perfectly black pearls when you suddenly hear the sound of steps. The fat woman is already coming back! Finding yourself unable to continue your search, you decide to just grab the black pearls, as they’ve piqued your interest.</p>

${itemAcquisitionFeedback(flags.inventory.pearls.name)}
      `;
    } ,
    "next": (goToSection, flags, updateFlag) => {
      const text = `The fat woman is now but a few steps away from the hut. `;

      const doll = flags.inventory.doll;
      if (doll.acquired && !doll.used) {
        const action = () => {
          useItem("doll", updateFlag);
          acquireItem("net", updateFlag);
          goToSection("witch-versus-root");
        };

        return (
          <Funnel text={text} action={action} conditional={true} />
        );
      }

      const action = () => {
        goToSection("witch-thief-honeypot");
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "witch-thief-honeypot": {
    "text": `
<p>The fat woman enters the hut and immediately spots you.</p>

<div class="conversation">
<p>“Nasty little thief!” she spits. “How did you get here?”</p>
</div>

<p>She heads straight for you, shouting threats.</p>
    `,
    "next": escapeTheWitch,
  },
  "witch-poor-thief": {
    "text": ascensionText + `
<p>You cautiously approach the hut’s entrance. A quick glance inside reveals that it’s indeed empty. You’re about to enter when the sound of steps makes you turn: a fat woman wrapped in a purple pareo is heading back toward the hut. Her short hair is bristling like spines and, from her head to her ankles, she wears many splendid pieces of golden jewelry. Tied around her waist, you observe a half-full bag, a grey fishing net and a small metal knife. It’s too late to get back to your hiding place: she’s seen you.</p>

<div class="conversation">
<p>“Well, well,” she says in an unfriendly voice. “I was looking for the intruder and I find her on my doorstep…”</p>
</div>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const inText = `You rush inside the hut.`;
      const choices = [
        {
          "text": inText,
          "action": () => {
            goToSection("in-the-witch-house", coatSentence(inText));
          },
        },
        {
          "text": `You run down the slope toward the shore.`,
          "action": () => {
            updateFlag("caughtInAWitchNet", true);
            goToSection("witch-doomed-escape");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "witch-versus-root": {
    "text": (flags) => {
      return `
<p>As you look around for a way to escape, the limbs of the wooden figurine suddenly start quivering. Under your astonished eyes, the creation of the crocodile stands on its legs, then grows up and changes color until it becomes a perfect copy of yourself!</p>

<p>Your twin gives you an amused smile, then springs out of the hut right under the fat woman’s nose. The woman is only surprised for a moment, then she grabs the grey net tied to her waist and throws it after the intruder. Peering through the hut’s entrance, you see the net fly through the air with perfect precision and tightly wrap itself around your copy. Trapped, the figurine immediately returns to its original shape, then crumbles to dust. Seizing the occasion, you rush out of the hut under the astonished eyes of the fat woman, grab the net, and flee as fast as you can until you’ve returned to your canoe.</p>

${itemAcquisitionFeedback(flags.inventory.net.name)}
      `;
    },
    "next": (goToSection, flags, updateFlag) => {
      const text = `You quickly move away from the island.`;
      const action = () => {
        updateFlag("time", flags.time+1);
        updateFlag("survivedWitchIsland", true);
        return "back-to-hub";
      };

      return repeatingFunnel(
        goToSection,
        text,
        action,
      );
    },
  },
  "witch-drunk-escape": {
    "text": `
<p>You run down the slope as fast as you can. Behind you, the fat woman is yelling angrily, but you escape from her sight by slipping behind a thick bush.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const doll = flags.inventory.doll;
      if (doll.acquired && !doll.used) {
        const text = `Just before you can resume your flight, something completely unexpected happens.`;
        const action = () => {
          useItem("doll", updateFlag);
          acquireItem("net", updateFlag);
          goToSection("witch-versus-root-alt");
        };

        return (
          <Funnel text={text} action={action} conditional={true} />
        );
      }

      const text = `You resume your flight without wasting any time, get back to your canoe, and quickly move away from the island.`;
      const action = () => {
        updateFlag("time", flags.time+1);
        updateFlag("survivedWitchIsland", true);
        return "back-to-hub";
      };

      return repeatingFunnel(
        goToSection,
        text,
        action,
      );
    }
  },
  "witch-versus-root-alt": {
    "text": (flags) => {
      return `
<p>As you were about to resume running toward the shore, the limbs of the wooden figurine suddenly start quivering. Under your astonished eyes, the creation of the crocodile stands on its legs, then grows up and changes color until it becomes a perfect copy of yourself!</p>

<p>Your twin gives you an amused smile, then springs out from behind the bush and starts running in plain sight of the fat woman. A moment later, you see the woman’s grey net fly through the air with perfect precision and tightly wraps itself around your copy. Trapped, the figurine immediately returns to its original shape, then crumbles to dust. Seizing the occasion, you run toward the net and grab it, then resume your flight. It doesn’t take you long to get back to your canoe.</p>

${itemAcquisitionFeedback(flags.inventory.net.name)}
      `;
    },
    "next": (goToSection, flags, updateFlag) => {
      const text = `You quickly move away from the island.`;
      const action = () => {
        updateFlag("time", flags.time+1);
        updateFlag("survivedWitchIsland", true);
        return "back-to-hub";
      };

      return repeatingFunnel(
        goToSection,
        text,
        action,
      );
    },
  },
}

export default island5;
