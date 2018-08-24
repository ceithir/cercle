import React from "react";
import Funnel from "./../components/Funnel.js";
import {acquireItem, repeatingFunnel, secondTimeToIsland, itemAcquisitionFeedback} from "./helpers.js";

const island7 = {
  "island-7": {
    "text": (flags) => {
      if (secondTimeToIsland("island-7", flags)) {
        return `
<p>The islet looks even tinier than the previous time you were here. You’d never have guessed that it might hide something valuable.</p>
        `;
      }

      return `
<p>This islet is but a stretch of bare sand, rising only slightly above the waves. Ten strides would be more than sufficient to cross it.</p>
      `;
    },
    "next": function(goToSection, flags, updateFlag) {
      if (flags.talkedWithFaanarua && !flags.inventory.dolphin.acquired) {
        const text = `You start looking for the pendant Faanarua told you about.`;
        const action = () => {
          acquireItem("dolphin", updateFlag);
          updateFlag("time", flags.time+1);
          goToSection("exploring-island-7");
        };

        return (
          <Funnel text={text} action={action} conditional={true} />
        );
      }

      const text = `You quickly come to the conclusion that there’s nothing for you to discover here.`;
      const action = "back-to-hub";

      return repeatingFunnel(goToSection, text, action);
    }
  },
  "exploring-island-7" : {
    "text": (flags) => {
      return `
<p>The islet may be tiny, but so is the object you’re looking for. You methodically search the warm sand, hoping that Faanarua didn’t bury the pendant too deep. You know you’re going to need either luck or patience. But after a while, seeing your efforts remain unfruitful becomes wearisome. Is the pendant really here ? According to Faanarua, it’s been many years since she hid it. The rain, the wind and the waves could have gradually shifted its position until it vanished into the ocean or into the lagoon.</p>

<p>You’re so preoccupied by those growing doubts that, when your fingers close on the very object you were looking for, you almost throw it aside, taking it for a broken piece of seashell. Fortunately, you’re still paying enough attention to cancel your gesture just in time !</p>

<p>You study the pendant curiously. It’s white as foam and about the size of your forefinger. Though it’s damaged, it clearly represents a dolphin. You fetch a leather thong from your canoe and use it to hang the pendant around your neck. As you do, you feel somewhat strange, as if you’d just taken an especially deep breath. But the impression dissipates almost immediately, leaving you quite unchanged. Has the pendant retained any power at all ? In any case, wearing it can’t harm you.</p>

${itemAcquisitionFeedback(flags.inventory.dolphin.name)}
      `;
    },
    "next": function(goToSection) {
      const text = `There’s obviously nothing new for you to do here, and you soon decide to head elsewhere.`;
      const action = "back-to-hub";

      return repeatingFunnel(goToSection, text, action);
    }
  }
}

export default island7;
