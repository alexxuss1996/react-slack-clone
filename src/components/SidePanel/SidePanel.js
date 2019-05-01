import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";

const SidePanel = ({ currentUser }) => (
  <Menu size="large" inverted vertical fixed="left" style={{ backgroundColor: "#4c3c4c", fontSize: "1.2em" }}>
    <UserPanel currentUser={currentUser} />
  </Menu>
);

export default SidePanel;
