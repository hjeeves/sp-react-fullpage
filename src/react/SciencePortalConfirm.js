import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

class SciencePortalConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        modalData : props.modalData
    };
    this.onClose = this.onClose.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  onClose(event) {
    if (event) {
      event.stopPropagation();
    }
    this.props.handlers.onClose();
  }

  onConfirm(event) {
    event.stopPropagation();
    this.props.handlers.onConfirm();
  }

  render() {
    var modalMsg = ""

    if (typeof this.state.modalData !== "undefined") {
      if (this.props.modalData.msg !== undefined) {
        modalMsg = this.props.modalData.msg
      }
    }

    var modal = (

      <Modal show={this.state.modalData.isOpen} onHide={this.onClose}
             keyboard={false} backdrop="static"
      >
        <Modal.Header>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you really want to delete this session? This process cannot be undone.</p>
          {modalMsg}
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="default" onClick={this.onClose}>
            Cancel
          </Button>

            <Button
              variant="danger"
              onClick={this.onConfirm}>
              Delete
            </Button>

        </Modal.Footer>
      </Modal>
    );
    return modal;
  }
}

export default SciencePortalConfirm;

