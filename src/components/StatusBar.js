import React from 'react';
import Title from './Title.js';
import { Navbar } from 'react-bootstrap';

class StatusBar extends React.Component {
  render() {
    return (
      <Navbar fixedTop fluid>
        <Title icon={this.props.icon} title={this.props.title} />
      </Navbar>
    );
  }
}

StatusBar.propTypes = {
  title: React.PropTypes.string.isRequired,
  icon: React.PropTypes.string.isRequired,
};

export default StatusBar;
