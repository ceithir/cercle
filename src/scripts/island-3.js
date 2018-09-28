import React from "react";
import Crossroads from "./../components/Crossroads.js";
import {endGame, coatSentence, repeatingCrossroad, repeatingFunnel, secondTimeToIsland} from "./helpers.js";

const island3 = {
  "island-3": {
    "text": (flags) => {
      if (secondTimeToIsland("island-3", flags)) {
        return `
<p>The white sail draws your attention as you come close to this island again. Squatting on the sand, the unknown woman is still focused on the maintenance of her canoe.</p>
        `;
      }

      return `
<p>As you come close to this island covered with many palm trees, your eye is drawn to a triangular white sail, shivering slightly in the breeze. Somewhat larger than yours, a canoe has been hauled on the beach and a woman is taking care of its maintenance. Her back is turned and nothing suggests that she has noticed your approach.</p>
      `;
    },
    "next": function(goToSection, flags, updateFlag) {
      const leaveText = `You’d rather pick a different destination.`;

      const choices = [
        {
          "text": `You decide to land your canoe on this island.`,
          "action": () => {
            updateFlag("approachedFaanarua", true);
            goToSection("exploring-island-3");
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
  "exploring-island-3" : {
    "text":`
<p>You barely have time to land your canoe on the beach before the woman turns to face you with a furious expression:</p>

<div class="conversation">
<p>“Are you people ever going to leave me in peace? I thought I’d…”</p>
</div>

<p>She pauses as she realizes that you’re unknown to her. But she quickly gets over her surprise, and the hostility in her voice barely diminishes:</p>
<div class="conversation">
<p>“You’re the foreign girl who’s arrived yesterday, aren’t you? Well, there’s nothing for you here. Go back to the village or visit any of the other islands, I don’t care. Just leave and stop bothering me.”</p>

<p>Her accent clearly identifies her as a member of the tribe, but she looks fairly different from the women you saw during yesterday’s feast: her thick hair is tied behind her head, she wears an elaborate shell necklace and a faded pareo is wrapped around her waist. She’s holding her ivory knife and was obviously using it to rid her canoe’s hull from the barnacles clinging to it.</p>

<p>Aside from this woman, you don’t expect to discover anything of interest to you on this island. And you won’t get anything out of her unless you convince her that you don’t deserve her hostility.</p>
    `,
    "next": function(goToSection) {
      const text1 = `You ask her where she travels to with her canoe.`;
      const text2 = `You tell her about your race against Raiahui.`;
      const text3 = `You comply with her request and leave the island.`;

      const choices = [
        {
          "text": text1,
          "action": () => {
            goToSection("faanarua-her-journey", coatSentence(text1));
          },
        },
        {
          "text": `You tell her about your own journey.`,
          "action": () => {
            goToSection("faanarua-your-journey");
          },
        },
        {
          "text": text2,
          "action": () => {
            goToSection("faanarua-raiahui", coatSentence(text2));
          },
        },
        {
          "text": text3,
          "action": () => {
            goToSection("back-to-hub", coatSentence(text3));
          },
        },
      ];

      return (
          <Crossroads choices={choices} />
      );
    }
  },
  "faanarua-her-journey": {
    "text":`
<p>The woman frowns impatiently. But instead of once again telling you to scram, she just sighs. After a while, she speaks in a calmer voice:</p>

<div class="conversation">
<p>“Look, I’ll talk to you if that’s what it takes to make you leave. But I’ve been working for a while now, and I’m getting really hungry. Bring me back a few crabs or some crayfish – the lagoon is full of them – and I’ll tell you about anything you want afterwards.”</p>
</div>

<p>You clearly won’t be able to negotiate another deal.</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const leaveText = `You refuse and go back to your canoe.`;
      const choices = [
        {
          "text": `You accept the deal.`,
          "action": () => {
            updateFlag("eatenByFaanarua", true);
            goToSection("faanarua-prey");
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
  "faanarua-prey": {
    "text":`
<p>You dive in the warm, clear water of the lagoon. Small, colorful fish hastily disappear in the countless hiding places provided by the coral reefs. Holding in one hand the small net you’ll use to carry your catch, you swim without haste, looking for slower preys.</p>

<p>Horrifying pain suddenly pierces your leg. In shock, you reflexively exhale all the air from your lungs. You immediately try to reach the surface, but you’re held in a savage grip. You struggle in vain, unable to distinguish your assailant clearly. Far from increasing your strength, panic makes you weaker and frantic. A dark veil soon begins to thicken before your eyes. The last thing you see before everything disappears is the thick red color sullying the previously clear water.</p>
    `,
    "next": endGame,
  },
  "faanarua-your-journey": {
    "text": `
<p>The woman looks irritated when you explain to her the meaning of your journey, but her annoyance slowly dissipates as you start describing the islands you’ve visited. Her comments – very terse at first – reveal that some of them are known to her.</p>

<div class="conversation">
<p>“So you’ve visited the Tongakiri? she asks at one point. Are they still busy carving that ludicrously tall statue of their legendary founder?”</p>
<p>“I arrived on the very day it was supposed to be erected. But something went wrong: the statue toppled and broke into three pieces. I decided not to tarry on the island after the shaman of the tribe stated that the accident was a sign of divine displeasure and that a sacrifice would need to be performed.”</p>
</div>

<p>You story makes her laugh, lightening the atmosphere. For a few pleasant moments, you tell each other about your most memorable discoveries and encounters. The woman’s clearly a great traveler and you learn much by listening to her. Eventually, she puts an end to this exchange by switching to a different subject:</p>
<div class="conversation">
<p>“You can’t know in advance what revelation your journey will bring, of course. But how do you hope that it will change you?”</p>
</div>

<p>That’s an excellent question, but properly thinking about it would require more free time than you have today.</p>

<p>Two possible answers – both rather vague – nevertheless come to your mind:</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const choices = [
        {
          "text": `"I hope this journey will expand my outlook on the entire world."`,
          "action": () => {
            updateFlag("time", flags.time+1);
            updateFlag("talkedWithFaanarua", true);
            return "faanarua-the-world";
          },
        },
        {
          "text": `"I hope this journey will give me a different outlook on my native island and my tribe."`,
          "action": () => {
            updateFlag("time", flags.time+1);
            return "faanarua-my-world";
          },
        },
      ];

      return repeatingCrossroad(goToSection, choices);
    },
  },
  "faanarua-the-world": {
    "text":`
<p>The woman gives you a friendly tap on the shoulder.</p>

<div class="conversation">
<p>“I’m beginning to like you, my girl! My name’s Faanarua, by the way.”</p>
<p>“I’m Mananuiva.”</p>
<p>“Then listen well, Mananuiva, for I’m about to give you some useful advice for this evening’s race.”</p>
</div>

<p>You immediately perk up your ears.</p>

<div class="conversation">
<p>“Are there currents or dangerous reefs between the two islands?” you ask. “I passed between them on my canoe and didn’t notice anything.”</p>
</div>

<p>Faanarua shakes her head.</p>

<div class="conversation">
<p>“There’s nothing of the sort, you don’t need to worry about that. But the race itself is not the type of competition that you probably have in mind. You’ll have to think differently. First of all, if you don’t start the race well before Raiahui, you’re necessarily going to lose.”</p>
<p>“I’m an excellent swimmer!” you exclaim, somewhat offended.</p>
</div>

<p>A brief smile crosses the woman’s lips.</p>

<div class="conversation">
<p>“Trust me, Raiahui swims much faster than you do. She knows it, as does the rest of the tribe. In a way, it’ll play to your advantage: she won’t want to start the race at the same time as you do, for that would suggest that she lacks confidence in herself. But don’t count on that to give you a real chance: Raiahui will not intentionally risk losing the race. If you want to win, you’ll have to ensure that she goes in the water later than she would want to.”</p>
</div>

<p>She pauses for thought, while you consider this fairly strange piece of advice.</p>

<div class="conversation">
<p>“Even with a solid lead,” she adds after a moment, “you’ll need to pay close attention to your surroundings and to react quickly to the unexpected. There’s no infallible advice I can give you, but I’ve just remembered an object that could be of use to you. Like all the members of the tribe, I’ve undergone this rite of passage, but the outsider I had to face was not an ordinary opponent: he had an amulet that made him an exceptional swimmer.”</p>
<p>“You mean that he was using a magical amulet?” you ask. “Wouldn’t that be cheating?”</p>
<p>“Don’t worry about playing fair. Other than the fact that you have to swim from one island to the other, this race barely has any rule. It’s cunning that makes victory possible. And that’s what made a difference back then: I stole my opponent’s pendant and, since I could neither use it nor destroy it, I simply buried it somewhere. When the race happened, I won easily.”</p>
<p>“And the pendant?”</p>
<p>“I’ve never retrieved it. It’s buried in the middle of the tiny island at the other end of the atoll.”</p>
<p>“But you told me that it wouldn’t work for you…”</p>
<p>“I’m not really compatible with it, but I’m sure you won’t have the same problem. It may have lost some of its power – I’ve damaged it somewhat – but I genuinely believe that it can be of use to you.”</p>
</div>

<p>A strange smile appears on Faanarua’s lips.</p>

<div class="conversation">
<p>“I’ve told Raiahui the story of that pendant, but I’m sure she won’t recognize it, even if she sees it around your neck. Attention to details is one of the many things she didn’t inherit from me.”</p>
</div>

<p>It takes you a moment to realize what she’s just said.</p>

<div class="conversation">
<p>“Raiahui’s your daughter?”</p>
<p>“Such ties don’t matter much here. Raiahui and I barely have anything in common. You’re the one I hope will have the cunning and the tenacity needed to win the race. Believe me, those qualities are much stronger than any magic.”</p>
</div>
    `,
    "next": function(goToSection) {
      const text = `Faanarua doesn’t have anything else to tell you and, after thanking her, you go back to your canoe.`;
      const action = "back-to-hub";

      return repeatingFunnel(goToSection, text, action);
    },
  },
  "faanarua-my-world": {
    "text":`
<p>The woman nods thoughtfully.</p>

<div class="conversation">
<p>“I need to get back to work," she says. "I’d like to leave tomorrow and this canoe still requires maintenance. But I find you less annoying than the members of my tribe, so I’ll give you three pieces of advice. The first one is very simple, but easily overlooked: take time to think and don’t trust appearances. The second one is that you’ll only be able to win if you’re cunning enough: other than the fact that you need to swim from one island to the other, the race doesn’t really have any rule. And the third one is that you should make sure that you have as much of a lead as possible before Raiahui goes into the water.</p>
</div>
    `,
    "next": function(goToSection) {
      const text = `She has nothing more to add and, after thanking her, you go back to your canoe.`;
      const action = "back-to-hub";

      return repeatingFunnel(goToSection, text, action);
    }
  },
  "faanarua-raiahui": {
    "text": `
<p>The woman quickly cuts you off:</p>

<div class="conversation">
<p>“I already know about the race between Raiahui and you. I don’t care in the slightest.”</p>
<p>“But it’s a rite of passage to adulthood...”</p>
<p>“It’s a stupid tradition, that’s what it is. What do you think you’ll get out of it?”</p>
</div>

<p>You try to explain that you’re also undergoing a rite of passage, and to describe what you seek. She listens with a skeptical expression.</p>

<div class="conversation">
<p>“Travelling in search of revelation seems quite respectable, but I still don’t understand what you expect to find here.”</p>
</div>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const choices = [
        {
          "text": `You answer that taking part in the race might help you discover something about yourself.`,
          "action": "faanarua-her-journey",
        },
        {
          "text": `You tell her about the Foam of the Deep, the reward you were promised should you win the race.`,
          "action": () => {
            updateFlag("time", flags.time+1);
            return "faanarua-my-world";
          },
        },
      ];

      return repeatingCrossroad(
        goToSection,
        choices
      );
    }
  }
}

export default island3;
