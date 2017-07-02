import React from 'react';

class AtollMap extends React.Component {
  onClick = (event, action) => {
    event.preventDefault();
    event.target.blur();
    action();
  }

  render() {
    return (
      <svg
        viewBox="0 0 720 720"
        className="atoll-map center-block"
        xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <image xlinkHref={this.props.mapImg} x="0" y="0" height="720" width="720"/>
        {this.props.islands.map((island) => {
          let className = "island";
          if (island.current) {
            className += " current";
          }
          if (island.disabled) {
            className += " disabled";
          }

          return (
            <g key={island.key} className={className}>
              {island.onClick && <a className="choice hidden-xs hidden-xm" onClick={event => this.onClick(event, island.onClick)} href="#">
                <path d={island.path} className="shape" />
                <text
                  x={island.textPosition.x}
                  y={island.textPosition.y}
                  className={`lead text-anchor-${island.textAnchor}`}
                >
                  {island.description}
                </text>
              </a>}
              {island.current && <text x={island.harbor.x} y={island.harbor.y} className="here">{`⚓`}</text>}
              {island.disabled && island.cross && <g className="crossed">
                <line x1={island.cross[0]} y1={island.cross[1]} x2={island.cross[2]} y2={island.cross[3]} />
                <line x1={island.cross[4]} y1={island.cross[5]} x2={island.cross[6]} y2={island.cross[7]} />
              </g>}
            </g>
          );
        })}
      </svg>
    );
  }
}

AtollMap.propTypes = {
  mapImg: React.PropTypes.string.isRequired,
  islands: React.PropTypes.arrayOf(React.PropTypes.shape({
    key: React.PropTypes.string.isRequired,
    path: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func,
    current: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    textPosition: React.PropTypes.shape({
      x: React.PropTypes.number.isRequired,
      y: React.PropTypes.number.isRequired,
    }).isRequired,
    textAnchor: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    harbor: React.PropTypes.shape({
      x: React.PropTypes.number.isRequired,
      y: React.PropTypes.number.isRequired,
    }).isRequired,
    cross: React.PropTypes.arrayOf(React.PropTypes.number),
  })).isRequired,
};

export default AtollMap;
