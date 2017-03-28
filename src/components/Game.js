import React from 'react';
import Text from './Text.js';
import { Navbar, Nav } from 'react-bootstrap';
import Title from './Title.js';
import LogButton from './LogButton.js';
import InventoryButton from './InventoryButton.js';
import TextModal from './TextModal.js';
import OptionButton from './OptionButton.js';

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
      "modal": {"show": false},
      "currentSectionText": this.processText(currentSection, currentFlags),
    };
    window.scrollTo(0, 0);
  }

  goToSection = (section) => {
    this.setState((prevState, props) => {
      const flags = prevState.flags;
      const text = this.processText(section, flags);
      const logs = prevState.logs.concat([prevState.currentSectionText]);

      this.saveProgress(section, flags, logs);

      return {
        "currentSection": section,
        "logs": logs,
        "currentSectionText": text,
      };
    });
    window.scrollTo(0, 0);
  }

  showModal = (title, content) => {
    this.setState(() => {
      return {
        "modal": {
          "show": true,
          "title": title,
          "content": content,
        },
      };
    });
  }

  closeModal = () => {
    this.setState(() => {
      return {
        "modal": {"show": false},
      };
    });
  }

  updateAchievements = (flags) => {
    this.props.updateAchievements(flags);
  }

  saveProgress = (currentSection, flags, logs) => {
    this.props.saveProgress(currentSection, flags, logs);
  }

  reset = () => {
    this.props.clearProgress();

    const currentSection = this.props.startingSection;
    const currentFlags = this.props.startingFlags;

    this.setState({
      "currentSection": currentSection,
      "flags": currentFlags,
      "logs": [],
      "currentSectionText": this.processText(currentSection, currentFlags),
    });
    window.scrollTo(0, 0);
  }

  quit = () => {
    this.props.quit();
  }

  resetAndQuit = () => {
    this.reset();
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
        "key": "quit",
        "action": this.quit,
        "text": `Retour à l’écran titre`,
      },
      {
        "key": "reset",
        "action": this.reset,
        "text": `Recommencer`,
      },
    ];
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
              <LogButton logs={this.state.logs} showModal={this.showModal} text={`Journal`} />
              <InventoryButton inventory={this.state.flags.inventory} showModal={this.showModal} text={`Inventaire`} />
            </Nav>
            <Nav pullRight>
              <OptionButton options={this.getOptions()} text={`Options`} />
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="container-fluid main">
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <Text content={this.state.currentSectionText} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              {this.getSection(this.state.currentSection).next(this.goToSection, this.state.flags, this.updateFlag, this.reset, this.resetAndQuit)}
            </div>
          </div>
        </div>
        <TextModal close={this.closeModal} show={this.state.modal.show} title={this.state.modal.title} content={this.state.modal.content} />
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
