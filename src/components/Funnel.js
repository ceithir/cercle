import React from 'react';
import Crossroads from './Crossroads.js';

class Funnel extends React.Component {
  render() {
    const choices = [{
      "text": this.props.text,
      "action": this.props.action,
    }];

    return (
      <Crossroads text={this.props.context} choices={choices} />
    );
  }
}

Funnel.propTypes = {
  context: React.PropTypes.string,
  text: React.PropTypes.string.isRequired,
  action: React.PropTypes.func.isRequired,
};

export default Funnel;
