import React, { Component } from "react";
import { Accordion, Icon, Header, Segment, Image } from "semantic-ui-react";

export default class MetaPanel extends Component {
  state = {
    privateChannel: this.props.isPrivateChannel,
    channel: this.props.currentChannel,
    activeIndex: 0
  };

  setActiveIndex = (event, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newActiveIndex = activeIndex === index ? -1 : index;
    this.setState({
      activeIndex: newActiveIndex
    });
  };

  render() {
    const { activeIndex, privateChannel, channel } = this.state;

    if (privateChannel) {
      return null;
    }

    return (
      <Segment inverted loading={!channel}>
        <Header inverted as="h3" attached="top">
          About # {channel && channel.name}
        </Header>
        <Accordion
          fluid
          inverted
          style={{ border: "1px solid #eeeeee", borderRadius: "8px", margin: "10px 0", padding: "5px" }}
        >
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="info" />
            Channel Details
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>{channel && channel.details}</Accordion.Content>

          <Accordion.Title active={activeIndex === 1} index={1} onClick={this.setActiveIndex}>
            <Icon name="dropdown" />
            <Icon name="user circle" />
            Top Posters
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>posters</Accordion.Content>

          <Accordion.Title active={activeIndex === 2} index={2} onClick={this.setActiveIndex}>
            <Icon name="dropdown" />
            <Icon name="pencil alternate" />
            Created By
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            <Header as="h3" inverted>
              <Image circular src={channel && channel.createdBy.avatar} />
              {channel && channel.createdBy.name}
            </Header>
          </Accordion.Content>
        </Accordion>
      </Segment>
    );
  }
}
