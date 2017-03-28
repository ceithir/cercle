import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './App.css';
import Game from './components/Game.js';
import TitleScreen from './components/TitleScreen.js';
import MemoryScreen from './components/MemoryScreen.js';
import script from './scripts/script.js';
import flags from './scripts/flags.js';
import icon from './images/icon.jpg';
import cover from './images/cover.jpg';
import achievements from './scripts/achievements.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "screen": "title",
      "achievements": window.localStorage.getItem("achievements") ? JSON.parse(window.localStorage.getItem("achievements")) : [],
      "section": "prelude",
      "flags": flags,
      "logs": [],
    };
  }

  newGame = () => {
    this.clearProgress();
    this.setState({
      "screen": "game",
      "section": "prelude",
      "flags": flags,
      "logs": [],
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

  continueScreen = () => {
    const progress = JSON.parse(window.localStorage.getItem("progress"));

    this.setState({
      "screen": "game",
      "section": progress.section,
      "flags": progress.flags,
      "logs": progress.logs,
    });
  }

  saveProgress = (currentSection, flags, logs) => {
    window.localStorage.setItem(
      "progress",
      JSON.stringify({
        "section": currentSection,
        "flags": flags,
        "logs": logs,
      })
    );
  }

  clearProgress = () => {
    window.localStorage.removeItem("progress");
  }

  softReset = () => {
    this.clearProgress();
    this.titleScreen();
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
      window.localStorage.setItem("achievements", JSON.stringify(achievements));

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
    const unlockedAchievements = this.state.achievements;

    if ("title" === this.state.screen) {
      let buttons = [
        {
          "text": newGameText,
          "action": this.newGame,
        }
      ];

      if (window.localStorage.getItem("progress")) {
        buttons.push({
          "text": continueText,
          "action": this.continueScreen,
        });
      }

      if (unlockedAchievements.length > 0) {
        buttons.push({
          "text": achievementsText,
          "action": this.memoryScreen,
        });
      }

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

    return (
      <Game
        startingSection={this.state.section}
        flags={this.state.flags}
        logs={this.state.logs}
        title={title}
        sections={script}
        icon={icon}
        quit={this.softReset}
        updateAchievements={this.updateAchievements}
        saveProgress={this.saveProgress}
        reset={this.clearProgress}
        resetSection="prelude"
        resetFlags={flags}
      />
    );
  }
}

export default App;
