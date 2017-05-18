import {repeatingFunnel} from "./helpers.js";

const island8 = {
  "island-8": {
    "text": `
<p>L’île qui va servir de point d’arrivée à votre course est une longue bande de sable, sur laquelle ne poussent que quelques minces herbes frémissant dans la brise. De l’autre côté de la passe que vous avez la veille traversée en pirogue, vous distinguez l’extrémité de l’île où habite la tribu. C’est certainement là que se fera le départ. La distance à parcourir n’a rien d’insurmontable, mais vous ne devrez pas dépenser vos forces trop rapidement. La transparence de l’eau vous permet de distinguer clairement les récifs de corail. Ils ne sont pas à une grande profondeur, mais vous ne risquez pas de vous blesser contre l’un d’eux à moins de plonger nettement en-dessous de la surface.</p>

<p>Vous faites pensivement le tour de l’île — ce qui ne vous prend pas bien longtemps — mais sans remarquer rien d’autre d’intéressant.</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const text = `Vous finissez par regagner votre pirogue.`;
      const action = () => {
        updateFlag("time", flags.time+1);
        return "back-to-hub";
      };

      return repeatingFunnel(goToSection, text, action);
    }
  },
}

export default island8;
