import React from 'react';
import PropTypes from 'prop-types';
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
          <Col md={8} mdOffset={2}>
            <Image src={this.props.image} responsive={true} className="center-block cover"/>
          </Col>
        </Row>
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
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TitleScreen;
