import React from 'react';

class Choice extends React.Component {
  render() {
    return (
    	<a className="list-group-item choice" onClick={this.props.onClick}>{this.props.text}</a>
    );
  }
}

Choice.propTypes = {
  text: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
};

export default Choice;
