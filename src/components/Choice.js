import React from 'react';

class Choice extends React.Component {
  render() {
    return (
    	<a className="list-group-item choice" onClick={this.props.action}>
        {!this.props.conditional && this.props.text}
        {this.props.conditional && <span className="text-info">{this.props.text}</span>}
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
