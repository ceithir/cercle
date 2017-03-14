import React from 'react';
import Text from './Text.js';
import { Navbar, Nav } from 'react-bootstrap';
import Title from './Title.js';
import LogButton from './LogButton.js';
import TextModal from './TextModal.js';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "currentSection": this.props.startingSection,
      "flags": this.props.flags,
      "logs": [],
      "modal": {"show": false},
    };
  }

  goToSection = (section) => {
    this.setState((prevState, props) => {
      var logs = prevState.logs.slice();
      logs.push(prevState.currentSection);

      return {
        "currentSection": section,
        "logs": logs,
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

  render() {
    if (undefined === this.props.sections[this.state.currentSection]) {
      console.error(`Section ${this.state.currentSection} is not defined`);
      return null;
    }

    const section = this.props.sections[this.state.currentSection];

    return (
      <div>
        <Navbar fixedTop fluid>
          <Title icon={this.props.icon} title={this.props.title} />
          <Nav>
            <LogButton logs={this.state.logs} sections={this.props.sections} showModal={this.showModal} text="Journal" />
          </Nav>
        </Navbar>
        <div className="container-fluid main">
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <Text content={section.text} />
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
