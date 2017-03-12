import React, { Component } from 'react';
import './App.css';
import Game from './components/Game.js';
import script from './scripts/script.js';
import flags from './scripts/flags.js';
import icon from './images/icon.jpg';

class App extends Component {
  render() {
    const title = "Au Cœur d’un Cercle de Sable et d’Eau";
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
