import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './App.css';
import Game from './components/Game.js';
import TitleScreen from './components/TitleScreen.js';
import MemoryScreen from './components/MemoryScreen.js';
import CreditsScreen from './components/CreditsScreen.js';
import GalleryScreen from './components/GalleryScreen.js';
import script from './scripts/script.js';
import flags from './scripts/flags.js';
import icon from './images/icon.jpg';
import cover from './images/cover.jpg';
import achievements from './scripts/achievements.js';
import illustrations from './scripts/illustrations.js';
import Storage from './Storage.js';

const storage = new Storage("XNaZOJAPjfXevMueSJg6L75JjCEcuDAg");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "screen": "title",
      "achievements": storage.load("achievements") || [],
      "unlockedIllustrations": storage.load("illustrations") || this.getUnlockedIllustrations([], flags),
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

  galleryScreen = () => {
    this.setState({
      "screen": "gallery",
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

  getUnlockedIllustrations = (previouslyUnlockedIllustrations, flags) => {
    const playthroughIllustrations = illustrations.filter((illustration) => {
      return illustration.condition(flags);
    }).map((illustration) => {
      return illustration.key;
    });

    return previouslyUnlockedIllustrations.concat(playthroughIllustrations.filter((illustration) => {
      return -1 === previouslyUnlockedIllustrations.indexOf(illustration);
    }));
  }

  updateGallery = (flags) => {
    this.setState((prevState, props) => {
      const unlockedIllustrations = this.getUnlockedIllustrations(prevState.unlockedIllustrations, flags);
      storage.save("illustrations", unlockedIllustrations);

      return {
        "unlockedIllustrations": unlockedIllustrations,
      };
    });
  }

  saveSettings = (settings) => {
    storage.save("settings", settings);
  }

  canFastForward = () => {
    if (this.state.achievements.indexOf("the-truth") !== -1) {
      // Seen enough
      return true;
    }

    const atollBadEnds = ["tried-to-escape", "death-under-water", "the-witch-cup", "a-cursed-item", "the-witch-net", "the-crocodile-meal", "raiahui-good-end"];
    if (this.state.achievements.filter((achievement) => atollBadEnds.indexOf(achievement) !== -1).length >= 2) {
      // At least two different bad ends
      return true;
    }

    return false;
  }

  render() {
    const title = `Within a Circle of Sand and Water`;
    const newGameText = `New game`;
    const continueText = `Continue`;
    const achievementsText = `Memories`;
    const galleryText = `Gallery`;
    const creditsText = `Credits`;
    const unlockedAchievements = this.state.achievements;
    const settings = storage.load("settings");
    const canFastForward = this.canFastForward();
    const startingSection = this.canFastForward()? "quick-start": "prelude";

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
        "text": galleryText,
        "action": this.galleryScreen,
      });

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

    if ("gallery" === this.state.screen) {
      return (
        <GalleryScreen
          title={galleryText}
          illustrations={illustrations.map((illustration) => {
            return Object.assign(
              {},
              illustration,
              {
                "unlocked": -1 !== this.state.unlockedIllustrations.indexOf(illustration.key),
              },
            )
          })}
          quit={this.titleScreen}
        />
      );
    }

    return (
      <Game
        startingSection={startingSection}
        startingFlags={flags}
        currentSection={this.state.section}
        currentFlags={this.state.flags}
        currentLogs={this.state.logs}

        title={title}
        sections={script}
        icon={icon}
        updateAchievements={this.updateAchievements}
        updateGallery={this.updateGallery}
        currentSettings={settings}
        saveSettings={this.saveSettings}
        saveProgress={this.saveProgress}
        clearProgress={this.clearProgress}
        quit={this.titleScreen}
        canSave={storage.isAvailable()}
        canFastForward={canFastForward}
      />
    );
  }
}

export default App;
