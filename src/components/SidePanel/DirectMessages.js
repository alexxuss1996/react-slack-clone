import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";
import firebaseService from "../../firebase";

class DirectMessages extends Component {
  state = {
    activeChannel: "",
    user: this.props.currentUser,
    users: [],
    usersRef: firebaseService.database().ref("users"),
    connectedRef: firebaseService.database().ref(".info/connected"),
    presenceRef: firebaseService.database().ref("presence")
  };

  componentDidMount() {
    const { user } = this.state;
    if (user) {
      this.addListeners(user.uid);
    }
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    const { usersRef, connectedRef, presenceRef } = this.state;
    usersRef.off();
    connectedRef.off();
    presenceRef.off();
  };

  addListeners = currentUserUid => {
    const { usersRef, connectedRef, presenceRef } = this.state;
    const loadedUsers = [];
    usersRef.on("child_added", snap => {
      if (currentUserUid !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);
        this.setState({
          users: loadedUsers
        });
      }
    });
    connectedRef.on("value", snap => {
      if (snap.val() === true) {
        const ref = presenceRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });

    presenceRef.on("child_added", snap => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });

    presenceRef.on("child_removed", snap => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    const { users } = this.state;
    const updatedUsers = users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);

    this.setState({
      users: updatedUsers
    });
  };

  isUserOnline = user => user.status === "online";

  getChannelId = userId => {
    const currentUserId = this.state.user.uid;
    return userId < currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`;
  };

  setActiveChannel = userId => {
    this.setState({
      activeChannel: userId
    });
  };

  changeChannel = user => {
    const channelId = this.getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name
    };
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
    this.setActiveChannel(user.uid);
  };

  render() {
    const { users, activeChannel } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>{" "}
          ({users.length})
        </Menu.Item>
        {users.map(user => (
          <Menu.Item
            key={user.uid}
            active={user.uid === activeChannel}
            onClick={() => this.changeChannel(user)}
            style={{ opacity: 0.7, fontStyle: "italic" }}
          >
            <Icon name="circle" color={this.isUserOnline(user) ? "green" : "red"} />@ {user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    );
  }
}

export default connect(
  null,
  { setCurrentChannel, setPrivateChannel }
)(DirectMessages);
