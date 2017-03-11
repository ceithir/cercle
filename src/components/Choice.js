import React from 'react';

class Choice extends React.Component {
  render() {
    return (
    	<a className="list-group-item choice" onClick={this.props.onClick}>{this.props.text}</a>
    );
  }
}

export default Choice;
