/* eslint-disable no-unused-expressions */
import React, { Component } from "react";
import { connect } from "react-redux";
import { setUserPosts } from "../../actions";
import { Segment, Comment } from "semantic-ui-react";
import firebaseService from "../../firebase";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";
import Typing from "./Typing";
import Skeleton from "./Skeleton";
class Messages extends Component {
  state = {
    privateChannel: this.props.isPrivateChannel,
    privateMessagesRef: firebaseService.database().ref("privateMessages"),
    messagesRef: firebaseService.database().ref("messages"),
    usersRef: firebaseService.database().ref("users"),
    typingRef: firebaseService.database().ref("typing"),
    connectedRef: firebaseService.database().ref(".info/connected"),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    isChannelStarred: false,
    messages: [],
    messagesLoading: true,
    typingUsers: [],
    progressBar: false,
    numUniqueUsers: "",
    searchTerm: "",
    searchLoading: false,
    searchResults: [],
    listeners: []
  };

  componentDidMount() {
    const { channel, user, listeners } = this.state;
    if (channel && user) {
      this.removeListeners(listeners);
      this.addListeners(channel.id);
      this.addUserStarsListener(channel.id, user.uid);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.messagesEnd) {
      this.scrollToBottom();
    }
  }

  componentWillUnmount() {
    this.removeListeners(this.state.listeners);
    this.state.connectedRef.off();
  }

  removeListeners = listeners => {
    listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event);
    });
  };

  addToListeners = (id, ref, event) => {
    const index = this.state.listeners.findIndex(listener => {
      return listener.id === id && listener.ref === ref && listener.event === event;
    });

    if (index === -1) {
      const newListener = { id, ref, event };
      this.setState({ listeners: this.state.listeners.concat(newListener) });
    }
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  addTypingListeners = channelId => {
    const { typingRef, connectedRef, user } = this.state;
    let typingUsers = [];
    typingRef.child(channelId).on("child_added", snap => {
      if (snap.key !== this.state.user.uid) {
        typingUsers = typingUsers.concat({
          id: snap.key,
          name: snap.val()
        });
        this.setState({ typingUsers });
      }
    });

    this.addToListeners(channelId, this.state.typingRef, "child_added");

    typingRef.child(channelId).on("child_removed", snap => {
      const index = typingUsers.findIndex(user => user.id === snap.key);
      if (index !== -1) {
        typingUsers = typingUsers.filter(user => user.id !== snap.key);
        this.setState({ typingUsers });
      }
    });
    this.addToListeners(channelId, this.state.typingRef, "child_removed");

    connectedRef.on("value", snap => {
      if (snap.val() === true) {
        typingRef
          .child(channelId)
          .child(user.uid)
          .onDisconnect()
          .remove(err => {
            if (err !== null) {
              console.error(err);
            }
          });
      }
    });
  };

  addListeners = channelId => {
    this.addMessageListener(channelId);
    this.addTypingListeners(channelId);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
      this.countUserPosts(loadedMessages);
    });
    this.addToListeners(channelId, ref, "child_added");
  };

  addUserStarsListener = (channelId, userId) => {
    this.state.usersRef
      .child(userId)
      .child("starred")
      .once("value")
      .then(data => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          this.setState({
            isChannelStarred: prevStarred
          });
        }
      });
  };

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
    this.setState({
      numUniqueUsers
    });
  };

  countUserPosts = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        };
      }
      return acc;
    }, {});
    this.props.setUserPosts(userPosts);
  };

  getMessagesRef = () => {
    const { privateChannel, privateMessagesRef, messagesRef } = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  };

  handleStar = () => {
    this.setState(
      prevState => ({
        isChannelStarred: !prevState.isChannelStarred
      }),
      () => this.starChannel()
    );
  };

  starChannel = () => {
    const { isChannelStarred, channel, user, usersRef } = this.state;
    if (isChannelStarred) {
      usersRef.child(`${user.uid}/starred`).update({
        [channel.id]: {
          name: channel.name,
          details: channel.details,
          createdBy: {
            name: channel.createdBy.name,
            avatar: channel.createdBy.avatar
          }
        }
      });
    } else {
      usersRef
        .child(`${user.uid}/starred`)
        .child(channel.id)
        .remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
    }
  };

  handleSearchChange = event => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true
      },
      () => this.handleSearchMessages()
    );
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = channelMessages.reduce((acc, message) => {
      if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => <Message key={message.timestamp} message={message} user={this.state.user} />);

  isProgressBarVisible = percent => {
    if (percent > 0) {
      this.setState({
        progressBar: true
      });
    }
  };

  displayChannelName = channel => {
    return channel ? `${this.state.privateChannel ? "@" : "#"}${channel.name}` : "";
  };

  displayTypingUsers = users => {
    users.length > 0 &&
      users.map(user => (
        <div key={user.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.2em" }}>
          <span className="user__typing">{user.name} is typing</span>
          <Typing />
        </div>
      ));
  };

  displayMessagesSkeleton = loading =>
    loading ? (
      <>
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} />
        ))}
      </>
    ) : null;

  render() {
    const {
      messagesRef,
      channel,
      isChannelStarred,
      messages,
      user,
      progressBar,
      numUniqueUsers,
      searchTerm,
      searchResults,
      searchLoading,
      privateChannel,
      typingUsers,
      messagesLoading
    } = this.state;
    return (
      <>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={privateChannel}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}
        />
        <Segment inverted className={progressBar ? "messages__progress" : "messages"}>
          <Comment.Group>
            {this.displayMessagesSkeleton(messagesLoading)}
            {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
            {this.displayTypingUsers(typingUsers)}
            <div ref={node => (this.messagesEnd = node)} />
          </Comment.Group>
        </Segment>
        <MessageForm
          messagesRef={messagesRef}
          currentUser={user}
          currentChannel={channel}
          isProgressBarVisible={this.isProgressBarVisible}
          isPrivateChannel={privateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </>
    );
  }
}

export default connect(
  null,
  { setUserPosts }
)(Messages);
