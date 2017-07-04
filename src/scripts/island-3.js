import React from "react";
import Crossroads from "./../components/Crossroads.js";
import {endGame, coatSentence, repeatingCrossroad, repeatingFunnel} from "./helpers.js";

const island3 = {
  "island-3": {
    "text": `
<p>Alors que vous approchez de cette île couverte de nombreux palmiers, votre œil est attiré par une voile blanche triangulaire, frémissant à peine sous l’effet d’une légère brise. Une pirogue un peu plus grande que la vôtre a été tirée sur la plage et une femme est visiblement en train d’oeuvrer à son entretien. Elle vous tourne le dos et rien ne suggère qu’elle a remarqué votre approche.</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const leaveText = `Vous préférez vous rendre à un autre point de l’atoll.`;

      const choices = [
        {
          "text": `Vous décidez d’aborder cette île.`,
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
<p> Vous avez tout juste eu le temps de faire accoster votre pirogue sur la plage lorsque la femme, interrompant son ouvrage, se retourne avec une expression furieuse :</p>

<div class="conversation">
<p>— Est-ce que vous allez tous finir par me laisser tranquille ? Je croyais avoir…</p>
</div>

<p>Elle s’interrompt momentanément en réalisant que vous lui êtes inconnue, mais ne tarde pas à reprendre, d’un ton à peine moins hostile :</p>
<div class="conversation">
<p>— Tu es l’étrangère qui est arrivée hier, c’est ça ? Et bien, il n’y a rien d’intéressant pour toi ici. Retourne au village ou va te promener ailleurs, mais ne reste pas ici à me déranger.</p>

<p>Son accent l’identifie clairement comme une membre de la tribu, mais son apparence est assez différente des femmes que vous avez observées la veille au festin : sa chevelure abondante est attachée en une queue de cheval, elle porte un collier fait de nombreux coquillages et un paréo délavé lui entoure les reins. Elle a son couteau d’ivoire à la main et vous devinez qu’elle était en train de s’en servir pour retirer les coquillages accrochés à la coque de sa pirogue.</p>

<p>Il vous paraît probable que la présence de cette femme est le seul intérêt que présente cette île. Mais vous ne tirerez rien d’elle à moins de la convaincre que vous ne méritez pas son agressivité.</p>
    `,
    "next": function(goToSection) {
      const text1 = `Vous l’interrogez sur les voyages qu’elle réalise avec sa pirogue.`;
      const text2 = `Vous lui parlez de la course qui va vous opposer à Raiahui.`;
      const text3 = `Vous préférez repartir comme elle vous le demande.`;

      const choices = [
        {
          "text": text1,
          "action": () => {
            goToSection("faanarua-her-journey", coatSentence(text1));
          },
        },
        {
          "text": `Vous lui parlez de votre propre voyage.`,
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
<p>Le visage de la femme se plisse d’une grimace impatiente et vous vous attendez à ce qu’elle vous demande à nouveau de déguerpir. Il n’en est cependant rien : un soupir lui échappe et, après quelques instants, elle reprend la parole d’une voix plus calme :</p>

<div class="conversation">
<p>— Ecoute, je veux bien te parler si ça te fait partir plus vite. Mais ça fait un bon moment que je travaille sans rien manger et je commence à avoir vraiment faim. Rapporte-moi quelques crabes ou quelques écrevisses — il y en a plein le lagon — et je te raconterai ce que tu veux ensuite.</p>
</div>

<p>Vous n’obtiendrez clairement pas mieux que ce marché.</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const leaveText = `Vous le refusez et regagnez votre pirogue.`;
      const choices = [
        {
          "text": `Vous l’acceptez.`,
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
<p>Les eaux tièdes et transparentes du lagon se referment sur vous. Une multitude de petits poissons colorés se hâtent de disparaître dans les innombrables cachettes que leur fournissent les récifs de corail. Tenant dans une main le petit filet où vous rangerez vos prises, vous progressez à brasses lentes, cherchant du regard des proies moins mobiles.</p>

<p>Une douleur effroyable vous transperce soudain la jambe et, sous le choc, vous laissez échapper tout l’air que contenaient vos poumons. Vous essayez aussitôt de remonter vers la surface, mais vous êtes retenue par une étreinte féroce. Vous vous débattez en vain contre votre agresseur, que vous ne parvenez pas à distinguer clairement.  La panique instinctive qui vous emplit diminue vos forces plutôt qu’elle ne les accroît et un voile sombre ne tarde pas à recouvrir vos yeux. La dernière chose que vous voyez avant que tout ne disparaisse est l’épaisse couleur écarlate qui souille l’eau précédemment cristalline.</p>
    `,
    "next": endGame,
  },
  "faanarua-your-journey": {
    "text": `
<p>Une expression agacée se peint sur le visage de la femme tandis vous lui expliquez le principe de votre voyage d’initiation, mais elle disparaît peu à peu lorsque vous commencez à lui parler des îles que vous avez visité. Ses commentaires — d’abord assez brefs — révèlent vite que certaines d’entre elles lui sont familières.</p>

<div class="conversation">
<p>— Alors comme ça tu es passée chez les Tongakiri ? fait-elle à un moment. Est-ce qu’ils sont toujours en train de sculpter cette statue en pierre ridiculement grande de je ne sais quel chef légendaire ?</p>
<p>— Ils devaient la mettre en place justement le jour où je suis arrivée, mais ils s’y sont mal pris : la statue s’est renversée et cassée en trois. J’ai décidé de vite repartir lorsque le chamane de la tribu a déclaré que c’était parce que les dieux étaient mécontents et qu’il fallait leur faire un sacrifice.</p>
</div>

<p>Ce récit fait rire votre interlocutrice et détend pour de bon l’atmosphère. Pendant quelques instants agréables, vous vous décrivez l’une à l’autre vos découvertes et vos rencontres les plus saisissantes. La femme est clairement une grande voyageuse et vous apprenez beaucoup en l’écoutant. Mais elle met finalement un terme à cet échange en abordant un sujet différent :</p>
<div class="conversation">
<p>— Tu ne peux pas savoir quelle révélation t’apportera ton voyage, bien sûr, mais en quoi est-ce que tu espères qu’il te changera ?</p>
</div>

<p>C’est une excellente question, mais la réflexion prolongée qu’elle mérite demanderait clairement plus de temps libre que vous n’en avez aujourd’hui.</p>

<p>Deux idées vagues de réponse vous viennent cependant à l’esprit :</p>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const choices = [
        {
          "text": `— Je voudrais que ce voyage m’apporte une vision plus vaste du monde tout entier.`,
          "action": () => {
            updateFlag("time", flags.time+1);
            updateFlag("talkedWithFaanarua", true);
            return "faanarua-the-world";
          },
        },
        {
          "text": `— Je voudrais que ce voyage me donne une vision différente de mon île natale et de ma tribu.`,
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
<p>La femme vous donne une tape amicale sur l’épaule.</p>

<div class="conversation">
<p>— Ma petite, tu commences à me plaire ! Je m’appelle Faanarua, au fait.</p>
<p>— Moi, c’est Mananuiva.</p>
<p>— Alors écoute-moi bien, Mananuiva, parce que je vais te donner quelques conseils utiles pour gagner la course de ce soir.</p>
</div>

<p>Vous dressez aussitôt l’oreille avec intérêt.</p>

<div class="conversation">
<p>— Est-ce qu’il y a des courants ou des récifs dangereux entre les deux îles ? demandez-vous. Je suis passée là en pirogue et je n’ai rien remarqué.</p>
</div>

<p>Faanarua secoue la tête.</p>

<div class="conversation">
<p>— Il n’y a rien de tout cela, c’est un trajet tout à fait simple. Mais la course elle-même n’est pas le genre de compétition que tu imagines sans doute. Il faudra que tu réfléchisses différemment. Pour commencer, si tu ne pars pas avec une bonne avance sur Raiahui, tu vas forcément perdre.</p>
<p>— Je suis une excellente nageuse ! protestez-vous, quelque peu vexée.</p>
</div>

<p>Un bref sourire traverse le visage de votre interlocutrice.</p>

<div class="conversation">
<p>— Fais-moi confiance, Raiahui nage beaucoup plus vite que toi. Elle le sait, comme tout le reste de la tribu. D’une certaine façon, cela joue à ton avantage : elle ne voudra pas partir en même temps que toi, parce que ça suggèrerait qu’elle manque de confiance en elle-même. Mais il ne faut pas trop compter sur cela pour te donner une chance : Raiahui ne prendra pas intentionnellement le risque de perdre cette course. Si tu veux gagner, il faudra te débrouiller pour qu’elle entre dans l’eau plus tard qu’elle ne le voudrait.</p>
</div>

<p>Elle s’arrête un instant pour réfléchir, tandis que vous digérez ce conseil pour le moins étrange.</p>

<div class="conversation">
<p>— Même avec une solide avance, il faudra que tu prêtes très attention à tout ce qui t’entoure et que tu saches réagir rapidement à l’inattendu, ajoute-t-elle après un moment. Je n’ai pas de conseil infaillible à te donner, mais je viens de penser à un objet qui pourrait peut-être t’être utile. Comme tous les membres de la tribu, j’ai accompli ce même rite de passage, mais l’étranger que j’ai eu pour adversaire n’était pas quelqu’un d’ordinaire : il avait une amulette qui en faisait de lui un nageur exceptionnel.</p>
<p>— Vous voulez dire qu’il utilisait une amulette magique ? interrompez-vous. Est-ce que ce n’était pas de la triche ?</p>
<p>— Oublie ces histoires de triche, vous dit Faanarua. En-dehors du fait qu’elle doit s’accomplir à la nage, cette course n’a presque aucune règle. C’est l’astuce qui permet de gagner alors qu’on devrait perdre. Et c’est ce qui s’est passé à l’époque : j’ai volé l’amulette de mon adversaire et, comme je n’arrivais ni à m’en servir, ni à la détruire, je l’ai tout simplement enfouie quelque part. Lorsque la course a eu lieu, j’ai facilement gagné.</p>
<p>— Et l’amulette ?</p>
<p>— Je ne suis jamais retournée la chercher. Je l’avais enterrée au milieu de la toute petite île qui se trouve à l’autre bout de l’atoll.</p>
<p>— Mais vous avez dit que vous n’arriviez pas à vous en servir…</p>
<p>— Je suis en quelque sorte incompatible, mais elle marchera certainement pour toi. Elle a peut-être perdu un peu en pouvoir — je l’ai abîmée en essayant de la briser — mais je crois sincèrement qu’elle pourrait t’être utile.</p>
</div>

<p>Un sourire étrange plisse les lèvres de Faanarua.</p>

<div class="conversation">
<p>— J’ai raconté à Raiahui l’histoire de cette amulette, mais je suis sûre qu’elle n’y fera pas attention même si elle te voit la porter autour du cou. La vigilance fait partie des nombreuses choses qu’elle n’a pas héritées de moi.</p>
</div>

<p>Il vous faut un instant pour réaliser ce qu’elle vient de dire.</p>

<div class="conversation">
<p>— Raiahui est votre fille ?</p>
<p>— Ce genre de liens n’a pas ici l’importance à laquelle tu es habituée. Raiahui et moi n’avons à peu près rien en commun. C’est à toi que je souhaite d’avoir l’astuce et la ténacité nécessaires. Crois-moi, ce sont des qualités bien supérieures à n’importe quel objet magique.</p>
</div>
    `,
    "next": function(goToSection) {
      const text = `Faanarua n’a pas d’autres conseils à vous fournir et, après l’avoir remerciée, vous regagnez votre pirogue.`;
      const action = "back-to-hub";

      return repeatingFunnel(goToSection, text, action);
    },
  },
  "faanarua-my-world": {
    "text":`
<p>La femme hoche pensivement la tête en vous écoutant.</p>

<div class="conversation">
<p>— Il faut que je me remette au travail, dit-elle. J’aimerais repartir dès demain et cette pirogue a encore besoin d’entretien. Mais tu m’es moins désagréable que les membres de ma tribu et je vais donc te donner trois conseils pour la course de ce soir. Le premier est très simple, mais facilement négligé : c’est de prendre le temps de réfléchir et de ne pas t’arrêter aux apparences. Le deuxième est que tu ne pourras gagner qu’en te montrant suffisamment astucieuse : en-dehors du fait qu’elle doit s’effectuer à la nage, cette course n’a presque aucune règle. Et le troisième conseil est de prendre autant d’avance que possible avant même que Raiahui ne soit dans l’eau.</p>
</div>
    `,
    "next": function(goToSection) {
      const text = `Elle n’a rien d’autre à ajouter et, après l’avoir remerciée, vous regagnez votre pirogue.`;
      const action = "back-to-hub";

      return repeatingFunnel(goToSection, text, action);
    }
  },
  "faanarua-raiahui": {
    "text": `
<p>La femme ne tarde pas à vous interrompre :</p>

<div class="conversation">
<p>— Je suis déjà au courant de la course entre Raiahui et toi. Ca ne m’intéresse absolument pas.</p>
<p>— C’est tout de même un rite de passage à l’âge adulte…</p>
<p>— C’est une coutume idiote, oui. Qu’est-ce que tu imagines que cela t’apportera de participer à cette course ?</p>
</div>

<p>Vous essayez de lui expliquer que vous êtes vous-même en train d’accomplir un rite de passage et de lui décrire ce que vous recherchez. Elle vous écoute avec une moue dubitative.</p>

<div class="conversation">
<p>— Voyager en quête d’une révélation me paraît tout à fait respectable, mais je ne vois toujours pas ce que tu espères trouver ici.</p>
</div>
    `,
    "next": function(goToSection, flags, updateFlag) {
      const choices = [
        {
          "text": `Vous répondez que participer à la course pourrait vous aider à découvrir quelque chose sur vous-même.`,
          "action": "faanarua-her-journey",
        },
        {
          "text": `Vous lui parlez de l’Écume des Profondeurs, la récompense qu’on vous a promise si vous l’emportez.`,
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
