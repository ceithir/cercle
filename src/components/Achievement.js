import React from 'react';
import { Panel } from 'react-bootstrap';

class Achievement extends React.Component {
  render() {
    return (
      <Panel header={this.props.name} className={this.props.disabled ? "disabled" : ""}>{this.props.description}</Panel>
    );
  }
}

Achievement.propTypes = {
  name: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  disabled: React.PropTypes.bool,
};

export default Achievement;
