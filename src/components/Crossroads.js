import React from 'react';
import Choice from './Choice.js';

class Crossroads extends React.Component {
  render() {
  	const choices = this.props.choices.map((choice, index) =>
  		<Choice
        text={choice.text}
        onClick={choice.onClick}
        key={index.toString()}
      />
	);
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          {this.props.text}
        </div>
        <div className="list-group">
          {choices}
        </div>
      </div>
    );
  }
}

Crossroads.propTypes = {
  text: React.PropTypes.string.isRequired,
  choices: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};

export default Crossroads;
