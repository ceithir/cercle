import React from 'react';
import Text from './Text.js';
import { Navbar, Nav } from 'react-bootstrap';
import Title from './Title.js';
import LogButton from './LogButton.js';
import InventoryButton from './InventoryButton.js';
import TextModal from './TextModal.js';
import NavComment from './NavComment.js';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "currentSection": this.props.startingSection,
      "flags": this.props.flags,
      "logs": this.props.logs,
      "modal": {"show": false},
      "currentSectionText": this.processText(this.props.startingSection, this.props.flags),
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

  reset = () => {
    this.props.reset();
    this.setState({
      "currentSection": this.props.resetSection,
      "flags": this.props.resetFlags,
      "logs": [],
      "currentSectionText": this.processText(this.props.resetSection, this.props.resetFlags),
    });
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div>
        <Navbar fixedTop fluid collapseOnSelect>
          <Title icon={this.props.icon} title={this.props.title}>
            {this.state.logs.length > 0 && <Navbar.Toggle />}
          </Title>
          <Navbar.Collapse>
            <Nav>
              <LogButton logs={this.state.logs} showModal={this.showModal} text={`Journal`} />
              <InventoryButton inventory={this.state.flags.inventory} showModal={this.showModal} text={`Inventaire`} />
              {this.props.comments(this.state.flags).map((comment, index) => {
                return (
                  <NavComment key={index.toString()} text={comment.text} color={comment.color} />
                );
              })}
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
              {this.getSection(this.state.currentSection).next(this.goToSection, this.state.flags, this.updateFlag, this.reset, this.props.quit)}
            </div>
          </div>
        </div>
        <TextModal close={this.closeModal} show={this.state.modal.show} title={this.state.modal.title} content={this.state.modal.content} />
      </div>
    );
  }
}

Game.propTypes = {
  title: React.PropTypes.string.isRequired,
  icon: React.PropTypes.string.isRequired,
  startingSection: React.PropTypes.string.isRequired,
  flags: React.PropTypes.object.isRequired,
  sections: React.PropTypes.object.isRequired,
  quit: React.PropTypes.func.isRequired,
  updateAchievements: React.PropTypes.func.isRequired,
  logs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  saveProgress: React.PropTypes.func.isRequired,
  reset: React.PropTypes.func.isRequired,
  resetSection: React.PropTypes.string.isRequired,
  resetFlags: React.PropTypes.object.isRequired,
  comments: React.PropTypes.func.isRequired,
};

export default Game;
