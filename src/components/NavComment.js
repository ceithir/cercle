import React from 'react';
import { Navbar } from 'react-bootstrap';

class NavComment extends React.Component {
  render() {
    return (
      <Navbar.Text className={"comment " + this.props.color}>
        {this.props.text}
      </Navbar.Text>
    );
  }
}

NavComment.propTypes = {
  text: React.PropTypes.string.isRequired,
  color: React.PropTypes.string,
};

export default NavComment;
