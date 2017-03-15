import React from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';

class InventoryButton extends React.Component {
  onItemSelect = (eventKey) => {
    const item = this.props.inventory[eventKey];

    const modalTitle = item.name;
    const modalContent = item.description;

    this.props.showModal(modalTitle, modalContent);
  }

  render() {
    let listItems = [];

    const inventory = this.props.inventory;
    for (let key in inventory) {
      if (!inventory.hasOwnProperty(key)) {
        continue;
      }

      const item = inventory[key];
      if (!item.acquired) {
        continue;
      }
      listItems.push(
        <MenuItem eventKey={key} key={key} disabled={item.used} onSelect={this.onItemSelect}>{item.name}</MenuItem>
      );
    }

    if (!listItems.length) {
      return null;
    }

    return (
      <NavDropdown eventKey="4" title={this.props.text} id="inventory-dropdown">
        {listItems}
      </NavDropdown>
    );
  }
}

InventoryButton.propTypes = {
  text: React.PropTypes.string.isRequired,
  inventory: React.PropTypes.object.isRequired,
  showModal: React.PropTypes.func.isRequired,
};

export default InventoryButton;
