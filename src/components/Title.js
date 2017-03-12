import React from 'react';
import { Navbar } from 'react-bootstrap';

class Title extends React.Component {
  render() {
    return (
        <Navbar.Header>
          <Navbar.Brand>
            <img src={this.props.icon} className="visible-xs visible-xm" title={this.props.title} alt="" />
            <span className="hidden-xs hidden-xm">{this.props.title}</span>
          </Navbar.Brand>
        </Navbar.Header>
    );
  }
}

Title.propTypes = {
  title: React.PropTypes.string.isRequired,
  icon: React.PropTypes.string.isRequired,
};

export default Title;
