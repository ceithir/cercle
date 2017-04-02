import React from 'react';
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
  achievements: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};

export default Achievements;
