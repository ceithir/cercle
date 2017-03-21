import React from 'react';
import { PageHeader, Grid, Row, Image, Col, Button } from 'react-bootstrap';

class TitleScreen extends React.Component {
  render() {
    return (
      <Grid>
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
        {this.props.buttons.map((button, index) => {
          return(
            <Row key={index.toString()}>
              <Col mdOffset={3} md={6}>
                <Button bsSize="large" block onClick={button.action}>{button.text}</Button>
              </Col>
            </Row>
          );
        })}
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
