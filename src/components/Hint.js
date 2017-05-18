import React from 'react';

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
  warning: React.PropTypes.string.isRequired,
  hint: React.PropTypes.string.isRequired,
};

export default Hint;
