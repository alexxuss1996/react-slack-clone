import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";

export default class SidePanel extends Component {
  render() {
    return (
      <Menu size="large" inverted vertical fixed="left" style={{ backgroundColor: "#4c3c4c", fontSize: "1.2em" }}>
        <UserPanel />
      </Menu>
    );
  }
}
