import React from 'react';
import { Image } from "react-bootstrap";

class AtollMap extends React.Component {

  render() {
    return (
      <div>
        <Image src={this.props.mapImg} className="center-block visible-xs visible-xm" responsive />
        <svg
          id="atoll-map"
          width="720" height="720"
          className="center-block hidden-xs hidden-xm"
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
                <path d={island.path} className="shape" onClick={island.onClick} />
                <text x={island.textPosition.x} y={island.textPosition.y} className={`lead text-anchor-${island.textAnchor}`}>{island.description}</text>
                {island.current && <text x={island.harbor.x} y={island.harbor.y} className="here">{`⚓`}</text>}
                {island.disabled && island.cross && <g className="crossed">
                  <line x1={island.cross[0]} y1={island.cross[1]} x2={island.cross[2]} y2={island.cross[3]} />
                  <line x1={island.cross[4]} y1={island.cross[5]} x2={island.cross[6]} y2={island.cross[7]} />
                </g>}
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
}

AtollMap.propTypes = {
  mapImg: React.PropTypes.string.isRequired,
  islands: React.PropTypes.arrayOf(React.PropTypes.shape({
    key: React.PropTypes.string.isRequired,
    path: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
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
