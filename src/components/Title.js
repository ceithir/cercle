import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from 'react-bootstrap';

class Title extends React.Component {
  render() {
    return (
        <Navbar.Header>
          <Navbar.Brand>
            <img src={this.props.icon} className="visible-xs visible-xm" alt={this.props.title} />
            <span className="hidden-xs hidden-xm">{this.props.title}</span>
          </Navbar.Brand>
          {this.props.children}
        </Navbar.Header>
    );
  }
}

Title.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export default Title;
