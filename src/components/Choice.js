import React from 'react';

class Choice extends React.Component {
  render() {
    return (
    	<a className="list-group-item choice" onClick={this.props.action}>
        {this.props.text}
        {this.props.condition && " ["+this.props.condition+"]"}
      </a>
    );
  }
}

Choice.propTypes = {
  text: React.PropTypes.string.isRequired,
  action: React.PropTypes.func.isRequired,
  condition: React.PropTypes.string,
};

export default Choice;
