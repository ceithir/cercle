import React from "react";
import Crossroads from "./../components/Crossroads.js";
import Funnel from "./../components/Funnel.js";
import {useItem, acquireItem, endGame, repeatingFunnel, coatSentence, wentToIsland, itemUpdateFeedback} from "./helpers.js";
import atollMapImg from "./../images/map.jpg";
import AtollMap from "./../components/AtollMap.js";

const timeLimit = 12;

const getIslandNumber = function(island) {
  return island.match(/\w+\-(\d+)/)[1];
}

const computeTripTime = function(currentIsland, newIsland) {
  if (newIsland === currentIsland) {
    return 0;
  }

  return Math.abs(getIslandNumber(currentIsland) - getIslandNumber(newIsland)) % 7 < 2 ? 1 : 2;
}

const emptyFunction = () => {
  return '';
}

const getIslands = function(flags) {
  return [
    {
      "key": "island-2",
      "name": `An island with no real distinguishing feature`,
      "path": "M95 415 C 20 430, 50 560, 145 555 S 140 395, 95 415",
      "harbor": {"x": 165, "y": 485},
      "textPosition": {"x": 180, "y": 475},
      "textAnchor": "left",
      "cross": [65, 430, 180, 540, 145, 425, 75, 540],
      "description": ((flags) => {
        return `
<p>This island, close to the one where you spent the night, has no distinguishing feature.</p>
        `;
      })(flags),
      "disabled": ((flags) => {
        return flags.searchedIsland2;
      })(flags),
      "disabledText": `
You have better things to do with your time than to explore this uninhabited islet again.
      `,
    },
    {
      "key": "island-3",
      "name": flags.toldAboutFaanaruaByVarenui? `Faanarua's island`: `Another very ordinary island`,
      "path": "M20 345 C 20 245, 125 245, 130 345 S 20 405, 20 345",
      "harbor": {"x": 120, "y": 340},
      "textPosition": {"x": 140, "y": 335},
      "textAnchor": "left",
      "cross": [30, 270, 125, 410, 125, 275, 25, 405],
      "description": ((flags) => {
          let text =`
<p>This island is fairly similar to its neighbors, having the same type of relief and vegetation.</p>
          `;

          if (flags.toldAboutFaanaruaByVarenui) {
            text += `
<p class="text-conditional">However, you've been told it's currently inhabited by Faanarua, the only member of the tribe with more than a superficial knowledge of the outside world.
            `;
            if (flags.toldAboutFaanaruaByRaiahui) {
              text += ` Raiahui has also told you about her, describing her as a great hunter and storyteller.`
            }
            text += `</p>`;
          }

          return text;
      })(flags),
      "disabled": ((flags) => {
        return flags.approachedFaanarua;
      })(flags),
      "disabledText": `
It seems unlikely that you could learn anything more by returning to this island.
      `,
    },
    {
      "key": "island-4",
      "name": `The small, isolated islet`,
      "path": "M50 205 C 50 150, 120 170, 125 205 S 50 260, 50 205",
      "harbor": {"x": 115, "y": 220},
      "textPosition": {"x": 135, "y": 215},
      "textAnchor": "left",
      "cross": [60, 175, 105, 235, 120, 175, 45, 235],
      "description": ((flags) => {
        return `
<p>This islet is barely large enough to have vegetation, and said vegetation doesn't rise very high.</p>
        `;
      })(flags),
      "disabled": ((flags) => {
        return flags.toldAboutWitchByMonkey;
      })(flags),
      "disabledText": `
Exploring this islet once was more than enough.
      `,
    },
    {
      "key": "island-5",
      "name": flags.toldAboutAtollByRaiahui? `The island of the witch`: `The strange rock`,
      "path": "M100 80 C 120 0, 210 0, 240 80 S 90 170, 100 80",
      "harbor": {"x": 160, "y": 140},
      "textPosition": {"x": 175, "y": 170},
      "textAnchor": "left",
      "cross": [120, 25, 225, 145, 235, 35, 115, 135],
      "description": ((flags) => {
        let text = `
<p>This island - that Raiahui strongly suggested that you not approach - is strangely different from the others: far from being low and flat, it rises above the waves like a large rock.</p>
        `;
        if (flags.toldAboutAtollByRaiahui) {
          text += ` <p class="text-conditional">Raiahui has mentioned that it's inhabited by a witch.`;
          if (flags.toldAboutWitchByMonkey) {
            text += ` And that assertion was corroborated by a man turned into a monkey, meaning that it's probably true.`;
          }
          text += `</p>`;
        } else if (flags.toldAboutWitchByMonkey) {
          text += ` <p class="text-conditional">The monkey - or rather the man turned into a monkey - living on the neighboring islet has warned you against the witch living on this island.</p>`;
        }

        return text;
      })(flags),
      "disabled": ((flags) => {
        return flags.survivedWitchIsland;
      })(flags),
      "disabledText": `
You have absolutely no intention of going back to this island!
      `,
    },
    {
      "key": "island-6",
      "name": (flags.toldAboutAtollByRaiahui || flags.toldAboutLazyOneByAriinea)? `The island of the Old Sluggard`: `The island covered with trees`,
      "path": "M 360, 50 C 400,-35 640,100 630,145 620,175 580, 210 570, 200 575, 185 475, 115 390, 105 385, 110 355, 80 360, 50 Z",
      "harbor": {"x": 525, "y": 150},
      "textPosition": {"x": 490, "y": 165},
      "textAnchor": "right",
      "cross": [375, 15, 620, 190, 360, 90, 635, 120],
      "description": ((flags) => {
        let text = `
<p>This island looks rather ordinary, aside from the tangle of tall trees that covers it. Raiahui has however strongly suggested that you not approach it.</p>
        `;

        if (flags.toldAboutAtollByRaiahui) {
          text += ` <p class="text-conditional">She mentioned that it's the home of the unwelcoming "Old Sluggard".`;
          if (flags.toldAboutLazyOneByAriinea) {
            text += ` Ariinea and her friend also mentioned that this mysterious individual could be dangerous.`;
          }
          text += `</p>`;
        } else {
          if (flags.toldAboutAtollByRaiahui) {
            text += ` <p class="text-conditional">It's probably the home of the "Old Sluggard" Ariinea told you about. Her friend seemed to believe that he could be truly dangerous.</p>`;
          }
        }

        return text;
      })(flags),
      "disabled": ((flags) => {
        return flags.approchedCrocodile || flags.damagedBoat;
      })(flags),
      "disabledText": `
Approaching this island again is out of the question!
      `,
    },
    {
      "key": "island-7",
      "name": `The islet next to the island of the test`,
      "path": "M595 260 C 605 240, 625 210, 650 250 S 580 290, 595 260",
      "harbor": {"x": 605, "y": 265},
      "textPosition": {"x": 590, "y": 265},
      "textAnchor": "right",
      "cross": [605, 245, 640, 275, 645, 240, 605, 275],
      "description": ((flags) => {
        return `
<p>This islet is nothing more than a tiny stretch of white sand.</p>
        `;
      })(flags),
      "disabled": ((flags) => {
        if (flags.talkedWithFaanarua && !flags.inventory.dolphin.acquired) {
          return false;
        }

        return wentToIsland("island-7", flags);
      })(flags),
      "disabledText": `
Going back to this tiny islet would clearly be pointless.
      `,
    },
    {
      "key": "island-8",
      "name": `The island of the test`,
      "path": "M575 430 C 580 380, 645 365, 650 430 S 575 480, 575 430",
      "harbor": {"x": 580, "y": 430},
      "textPosition": {"x": 560, "y": 430},
      "textAnchor": "right",
      "cross": [585, 405, 645, 450, 650, 405, 580, 450],
      "description": ((flags) => {
        return `
<p>If it weren't the arrival point of the race that'll pit you against Raiahui this evening, there'd be little to say about this stretch of sand, separated from the main island by a channel.</p>
        `;
      })(flags),
      "disabled": ((flags) => {
        return wentToIsland("island-8", flags);
      })(flags),
      "disabledText": `
It'd be pointless to return to this island now. You'll have plenty of time to admire it once you've won this evening's race.
      `,
    },
  ];
}

const getIslandsWithMapMetadata = (flags, currentIsland) => {
  if (!currentIsland) {
    currentIsland = flags.currentIsland;
  }

  return getIslands(flags).concat([
    {
      "key": "island-1",
      "name": `The village`,
      "path": "M 170, 555 C 220, 520 290, 600 330, 580 400, 570 530, 490 540, 475 555, 460 625, 510 615, 520 575, 635 240, 715 150, 620 150, 622 170, 555 170, 555 Z",
      "harbor": {"x": 325, "y": 585},
      "textPosition": {"x": 370, "y": 615},
      "textAnchor": "middle",
      "description": ((flags) => {
          return `
<p>The atoll's main island, where you slept last night. If you go back to it, you're not sure you'll be able to resist its comfortable hammocks.</p>
          `;
      })(flags),
      "disabled": false,
    },
  ]).map(island => Object.assign(
    {},
    island,
    {
      "current": island.key === currentIsland,
      "disabled": island.disabled,
    },
  ));
}

const getIslandWithMapMetadata = (islandKey, flags) => {
  return getIslandsWithMapMetadata(flags).filter(island => islandKey === island.key)[0];
}

const moveToIsland = function(newIsland, goToSection, flags, updateFlag, extraLog = "") {
  const currentIsland = flags.currentIsland;

  let tripTime = computeTripTime(currentIsland, newIsland);
  if (flags.damagedBoat && tripTime > 0) {
    tripTime += 1;
  }
  const newTime = flags.time + tripTime;

  updateFlag("time", newTime);

  if (newTime >= timeLimit) {
    return goToSection("no-more-time-at-sea", extraLog);
  }

  updateFlag("currentIsland", newIsland);
  updateFlag("visitedIslands", flags.visitedIslands.slice().concat([newIsland]));

  const islands = getIslandsWithMapMetadata(flags, newIsland);
  const from = islands.filter(island => currentIsland === island.key)[0];
  const to = islands.filter(island => newIsland === island.key)[0];
  const course = flags.course.concat([[
    from["harbor"]["x"],
    from["harbor"]["y"],
    to["harbor"]["x"],
    to["harbor"]["y"],
  ]]);
  updateFlag("course", course);

  goToSection(newIsland, extraLog);
}

const getIslandChoice = function(island, goToSection, flags, updateFlag, extraLog = "") {
  return {
    "text": island.name+".",
    "action": () => {
      updateFlag("targetIsland", island.key);
      goToSection("island-confirm", extraLog);
    },
  };
}

const getOtherChoices = function(goToSection, flags, updateFlag, extraLog = "") {
  let otherChoices = [
    {
      "text": `Return to the village and rest.`,
      "action": () => {
        moveToIsland("island-1", goToSection, flags, updateFlag, extraLog);
      },
    },
    {
      "text": `Leave the lagoon.`,
      "action": () => {
        updateFlag("time", flags.time+1);
        updateFlag("hesitationCounter", flags.hesitationCounter+1);
        goToSection("exit", extraLog);
      },
    },
  ];

  const alcohol = flags.inventory.alcohol;
  if (alcohol.acquired && !alcohol.used) {
    otherChoices.push({
      "text": `Taste the contents of the calabash.`,
      "action": () => {
        useItem("alcohol", updateFlag);
        updateFlag("drunk", true);
        updateFlag("time", flags.time+1);
        goToSection("drink", extraLog);
      },
      "conditional": true,
    });
  }

  const pearls = flags.inventory.pearls;
  if (pearls.acquired && !pearls.used) {
    otherChoices.push({
      "text": `Examine the mysterious pearls.`,
      "action": () => {
        useItem("pearls", updateFlag);
        acquireItem("smokePearls", updateFlag);
        goToSection("look-at-pearls", extraLog);
      },
      "conditional": true,
    });
  }

  if (flags.talkedWithFaanarua && !flags.inventory.dolphin.acquired) {
    otherChoices.push({
      "text": `Look for the amulet Faanarua told you about.`,
      "action": () => {
        moveToIsland("island-7", goToSection, flags, updateFlag, extraLog);
      },
      "conditional": true,
    });
  }

  return otherChoices;
}

const getIslandMap = (goToSection, flags, updateFlag, extraLog = "") => {
  const islands = getIslandsWithMapMetadata(flags).map(island => Object.assign(
    {},
    island,
    {
      "onClick": () => {
        updateFlag("targetIsland", island.key);
        goToSection(`island-confirm`, extraLog);
      },
    },
  ));

  return (
    <AtollMap mapImg={atollMapImg} islands={islands} course={flags.course} />
  );
}

const getIslandChoices = function(goToSection, flags, updateFlag, extraLog = "") {
  const currentIsland = flags.currentIsland;
  const alreadyVisitedIslands = flags.visitedIslands;

  const islands = getIslands(flags).filter(function(island) {
    return -1 === alreadyVisitedIslands.indexOf(island.key);
  });

  const nearIslands = islands.filter(function(island) {
    return 1 === computeTripTime(currentIsland, island.key);
  });

  const farIslands = islands.filter(function(island) {
    return 2 === computeTripTime(currentIsland, island.key);
  });

  const nearText = `Right now, you're close to:`;
  const nearChoices = nearIslands.map(function(island) {
    return getIslandChoice(island, goToSection, flags, updateFlag, extraLog);
  });

  let farText = `You can head directly for one of the more distant islands:`;
  if (0 === nearChoices.length) {
    farText = `You've already visited the islands close to this one, but you could head for:`;
  }
  const farChoices = farIslands.map(function(island) {
    return getIslandChoice(island, goToSection, flags, updateFlag, extraLog);
  });

  const otherText = `You could also pause your exploration and…`;
  const otherChoices = getOtherChoices(goToSection, flags, updateFlag, extraLog);

  return (
    <div>
      {getIslandMap(goToSection, flags, updateFlag, extraLog)}
      {nearChoices.length > 0 && <Crossroads context={nearText} choices={nearChoices} />}
      {farChoices.length > 0 && <Crossroads context={farText} choices={farChoices} />}
      <Crossroads context={otherText} choices={otherChoices} />
    </div>
  );
};

const timeDescription = (time) => {
  switch(time) {
    case 0:
    case 1:
    case 2:
      return `The sun is still low, the day is only beginning.`;
    case 3:
    case 4:
    case 5:
      return `The sun keeps rising toward its zenith.`;
    case 6:
    case 7:
      return `The sun is approximately at its zenith.`;
    case 8:
    case 9:
      return `The sun is still shining bright, but has begun its descent in the sky.`;
    default:
      return `The sun is slowly descending toward the horizon, the evening is now close.`;
  }
}

const hub = {
  "hub": {
    "text": (flags) => {
      let faanaruaIsland = ``;
      if (flags.toldAboutFaanaruaByVarenui) {
        faanaruaIsland += `<p class="text-conditional">You've been told this is where you might find Faanarua, the only member of the tribe with more than a superficial knowledge of the outside world.`;
        if (flags.toldAboutFaanaruaByRaiahui) {
          faanaruaIsland += ` Raiahui has also told you about her, describing her as a great hunter and storyteller.`
        }
        faanaruaIsland += `</p>`;
      }

      let witchIslandDescription = `<p>The first one is strangely different from the others: far from being low and flat, it rises above the waves like a large rock.`;
      if (flags.toldAboutAtollByRaiahui) {
        witchIslandDescription += ` <span class="text-conditional">Raiahui has told you it is inhabited by a witch.</span>`;
      }
      witchIslandDescription += `</p>`;

      let crocodileIslandDescription = `<p>The second one is more ordinary, and its main distinguishing feature seems to be that it's covered by a tangle of tall trees.`;
      if (flags.toldAboutAtollByRaiahui) {
        crocodileIslandDescription += ` <span class="text-conditional">Raiahui has mentioned that it's the home of the unwelcoming "Old Sluggard".</span>`;
        if (flags.toldAboutLazyOneByAriinea) {
            crocodileIslandDescription += ` <span class="text-conditional">Ariinea and her friend have also mentioned that this mysterious individual could be dangerous.</span>`;
        }
      } else {
        if (flags.toldAboutLazyOneByAriinea) {
          crocodileIslandDescription += ` <span class="text-conditional">It's probably the home of the "Old Sluggard" Ariinea told you about. Her friend has strongly suggested that you not approach it, as she believes the mysterious individual could be truly dangerous. </span>`;
        }
      }
      crocodileIslandDescription += `</p>`;

      return `
<p>Standing next to your canoe, you examine your situation.</p>

<p>The atoll has eight islands of varied sizes.</p>

<p>The island where you currently are - and where the village is located - is at the southern extremity. It's clearly the largest island of the atoll; its thin, curved shape somewhat reminds you of a bow.</p>

<p>Starting from where you are and going clockwise (you've never actually seen a clock, but you've heard vague descriptions of such objects), you then have two islands that look rather similar: medium-sized and covered with many palm trees.</p>

${faanaruaIsland}

<p>Then, to the north-west, a much smaller island with low vegetation.</p>

<p>Then the two islands Raiahui has strongly suggested that you not approach.</p>

${witchIslandDescription}

${crocodileIslandDescription}

<p>Then, somewhere between east and north-east, an island that's nothing more than a tiny stretch of white sand.</p>

<p>The next island is very similar, though slightly larger; it will be the arrival point of the race pitting you against Raiahui.</p>

<p>Only tiny waves agitate the surface of the lagoon, promising easy navigation. You could probably have a look at most of these islands and be back in time for the race.</p>
      `;
    },
    "next": function(goToSection, flags, updateFlag) {
      return getIslandChoices(goToSection, flags, updateFlag);
    }
  },
  "back-to-hub": {
    "text": (flags) => {
      if (flags.time >= timeLimit) {
        return `
<p>A surprise awaits you as you return to your canoe: a young boy from the tribe is in the water, not very far from the shore.</p>

<div class="conversation">
<p>"Mananuiva!" he shouts. "I've been sent to fetch you: the race is going to begin."</p>
</div>

<p>You glance at the sun's position: you haven't paid close attention to the passage of time, but the afternoon is indeed about to end.</p>

<p>You get in your canoe and tell the boy - who you notice is carrying his curved ivory knife - to sit before you. Then, plunging your paddle into the water, you head for the island where the tribe lives.</p>
        `;
      }

      return `
<p>You go back to your canoe, and take a moment to think about your next destination.</p>

<p class="text-conditional">${timeDescription(flags.time)}</p>
      `;
    },
    "next": function(goToSection, flags, updateFlag) {
      if (flags.time >= timeLimit) {
        const text = `Once you're back to the very beach you departed from this morning, you leave your canoe and follow your young guide to the place from where the race will start.`;
        const action = () => {
          if (flags.visitedIslands.length > 0 && "island-6" === flags.visitedIslands[flags.visitedIslands.length-1]) {
            updateFlag("aVillagerOnCrocodileIsland", true);
          }
          return "trial";
        };

        return repeatingFunnel(goToSection, text, action);
      }

      return getIslandChoices(goToSection, flags, updateFlag, emptyFunction);
    }
  },
  "drink": {
    "text": `
<p>You uncork the calabash and a strong smell immediately fills your nostrils. At first, you only take a cautious sip, though it's enough to almost burn your palate. The taste, acrid and intense, is unlike any beverage you've experienced. After a few more sips, however, you begin to get used to it and even to find it enjoyable. Soon enough, you've emptied the entire calabash.</p>

<p>You seldom drink alcohol, and you're completely unfamiliar with the effects of such hard liquor. But you're about to discover them quite brutally: your balance dissolves into uncontrollable swaying, the colors surrounding you merge together, and a terrible pressure seemingly threatens to burst your head open.</p>

<p>Nauseous, freezing yet burning up at the same time, you no longer have any intention of exploring the atoll. The only thing you desire is to return to the village and rest.</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const text = `You start paddling in that direction, as best you can.`;
      const action = () => {
        moveToIsland("island-1", goToSection, flags, updateFlag);
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "no-more-time-at-sea" : {
    "text": `
<p>You're paddling steadily, aiming for your next destination, when a splashing sound draws your attention: not far from your canoe, the head of a young boy from the tribe has just emerged above the water.</p>

<div class="conversation">
<p>"Mananuiva!" he shouts. "I've been sent to fetch you: the race is going to begin."</p>
</div>

<p>You stop your canoe and glance at the sun's position: you haven't paid close attention to the passage of time, but the afternoon is indeed about to end.</p>

<p>You help the boy - who's you notice is carrying his curved ivory knife - climb aboard your canoe, then you head toward the island where the tribe lives.</p>
    `,
    "next": function(goToSection) {
      const text = `Once you're back to the very beach you departed from this morning, you leave your canoe and follow your young guide to the place from where the race will start.`;
      const action = "trial";

      return repeatingFunnel(goToSection, text, action);
    }
  },
  "exit": {
    "text": (flags) => {
      if (flags.hesitationCounter >= 2) {
        return `
<p>You head for the closest channel and cross it, paddling steadily. It doesn't reveal anything new regarding the neighboring islands, but once again, you have a clear view of the barrier reef, and the foamy line separating the atoll from the immensity of the ocean.</p>
        `;
      }

      return `
<p>You enter one the channels that separate the islands of the atoll. You keep a close eye on the water under your canoe, wary of coral reefs that might reach close to the surface, but you don't encounter any problem. Soon enough, you've left the lagoon and find yourself at the edge of the ocean, where the waves are a bit taller and the wind a bit stronger.</p>

<p>Your view of the atoll is a lot more limited than it was inside the lagoon, and you observe nothing new.</p>

<p>Finding yourself at the boundary between the tiny world of the atoll and the countless destinations that exist elsewhere, you hesitate.</p>
      `;
    },
    "next": function (goToSection, flags, updateFlag) {
      const backText = `You go back to the lagoon and pick a new destination.`;

      const choices = [
        {
          "text": backText,
          "action": () => {
            const extraLog = coatSentence(backText);

            if (flags.time >= timeLimit) {
              return goToSection("no-more-time-at-sea", extraLog);
            }

            goToSection("back-to-hub", extraLog);
          },
        },
        {
          "text": `You decide to give up on the race and leave the atoll.`,
          "action": () => {
            updateFlag("triedToFlee", true);
            goToSection("out-of-here");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "out-of-here": {
    "text": `
<p>Paddling steadily, you leave the atoll behind you, your eyes turned toward the horizon. Already, you're thinking about the next islands that you'll visit. You feel certain that one of them will hold a clue that'll bring you closer to what you're looking for.</p>

<p>Lost in your thoughts, you suddenly hear a splashing sound right next to you, and horrifying pain pierces through your arm. You're brutally pulled out of your canoe and into the water, that closes over your head.</p>

<p>Once that flurry of movements has ended, the surface of the water quickly becomes calm again. Deprived of momentum, your canoe is floating idly. Around it, the reflection of the sun on the waves is slowly turning to sparkling rubies.</p>
    `,
    "next": endGame,
  },
  "island-1": {
    "text": `
<p>The outskirts of the village are more animated than when you left, but the difference isn't exactly considerable. You see several members of the tribe, who give you nods, but Raiahui's nowhere to be seen.</p>

<p>You quickly get back to your hammock - or another one just like it - and settle in it for a nap.</p>
    `,
    "next": (goToSection, flags, updateFlag) => {
      const text = `You close your eyes, just for a moment.`;
      const action = () => {
        if (!flags.drunk && flags.time <= 9) {
          updateFlag("wellRested", true);
        }
        if (flags.drunk && flags.time <= 8) {
          updateFlag("drunk", false);
          updateFlag("refreshed", true);
        }

        goToSection("rest");
      };

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "rest": {
    "text": (flags) => {
      let statusComment = `<p class="text-conditional">You wouldn't have minded sleeping a bit longer.</p>`;

      if (flags.drunk) {
        statusComment = `<p class="text-conditional">Unfortunately, this short rest wasn't enough for you to overcome the effects of alcohol, and you're still feeling weak. You can only hope that the excitement of the race and the seawater slapping against your face will help you pull through.</p>`;
      }

      if (flags.refreshed) {
        statusComment = `<p class="text-conditional">The nausea caused by your consumption of alcohol has dissipated. You feel ready.</p>`;
      }

      if (flags.wellRested) {
        statusComment = `<p class="text-conditional">This nap has set you back to rights. You feel in great shape, ready for anything.</p>`;
      }

      return `
<p>The sun has significantly dropped toward the horizon when a young boy comes to shake you out of the drowsiness you'd slipped into.</p>

<div class="conversation">
<p>"Mananuiva, you need to come, the race is going to begin!"</p>
</div>

<p>Opening your eyes, you leave your hammock with some regret and stretch a bit.</p>

${statusComment}
      `;
    },
    "next": (goToSection) => {
      const text = `You follow your young guide.`;
      const action = () => {goToSection("trial")};

      return (
        <Funnel text={text} action={action} />
      );
    },
  },
  "look-at-pearls": {
    "text": (flags) => {
      return `
<p>The pearls were not produced by shellfish, at least not by any kind of shellfish you know of. They feel strange: uneven, rough, mineral. And they crumble easily between your fingers, producing dust darker than a moonless night.</p>

<p>As you wash your hand, you notice the water becoming nearly opaque around your fingers. You decide to check what would happen if you immersed one of the pearls completely.</p>

<p>At first, not much. Thin wisps of smoke, barely visible, seem to emanate from the pearl. You scratch it a bit, and the smoke becomes thicker and darker. Finally, you crush the pearl completely and it creates a large underwater cloud, blocking light entirely.</p>

<p>The weak currents of the lagoon have a hard time dispersing the result of your experiment. For a time, your canoe finds itself at the center of a shadowy puddle. It doesn’t seem to be dangerous, but its darkness is impenetrable.</p>

${itemUpdateFeedback(flags.inventory.pearls.name)}

<p>You cautiously put away the remaining pearls. Quite an interesting find. Surely you can find a good use for them.</p>
      `;
    },
    "next": (goToSection) => {
      const text = `For now, you have other decisions to make.`;
      const action = () => {goToSection("back-to-hub")};

      return (
        <Funnel text={text} action={action} />
      );
    }
  },
  "island-confirm": {
    "text": (flags) => {
      return getIslandWithMapMetadata(flags.targetIsland, flags)["description"];
    },
    "next": (goToSection, flags, updateFlag) => {
      const island = getIslandWithMapMetadata(flags.targetIsland, flags);

      if (island.current && "island-1" !== island.key) {
        const text = `You're there.`;
        const action = () => {
          goToSection("back-to-hub", emptyFunction);
        };

        return (
          <Funnel text={text} action={action} />
        );
      }

      if (island.disabled) {
        const text = island.disabledText;
        const action = () => {
          goToSection("back-to-hub", emptyFunction);
        };

        return (
          <Funnel text={text} action={action} />
        );
      }

      const isOnStartingIslandAndWantToStayThere = island.current && "island-1" === island.key;

      const choices = [
        {
          "text": !isOnStartingIslandAndWantToStayThere? `You head in this direction.`: `A good nap seems to be the most pleasant way to begin the day.`,
          "action": () => {
            moveToIsland(flags.targetIsland, goToSection, flags, updateFlag, emptyFunction);
          },
        },
        {
          "text": `You consider your other options.`,
          "action": () => {
            goToSection("back-to-hub", emptyFunction);
          }
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  },
}

export default hub;
