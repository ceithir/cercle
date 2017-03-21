import React, { Component } from 'react';
import './App.css';
import Game from './components/Game.js';
import TitleScreen from './components/TitleScreen.js';
import script from './scripts/script.js';
import flags from './scripts/flags.js';
import icon from './images/icon.jpg';
import cover from './images/cover.jpg';

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

  render() {
    const title = "Au Cœur d’un Cercle de Sable et d’Eau";

    if ("title" === this.state.screen) {
      const buttons = [
        {
          "text": "Nouvelle partie",
          "action": this.newGame,
        }
      ];

      return (
        <TitleScreen title={title} image={cover} buttons={buttons} />
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
      />
    );
  }
}

export default App;
