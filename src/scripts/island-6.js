import React from "react";
import Crossroads from "./../components/Crossroads.js";
import {endGame, acquireItem, coatSentence, repeatingFunnel, repeatingCrossroad, secondTimeToIsland, itemAcquisitionFeedback} from "./helpers.js";
import crocodileImage from "./../images/crocodile.jpg";

const crocodileLastWords = `
<p>As you run away, a guttural laugh echoes loudly behind you.</p>

<div class="conversation">
<p>"You can’t blame me for trying, appetizing human girl!" the crocodile shouts. "But I’ll give you a real piece of advice, so you can humiliate that thieving tribe. Find some of the red fruits that grow on this island and take them with you. If you taste one of them just before your race, it may give you a chance to win. You’ll also need cunning, but that’s not so easily acquired!"</p>
</div>

<p>You barely slow down, even after his voice has disappeared behind you. Just before you reach your canoe, you notice a few shrubs bearing red fruits. They must be what the crocodile was referring to, but can you trust him this time? </p>
`;

const crocodileLastCrossroads = (goToSection, flags, updateFlag) => {
  const choices = [
    {
      "text": `You take a moment to pick a handful of those red fruits.`,
      "action": () => {
        acquireItem("fruit", updateFlag);
        return "gather-fruits";
      },
    },
    {
      "text": `You leave this dangerous island immediately.`,
      "action": () => {
        updateFlag("time", flags.time+1);
        return "back-to-hub";
      },
    },
  ];

  return repeatingCrossroad(
    goToSection,
    choices
  );
};

const singOrDie = (goToSection, flags, updateFlag) => {
  const songText = `You try to hum the same tune.`;

  const choices = [
    {
      "text": `You listen to the crocodile.`,
      "action": () => {
        updateFlag("eatenByCrocodile", true);
        goToSection("crocodile-song");
      },
    },
    {
      "text": songText,
      "action": () => {
        goToSection("crocodile-chorus", coatSentence(songText));
      },
    },
    {
      "text": `Suspecting a trap, you decide to run away.`,
      "action": () => {
        goToSection("crocodile-siren");
      },
    },
  ];

  return (
    <Crossroads choices={choices} />
  );
};

const island6 = {
  "island-6": {
    "text": (flags) => {
      if (flags.encounteredCrocodileAtSea) {
        return `
<p>Your paddle strokes become more hesitant as you come close to the shore, smothered under the mangrove trees. You now know the peril that exists on this island.</p>
        `;
      }

      if (secondTimeToIsland("island-6", flags)) {
        return `
<p>Buried under the roots of the mangrove trees, the island doesn’t seem to have changed in the slightest since the previous time you approached it.</p>
        `;
      }

      return `
<p>This island is covered by a multitude of mangrove trees, their entangled roots hiding the ground from your eyes. Here and there, tiny beaches have managed not to be smothered. The island is fairly large – though not as much as the one where the village is located – and its heart is completely hidden by the vegetation.</p>
      `;
    },
    "next": (goToSection, flags, updateFlag) => {
      if (flags.encounteredCrocodileAtSea) {
        const choices = [
          {
            "text": `You decide to go back to the island, despite the risk.`,
            "action": () => {
              return "island-6-take-two";
            },
          },
          {
            "text": `You deem it wiser to choose another destination.`,
            "action": () => {
              return "back-to-hub";
            },
          },
        ];

        return repeatingCrossroad(
          goToSection,
          choices
        );
      }

      const leaveText = `You’d rather choose another destination.`;

      const choices = [
        {
          "text": `You land on one of the stretches of sand and start exploring on foot.`,
          "action": () => {
            goToSection("exploring-island-6");
          },
        },
        {
          "text": `You paddle along the shore of the island.`,
          "action": () => {
            updateFlag("encounteredCrocodileAtSea", true);
            goToSection("observing-island-6");
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
  "exploring-island-6": {
    "text": `
<p>You land on a very small beach and head straight for the heart of the island. The roots cover the ground like a thick spider web, and walking is not easy: several times, you almost lose your balance. As you get farther from the shore, the trees become larger, but you’re still unable to notice any sign of animal life. The silence – that you found relaxing at first – is now beginning to feel somewhat oppressive.</p>

<p>Time goes by and you fail to discover anything of interest, eventually getting tired of this fruitless exploration. It seems increasingly unlikely that anything on this island could be of any use to you. Not quite certain that you’d manage to retrace your steps, you decide to simply head for the lagoon, and then walk along the shore until you find your canoe. A few short moments are enough for you to reach one of the small beaches of the island, surrounded and nearly choked by countless tree roots.</p>

<p>Your blood freezes in your veins. Lying on the sand, just before you, is a crocodile four times your size.</p>

<p>The beast is still as a fallen tree. It seems lifeless. You’re about to run away as fast as you can when a guttural voice suddenly makes itself heard:</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `"Wait."`;
      const action = () => {
        updateFlag("approchedCrocodile", true);
        return "crocodile";
      };

      return repeatingFunnel(
        goToSection,
        text,
        action
      );
    }
  },
  "observing-island-6": {
    "text": `
<p>In the shade of the mangrove trees, you paddle along the shore. The entire island seems to be slumbering, undisturbed by any birdsong. The general stillness slowly gives you the impression that nothing here is able to move. And for that reason, you fail to notice the island’s only inhabitant as early as you could have.</p>

<p>Your blood freezes in your veins. Lying on a stretch of sand surrounded by thick tree roots, so close that two paddle strokes would be enough for you to reach it, is a crocodile four times your size.</p>

<p>It’s perfectly still and you can’t tell if its eyes are open.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `You quickly paddle away.`,
          "action": () => {
            goToSection("crocodile-swift-paddling");
          },
        },
        {
          "text": `You paddle away as silently as possible.`,
          "action": () => {
            updateFlag("damagedBoat", true);
            goToSection("crocodile-quiet-paddling");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "crocodile-swift-paddling": {
    "text": `
<p>Sharply turning your canoe toward the center of the lagoon, you paddle with all your strength to get away from that armored monster. Only after a long moment do you finally dare to stop, nearly out of breath. Looking behind you, you see that the crocodile is still lying in the exact same spot, as motionless as a fallen tree.</p>

<p>You now know the peril of this island.</p>
    `,
    "next": (goToSection) => {
      const choices = [
        {
          "text": `You return to the island, despite the risk.`,
          "action": () => {
            return "island-6-take-two";
          },
        },
        {
          "text": `You deem it wiser to choose a different destination.`,
          "action": () => {
            return "back-to-hub";
          },
        },
      ];

      return repeatingCrossroad(
        goToSection,
        choices
      );
    },
  },
  "crocodile-quiet-paddling": {
    "text": `
<p>Plunging your paddle into the water without a sound, you slowly turn your canoe toward the center of the lagoon, your muscles tense with fear. But the crocodile, until then as motionless as a fallen tree, abruptly springs into action, rushing toward you with a great splashing sound! Terrified, you start paddling with all your strength, but the huge reptile has already reached your canoe.</p>

<img src="${crocodileImage}" class="img-responsive text-img" alt=""/>

<p>A brutal impact nearly makes you fall into the water when the beast’s powerful jaws close on your outrigger. The crocodile tries to use this hold to overturn the canoe, but does so with such violence that it completely tears off the outrigger. You desperately seize this chance to escape, paddling quicker than you ever have in your entire life, until you feel ready to faint.</p>

<p>When you finally stop, your heart banging wildly in your chest, a glance behind you reveals that the monster hasn’t given chase. Still in shock after seeing death up close, it takes you a moment to even feel relieved.</p>

<p>Once you’ve pulled yourself together, you decide to head for a different island. But the loss of its outrigger makes your canoe much less stable. You’ll have to paddle more cautiously, and that will slow you down.</p>
    `,
    "next": (goToSection) => {
      const text = `You decide to choose a less dangerous destination.`;
      const action = () => "back-to-hub";

      return repeatingFunnel(
        goToSection,
        text,
        action,
      );
    },
  },
  "island-6-take-two": {
    "text": `
<p>You make sure to land on a beach far from the one where you spotted the huge crocodile. Then you cautiously start exploring the island.</p>

<p>The roots cover the ground like a thick spider web, and walking is not easy; several times, you almost lose your balance. As you get farther from the shore, the trees become larger, but you’re still unable to notice any sign of animal life. Far from being relaxing, the silence soon feels oppressive.</p>

<p>Time goes by, you fail to discover anything of interest, and you start feeling nervous. What if the crocodile has left its beach and is now lying in wait close to your canoe? You’d find yourself trapped!</p>

<p>You decide you’ve stayed long enough on this island, where there’s obviously nothing that could be of any use to you. But before you leave, you want to make sure that the crocodile is still where you saw it. It’s clearly a risk, but it scares you less than not knowing for sure the position of that monster.</p>

<p>With extreme caution, you head for the beach where the crocodile was lying, ready to flee at the slightest scare. Your heart is banging violently in your chest and your fear keeps growing. As you’re about to run back to your canoe, the stretch of sand suddenly appears just before you.</p>

<p>The crocodile has remained in the same spot, still as a statue. It seems lifeless. Having confirmed its position, you’re about to slip away discreetly, but a guttural voice makes itself heard:</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `"Wait."`;
      const action = () => {
        updateFlag("approchedCrocodile", true);
        return "crocodile";
      };

      return repeatingFunnel(
        goToSection,
        text,
        action
      );
    },
  },
  "crocodile": {
    "text": `
<p>The heavy, armored body of the crocodile hasn’t lost its ponderous stillness, but his head has moved a little and his yellow eyes are now watching you. The voice that comes out of his slightly open mouth is rough and growling at the same time, making the words almost difficult to understand:</p>

<div class="conversation">
<p>"Have no fear, I won’t hurt you. On the contrary, I want to help you. Come a bit closer, so we can talk; I don’t perceive human voices very clearly."</p>
</div>

<p>Most of your tribe’s legends feature animals gifted with intelligence and speech. You’ve sometimes daydreamed about meeting such a creature. But you didn’t expect it to happen this way!</p>

<p>Your astonishment doesn’t make you any less cautious, however.</p>

<p>You’re four strides away from the crocodile.</p>
    `,
    "next": (goToSection) => {
      const unmovingText = `You remain exactly where you are.`;

      const choices = [
        {
          "text": `You get closer – very slightly closer – to him.`,
          "action": () => {
            goToSection("crocodile-closer");
          },
        },
        {
          "text": unmovingText,
          "action": () => {
            goToSection("crocodile-close-enough", coatSentence(unmovingText));
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "crocodile-closer": {
    "text": `
<p>You take a cautious step forward, ready to flee at any moment. But the enormous body of the crocodile remains as motionless as the sand it’s lying on.</p>

<div class="conversation">
<p>"Good, you’ve learned not to trust appearances. I genuinely want to help you, and you do need help. Now think: what do you want to know?"</p>
</div>
    `,
    "next": (goToSection) => {
      const choices = [
        {
          "text": `You ask him about the race that’ll pit you against Raiahui.`,
          "action": () => {
            goToSection("crocodile-trial");
          },
        },
        {
          "text": `You ask him about the tribe.`,
          "action": () => {
            goToSection("crocodile-bitterness");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "crocodile-bitterness": {
    "text": `
<div class="conversation">
<p>"Those thieves… I was the only master of the atoll before their miserable tribe decided to settle here. Now, the only things I have left are this island and a small part of the lagoon where I can hunt. But I’m patient, I can wait for many seasons… One day, they’ll learn that I possess many secrets and hidden powers, but it’ll be too late!"</p>
</div>

<p>It’s difficult to recognize emotions expressed in such an inhuman voice, but the bitter, vengeful resentment of the reptile is nevertheless unmistakable.</p>
    `,
    "next": (goToSection) => {
      const choices = [
        {
          "text": `You ask him for a demonstration of the powers he claims to possess.`,
          "action": () => {
            return "crocodile-power";
          },
        },
        {
          "text": `You ask him if he can help you win your race against Raiahui.`,
          "action": () => {
            return "crocodile-help";
          },
        },
      ];

      return repeatingCrossroad(
        goToSection,
        choices
      );
    },
  },
  "crocodile-power": {
    "text": `
<div class="conversation">
<p>"Maybe you doubt the truth of my words?" the crocodile says. "You’re still young and ignorant. I’ll show you what I can do."</p>
</div>

<p>His huge body starts moving. You tense, frightened, but he’s not heading in your direction. His powerful jaws close on a nearby root and tear off part of it. The crocodile seemingly gnaw on the thick piece of wood for a while, then he turns back toward you and spits it on the sand.</p>

<div class="conversation">
<p>"Look! Here’s one of my powers!"</p>
</div>

<p>Its stay in the crocodile’s mouth has strangely altered this piece of wood: it now looks like a human-shaped figurine. And, though it’s very rough and has little detail, you’re suddenly struck with the weird conviction that it represents you. You stare at it with growing fascination.</p>

<div class="conversation">
<p>"You like it, don’t you?" the crocodile says, almost whispering. "And it would be extremely useful to you. Come and take it… Come… Come closer…"</p>
</div>

<p>The desire to possess the figurine now dominates your mind, and you’re ready to risk death to obtain it. But, though you’re unable to resist this enthallment, your common sense isn’t completely numb. You realize that the crocodile’s actions have no other purpose than to make a meal out of you.</p>

<p>The figurine is halfway between you. A long branch, thick as your calf, lies on the ground next to you.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `You pick up the branch and use it to keep the crocodile away.`,
          "action": () => {
            updateFlag("eatenByCrocodile", true);
            goToSection("crocodile-branch");
          },
        },
        {
          "text": `You try to distract the crocodile by pretending to catch sight of a member of the tribe he hates so much.`,
          "action": () => {
            acquireItem("doll", updateFlag);
            goToSection("crocodile-look-out");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "crocodile-branch": {
    "text": `
<p>You quickly walk toward the figurine, holding the branch before you like a spear. The crocodile remains still until you bend down to pick up the figurine. Then he rushes toward you with terrifying suddenness. His frightful jaws close on the branch and violently rip it out of your hands, making you lose your balance and fall. You try to get up, but it’s too late: though he seldom moves, the crocodile is capable of great speed when it comes to catching a prey. For the first time in many years, he’s about to feast on human flesh.</p>
    `,
    "next": endGame,
  },
  "crocodile-look-out": {
    "text": (flags) => {
      return `
<div class="conversation">
<p>"It seems I no longer have the time," you say, gesturing toward the lagoon. "I see someone coming, probably to tell me that the race is going to begin. I’ll have to… </p>
</div>

<p>Your lie works beyond your hopes: with astonishing speed, the huge beast turns to face the imaginary newcomer, opening its frightful jaws as threateningly as possible.</p>

<p>You immediately seize this wonderful opportunity : by the time the monster realizes he’s been tricked, you’ve reached the figurine and grabbed it, and you’re now running away as fast as you can, making sure not to stumble on one of the countless roots. He furiously chases after you, but you easily outdistance him.</p>

<p>A few moments later, as you get back to your canoe, you take the time to examine the rough figurine. The spell that made you crave for it has now dissipated, but your intuition tells you it might really be useful.</p>

${itemAcquisitionFeedback(flags.inventory.doll.name)}
      `;
    },
    "next": (goToSection, flags, updateFlag) => {
      const text = `You leave the island.`;
      const action = () => {
        updateFlag("time", flags.time+1);
        return "back-to-hub";
      };

      return repeatingFunnel(
        goToSection,
        text,
        action
      );
    },
  },
  "crocodile-help": {
    "text":`
<div class="conversation">
<p>"I have to take part in the rite of passage of a young woman from the tribe," you tell the huge reptile. "Do you anything that could help me? If I win, it’ll humble the entire tribe."</p>
</p>

<p>The crocodile reflects for a while before answering:</p>
<div class="conversation">
<p>"Do not fool yourself: as far as your opponent is concerned, that race is a formality more than it is a real trial. The traditions of that bastard tribe have no other purpose than to remind them of their supposed superiority. Once the race has begun, know that you’ll only stand a chance if you show cunning and alertness. But I want to help you humiliate those thieves. Listen well, I’ll reveal one of my secrets to you…"</p>
</div>

<p>Out of his mouth comes a strange sound, very deep, halfway between a growl and a song. Its rhythm, different from any music you know, is strangely mesmerizing.</p>
    `,
    "next": singOrDie,
  },
  "crocodile-song": {
    "text": `
<p>The haunting sound infiltrates your entire mind, smothering your instinct and paralyzing your thoughts. Soon enough, you’re completely motionless and staring at nothing. Then the crocodile stops singing and, lifting his heavy body from the sand, slowly approaches you, who remain unaware. He feels great satisfaction, for it has been many years since he last had the occasion to devour a human being. You will snap out of the enthrallment in a moment, but it’ll be much too late then.</p>
    `,
    "next": endGame,
  },
  "crocodile-siren": {
    "text": `
<p>You turn to flee. The sound stops immediately and the crocodile rushes toward you with startling suddenness, its mouth wide open! Fortunately, you’ve already moved, and the frightful jaws close on empty air. You run away as fast as you can among the trees, without ever looking back.</p>
    ` + crocodileLastWords,
    "next": crocodileLastCrossroads,
  },
  "crocodile-close-enough": {
    "text": `
<p>A halting, raucous laugh comes out of the reptile’s powerful mouth.</p>
<div class="conversation">
<p>"So distrustful! I guess appearances are against me. Yet you have many other reasons to worry. Do you want me to share my wisdom with you anyway?</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `You ask him about the race that will pit you against Raiahui.`,
          "action": () => {
            return "crocodile-trial";
          },
        },
        {
          "text": `You ask him about the tribe.`,
          "action": () => {
            return "crocodile-angry";
          },
        },
      ];

      return repeatingCrossroad(
        goToSection,
        choices
      );
    }
  },
  "crocodile-angry": {
    "text": `
<div class="conversation">
<p>"I hate those miserable thieves," the crocodile hisses angrily. "I was the only master of the atoll before their bastard tribe decided to settle here. Now, the only things I have left are this island and a small part of the lagoon where I can hunt. But I’m patient, and I have many secrets that despicable tribe doesn’t know of. Listen well, I’ll share one of them with you, it’ll be useful…"</p>
</div>

<p> Out of his mouth comes a strange sound, very deep, halfway between a growl and a song. Its rhythm, different from any music you know, is strangely mesmerizing.</p>
    `,
    "next": singOrDie,
  },
  "crocodile-trial": {
    "text": `
<div class="conversation">
<p>"Do not fool yourself: the arrogant members of that bastard tribe don’t think that you stand any chance of winning their traditional race. As far as they’re concerned, it’s merely a formality, not a real trial. But I’d like to humiliate those thieves by helping you win. Look among the roots of the tree next to you, there’s an object that would serve you well."</p>
</div>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const noText = `You refrain from doing so, suspecting a trap.`;

      const choices = [
        {
          "text": `You follow his advice.`,
          "action": () => {
            goToSection("crocodile-tree");
          },
        },
        {
          "text": noText,
          "action": () => {
            goToSection("crocodile-unmasked", coatSentence(noText));
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "crocodile-tree": {
    "text": `
<p>The roots of the tree in question are inextricably tangled. You bend down to search for the object.</p>
<p>The crocodile rushes toward you with startling suddenness, its mouth wide open! Taken by surprise, you barely have time to react.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": `You jump backward.`,
          "action": () => {
            updateFlag("eatenByCrocodile", true);
            goToSection("crocodile-meal");
          },
        },
        {
          "text": `You jump to the side.`,
          "action": () => {
            goToSection("crocodile-escape");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "crocodile-meal": {
    "text": `
<p>You evade the powerful jaws, but only for a brief moment. As you jump backward, your foot hits one the countless roots covering the ground, and you fall down abruptly. The huge crocodile, eager for a meal he wasn’t counting on, won’t give you a chance to get up.</p>
    `,
    "next": endGame,
  },
  "crocodile-escape": {
    "text": `
<p>You reflexively jump to the side, just in time for the powerful jaws to close on empty air. You roll on the ground, bruising your arms and your back against the thick roots. Spurred on by terror, you get up almost immediately and run away as fast as you can. The beach is already far behind you when you remember to breathe.</p>
    ` + crocodileLastWords,
    "next": crocodileLastCrossroads,
  },
  "crocodile-unmasked": {
    "text": `
<p>The crocodile rushes toward you with startling suddenness, its mouth wide open! Fortunately, you’ve remained on your guard and you flee before he can reach you.</p>
    ` + crocodileLastWords,
    "next": crocodileLastCrossroads,
  },
  "crocodile-chorus": {
    "text": `
<p>You do your best, but your ear is unable to understand the strange rhythm, just like your human voice is unable to produce such low notes. Out of instinct, you nevertheless keep humming, covering the haunting sound that was infiltrating your mind, imitating the crocodile’s song more and more poorly.</p>

<p>The crocodile suddenly stops and so do you, staggering as though you were feeling faint.</p>

<div class="conversation">
<p>"Enough singing. Watch now."</p>
</div>

<p> His huge body starts moving. You tense, frightened, but he’s not heading in your direction. His powerful jaws close on a nearby root and tear off part of it. The crocodile seemingly gnaw on the thick piece of wood for a while, then he turns back toward you and spits it on the sand.</p>

<div class="conversation">
<p>"Look! Here’s one of my powers!"</p>
</div>

<p> Its stay in the crocodile’s mouth has strangely altered this piece of wood: it now looks like a human-shaped figurine. And, though it’s very rough and has little detail, you’re suddenly struck with the weird conviction that it represents you. You stare at it with growing fascination.</p>

<div class="conversation">
<p>"You like it, don’t you?" the crocodile says, almost whispering. "And it would be extremely useful to you. Come and take it… Come… Come closer…"</p>
</div>

<p> The desire to possess the figurine now dominates your mind, and you’re ready to risk death to obtain it. But, though you’re unable to resist this enthallment, your common sense isn’t completely numb. You realize that the crocodile’s actions have no other purpose than to make a meal out of you.</p>

<p> The figurine is halfway between you. A long branch, thick as your calf, lies on the ground next to you.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const choices = [
        {
          "text": ` You pick up the branch and use it to keep the crocodile away.`,
          "action": () => {
            updateFlag("eatenByCrocodile", true);
            goToSection("crocodile-branch");
          },
        },
        {
          "text": ` You try to distract the crocodile by pretending to catch sight of a member of the tribe he hates so much.`,
          "action": () => {
            acquireItem("doll", updateFlag);
            goToSection("crocodile-look-out");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
  "gather-fruits": {
    "text": (flags) => {
      return `
<p>Touching the fruits doesn’t harm you in any way. Of course, that doesn’t tell you whether eating them would be safe.</p>

${itemAcquisitionFeedback(flags.inventory.fruit.name)}
      `;
    },
    "next": (goToSection, flags, updateFlag) => {
      return repeatingFunnel(
        goToSection,
        `It’s more than time to leave this island.`,
        () => {
          updateFlag("time", flags.time+1);
          return "back-to-hub";
        },
      );
    },
  },
}

export default island6;
