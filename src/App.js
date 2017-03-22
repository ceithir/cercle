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
    };
  }

  newGame = () => {
    this.setState({
      "screen": "game",
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

  render() {
    const title = `Au Cœur d’un Cercle de Sable et d’Eau`;
    const newGameText = `Nouvelle partie`;
    const achievementsText = `Succès passés`;
    const unlockedAchievements = [];

    if ("title" === this.state.screen) {
      let buttons = [
        {
          "text": newGameText,
          "action": this.newGame,
        }
      ];

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

    const startingSection = "prelude";

    return (
      <Game
        title={title}
        sections={script}
        startingSection={startingSection}
        flags={flags}
        icon={icon}
        quit={this.titleScreen}
      />
    );
  }
}

export default App;
