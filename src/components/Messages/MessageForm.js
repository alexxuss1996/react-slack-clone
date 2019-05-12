import React, { Component } from "react";
import { Button, Input, Segment } from "semantic-ui-react";
import Firebase from "firebase/app";
import FileModal from "./FileModal";

export default class MessageForm extends Component {
  state = {
    message: "",
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: [],
    modal: false
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  createMessage = () => {
    const { user } = this.state;
    const message = {
      timestamp: Firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL
      },
      content: this.state.message
    };
    return message;
  };

  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel, errors } = this.state;

    if (message) {
      this.setState({
        loading: true
      });
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => this.setState({ loading: false, message: "", errors: [] }))
        .catch(err => {
          console.error(err);
          this.setState({ loading: false, errors: errors.concat(err) });
        });
    } else {
      this.setState({
        errors: errors.concat({ message: "Add a message" })
      });
    }
  };
  render() {
    const { errors, loading, message, modal } = this.state;
    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={"add"} />}
          labelPosition="left"
          value={message}
          onChange={this.handleChange}
          className={errors.some(error => error.message.includes("message")) ? "error" : ""}
          placeholder="Write your message"
        />
        <Button.Group icon widths="2">
          <Button
            color="orange"
            content="Add Reply"
            labelPosition="left"
            disabled={loading}
            onClick={this.sendMessage}
            icon="edit"
          />
          <Button
            color="teal"
            content="Upload Media"
            onClick={this.openModal}
            labelPosition="right"
            icon="cloud upload"
          />
          <FileModal modal={modal} closeModal={this.closeModal} />
        </Button.Group>
      </Segment>
    );
  }
}
