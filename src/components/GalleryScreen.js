import React from 'react';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';
import Funnel from './Funnel.js';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';
import widePlaceholder from "./../images/wide-placeholder.png";
import tallPlaceholder from "./../images/tall-placeholder.png";

class GalleryScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "currentImageIndex": null,
      "lightboxIsOpen": false,
    };
  }

  getImages = () => {
    return this.props.illustrations.map((illustration) => {
      if (illustration.unlocked) {
        return illustration;
      }

      if (illustration.width > illustration.height) {
        return {
          "src": widePlaceholder,
          "width": 1600,
          "height": 1200,
        };
      }

      return {
        "src": tallPlaceholder,
        "width": 1200,
        "height": 1600,
      };
    });
  }

  openLightbox = (index, event) => {
    event.preventDefault();
    this.setState({
      "currentImageIndex": index,
      "lightboxIsOpen": true,
    });
  }

  closeLightbox = () => {
    this.setState({
      "lightboxIsOpen": false,
    });
  }

  goToPrevious = () => {
    this.setState(prevState => {
      return {
        "currentImageIndex": prevState.currentImageIndex-1,
      };
    });
  }

  goToNext = () => {
    this.setState(prevState => {
      return {
        "currentImageIndex": prevState.currentImageIndex+1,
      };
    });
  }

  render() {
    const images = this.getImages();

    return (
      <Grid className="gallery-screen">
        <Row>
          <Col md={12}>
            <PageHeader className="text-center">{this.props.title}</PageHeader>
          </Col>
        </Row>
        <Row>
        <Col md={8} mdOffset={2}>
          <Gallery photos={images} onClickPhoto={this.openLightbox} />
        </Col>
        </Row>
        <Row>
          <Col md={6} mdOffset={3} className="lead text-center">
            <Funnel text={`Retour`} action={this.props.quit} />
          </Col>
        </Row>
        <Lightbox
          images={images}
          onClose={this.closeLightbox}
          onClickPrev={this.goToPrevious}
          onClickNext={this.goToNext}
          currentImage={this.state.currentImageIndex}
          isOpen={this.state.lightboxIsOpen}
          leftArrowTitle={`Illustration précédente`}
          rightArrowTitle={`Illustration suivante`}
          showImageCount={false}
          width={1600}
          showCloseButton={false}
          backdropClosesModal={true}
        />
      </Grid>
    );
  }
}

GalleryScreen.propTypes = {
  title: React.PropTypes.string.isRequired,
  quit: React.PropTypes.func.isRequired,
  illustrations: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};

export default GalleryScreen;
