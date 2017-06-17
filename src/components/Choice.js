import React from 'react';

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
  text: React.PropTypes.string.isRequired,
  action: React.PropTypes.func.isRequired,
  conditional: React.PropTypes.bool,
};

export default Choice;
