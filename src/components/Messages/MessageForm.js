import React, { Component } from "react";
import { Button, Input, Segment } from "semantic-ui-react";
import uuidv4 from "uuid/v4";
import Firebase from "firebase/app";
import firebaseService from "../../firebase";

import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";

export default class MessageForm extends Component {
  state = {
    uploadState: "",
    uploadTask: null,
    storageRef: firebaseService.storage().ref(),
    message: "",
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: [],
    percentUploaded: 0,
    modal: false
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  createMessage = (fileUrl = null) => {
    const { user } = this.state;
    const message = {
      timestamp: Firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL
      }
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }

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

  uploadFile = (file, metadata) => {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.messagesRef;
    const filePath = `chat/public/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          snap => {
            const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            this.setState({ percentUploaded });
            this.props.isProgressBarVisible(percentUploaded);
          },
          err => {
            console.error(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: "error",
              uploadTask: null
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadUrl => {
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch(err => {
                console.error(err);
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: "error",
                  uploadTask: null
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({
          uploadState: "done"
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          errors: this.state.errors.concat(err)
        });
      });
  };

  render() {
    const { errors, loading, message, modal, uploadState, percentUploaded } = this.state;
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
            labelPosition="right"
            disabled={uploadState === "uploading"}
            onClick={this.openModal}
            icon="cloud upload"
          />
        </Button.Group>
        <FileModal modal={modal} uploadFile={this.uploadFile} closeModal={this.closeModal} />
        <ProgressBar uploadState={uploadState} percentUploaded={percentUploaded} />
      </Segment>
    );
  }
}
