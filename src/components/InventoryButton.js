import React from 'react';
import { NavItem, Modal } from 'react-bootstrap';

class InventoryButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "showModal": false,
    };
  }

  showInventory = () => {
    this.setState({
      "showModal": true,
    });
  }

  hideInventory = () => {
    this.setState({
      "showModal": false,
    });
  }

  getItems = () => {
    let items = [];

    const inventory = this.props.inventory;
    for (let key in inventory) {
      if (!inventory.hasOwnProperty(key)) {
        continue;
      }

      const item = inventory[key];
      if (!item.acquired || item.used) {
        continue;
      }
      items.push(Object.assign({}, item, {"key": key}));
    }

    return items;
  }

  render() {
    const items = this.getItems();
    if (0 === items.length) {
      return null;
    }

    return (
      <NavItem id="inventory" onClick={() => {this.showInventory()}}>
        {this.props.text}
        <Modal show={this.state.showModal} onHide={this.hideInventory} className="inventory">
          <Modal.Body>
            <dl>
              {items.map((item) => {
                return (
                  <div key={item.key}>
                    <dt>{item.name}</dt>
                    <dd dangerouslySetInnerHTML={{__html: item.description}}></dd>
                  </div>
                );
              })}
            </dl>
          </Modal.Body>
        </Modal>
      </NavItem>
    );
  }
}

InventoryButton.propTypes = {
  text: React.PropTypes.string.isRequired,
  inventory: React.PropTypes.object.isRequired,
};

export default InventoryButton;
