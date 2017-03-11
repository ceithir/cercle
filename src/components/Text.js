import React from 'react';

class Text extends React.Component {
  prepareHtmlContent = () => {
    return {__html: this.props.content};
  }

  render() {
    return (
    	<div dangerouslySetInnerHTML={this.prepareHtmlContent()} ></div>
    );
  }
}

Text.propTypes = {
  content: React.PropTypes.string.isRequired,
};

export default Text;
