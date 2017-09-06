import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'react-bootstrap';

class Achievement extends React.Component {
  render() {
    return (
      <Panel header={this.props.name} className={this.props.disabled ? "disabled" : ""}>{this.props.description}</Panel>
    );
  }
}

Achievement.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default Achievement;
