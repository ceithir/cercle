import {repeatingFunnel} from "./helpers.js";

const island8 = {
  "island-8": {
    "text": `
<p>The island that’ll serve as the arrival point for your race is a long stretch of sand, where the only vegetation consists of a few blades of grass shivering in the breeze. On the other side of the channel that you crossed yesterday on your canoe, you can see the end of the island where the tribe lives. It’s certainly from there that the race will begin. The distance is nothing daunting, though not so short that you’ll be able to swim at your maximum speed the entire time. The water is so clear that you can perfectly make out the coral reefs. They’re deep enough that you’ll run no risk of injuring yourself against them, unless you dive well below the surface.</p>

<p>You walk thoughtfully around the island – it doesn’t take very long – but don’t notice anything else of interest.</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const text = `You decide to go back to your canoe.`;
      const action = () => {
        updateFlag("time", flags.time+1);
        return "back-to-hub";
      };

      return repeatingFunnel(goToSection, text, action);
    }
  },
}

export default island8;
