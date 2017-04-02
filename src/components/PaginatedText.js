import React from 'react';
import { Pagination } from 'react-bootstrap';

class PaginatedText extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "activePage": this.props.defaultPage,
    };
  }

  prepareText = (page) => {
    return {__html: this.props.texts[page-1]};
  }

  onSelect = (eventKey) => {
    this.setState({
      activePage: eventKey,
    });
  }

  render() {
    if (0 === this.props.texts.length) {
      return null;
    }

    if (this.state.activePage < 1 || this.state.activePage > this.props.texts.length) {
      return null;
    }

    return (
      <div>
        <div dangerouslySetInnerHTML={this.prepareText(this.state.activePage)} />
        {
          this.props.texts.length > 1 &&
          <div className="text-center">
            <Pagination
              items={this.props.texts.length}
              activePage={this.state.activePage}
              onSelect={this.onSelect}
              maxButtons={3}
              ellipsis
              boundaryLinks
            />
          </div>
        }
      </div>
    );
  }
}

PaginatedText.propTypes = {
  texts: React.PropTypes.arrayOf(React.PropTypes.string),
  defaultPage: React.PropTypes.number,
};

export default PaginatedText;
