import coverImage from "./../images/rest.jpg";
import raiahuiIntroImage from "./../images/raiahui-intro.jpg";
import chiefImage from "./../images/chief.jpg";
import feastImage from "./../images/feast.jpg";
import crocodileImage from "./../images/crocodile.jpg";
import raiahuiFriendsImage from "./../images/raiahui-friends.jpg";
import squaleImage from "./../images/squale.jpg";
import sunsetImage from "./../images/sunset.jpg";

const illustrations = [
  {
    key: "cover",
    src: coverImage,
    condition: (flags) => {return true;},
    width: 1200,
    height: 1600,
  },
  {
    key: "raiahui",
    src: raiahuiIntroImage,
    condition: (flags) => {return flags.wentBeyondIntroduction;},
    width: 1200,
    height: 1600,
  },
  {
    key: "chief",
    src: chiefImage,
    condition: (flags) => {return flags.wentBeyondIntroduction;},
    width: 1200,
    height: 1600,
  },
  {
    key: "feast",
    src: feastImage,
    condition: (flags) => {return flags.wentBeyondIntroduction;},
    width: 1200,
    height: 1600,
  },
  {
    key: "crocodile",
    src: crocodileImage,
    condition: (flags) => {return flags.damagedBoat;},
    width: 1600,
    height: 1200,
  },
  {
    key: "trial",
    src: raiahuiFriendsImage,
    condition: (flags) => {return flags.reachedTheTrial;},
    width: 1200,
    height: 1600,
  },
  {
    key: "squale",
    src: squaleImage,
    condition: (flags) => {return flags.seenRaiahuiTrueForm;},
    width: 1600,
    height: 1200,
  },
  {
    key: "sunset",
    src: sunsetImage,
    condition: (flags) => {return flags.survivedTheTrial;},
    width: 1200,
    height: 1600,
  },
];

export default illustrations;
