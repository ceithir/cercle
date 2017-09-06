import React from 'react';
import PropTypes from 'prop-types';

class Hint extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "show": false,
    };
  }

  show = () => {
    this.setState({"show": true});
  }

  render() {
    return (
      <div>
        {!this.state.show && <a className="hint-warning" onClick={this.show}>{this.props.warning}</a>}
        {this.state.show && <p className="hint" dangerouslySetInnerHTML={{__html: this.props.hint}}></p>}
      </div>
    );
  }
}

Hint.propTypes = {
  warning: PropTypes.string.isRequired,
  hint: PropTypes.string.isRequired,
};

export default Hint;
