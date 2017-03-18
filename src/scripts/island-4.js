import React from "react";
import Crossroads from "./../components/Crossroads.js";
import Funnel from "./../components/Funnel.js";

const island4 = {
  "island-4": {
    "text": `
<p>Arrivée à proximité de la petite île, vous êtes saisie d'une hésitation. Sans être réellement monstrueuses, les nombreuses plantes qui y poussent ont des formes et des teintes bizarres, nettement différente de la végétation qui vous est familière. Même les cris d'oiseau que vous entendez ont une sonorité qui vous paraît étrange.</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const choices = [
        {
          "text": `Vous accostez tout de même l'île.`,
          "action": () => {
            updateFlag("time", flags.time+1);
            goToSection("exploring-island-4");
          },
        },
        {
          "text": `Vous préférez repartir immédiatement.`,
          "action": () => {
            goToSection("back-to-hub");
          },
        },
      ];

      return (
        <Crossroads choices={choices} />
      );
    }
  },
  "exploring-island-4": {
//TODO Alter conversation if the witch has been encountered
    "text": `
<p>C'est non sans une certaine difficulté que vous vous frayez un chemin à travers la végétation épaisse. En y regardant de plus près, vous parvenez à reconnaître des formes familières derrière l'apparence générale d'étrangeté. C'est comme si quelqu'un avait pris des plantes ordinaires et, d'une manière inexplicable, les avait profondément déformées.</p>

<p>Vous explorez l'île avec patience, mais sans rien observer qui vous paraisse utile. Vous entendez de temps à autres des animaux détaler à votre approche, mais ils restent essentiellement invisibles.</p>

<p>Vous êtes sur le point de regagner votre pirogue, lassée par l'inutilité de vos efforts, lorsque vous apercevez une sorte de petit singe gris qui vous observe avec de grands yeux, accroché à une branche voisine. Sa tête est d'une taille curieusement disproportionnée avec le reste de son corps.</p>

<div class="conversation">
<p>- Alors, mon petit, lui lancez-vous avec un peu d'amusement, il y a des choses que tu me recommandes de voir par ici ?</p>
</div>

<p>À votre stupéfaction totale, il ouvre la bouche pour vous répondre d'une voix fluette :</p>
<div class="conversation">
<p>- Je suis homme.</p>
<p>- Qu... Quoi ?</p>
<p>- Je suis homme. Changé par sorcière.</p>
<p>- Il y a une sorcière sur cette île ? demandez-vous, regardant les alentours avec alarme.</p>
<p>- Autre île. Ici sorcière laisse résultats changements.</p>
<p>- Comment... Comment est-ce que cela t'est arrivé ?</p>
<p>- Je touche fétiche. Fétiche crie. Sorcière attrape moi dans filet. Filet toujours attrape, jamais manque.</p>
<p>- Est-ce que je peux faire quelque chose pour t'aider ?</p>
</div>

<p>Le singe secoue la tête avec une tristesse terriblement humaine.</p>

<div class="conversation">
<p>- Pas possible... Pas possible...</p>
</div>

<p>Il se laisse tomber de sa branche et disparaît rapidement parmi la végétation.</p>
    `,
    "next": function(goToSection) {
      const text = `Ébranlée, vous revenez à votre pirogue.`;
      const action = () => goToSection("back-to-hub");

      return (
        <Funnel text={text} action={action} />
      );
    }
  }
}

export default island4;