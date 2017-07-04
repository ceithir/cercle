import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './App.css';
import Game from './components/Game.js';
import TitleScreen from './components/TitleScreen.js';
import MemoryScreen from './components/MemoryScreen.js';
import CreditsScreen from './components/CreditsScreen.js';
import script from './scripts/script.js';
import flags from './scripts/flags.js';
import icon from './images/icon.jpg';
import cover from './images/cover.jpg';
import achievements from './scripts/achievements.js';
import Storage from './Storage.js';

const storage = new Storage("XNaZOJAPjfXevMueSJg6L75JjCEcuDAg");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "screen": "title",
      "achievements": storage.load("achievements") || [],
    };
  }

  newGame = () => {
    this.clearProgress();
    this.setState({
      "screen": "game",
      "section": null,
      "flags": null,
      "logs": null,
    });
  }

  continueGame = () => {
    const progress = storage.load("progress");

    this.setState({
      "screen": "game",
      "section": progress.section,
      "flags": progress.flags,
      "logs": progress.logs,
    });
  }

  titleScreen = () => {
    this.setState({
      "screen": "title",
    });
  }

  memoryScreen = () => {
    window.scrollTo(0, 0);
    this.setState({
      "screen": "achievements",
    });
  }

  creditsScreen = () => {
    this.setState({
      "screen": "credits",
    });
  }

  saveProgress = (currentSection, flags, logs) => {
    storage.save(
      "progress",
      {
        "section": currentSection,
        "flags": flags,
        "logs": logs,
      }
    );
  }

  clearProgress = () => {
    storage.save("progress", null);
  }

  updateAchievements = (flags) => {
    const newAchievements = achievements.filter((achievement) => {
      return achievement.condition(flags);
    }).map((achievement) => {
      return achievement.key;
    });

    this.setState((prevState, props) => {
      const achievements = prevState.achievements
        .concat(newAchievements)
        //Ref: http://stackoverflow.com/questions/11246758/how-to-get-unique-values-in-an-array#answer-23282057
        .filter(function(item, i, ar){ return ar.indexOf(item) === i; })
      ;
      storage.save("achievements", achievements);

      return {
        "achievements": achievements,
      };
    });
  }

  render() {
    const title = `Au Cœur d’un Cercle de Sable et d’Eau`;
    const newGameText = `Nouvelle partie`;
    const continueText = `Reprendre la partie précédente`;
    const achievementsText = `Souvenirs`;
    const creditsText = `Plumes`;
    const unlockedAchievements = this.state.achievements;

    if ("title" === this.state.screen) {
      let buttons = [
        {
          "text": newGameText,
          "action": this.newGame,
        }
      ];

      if (storage.load("progress")) {
        buttons.push({
          "text": continueText,
          "action": this.continueGame,
        });
      }

      if (unlockedAchievements.length > 0) {
        buttons.push({
          "text": achievementsText,
          "action": this.memoryScreen,
        });
      }

      buttons.push({
        "text": creditsText,
        "action": this.creditsScreen,
      });

      return (
        <TitleScreen title={title} image={cover} buttons={buttons} />
      );
    }

    if ("achievements" === this.state.screen) {
      return (
        <MemoryScreen
          title={achievementsText}
          achievements={achievements}
          quit={this.titleScreen}
          unlocked={unlockedAchievements}
        />
      );
    }

    if ("credits" === this.state.screen) {
      return (
        <CreditsScreen
          title={creditsText}
          quit={this.titleScreen}
        />
      );
    }

    return (
      <Game
        startingSection={"prelude"}
        startingFlags={flags}
        currentSection={this.state.section}
        currentFlags={this.state.flags}
        currentLogs={this.state.logs}

        title={title}
        sections={script}
        icon={icon}
        updateAchievements={this.updateAchievements}
        saveProgress={this.saveProgress}
        clearProgress={this.clearProgress}
        quit={this.titleScreen}
      />
    );
  }
}

export default App;
