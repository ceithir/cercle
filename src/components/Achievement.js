import React from 'react';
import PropTypes from 'prop-types';

class Achievement extends React.Component {
  render() {
    return (
      <div className={"achievement" + (this.props.disabled ? " disabled" : "")}>
        <div className="achievement-heading">{this.props.name}</div>
        <div className="achievement-body">{this.props.description}</div>
      </div>
    );
  }
}

Achievement.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default Achievement;
