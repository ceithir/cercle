import React from 'react';
import Text from './Text.js';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "currentSection": this.props.startingSection,
      "flags": this.props.flags,
    };
  }

  goToSection = (section) => {
    this.setState((prevState, props) => {
      return {
        "currentSection": section,
      };
    });
    window.scrollTo(0, 0);
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
    );
  }
}

export default Game;
