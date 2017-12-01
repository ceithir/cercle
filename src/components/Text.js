import React from 'react';
import PropTypes from 'prop-types';

class Text extends React.Component {
  prepareHtmlContent = () => {
    return {__html: this.props.content};
  }

  render() {
    return (
    	<div className="active-text" dangerouslySetInnerHTML={this.prepareHtmlContent()} ></div>
    );
  }
}

Text.propTypes = {
  content: PropTypes.string.isRequired,
};

export default Text;
