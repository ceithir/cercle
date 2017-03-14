import React from 'react';
import { Modal } from 'react-bootstrap';

class TextModal extends React.Component {
  close = () => {
    this.props.close();
  }

  prepareContent = () => {
    return {__html: this.props.content};
  }

  render() {
    if (!this.props.show || !this.props.title || !this.props.content) {
      return null;
    }

    return (
      <Modal show={this.props.show} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body dangerouslySetInnerHTML={this.prepareContent()}></Modal.Body>
      </Modal>
    );
  }
}

TextModal.propTypes = {
  show: React.PropTypes.bool.isRequired,
  title: React.PropTypes.string,
  content: React.PropTypes.string,
  close: React.PropTypes.func.isRequired,
};

export default TextModal;
