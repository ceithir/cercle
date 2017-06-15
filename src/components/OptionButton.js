import React from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';

class OptionButton extends React.Component {
  render() {
    if (!this.props.options.length) {
      return null;
    }

    return (
      <NavDropdown title={this.props.text} id="option-dropdown">
        {this.props.options.map((option) => {
          if (!option.action) {
            return (
              <MenuItem header key={option.key}>{option.text}</MenuItem>
            );
          }

          return (
            <MenuItem onSelect={(event) => {option.action();}} key={option.key} disabled={option.disabled}>{option.text}</MenuItem>
          );
        })}
      </NavDropdown>
    );
  }
}

OptionButton.propTypes = {
  text: React.PropTypes.string.isRequired,
  options: React.PropTypes.arrayOf(React.PropTypes.object),
};

export default OptionButton;
