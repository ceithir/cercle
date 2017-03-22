import React from 'react';
import { PageHeader, Grid, Row, Image, Col } from 'react-bootstrap';
import Crossroads from './Crossroads.js';

class TitleScreen extends React.Component {
  render() {
    return (
      <Grid className="title-screen">
        <Row>
          <Col md={12}>
            <PageHeader className="text-center">{this.props.title}</PageHeader>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Image src={this.props.image} responsive={true} className="center-block"/>
          </Col>
        </Row>
        <hr/>
        <Row>
          <Col md={6} mdOffset={3} className="lead text-center">
            <Crossroads choices={this.props.buttons} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

TitleScreen.propTypes = {
  title: React.PropTypes.string.isRequired,
  image: React.PropTypes.string.isRequired,
  buttons: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};

export default TitleScreen;
