import React from 'react';
import PropTypes from 'prop-types';
import Crossroads from './Crossroads.js';

class Funnel extends React.Component {
  render() {
    const choices = [{
      "text": this.props.text,
      "action": this.props.action,
      "conditional": this.props.conditional,
    }];

    return (
      <Crossroads context={this.props.context} choices={choices} />
    );
  }
}

Funnel.propTypes = {
  context: PropTypes.string,
  text: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  conditional: PropTypes.bool,
};

export default Funnel;
