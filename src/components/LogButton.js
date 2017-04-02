import React from 'react';
import { NavItem } from 'react-bootstrap';

class LogButton extends React.Component {
  onSelect = () => {
    const modalTitle = this.props.text;
    const modalContent = this.props.logs;

    this.props.showModal(modalTitle, modalContent);
  }

  render() {
    if (!this.props.logs.length) {
      return null;
    }

    return (
      <NavItem onSelect={this.onSelect}>{this.props.text}</NavItem>
    );
  }
}

LogButton.propTypes = {
  text: React.PropTypes.string.isRequired,
  logs: React.PropTypes.array.isRequired,
  showModal: React.PropTypes.func.isRequired,
};

export default LogButton;
