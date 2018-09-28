import {repeatingCrossroad, repeatingFunnel, secondTimeToIsland} from "./helpers.js";

const island4 = {
  "island-4": {
    "text": (flags) => {
      if (secondTimeToIsland("island-4", flags)) {
        return `
<p>The weirdness of this islet’s vegetation is no less bewildering than the first time you caught sight of it.</p>
        `;
      }

      return `
<p>As you come close to this islet, you find yourself hesitating. The many plants that grow here aren’t exactly monstrous, but they have weird shapes and colors, very different from the vegetation you’re used to. Even the bird cries sound eerie.</p>
      `;
    },
    "next": function(goToSection, flags, updateFlag) {
      const choices = [
        {
          "text": `You land your canoe and explore the islet.`,
          "action": () => {
            updateFlag("time", flags.time+1);
            updateFlag("toldAboutWitchByMonkey", true);
            return "exploring-island-4";
          },
        },
        {
          "text": `You’d rather choose a different destination.`,
          "action": "back-to-hub",
        },
      ];

      return repeatingCrossroad(goToSection, choices);
    }
  },
  "exploring-island-4": {
    "text": (flags) => {
      let text = `
<p>You slowly make your way through the thick vegetation. Now that you can examine it more closely, you recognize familiar shapes hiding behind the general impression of weirdness. It’s as if someone had taken ordinary plants and inexplicably warped them.</p>

<p>You patiently explore the islet, but fail to discover anything of any use. You can sometimes hear animals running away at your approach, but they remain largely invisible.</p>

<p>Tired of wasting your time, you’re about to go back to your canoe when you spot a strange little gray monkey, clinging to a nearby branch and staring at you. Its head is disproportionately large compared to the rest of its body.</p>

<div class="conversation">
<p>“So, little one,” you ask in jest, “are there any sights you’d recommend on this island?”</p>
</div>

<p>To your utter astonishment, it opens its mouth and answers in a thin voice:</p>
<div class="conversation">
<p>“I am man.”</p>
<p>“Wh… What?”</p>
<p>“I am man. Changed by witch.”</p>
      `;

      if (flags.survivedWitchIsland) {
        text += `
</div>
<p class="text-conditional">It must be referring to the witch you saw on the neighboring island.</p>
<p>It’s however not completely impossible that there might be another witch in the area. You decide to make sure.</p>
<div class="conversation">
<p>“There’s a witch on this island?”</p>
        `;
      } else {
        text += `
<p>“There’s a witch on this island?" you ask, looking around you nervously.</p>
        `;
      }

      text += `
<p>“Other island. Here witch leaves results changes.”</p>
<p>“How… How did it happen to you?”</p>
<p>“I touch fetish. Fetish screams. Witch catches me in net. Net always catches, never misses.”</p>
<p>“Can I do anything to help you?”</p>
</div>

<p>The monkey shakes its head with terribly human sadness.</p>

<div class="conversation">
<p>“Not possible… Not possible…”</p>
</div>

<p>It drops from the branch and quickly disappears amid the vegetation.</p>
      `;

      if (!flags.survivedWitchIsland && flags.toldAboutAtollByRaiahui) {
        text += `<p class="text-conditional">You weren’t convinced that Raiahui was being serious when she told you about a witch, but you’re beginning to reconsider.</p>`;
      }

      return text;
    },
    "next": function(goToSection) {
      const text = `Shaken, you go back to your canoe.`;
      const action = "back-to-hub";

      return repeatingFunnel(goToSection, text, action);
    }
  }
}

export default island4;
