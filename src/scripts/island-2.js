import React from "react";
import Crossroads from "./../components/Crossroads.js";
import Funnel from "./../components/Funnel.js";

const island2 = {
  "island-2": {
    "text": `
<p>L'île dont vous approchez est couverte de nombreux palmiers et buissons. Approchant votre pirogue de la plage de sable clair, vous êtes frappée par la cacophonie de trilles et de sifflements qui s'échappe de cette abondance végétale. De toute évidence, une multitude d'oiseaux a élu ici domicile. En revanche, vous ne distinguez aucun signe qu'il y ait d'autres habitants.</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const choices = [
        {
          "text": `Vous prenez le temps de l'explorer.`,
          "onClick": () => {
            updateFlag("time", flags.time+1);
            goToSection("exploring-island-2");
          },
        },
        {
          "text": `N'apercevant rien d'intéressant à première vue, vous repartez de suite.`,
          "onClick": () => {
            goToSection("back-to-hub");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "exploring-island-2" : {
    "text":`
<p>Non sans mal, vous vous frayez un chemin à travers l'épaisse végétation. Le ciel n'est bientôt plus visible que sous la forme de fragments d'azur minces et dispersés. Les cris d'oiseaux vous entourent de toute part et, même si les volatiles sont plus audibles que visibles, vous apercevez sans peine nombre d'entre eux. Votre présence ne semble pas les alarmer le moins du monde et, si vous disposiez du matériel nécessaire, il serait sans doute facile d'en attraper quelques-uns. Mais, même si le festin de la veille n'a pas épuisé votre goût pour la viande et que les plumes vivement colorées de certains des oiseaux vous font envie, il y a sans doute de meilleures façons d'occuper votre temps aujourd'hui. Après vous être assurée qu'il n'y a rien d'autre sur cette île, vous regagnez votre pirogue pour repartir.</p>
    `,
    "next": function(goToSection) {
      const text = `Aussi rejoignez-vous votre pirogue.`;
      const action = () => {goToSection('back-to-hub')};

      return (
        <Funnel text={text} action={action} />
      );
    }
  }
}

export default island2;
