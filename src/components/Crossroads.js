import React from 'react';
import PropTypes from 'prop-types';
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
    const isFunnel = 1 === choices.length;
    return (
      <div className={`panel panel-default choices${isFunnel? " funnel": ""}`}>
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
  context: PropTypes.string,
  choices: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Crossroads;
