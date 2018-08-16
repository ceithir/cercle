import {repeatingCrossroad, repeatingFunnel, secondTimeToIsland} from "./helpers";

const island2 = {
  "island-2": {
    "text": (flags) => {
      if (secondTimeToIsland("island-2", flags)) {
        return `
<p>The birds are just as loud as last time.</p>
        `;
      }

      return `
<p>This island is covered with many palm trees and bushes. As you bring your canoe closer to the white sand beach, you’re struck by a cacophony of trills and whistling coming out of the dense vegetation. Many birds have obviously made this island their home. Nothing seems to suggest that there may be other inhabitants.</p>
      `;
    },
    "next": function(goToSection, flags, updateFlag) {
      const choices = [
        {
          "text": `You land your canoe and explore the island.`,
          "action": () => {
            updateFlag("time", flags.time+1);
            updateFlag("searchedIsland2", true);
            return "exploring-island-2";
          },
        },
        {
          "text": `You choose another destination.`,
          "action":  "back-to-hub",
        },
      ];

      return repeatingCrossroad(goToSection, choices);
    }
  },
  "exploring-island-2" : {
    "text":`
<p>You make your way through the dense vegetation with some difficulty. Soon enough, the sky is reduced to azure fragments, small and scattered. You see many birds above you, and you hear many more. Your presence doesn’t seem to worry them in the slightest and, if you had the right equipment, it would probably be easy to catch a few of them. But, though yesterday's feast hasn't exhausted your taste for meat, and the brightly colored feathers of some birds are highly tempting, you realize that there are more useful ways of spending your time today.</p>
    `,
    "next": function(goToSection) {
      const text = `Once you've made certain that there's nothing else on this island, you go back to your canoe and leave.`;
      const action = "back-to-hub";

      return repeatingFunnel(
        goToSection,
        text,
        action
      );
    }
  }
}

export default island2;
