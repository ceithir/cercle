import React from "react";
import Funnel from "./../components/Funnel.js";
import {acquireItem, repeatingFunnel} from "./helpers.js";

const island7 = {
  "island-7": {
    "text": `
<p>Cette île n’est rien d’autre qu’une étendue de sable nu affleurant tout juste au-dessus des vagues. Vous pourriez la traverser en moins d’une dizaine d’enjambées.</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      if (flags.talkedWithFaanarua && !flags.inventory.dolphin.acquired) {
        const text = `Vous vous mettez à la recherche du médaillon dont Faanarua vous a parlé.`;
        const action = () => {
          acquireItem("dolphin", updateFlag);
          updateFlag("time", flags.time+1);
          goToSection("exploring-island-7");
        };

        return (
          <Funnel text={text} action={action} conditional={true} />
        );
      }

      const text = `Vous parvenez vite à la conclusion qu’il n’y a rien à faire ici.`;
      const action = "back-to-hub";

      return repeatingFunnel(goToSection, text, action);
    }
  },
  "exploring-island-7" : {
    "text":`
<p>L’île est minuscule, mais l’objet que vous recherchez l’est également. Vous retournez méthodiquement le sable chaud à sa recherche, espérant que Faanarua ne l’a pas trop profondément enterré. Il va de toute façon vous falloir de la chance ou de la patience. Après de longs moments infructueux, vous ne pouvez cependant vous empêcher de commencer à éprouver une certaine lassitude. Le talisman est-il vraiment là ? Même si Faanarua vous a raconté la vérité, il s’est écoulé de nombreuses années depuis qu’elle l’a caché ici. Comment savoir si la pluie, le vent et les vagues ne l’ont pas fait progressivement glisser dans l’océan ou dans le lagon ?</p>

<p>Vous êtes tellement préoccupée par ces doutes que vous jetez presque de côté l’objet de vos recherches lorsque vous mettez la main dessus, l’ayant pris pour un coquillage brisé. Heureusement, votre attention n’est pas encore tout à fait engourdie et vous retenez juste à temps votre geste !</p>

<p>Vous observez avec curiosité l’amulette, taillée dans une pierre blanche comme l’écume. Elle est à peu près grande comme votre index et, même si elle a été endommagée, il reste clair qu’elle représente un dauphin. Vous allez chercher à bord de votre pirogue une lanière en cuir, que vous passez par le mince trou pratiqué dans la pierre à cet effet. Lorsque vous accrochez l’amulette autour de votre cou, vous êtes saisie d’une sensation étrange, comme si vous veniez de prendre une inspiration particulièrement profonde. Mais l’impression se dissipe presque aussitôt, vous laissant tout à fait inchangée. L’amulette a-t-elle conservé le moindre pouvoir ? En tout cas, elle ne peut pas vous nuire.</p>
    `,
    "next": function(goToSection) {
      const text = `N’ayant de toute évidence rien d’autre à faire sur cette île, vous ne tardez pas à repartir.`;
      const action = "back-to-hub";

      return repeatingFunnel(goToSection, text, action);
    }
  }
}

export default island7;
