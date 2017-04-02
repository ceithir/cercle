import React from 'react';
import { Modal } from 'react-bootstrap';
import PaginatedText from './PaginatedText.js';

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
        {
          typeof this.props.content === 'string' &&
          <Modal.Body dangerouslySetInnerHTML={this.prepareContent()}></Modal.Body>
        }
        {
          Array.isArray(this.props.content) &&
          <Modal.Body><PaginatedText texts={this.props.content} defaultPage={this.props.content.length} /></Modal.Body>
        }
      </Modal>
    );
  }
}

TextModal.propTypes = {
  show: React.PropTypes.bool.isRequired,
  title: React.PropTypes.string,
  content: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.arrayOf(React.PropTypes.string),
  ]),
  close: React.PropTypes.func.isRequired,
};

export default TextModal;
