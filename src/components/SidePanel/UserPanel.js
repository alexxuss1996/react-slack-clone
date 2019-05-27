import React, { useState, useRef } from "react";
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";
import firebaseService from "../../firebase";
import AvatarEditor from "react-avatar-editor";

const UserPanel = ({ currentUser, primaryColor }) => {
  const [user] = useState(currentUser);
  const [modal, setModal] = useState(false);
  const [isFileUpload, setIsFileUpload] = useState(false)
  const [previewImage, setPreviewImage] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const [blob, setBlob] = useState("");
  const avatarEditor = useRef(null);

  const handleSignOut = () => {
    firebaseService
      .auth()
      .signOut()
      .then(() => {
        console.log("signed out!");
      });
  };

  const handleCropImage = () => {
    if (avatarEditor) {
      avatarEditor.current.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        setCroppedImage(imageUrl);
        setBlob(blob);
      });
    }
  };

  const handleChange = event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => setPreviewImage(reader.result));
      setIsFileUpload(true);
    }
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
        <Grid.Row style={{ margin: 0, padding: "1.2em" }}>
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
            <Input onChange={handleChange} fluid type="file" label="New Avatar" name="previewImage" />
            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column className="ui center aligned grid">
                  {previewImage && (
                    <AvatarEditor
                      ref={avatarEditor}
                      image={previewImage}
                      height={120}
                      width={120}
                      border={50}
                      scale={1.2}
                    />
                  )}
                </Grid.Column>
                <Grid.Column>
                  {croppedImage && (
                    <Image style={{ margin: "3.5em auto" }} width={100} height={100} src={croppedImage} />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            {croppedImage && (
              <Button color="green" inverted>
                <Icon name="save" /> Change Avatar
              </Button>
            )}
            <Button color="green" inverted onClick={handleCropImage} disabled={!isFileUpload}>
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
