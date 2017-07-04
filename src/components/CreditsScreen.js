import React from 'react';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';
import Funnel from './Funnel.js';
import credits from "../scripts/credits.js";
import image from "../images/rest.jpg";

class CreditsScreen extends React.Component {

  render() {
    return (
      <Grid className="credits-screen">
        <Row>
          <Col md={12}>
            <PageHeader className="text-center">{this.props.title}</PageHeader>
          </Col>
        </Row>
        <Row>
          <Col md={8} mdOffset={2}>
            <img className="img-responsive text-img tall left" src={image} alt="" />
            <div dangerouslySetInnerHTML={{__html: credits}}/>
          </Col>
        </Row>
        <Row>
          <Col md={6} mdOffset={3} className="lead text-center">
            <Funnel text={`Retour`} action={this.props.quit} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

CreditsScreen.propTypes = {
  title: React.PropTypes.string.isRequired,
  quit: React.PropTypes.func.isRequired,
};

export default CreditsScreen;
