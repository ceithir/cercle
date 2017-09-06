import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';
import Achievements from './Achievements.js';
import Funnel from './Funnel.js';

class MemoryScreen extends React.Component {
  getAchievements = () => {
    return this.props.achievements.map((achievement) => {
      if (-1 === this.props.unlocked.indexOf(achievement.key)) {
        return Object.assign({}, achievement, {'description': "???", 'disabled': true});
      }

      return achievement;
    });
  }

  render() {
    if (0 === this.props.achievements.length) {
      return null;
    }

    return (
      <Grid className="achievements-screen">
        <Row>
          <Col md={12}>
            <PageHeader className="text-center">{this.props.title}</PageHeader>
          </Col>
        </Row>
        <Row>
          <Col md={8} mdOffset={2}>
            <Achievements achievements={this.getAchievements()} />
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

MemoryScreen.propTypes = {
  title: PropTypes.string.isRequired,
  achievements: PropTypes.arrayOf(PropTypes.object).isRequired,
  unlocked: PropTypes.arrayOf(PropTypes.string).isRequired,
  quit: PropTypes.func.isRequired,
};

export default MemoryScreen;
