import React from "react";
import { Comment, Image } from "semantic-ui-react";
import moment from "moment";

const Message = ({ message, user }) => {
  const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? "message__self" : "";
  };

  const isImage = message => {
    return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
  };

  const timeFromNow = timestamp => moment(timestamp).fromNow();

  return (
    <Comment>
      <Comment.Avatar src={message.user.avatar} />
      <Comment.Content style={{ color: "#fcfcfc" }} className={isOwnMessage(message, user)}>
        <Comment.Author style={{ color: "#ffffff" }} as="a">
          {message.user.name}
        </Comment.Author>
        <Comment.Metadata style={{ color: "#f8f8f8" }}>{timeFromNow(message.timestamp)}</Comment.Metadata>
        {isImage(message) ? (
          <Image src={message.image} className="message__image" />
        ) : (
          <Comment.Text style={{ color: "#f5f5f5" }}>{message.content}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  );
};

export default Message;
