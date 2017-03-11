import React, { Component } from 'react';
import './App.css';
import Game from './components/Game.js';
import script from './scripts/script.js';
import flags from './scripts/flags.js';
import icon from './images/icon.jpg';

const title = "Au Cœur d’un Cercle de Sable et d’Eau";
const startingSection = "prelude";

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <div className="navbar-brand">
                <img src={icon} className="visible-xs visible-xm" title={title} alt="" />
                <span className="hidden-xs hidden-xm">{title}</span>
              </div>
            </div>
          </div>
        </nav>
        <Game startingSection={startingSection} sections={script} flags={flags} />
      </div>
    );
  }
}

export default App;
