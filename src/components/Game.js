import React from 'react';
import Text from './Text.js';
import { Navbar, Nav } from 'react-bootstrap';
import Title from './Title.js';
import LogButton from './LogButton.js';
import InventoryButton from './InventoryButton.js';
import TextModal from './TextModal.js';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
  }

  getDefaultState = () => {
    return {
      "currentSection": this.props.startingSection,
      "flags": this.props.flags,
      "logs": [],
      "modal": {"show": false},
      "currentSectionText": this.processText(this.props.startingSection, this.props.flags),
    };
  }

  goToSection = (section) => {
    if (null === section) {
      this.setState(this.getDefaultState());
      window.scrollTo(0, 0);
      return;
    }

    this.setState((prevState, props) => {
      const text = this.processText(section, prevState.flags);
      const logs = prevState.logs.concat([prevState.currentSectionText]);

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

  updateFlag = (flag, newValue) => {
    this.setState((prevState, props) => {
      let newFlag = {};
      newFlag[flag] = newValue;
      const flags = Object.assign({}, prevState.flags, newFlag);
      this.updateAchievements(flags);

      return {
        "flags": flags,
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

  render() {
    return (
      <div>
        <Navbar fixedTop fluid collapseOnSelect>
          <Title icon={this.props.icon} title={this.props.title}>
            {this.state.logs.length > 0 && <Navbar.Toggle />}
          </Title>
          <Navbar.Collapse>
            <Nav>
              <LogButton logs={this.state.logs} showModal={this.showModal} text="Journal" />
              <InventoryButton inventory={this.state.flags.inventory} showModal={this.showModal} text="Inventaire" />
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
              {this.getSection(this.state.currentSection).next(this.goToSection, this.state.flags, this.updateFlag, this.props.quit)}
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
};

export default Game;
