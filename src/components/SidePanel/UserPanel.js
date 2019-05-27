import React, { useState } from "react";
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";
import firebaseService from "../../firebase";

const UserPanel = ({ currentUser, primaryColor }) => {
  const [user] = useState(currentUser);
  const [modal, setModal] = useState(false);
  const handleSignOut = () => {
    firebaseService
      .auth()
      .signOut()
      .then(() => {
        console.log("signed out!");
      });
  };

  const openModal = () => setModal(true);

  const closeModal = () => setModal(false);

  const dropdownOptions = [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span onClick={openModal}>Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={handleSignOut}>Sign Out</span>
    }
  ];

  return (
    <Grid style={{ backgroundColor: primaryColor }}>
      <Grid.Column>
        <Grid.Row style={{ margin: 0, padding: "1.2em" }}>
          {/* App Header */}
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>DevChat</Header.Content>
          </Header>
        </Grid.Row>
        {/* User Dropdown */}
        <Grid.Row style={{ margin: 0, padding: "1.2em", backgroundColor: primaryColor }}>
          <Header style={{ padding: "0.25rem" }} as="h4" inverted>
            <Dropdown
              trigger={
                <span>
                  <Image src={user.photoURL} spaced="right" avatar />
                  {user.displayName}
                </span>
              }
              options={dropdownOptions}
            />
          </Header>
        </Grid.Row>
        {/* Change User Avatar Modal */}
        <Modal basic open={modal} onClose={closeModal}>
          <Modal.Header>Change Avatar</Modal.Header>
          <Modal.Content>
            <Input fluid type="file" label="New Avatar" name="previewImage" />
            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column className="ui center aligned grid">{/* Image Preview */}</Grid.Column>
                <Grid.Column>{/* Cropped Image Preview */}</Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted>
              <Icon name="save" /> Change Avatar
            </Button>
            <Button color="green" inverted>
              <Icon name="image" /> Preview
            </Button>
            <Button color="red" inverted onClick={closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
