import React from 'react';
import PropTypes from 'prop-types';
import Text from './Text.js';
import { Navbar, Nav, Modal } from 'react-bootstrap';
import Title from './Title.js';
import InventoryButton from './InventoryButton.js';
import OptionButton from './OptionButton.js';
import ReactDOM from 'react-dom';
import jump from 'jump.js';
import Settings from './Settings.js';

class Game extends React.Component {
  constructor(props) {
    super(props);

    const currentSection = this.props.currentSection || this.props.startingSection;
    const currentFlags = Object.assign({}, this.props.startingFlags, this.props.currentFlags || {});
    const currentLogs = this.props.currentLogs || [];
    const settings = Object.assign({}, {"fontSize": 14, "justified": false, "noTransitions": false}, this.props.currentSettings || {});

    this.state = {
      "currentSection": currentSection,
      "flags": currentFlags,
      "logs": currentLogs,
      "currentSectionText": this.processText(currentSection, currentFlags),
      "scrollOffset": 0,
      "settings": settings,
      "showSettings": false,
      "scrollToNextSection": true,
    };
    this.saveProgress(currentSection, currentFlags, currentLogs);
  }

  goToSection = (section, extraLog = '') => {
    this.setState((prevState, props) => {
      const flags = prevState.flags;
      const text = this.processText(section, flags);

      let log;
      if (typeof extraLog === 'function') {
        log = extraLog(prevState.currentSectionText);
      } else {
        log = prevState.currentSectionText + extraLog;;
      }

      const logs = log.length > 0 ? prevState.logs.concat([log]) : prevState.logs;

      this.saveProgress(section, flags, logs);

      const offset = (window.scrollY > 0) ? window.scrollY : prevState.scrollOffset;

      return {
        "currentSection": section,
        "logs": logs,
        "currentSectionText": text,
        "scrollOffset": offset,
        "scrollToNextSection": true,
      };
    });
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
      "scrollOffset": 0,
      "scrollToNextSection": true,
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

      this.props.updateAchievements(updatedFlags);
      this.props.updateGallery(updatedFlags);

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

  showSettings = () => {
    this.setState({
      "showSettings": true,
      "scrollToNextSection": false,
      "scrollOffset": window.scrollY,
    })
  }

  hideSettings = () => {
    this.setState({
      "showSettings": false,
    })
  }

  getOptions = () => {
    return [
      {
        "key": "settings",
        "action": this.showSettings,
        "text": `Paramètres`,
      },
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

  scrollActiveSectionToTop = (behavior='auto') => {
    const element = ReactDOM.findDOMNode(this.currentSectionRef);
    if (!element) {
      return;
    }

    const offset = this.state.logs.length > 0 ? 10 : 0;

    if ("smooth" === behavior) {
      const scrollBy = element.offsetTop + offset - window.scrollY;
      if (scrollBy > 0) {
        jump(scrollBy, {
          duration: 500,
          callback: () => {
            this.stopPlayingWithScroll = false;
          },
          easing: (t, b, c, d) => c*(t/=d)*t + b,
        });
        return;
      }
    }

    window.scrollTo(0, element.offsetTop + offset);
    this.stopPlayingWithScroll = false;
  }

  maintainScroll = () => {
    window.scrollTo(0, this.state.scrollOffset);
  }

  componentDidMount = () => {
    this.scrollActiveSectionToTop();
  }

  componentDidUpdate = () => {
    if (this.stopPlayingWithScroll) {
      return;
    }

    this.stopPlayingWithScroll = true;

    this.maintainScroll();
    if (!this.state.scrollToNextSection) {
      this.stopPlayingWithScroll = false;
      return;
    }
    this.scrollActiveSectionToTop(this.state.settings.noTransitions ? 'auto' : 'smooth');
  }

  updateSettings = (values) => {
    this.setState((prevState, props) => {
      const settings = Object.assign({}, prevState.settings, values);

      this.props.saveSettings(settings);

      return {
        "settings": settings,
      };
    });
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
        <div className={"container-fluid core font-"+this.state.settings.fontSize + (this.state.settings.justified ? " text-justify" : "")}>
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
        <Modal show={this.state.showSettings} onHide={this.hideSettings} className="settings">
          <Modal.Body>
            <Settings
              values={this.state.settings}
              update={this.updateSettings}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

Game.propTypes = {
  startingSection: PropTypes.string.isRequired,
  startingFlags: PropTypes.object.isRequired,
  currentSection: PropTypes.string,
  currentFlags: PropTypes.object,
  currentLogs: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  sections: PropTypes.object.isRequired,
  quit: PropTypes.func.isRequired,
  updateAchievements: PropTypes.func.isRequired,
  updateGallery: PropTypes.func.isRequired,
  saveProgress: PropTypes.func.isRequired,
  clearProgress: PropTypes.func.isRequired,
  currentSettings: PropTypes.object,
  saveSettings: PropTypes.func.isRequired,
};

export default Game;
