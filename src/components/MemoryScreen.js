import React from 'react';
import { Grid, Row, Col, PageHeader, ProgressBar } from 'react-bootstrap';
import Achievements from './Achievements.js';
import Funnel from './Funnel.js';

class MemoryScreen extends React.Component {
  getUnlockedAchievements = () => {
    return this.props.achievements.filter((achievement) => {
      return this.props.unlocked.includes(achievement.key);
    });
  }

  render() {
    if (0 === this.props.achievements.length) {
      return null;
    }

    const unlocked = this.getUnlockedAchievements();
    const all = this.props.achievements;
    const unlockedPercentage = Math.round(100*unlocked.length/all.length);

    return (
      <Grid className="achievements-screen">
        <Row>
          <Col md={12}>
            <PageHeader className="text-center">{this.props.title}</PageHeader>
          </Col>
        </Row>
        <Row>
          <Col md={8} mdOffset={2}>
            <ProgressBar now={unlockedPercentage} label={`${unlocked.length} / ${all.length}`}  />
            <Achievements achievements={unlocked} />
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
  title: React.PropTypes.string.isRequired,
  achievements: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  unlocked: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  quit: React.PropTypes.func.isRequired,
};

export default MemoryScreen;
