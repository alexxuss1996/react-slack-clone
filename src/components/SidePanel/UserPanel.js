import React from "react";
import { Grid, Header, Icon, Dropdown } from "semantic-ui-react";

const UserPanel = () => {
  const dropdownOptions = [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>User</strong>
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
      text: <span>Sign Out</span>
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
        <Header style={{ padding: "0.25em" }} as="h4" inverted>
          <Dropdown trigger={<span>User</span>} options={dropdownOptions} />
        </Header>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
