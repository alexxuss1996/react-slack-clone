import React, { Component } from "react";
import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment } from "semantic-ui-react";
import { SliderPicker } from "react-color";
import { connect } from "react-redux";
import { setColors } from "../../actions";
import firebaseService from "../../firebase";

class ColorPanel extends Component {
  state = {
    modal: false,
    primary: "",
    secondary: "",
    user: this.props.currentUser,
    userColors: [],
    usersRef: firebaseService.database().ref("users")
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListener(this.state.user.uid);
    }
  }

  componentWillUnmount() {
    this.removeListener();
  }

  removeListener = () => {
    this.state.usersRef.child(`${this.state.user.uid}/colors`).off();
  };

  addListener = userId => {
    let userColors = [];
    this.state.usersRef.child(`${userId}/colors`).on("child_added", snap => {
      userColors.unshift(snap.val());
      this.setState({ userColors });
    });
  };

  saveColors = (primary, secondary) => {
    const { usersRef, user } = this.state;
    usersRef
      .child(`${user.uid}/colors`)
      .push()
      .update({
        primary,
        secondary
      })
      .then(() => {
        console.log("Colors Added!");
        this.closeModal();
      })
      .catch(err => console.error(err));
  };

  displayUserColors = colors =>
    colors.length > 0 &&
    colors.map((color, i) => (
      <React.Fragment key={Math.random() * i}>
        <Divider />
        <div className="color__container" onClick={() => this.props.setColors(color.primary, color.secondary)}>
          <div className="color__square" style={{ backgroundColor: color.primary }}>
            <div className="color__overlay" style={{ backgroundColor: color.secondary }} />
          </div>
        </div>
      </React.Fragment>
    ));

  handleSaveColors = () => {
    const { primary, secondary } = this.state;
    if (primary && secondary) {
      this.saveColors(primary, secondary);
    }
  };

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  handleChangePrimary = color => this.setState({ primary: color.hex });

  handleChangeSecondary = color => this.setState({ secondary: color.hex });

  render() {
    const { modal, primary, secondary, userColors } = this.state;
    return (
      <Sidebar as={Menu} icon="labeled" inverted vertical visible width="very thin">
        <Divider />
        <Button color="blue" size="small" icon="add" onClick={this.openModal} />
        {this.displayUserColors(userColors)}
        {/* Color Picker Modal */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Choose App Colors</Modal.Header>
          <Modal.Content>
            <Segment inverted>
              <Label content="Primary Color" className="color__label" />
              <SliderPicker color={primary} onChange={this.handleChangePrimary} />
            </Segment>
            <Segment inverted>
              <Label content="Secondary Color" className="color__label" />
              <SliderPicker color={secondary} onChange={this.handleChangeSecondary} />
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSaveColors}>
              <Icon name="checkmark" /> Save Colors
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Sidebar>
    );
  }
}

export default connect(
  null,
  { setColors }
)(ColorPanel);
