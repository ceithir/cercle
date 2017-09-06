import React from 'react';
import PropTypes from 'prop-types';

class Choice extends React.Component {
  onClick = (event) => {
    event.preventDefault();
    event.target.blur();
    this.props.action();
  }

  render() {
    return (
    	<a
        className="list-group-item choice"
        href="#"
        onClick={this.onClick}
      >
        {!this.props.conditional && this.props.text}
        {this.props.conditional && <span className="text-conditional">{this.props.text}</span>}
      </a>
    );
  }
}

Choice.propTypes = {
  text: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  conditional: PropTypes.bool,
};

export default Choice;
