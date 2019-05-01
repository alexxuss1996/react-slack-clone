import React, { useState } from "react";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
import firebase from "../../firebase";

const UserPanel = ({ currentUser }) => {
  const [user] = useState(currentUser);
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("signed out!");
      });
  };
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
      text: <span>Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={handleSignOut}>Sign Out</span>
    }
  ];

  return (
    <Grid>
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
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
