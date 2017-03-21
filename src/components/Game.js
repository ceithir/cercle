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

  updateFlag = (flag, newValue) => {
    this.setState((prevState, props) => {
      let newFlag = {};
      newFlag[flag] = newValue;
      return {
        "flags": Object.assign({}, prevState.flags, newFlag),
      };
    });
  }

  processText = (section, flags) => {
    const text = this.props.sections[section]["text"];

    if ('string' === typeof text) {
      return text;
    }

    return text(flags);
  }

  render() {
    if (undefined === this.props.sections[this.state.currentSection]) {
      console.error(`Section ${this.state.currentSection} is not defined`);
      return null;
    }

    const section = this.props.sections[this.state.currentSection];

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
              {section.next(this.goToSection, this.state.flags, this.updateFlag)}
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
};

export default Game;
