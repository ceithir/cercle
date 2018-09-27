import React from "react";
import Crossroads from "./../components/Crossroads.js";
import raiahuiIntroImage from "./../images/raiahui-intro.jpg";
import feastImage from "./../images/feast.jpg";
import {repeatingFunnel, coatSentence} from "./helpers";

const noRepeatedAction = function(flagName, actions, goToSection, flags, updateFlag, logFunc) {
  if (!logFunc) {
    logFunc = () => "";
  }

  const choice = function(key, text, extraFlag) {
    return {
      "text": text,
      "action": () => {
        let actions = flags[flagName].slice();
        actions.push(key);
        updateFlag(flagName, actions);
        if (extraFlag) {
          updateFlag(extraFlag, true);
        }

        return goToSection(key, logFunc(text));
      },
    };
  }

  return actions.filter(function(action){
      return -1 === flags[flagName].indexOf(action.key);
    }).map(function(action){
      return choice(action.key, action.text, action.flag);
    });
}

const arrivalActions = function(goToSection, flags, updateFlag) {
  return noRepeatedAction(
    "arrivalActions",
    [
      {
        "key": "visit",
        "text": `You visit the village.`,
        "flag": "toldAboutFaanaruaByRaiahui",
      },
      {
        "key": "repair",
        "text": `You spend time on the maintenance of your canoe.`,
      },
      {
        "key": "raiahui-trial",
        "text": `You ask Raiahui about her rite of passage.`,
      },
      {
        "key": "raiahui-atoll",
        "text": `You ask Raiahui to describe the atoll to you.`,
        "flag": "toldAboutAtollByRaiahui",
      },
    ],
    goToSection,
    flags,
    updateFlag,
  );
}

const arrivalNext = function(goToSection, flags, updateFlag) {
  if (flags.arrivalActions.length <= 1) {
    return (
      <Crossroads choices={arrivalActions(goToSection, flags, updateFlag)} />
    );
  }

  return repeatingFunnel(
    goToSection,
    `The feast is now about to begin.`,
    "feast",
  );
}

const feastActions = function(goToSection, flags, updateFlag, transitionText) {
  return noRepeatedAction(
    "feastActions",
    [
      {
        "key": "feast-chief",
        "text": `The chieftain Ataroa.`,
      },
      {
        "key": "feast-men",
        "text": `The men.`,
      },
      {
        "key": "feast-women",
        "text": `The women.`,
        "flag": "toldAboutLazyOneByAriinea",
      },
      {
        "key": "feast-boys",
        "text": `The male adolescents.`,
        "flag": "toldAboutFaanaruaByVarenui",
      },
      {
        "key": "feast-girls",
        "text": `The female adolescents.`,
        "flag": "watchedKnifeImportance",
      },
    ],
    goToSection,
    flags,
    updateFlag,
    text => {
        if (!transitionText) {
          transitionText = `<p>You could spend time talking with <span class="transition-sentence">{text}</span>.</p>`;
        }

        return transitionText.replace("{text}", text.charAt(0).toLowerCase() + text.slice(1, -1));
    },
  );
}

const feastNext = function(goToSection, flags, updateFlag) {
  if (flags.feastActions.length <= 1) {
    const transitionText = `<p>You talk a while longer, then politely take your leave and approach <span class="transition-sentence">{text}</span>.</p>`

    return (
      <div>
        <p>{`You talk a while longer, then politely take your leave and approach other people:`}</p>
        <Crossroads choices={feastActions(goToSection, flags, updateFlag, transitionText)} />
      </div>
    );
  }

  return repeatingFunnel(
    goToSection,
    `You talk a while longer. Around you, the feast is slowly petering out.`,
    "night"
  );
}

const intro = {
  "prelude": {
    "text":
`
<p>You paddle steadily, not thinking or dreaming about anything, focused only on the purely physical sensations provided by the shift of your muscles, the moist air filling your nostrils and the burning touch of the sun on your naked back. Your small outrigger canoe creates short-lived, insignificant trails on the surface of the immense ocean, barely disturbing its peaceful waves. Above your head, the birds are dots in the azure sky, tiny yet clearly visible. Watching their flight is what made you suspect the existence of an island in this direction. Your guess was confirmed around midday, when the island's flat outline became visible against the horizon. If you judge the distance correctly, you should reach it long before sunset.</p>

<p>As you get closer, and the pale line of a beach appears between the dark blue of the water and the green vividness of the trees, your mind leaves its state of detachment and considers the near future. Will the island turn out to be inhabited? Ever since you left behind you the small part of the archipelago you were familiar with, you've often made stopovers in completely deserted places. You weren't used to such solitude before you embarked on this journey, and though it hasn't turned out to be as unpleasant as you might have thought, it becomes wearisome when it remains uninterrupted for too long.</p>

<p>Whether the island is inhabited or not, it will give you the opportunity to restock your supplies, currently limited to a small quantity of yam and sweet potatoes, along with a few bananas. A freshwater spring would also be welcome: one of your two waterskins is completely empty. And if you can stay for a while, repairing or replacing some of your tools wouldn't be luxury: your bone knife is now quite dull and you recently broke the handle of your stone hatchet. Ideally, you'd find the materials necessary to create makeshift replacements for your mast and sail, that were destroyed a few days ago during a bout of rough weather.</p>

<p>And then? Unless, by extraordinary happenstance, this island turns out to hold everything you're looking for, you'll pick a new direction and resume your wandering.</p>

<p>Your name is Mananuiva and, since the day of your birth, the wet season has come and passed seventeen times. During all those years, you've known nothing but your home island, its close neighbors and the waves surrounding them. But you've finally reached the age when the young men and women of your tribe perform their rite of passage to adulthood: taking a canoe and sailing far away, alone. Tradition calls it "heading for the horizon" and many legends begin with a young boy discovering a mysterious, faraway island during the rite. These days, truth be told, adolescents content themselves with going to the islands located less than a day away, where they have fun as best they can for a week or two. Flings and romances are common during such stays, and the tradition is responsible for many marriages between people that might otherwise never have met.</p>

<p>During the months that preceded it, you spent many evenings daydreaming about your own rite of passage, vaguely hoping that it would teach you something invaluable about yourself and the entire world. And, on the day of your departure, your home island hadn't yet disappeared behind you when you did have a revelation... the revelation that the adult life waiting for you after this journey held nothing that you found promising. You don't want to become a reasonable woman, to marry and have many children, to have a life like your parents or your five older siblings.</p>

<p>That was two months ago. Since then, you've visited many islands, looking for a sign, a vision or an oracle that would reveal a path that would fit you. You still don't know for sure why you rejected the future waiting for you: your life until then hadn't been unhappy, and could at worst be described as slightly unsatisfying. But you've never doubted your decision.</p>

<p>The island is surrounded with coral reefs reaching close to the surface; you skillfully maneuver your canoe to cross that natural barrier. You're now but a few paddle strokes away from the beach where the waves expire, but you don't land yet. You suspect that this isn't a single island but an atoll, in which case getting to the inner lagoon should give you a much better overall view.</p>

<p>As you wonder whether you should paddle along the beach to your left or to your right, a splashing sound makes you turn your head.</p>

<img src="${raiahuiIntroImage}" class="img-responsive text-img tall left" alt=""/>

<p>Having just emerged from the water, both of her arms resting on your outrigger, a young woman is watching you with delighted curiosity.</p>

<div class="conversation">
<p>"Hello," she says cheerfully. "Do you come from afar?"</p>
<p>"I guess I do," you answer after a moment of surprise. "Do you want to climb aboard?"</p>
<p>"Wait just a moment. I dropped something as I was surfacing, and I'd rather get it back right now.</p>
</div>

<p>She dives without waiting for an answer. Through the clear water, you see her approach an especially dense jumble of coral, stick her arm in a crevice, then immediately head back in your direction. Once she's resurfaced, she readily climbs aboard your canoe. She now holds an ivory knife, and you're surprised that she could find such a small object so quickly amid the extravagant profusion of coral. You consider that she might have been searching for shellfish or crustaceans underwater when you arrived; but if that were the case, she'd have brought a small net to carry her catch, and she has nothing of the sort.</p>

<div class="conversation">
<p>"My name's Raiahui. What's yours ?"</p>
<p>"Mananuiva. Is your village far from here?"</p>
<p>"It's on the side of the lagoon. I'll show you the nearest channel."</p>
</div>

<p>Raiahui is about as old as you are. She's a bit taller, a bit thinner, and her brown skin is slightly lighter. Her dark hair has been cut strangely short, and doesn't even reach her shoulders.</p>

<p>You maneuver your canoe according to her instructions. Raiahui speaks the same language as you do, and her accent is no thicker than many you've heard during your journey. Some of the expressions she uses are unfamiliar to you, but it doesn't prevent you from easily understanding one another.</p>

<p>You soon reach the channel and go through it. To your left, the island you've been paddling along is evenly covered with an entanglement of trees. To your right, some distance away, you now see another of the atoll's islands; it's barely more than a stretch of bare sand. Under your canoe, the water has a limpidity that constrasts with the dark blue of the ocean and the lagoon.</p>

<div class="conversation">
<p>"Are you a good swimmer?" Raiahui asks suddenly.</p>
<p>"Very good."</p>
</div>

<p>Your answer makes her smile, but she doesn't explain why.</p>
`
    ,
    "next": function(goToSection) {
      const text = `Following her instructions, you reach the lagoon.`;
      const action = "arrival";

      return repeatingFunnel(goToSection, text, action);
    }
  },
  "arrival": {
    "text":
`
<p>Raiahui's village turns out to be quite modest: it only comprises a few very simple huts, spread without order among the trees. The first inhabitants you see are young children, loudly playing on the sand and in the water. When they catch sight of you, their excited calls quickly bring a few adults, who'd been resting in hammocks nearby.</p>

<p>As you get very close to the beach, Raiahui jumps out of the canoe to help you land. A score of spectators of all ages have gathered to watch you with curious eyes, and many others are approaching. You endure the attention as best you can; you've already visited islands where strangers are so rare that your arrival was an event.</p>

<p>The crowd suddenly makes way for a man with very close-shaven hair, whose muscular body bears many scars.</p>

<div class="conversation">
<p>"It's the chieftain of the tribe, Ataroa," whispers Raiahui as you get out of your canoe.</p>
</div>

<p>You bow and introduce yourself politely, hoping that the local etiquette isn't more demanding than that. Ataroa watches you for a moment, his face expressionless. Then he nods.</p>

<div class="conversation">
<p>"You're welcome here. Have you come in search of something?</p>
<p>"I'm performing my rite of passage," you answer. "I'm looking for omens about my future."</p>
</div>

<p>That explanation has earned quite a few puzzled looks since the beginning of your journey: rites of passage to adulthood take many different forms throughout the archipelago, but their true role is to integrate adolescents into the community of adults, not to send them on the kind of mystic quest that would befit a shaman. If your answer surprises Ataroa, however, he doesn't show it.</p>

<p>"That's a lucky coincidence," he says. "There's a member of our tribe who also has to perform her rite of passage, but she had to wait for the arrival of an outsider to do so."</p>

<p>He gestures toward Raiahui, who's clearly having a hard time keeping her excitement in check.</p>

<div class="conversation">
<p>"What is that rite like?" you ask, a bit surprised.</p>
<p>"A simple race between this island and its neighbor, nothing more. If Raiahui wins, she can join the adults of the tribe. If you win...</p>
</div>

<p>He briefly pauses for thought, then resumes:</p>

<div class="conversation">
<p>"There's a sacred beverage, called the Foam of the Deep, that we hardly ever brew, for its ingredients are difficult to gather. The one who drinks it can access the world of the spirits, and receive wisdom and knowledge. My predecessors used the Foam of the Deep when the tribe was in danger, I have not yet had the occasion to do so myself. If you win the race, we'll brew the Foam of the Deep for you. Do you accept?"</p>
</div>

<p>Hearing Ataroa offer you such a prize has drawn a few surprised exclamations out of the crowd. Would that Foam of the Deep really bring you the answers you seek? Real magic is not as common as legends suggest, as you've realized since the beginning of your journey. On the other hand, if you don't seize all possible opportunities, your quest is likely to remain fruitless.</p>

<p>From a more practical point of view, you suspect that the tribe won't grant you hospitality if you refuse to take part in the race, and you certainly don't feel like leaving on your canoe before a good night's sleep.</p>

<div class="conversation">
<p>"I will take part in the rite of passage," you say.</p>
</div>

<p>Raiahui giggles happily, and a murmur of general satisfaction echoes her among the crowd.</p>

<div class="conversation">
<p>"Excellent," says Ataroa. "The race will happen a day from now. This evening, we'll have a feast in your honor."</p>
</div>

<p>He gives instructions and the crowd disperses to prepare the feast. Raiahui briefly goes away to get dressed, then comes back, a wide smile still stuck to her face. You study her lithe, athletic build, wondering how hard it'll be to defeat her. You were being modest when you claimed to be a very good swimmer: the truth is that you've never met a woman that could surpass you.</p>

<p>Some time will obviously pass before the feast can begin.</p>
`
    ,
    "next": (goToSection, flags, updateFlag) => {
      return (
        <Crossroads choices={arrivalActions(goToSection, flags, updateFlag)} />
      );
    }
  },
  "visit": {
    "text": flags =>
`
<p>Raiahui makes you visit her village. Its few huts turn out to be rudimentary and ungainly; you keep that opinion to yourself, of course. The vegetation around it is plentiful, but its size is limited, as is common on atolls: though the palm trees reach well above your head, their trunks are all fairly thin.</p>

<p>The center of the village holds an impressive surprise. Not far from the area where the villagers are now preparing the feast is a monument built from many fishing trophies. You see turtle shells, swordfish bills, many dolphin skulls... In the middle is a long, thin jaw, twice as big as you are; its many teeth are thick and sharp.</p>

<div class="conversation">
<p>"It's the jaw of a sperm whale," Raiahui explains, smiling at your astonishment.</p>
</div>

<p>You've heard about those huge animals, but you've never seen one; judging from these remains, that may be fortunate.</p>

<div class="conversation">
<p>"How did you manage to catch such a beast?"</p>
<p>"I wasn't very old when it happened, and I mostly remember eating whale meat for several days. There were about twenty hunters and they had a very hard time separating the animal from its herd and making it run aground near the atoll. It's a pity Faanarua's not here to explain how they pulled it off."</p>
<p>"Who's Faanarua?"</p>
<p>"She used to be one of the best hunters in the tribe... and she tells stories really well. But she's become a bit weird and doesn't show up very often anymore. Today, I think she's around, but she probably won't come to this evening's feast.</p>
</div>

${flags.arrivalActions.length <= 1? `<p>After the visit of the village is over, some time still remains before the feast can begin.</p>`: ""}
`
    ,
    "next": arrivalNext,
  },
  "repair": {
    "text": flags =>
`
<p>Sensibly enough, you've got into the habit of checking the condition of your canoe at each stop. Its small size means that you can maneuver it by yourself, but it also makes it more vulnerable when the wind and the sea become unfriendly. A bout of rough weather can really put it to the test, as you've already experienced.</p>

<p>Under Raiahui's curious eyes, you examine your canoe from all angles, making sure that nothing threatens its watertightness, and that the outrigger remains firmly attached.</p>

<p>You don't notice any reason for concern, and you eventually put an end to your examination. But as you turn away, you suddenly notice something strange: on the beach next to the village, there are only two canoes other than your own, and both of them are rather puny. Even if the members of the tribe seldom venture on the open sea, mere fishing should require more than what you see. Are there other canoes kept somewhere else? You decide that the matter is not so important that it requires immediate investigation.</p>

${flags.arrivalActions.length <= 1? `<p>There's still some time left before the feast can begin.</p>`: ""}
`
    ,
    "next": arrivalNext,
  },
  "raiahui-trial": {
    "text": flags =>
`
<div class="conversation">
<p>"If I understand correctly, you couldn't perform your rite of passage without an outsider?</p>
<p>"Exactly. But it has to be someone who's healthy and sturdy enough, of course. Otherwise, it would be too easy.</p>
<p>"Do you often get visitors?"</p>
<p>"Not really, no. I've been waiting since the beginning of the dry season. If no one comes for an entire year, a few adults bring those who're old enough to one of the closest inhabited islands, where they can find people who'll take part in the rite. But thanks to you, I'll be an adult tomorrow evening. I'm really glad.</p>
<p>"The race hasn't happened yet," you observe.</p>
</div>

<p>Raiahui's smile shows all of her teeth.</p>

<div class="conversation">
<p>"I'm sorry for your quest, Mananuiva, but I'll be the winner."
</div>

${flags.arrivalActions.length <= 1? `<p>There's still some time left before the feast can begin.</p>`: ""}
`
    ,
    "next": arrivalNext
  },
  "raiahui-atoll": {
    "text": flags =>
`
<p>Judging from the sun's position, the island where the village is located lies at the southern end of the atoll. From the beach where you've landed your canoe, you can see the outlines of the other islands, but not determine their exact number. Raiahui draws a basic map on the sand.</p>

<div class="conversation">
<p>"We're here," she says, drawing a slightly curved line. "To the right is the channel we passed through to enter the lagoon, and on the other side, there's the arrival point for our race. You must have seen what it's like: there's not even a shrub!
Her finger keeps drawing vague shapes, moving toward the north.</p>
<p>"After that, there's a tiny islet, that nearly vanishes during the wet season. Then there's the island of the Old Sluggard. That's where the largest trees in the atoll can be found, but you shouldn't go and have a look: the Old One isn't really welcoming. He's smart enough to stay away from us, but strangers are another matter."</p>
</div>

<p>You're about to ask her for more details, but she's already moving on:</p>
<div class="conversation">
<p>"And here's the home of the witch!"</p>
<p>"A witch?"</p>
</div>

<p>You wonder if Raiahui might not be having fun at your expense, but she seems quite sincere and eager to tell you more.</p>

<div class="conversation">
<p>"When I was young," she says with nostalgic excitement, "nothing rose above the surface in that part of the atoll. And then, one morning, an island had appeared! Some think it floats, other that it's actually on the back of a giant crab enslaved by the witch. The water around it is very dark, so you can't really tell... Anyway, several adults decided to explore it and they never came back. Since then, of course, nobody goes there.</p>
<p>"Then how do you know there's a witch?"</p>
<p>"We spot her from time to time. She's very fat, with spiky hair like the spines of an urchin, and she wears weird golden jewelry. She usually looks busy, but no one knows for sure what she does.</p>
</div>

<p>The three remaining islands, on the western side of the atoll, clearly don't interest Raiahui anywhere as much, and she describes them in just a few words:</p>
<div class="conversation">
<p>"This one's very small and there's hardly anything on it. The other two are medium-sized and they have many palm trees, just like this island.</p>
</div>

${flags.arrivalActions.length <= 1? `<p>The description is over, but some time still remains before the feast can begin.</p>`: ""}
`
    ,
    "next": arrivalNext,
  },
  "feast": {
    "text":
`
<p>The sky is getting dark when Raiahui brings you to the space prepared for the feast. An abundance of food, impaled on plenty of spits, is roasting around a large fire, filling the air with smells that immediately make you mouth water. The brisk sound of drums in unison gives rhythm to the celebration about to begin.</p>

<img src="${feastImage}" class="img-responsive text-img tall left" alt=""/>

<p>All the tribe seems to have gathered for the occasion: not quite a hundred people, half of them children and adolescents. Eager to make a good impression, you've put on the brightly colored pareo usually stored aboard your canoe, but that probably wasn't necessary: even the women wear little more than simple loincloths, and you notice only a few basic ornaments here and there. You're met with many curious looks.</p>

<p>The feast begins without further ado. As the guest of honor, you're invited to help yourself before anyone else, much to the satisfaction of your stomach. You're given a platen woven out of palm leaves, and you make your choice among an assortment of bird meat, turtle meat, eggs, crustaceans, shellfish and a few fruits. A green coconut with a pierced top is brought to you so you can quench your thirst.</p>

<p>Once you've sat down, the members of the tribe help themselves in turn, with a chaotic enthusiasm that suggests such feasts are not common. Except for the very young children, you notice that they all own ivory knives similar to Raiahui's - curved and slightly serrated - and wield them with great dexterity. Judging from the ease with which they pierce coconuts, remove shells and cut meat, those tools must be incomparably sharper than your bone knife.</p>

<p>You quickly understand why there's such an abundance of food as you watch the gluttony of the people surrounding you. They don't even bother to spit out the small pieces of shell and bird bones that crack under their teeth.</p>

<p>Raiahui has left you and is currently surrounded by other adolescents, who're congratulating her - some with obvious envy - for soon becoming an adult. Quite obviously, they're convinced that she'll win tomorrow's race!</p>

<p>This feast is an excellent occasion to learn more about the tribe, though you clearly won't have time to chat with everybody.</p>
`
    ,
    "next": (goToSection, flags, updateFlag) => {
      return (
        <div>
          <p>{`You could spend time talking with:`}</p>
          <Crossroads choices={feastActions(goToSection, flags, updateFlag)} />
        </div>
      );
    }
  },
  "feast-chief": {
    "text":
`
<p>Ataroa is a very inexpressive man, but he's not at all haughty and clearly doesn't believe himself to be innately superior to the people around him. That makes him pleasantly different from the many chieftains that claim to be descended from deities, and impose burdensome rituals to constantly remind people of it. On two occasions since the beginning of your journey, you've had to cut short your stay on an island because you'd unwillingly transgressed an absurd, yet absolute taboo.</p>

<p>After a few casual questions, you ask Ataroa about the rite of passage used by his tribe:</p>

<div class="conversation">
<p>"Why is an outsider necessary? Wouldn't it be simpler to have a race every year between all the adolescents who're old enough?</p>
<p>"All the youths of the tribe are used to competing with each other since their childhood," Ataroa answers, while skillfully removing the shell of a crab with the point of his knife. "It can no longer teach them anything. By confronting them with someone they don't know, the rite places them in a uncertain situation, where they'll have to anticipate and to adapt. The trial is not merely physical, far from it. If you want to win, you will need to show cunning.</p>
<p>"Raiahui seems quite sure that she's going to win."</p>
</div>

<p>Ataroa briefly nods.</p>

<div class="conversation">
<p>"If she loses, it'll be because of her overconfidence. Don't make the same mistake when the time comes to start the race."</p>
</div>
`
    ,
    next: feastNext
  },
  "feast-men": {
    "text":
`
<p>Most of the men are busy filling their bellies, but some are curious to learn more about you. Most of their questions are about your skill as a swimmer; they're clearly trying to determine if you'll be a worthy contestant in tomorrow's race. You remain modest in your description of yourself: what you say may come to Raiahui's ears and you'd rather have her underestimate you.</p>

<div class="conversation">
<p>"Does your tribe also hold traditional competitions?" ask a man named Harumu.</p>
<p>"Yes. Every year, many birds come to a tiny island close to ours and lay their eggs. There's a race to be the first one to bring back some of those eggs.</p>
<p>"Have you ever won that race?"</p>
<p>"Oh, only men take part in it."</p>
</div>

<p>A puzzled expression appears on Harumu's face.</p>

<div class="conversation">
<p>"That's a strange custom," he says. "Is there any specific reason for it?"</p>
</div>

<p>You don't feel up to the task of putting into words the complex explanation this question calls for, so you opt for an easier answer:</p>
<div class="conversation">
<p>"Men swim faster than women, so it wouldn't be a fair race."</p>
<p>"Oh... Yes, obviously."</p>
</div>

<p>Judging from the look on his face, he doesn't deem it obvious at all.</p>
`
    ,
    "next": feastNext,
  },
  "feast-women": {
    "text":
`
<p>When you start talking with some of the women, you expect them to give you an overview of the tribe's domestic life. But, as you quickly discover, they're much more interested in telling you about the biggest fish they've caught. Some of their boasts seem rather doubtful, to say the least!</p>

<div class="conversation">
<p>"Do you ever fish in the lagoon itself?" you eventually ask, for they only mention catching fish out at sea.</p>
</div>

<p>Your question gets a laugh out of a woman named Ariinea, who was just a moment ago telling you about a swordfish of improbable size.</p>

<div class="conversation">
<p>"Quite often, out of sheer laziness," she answers, "but it's not very exciting. Most of the lagoon's fish are quite small. Eating nothing else gets boring very quickly, unless you're the Old Sluggard.</p>
<p>"The Old Sluggard?"</p>
<p>"He lives on an island at the other end of the atoll," Ariinea says, "and spends all of his time doing as little as possible.</p>
<p>"He can still be dangerous," another woman mentions, "especially for those who don't know him. I don't think you should approach that part of the atoll, Mananuiva."</p>
</div>

<p>Ariinea pouts, but doesn't refute the validity of that recommandation.</p>
`
    ,
    "next": feastNext,
  },
  "feast-boys": {
    "text":
`
<p>The tribe has quite a few boys close to your age. You mingle with them, exchanging a few words here and there. After a while, you feel somewhat vexed to observe that not a single one of them feels like flirting with you. During your previous stops on inhabited islands, your status as an outsider gave you an exotic charm that piqued the interest of male adolescents. It didn't bring you any closer to what you're looking for, but it didn't harm your self-esteem either.</p>

<p>A young boy named Varenui is however very interested in your journey. Telling him about everything would be much too long, but you take the time to describe some of the most memorable places you've visited. He seems fascinated by the slightest details, and asks many questions.</p>

<div class="conversation">
<p>"You've never visited another inhabited island?" you ask him eventually.
<p>"No. Even the adults very seldom do... well, except Faanarua, but she's barely a member of the tribe anymore."
<p>"Who's she?"
<p>"She's... someone weird. She's built a canoe with a sail for herself, so she can travel far and visit as many new islands as she can. Out of every year, she only spends a few days around here. She actually came back to the atoll just two days ago, and I tried to have her tell me about her journeys, but she sent me packing.
<p>"Is she present at the feast right now?" you ask, looking around you.</p>
<p>"No, she's not even in the village. She's settled on the westernmost island of the atoll, and she's barely seeing anyone.</p>
</div>
`
    ,
    "next": feastNext,
  },
  "feast-girls": {
    "text":
`
<p>You approach a few of the girls that are not currently gathered around Raiahui. Conversation is awkward at first: they obviously don't know what to discuss with an outsider. But, after a while, you manage to lighten the mood by giving them barely exaggerated descriptions of the weird customs and traditions you've observed during your journey. The girls clearly have but vague ideas of how the other tribes live; the variety of oddities you tell them about won't make them much more knowledgeable, but it soon has them laughing.</p>

<p>After describing to your amused audience some of the more extravagant traditional celebrations you've seen, you pause to catch your breath. A young girl named Runuhati fetches half a lobster for you, clearly expecting that some food will give you the strength to continue. You accept gratefully, but though you still have quite an appetite, your bone knife is now very blunt, and you'd have a hard time cutting anything with it.</p>

<div class="conversation">
<p>"Can I borrow your knife?" you ask Runuhati.</p>
</div>

<p>Her eyes open wide and she looks almost panic-struck.</p>

<div class="conversation">
<p>"I... No... It's..."</p>
</div>

<p>An older girl comes to her help:</p>

<div class="conversation">
<p>"It's an extremely personal item; we keep it throughout our entire lives and we never lend it, even among ourselves. Give me your lobster, I'll remove the shell for you.</p>
</div>
`
    ,
    "next": (goToSection, flags, updateFlag) => {
      if (flags.feastActions.length <= 1) {
        const transitionText = `
<p>You talk a while longer, adding a few semi-fanciful stories to the previous ones, before you politely take your leave and approach <span class="transition-sentence">{text}</span>.</p>
        `;

        return (
          <div>
            <p>{`You talk a while longer, adding a few semi-fanciful stories to the previous ones, before you politely take your leave and approach:`}</p>
            <Crossroads choices={feastActions(goToSection, flags, updateFlag, transitionText)} />
          </div>
        );
      }

      const text = `You talk a while longer, adding a few semi-fanciful stories to the previous ones. Around you, the feast is slowly petering out.`;
      const action = "night";

      return repeatingFunnel(goToSection, text, action);
    },
  },
  "night": {
    "text":
`
<p>Sunset is long past when the feast ends. The fire has died down enough to let you see the countless stars above your head. As the members of the tribe slowly disperse, Raiahui takes you to a hammock tied between two palm trees, not far from the beach. The tiredness accumulated during this day of travel is making your body heavy, and you gratefully lie down.</p>
`
    ,
    "next": (goToSection, flags, updateFlag) => {
      const text = `You're quickly lulled to sleep by the whisper of the water and the warm breeze.`;
      const action = () => {
        updateFlag("wentBeyondIntroduction", true);
        return "awakening";
      };

      return repeatingFunnel(goToSection, text, action);
    }
  },
  "awakening": {
    "text":
`
<p>You're woken up by the morning sunshine, filtering through the palm leaves. Everything is quiet. You laze for a while before finally deciding to get up. The only sounds coming to your ears are birdsongs, which suggests that most of the tribe is still asleep.</p>

<p>Raiahui is lying on a hammock close to yours, her knife on her belly. She opens an eye when you start stretching.</p>

<div class="conversation">
<p>"Up already?" she mumbles. "You should rest for this evening's race."</p>
<p>"I'm not going to spend all day doing nothing but wait."</p>
<p>"As you wish," she answers, yawning. "But don't get close to the two islands at the northern end of the atoll..."</p>
</div>

<p>A few moments later, she's gone back to sleep.</p>
`
    ,
    "next": function(goToSection) {
      const hubText = `You head for your canoe to explore the rest of the atoll.`;

      const choices = [
        {
          "text": `You take some time to explore the island where the village is located.`,
          "action": () => {goToSection("village");},
        },
        {
          "text": hubText,
          "action": () => {goToSection("hub", coatSentence(hubText));},
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "quick-start": {
    "text": `<p>Skip the introduction?</p>`,
    "next": (goToSection, flags, updateFlag) => {
      const noLog = () => "";

      const choices = [
        {
          "text": `Yes.`,
          "action": () => {
            updateFlag("toldAboutFaanaruaByRaiahui", true);
            updateFlag("toldAboutAtollByRaiahui", true);
            updateFlag("toldAboutLazyOneByAriinea", true);
            updateFlag("toldAboutFaanaruaByVarenui", true);
            updateFlag("watchedKnifeImportance", true);
            updateFlag("wentBeyondIntroduction", true);
            goToSection("awakening", noLog);
          },
        },
        {
          "text": `No.`,
          "action": () => {
            goToSection("prelude", noLog);
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    },
  }
};


export default intro;
