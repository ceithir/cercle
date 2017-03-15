import React from 'react';
import Choice from './Choice.js';

class Crossroads extends React.Component {
  render() {
    const choices = this.props.choices.map((choice, index) =>
      <Choice
        text={choice.text}
        onClick={choice.onClick}
        condition={choice.condition}
        key={index.toString()}
      />
    );
    return (
      <div className="panel panel-default">
        {this.props.text &&
          <div className="panel-heading">
            {this.props.text}
          </div>
        }
        <div className="list-group">
          {choices}
        </div>
      </div>
    );
  }
}

Crossroads.propTypes = {
  text: React.PropTypes.string,
  choices: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};

export default Crossroads;
