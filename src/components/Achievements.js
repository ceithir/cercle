import React from 'react';
import PropTypes from 'prop-types';
import Achievement from './Achievement.js';

class Achievements extends React.Component {
  render() {
    return (
      <div>
        {this.props.achievements.map((achievement) => {
          return (
            <Achievement
              key={achievement.key}
              name={achievement.name}
              description={achievement.description}
              disabled={achievement.disabled}
            />
          );
        })}
      </div>
    );
  }
}

Achievements.propTypes = {
  achievements: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Achievements;
