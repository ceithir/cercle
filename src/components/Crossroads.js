import React from 'react';
import Choice from './Choice.js';

class Crossroads extends React.Component {
  render() {
    const choices = this.props.choices.map((choice, index) =>
      <Choice
        text={choice.text}
        action={choice.action}
        conditional={choice.conditional}
        key={index.toString()}
      />
    );
    return (
      <div className="panel panel-default">
        {this.props.context &&
          <div className="panel-heading">
            {this.props.context}
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
  context: React.PropTypes.string,
  choices: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};

export default Crossroads;
