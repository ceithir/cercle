import React from 'react';
import Crossroads from './Crossroads.js';

class Funnel extends React.Component {
  render() {
    const choices = [{
      "text": this.props.text,
      "onClick": this.props.action,
    }];

    return (
      <Crossroads text={this.props.context} choices={choices} />
    );
  }
}

Crossroads.propTypes = {
  context: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired,
  action: React.PropTypes.func.isRequired,
};

export default Funnel;
