import React from 'react';
import Text from './Text.js';
import { Navbar, Nav } from 'react-bootstrap';
import Title from './Title.js';
import InventoryButton from './InventoryButton.js';
import OptionButton from './OptionButton.js';
import ReactDOM from 'react-dom';

class Game extends React.Component {
  constructor(props) {
    super(props);

    const currentSection = this.props.currentSection || this.props.startingSection;
    const currentFlags = this.props.currentFlags || this.props.startingFlags;
    const currentLogs = this.props.currentLogs || [];

    this.state = {
      "currentSection": currentSection,
      "flags": currentFlags,
      "logs": currentLogs,
      "currentSectionText": this.processText(currentSection, currentFlags),
    };
    this.saveProgress(currentSection, currentFlags, currentLogs);
  }

  goToSection = (section, extraLog = '') => {
    this.setState((prevState, props) => {
      const flags = prevState.flags;
      const text = this.processText(section, flags);

      const log = prevState.currentSectionText + extraLog;
      const logs = prevState.logs.concat([log]);

      this.saveProgress(section, flags, logs);

      return {
        "currentSection": section,
        "logs": logs,
        "currentSectionText": text,
      };
    });
  }

  updateAchievements = (flags) => {
    this.props.updateAchievements(flags);
  }

  saveProgress = (currentSection, flags, logs) => {
    this.props.saveProgress(currentSection, flags, logs);
  }

  reset = (section, flags) => {
    const currentSection = section || this.props.startingSection;
    const currentFlags = flags || this.props.startingFlags;
    const currentLogs = [];

    this.setState({
      "currentSection": currentSection,
      "flags": currentFlags,
      "logs": currentLogs,
      "currentSectionText": this.processText(currentSection, currentFlags),
    });
    this.props.saveProgress(currentSection, currentFlags, currentLogs);
  }

  quit = () => {
    this.props.quit();
  }

  resetAndQuit = () => {
    this.props.clearProgress();
    this.quit();
  }

  updateFlag = (flag, newValue) => {
    this.setState((prevState, props) => {
      let updatedFlags = Object.assign({}, prevState.flags);

      if ('string' === typeof flag) {
        updatedFlags[flag] = newValue;
      }

      if (Array.isArray(flag)) {
        if (0 === flag.length) {
          return null;
        }

        const propagate = (object, keys, value) => {

          let remainingKeys = keys.slice();
          const key = remainingKeys.shift();

          if (0 === remainingKeys.length) {
            return Object.assign({}, object, {[key]: value});
          }

          return Object.assign({}, object, {[key]: propagate(object[key], remainingKeys, value)});
        }

        updatedFlags = propagate(updatedFlags, flag, newValue);
      }

      this.updateAchievements(updatedFlags);

      return {
        "flags": updatedFlags,
      };
    });
  }

  processText = (sectionKey, flags) => {
    const text = this.getSection(sectionKey)["text"];

    if ('string' === typeof text) {
      return text;
    }

    return text(flags);
  }

  getSection = (sectionKey) => {
    if (!this.props.sections[sectionKey]) {
      console.error(`Section ${sectionKey} is not defined`);
      return {
        "text": "",
        "next": () => {},
      };
    }

    return this.props.sections[sectionKey];
  }

  getOptions = () => {
    return [
      {
        "key": "autosave",
        "text": `Ce jeu sauvegarde automatiquement.`,
      },
      {
        "key": "reset",
        "action": this.reset,
        "text": `Recommencer`,
      },
      {
        "key": "quit",
        "action": this.quit,
        "text": `Retourner à l’écran titre`,
      },
    ];
  }

  resetScrolling = () => {
    const element = ReactDOM.findDOMNode(this.currentSectionRef);
    if (!element) {
      return;
    }

    const offset = this.state.logs.length > 0 ? 10 : 0;

    window.scrollTo(0, element.offsetTop + offset);
  }

  componentDidMount = () => {
    this.resetScrolling();
  }

  componentDidUpdate = () => {
    this.resetScrolling();
  }

  render() {
    return (
      <div>
        <Navbar fixedTop fluid collapseOnSelect>
          <Title icon={this.props.icon} title={this.props.title}>
          <Navbar.Toggle />
          </Title>
          <Navbar.Collapse>
            <Nav>
              <InventoryButton inventory={this.state.flags.inventory} text={`Inventaire`} />
            </Nav>
            <Nav pullRight>
              <OptionButton options={this.getOptions()} text={`Options`} />
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="container-fluid core">
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <div className="logs">
                {this.state.logs.map((log, index) => {
                  return (
                    <div key={index.toString()}>
                      <Text content={log} />
                      <hr/>
                    </div>
                  );
                })}
              </div>
              <Text content={this.state.currentSectionText} ref={(ref) => { this.currentSectionRef = ref; }} />
            </div>
          </div>
          <div className="row next">
            <div className="col-md-8 col-md-offset-2">
              {this.getSection(this.state.currentSection).next(this.goToSection, this.state.flags, this.updateFlag, this.reset, this.resetAndQuit)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Game.propTypes = {
  startingSection: React.PropTypes.string.isRequired,
  startingFlags: React.PropTypes.object.isRequired,
  currentSection: React.PropTypes.string,
  currentFlags: React.PropTypes.object,
  currentLogs: React.PropTypes.arrayOf(React.PropTypes.string),
  title: React.PropTypes.string.isRequired,
  icon: React.PropTypes.string.isRequired,
  sections: React.PropTypes.object.isRequired,
  quit: React.PropTypes.func.isRequired,
  updateAchievements: React.PropTypes.func.isRequired,
  saveProgress: React.PropTypes.func.isRequired,
  clearProgress: React.PropTypes.func.isRequired,
};

export default Game;
