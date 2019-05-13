import React, { useState } from "react";
import mime from "mime-types";
import { Icon, Button, Input, Modal } from "semantic-ui-react";

const FileModal = ({ modal, closeModal, uploadFile }) => {
  const [fileState, setFileState] = useState(null);
  const [authorized] = useState(["image/jpeg", "image/png"]);

  const addFile = event => {
    const file = event.target.files[0];
    if (file) {
      setFileState(file);
    }
  };

  const isAuthorized = filename => authorized.includes(mime.lookup(filename));

  const clearFile = () => setFileState(null);

  const sendFile = () => {
    if (fileState !== null) {
      if (isAuthorized(fileState.name)) {
        const metadata = { contentType: mime.lookup(fileState.name) };
        uploadFile(fileState, metadata);
        closeModal();
        clearFile();
      }
    }
  };

  return (
    <Modal basic open={modal} onClose={closeModal}>
      <Modal.Header>Select an Image File</Modal.Header>
      <Modal.Content>
        <Input onChange={addFile} fluid label="File types: jpg, png" name="file" type="file" />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={sendFile} color="green" inverted>
          <Icon name="checkmark" /> Send
        </Button>
        <Button color="red" inverted onClick={closeModal}>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FileModal;
