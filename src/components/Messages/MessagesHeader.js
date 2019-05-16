import React, { Component } from "react";
import { Header, Icon, Input, Segment } from "semantic-ui-react";

export default class MessagesHeader extends Component {
  render() {
    const { channelName, numUniqueUsers, handleSearchChange, searchLoading, isPrivateChannel } = this.props;
    return (
      <Segment inverted clearing>
        {/* Channel Title */}
        <Header inverted fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {channelName}
            {!isPrivateChannel && <Icon name={"star outline"} color="black" />}
          </span>
          <Header.Subheader>{numUniqueUsers}</Header.Subheader>
        </Header>
        {/* Channel Search Input */}
        <Header inverted floated="right">
          <Input
            loading={searchLoading}
            onChange={handleSearchChange}
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search messages"
            inverted
          />
        </Header>
      </Segment>
    );
  }
}
