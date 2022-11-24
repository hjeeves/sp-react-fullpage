import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

class SPConfirmModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalData: props.modalData
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({modalData: nextProps.modalData});
  }

  openModal = () => this.setState({modalData: {'isOpen': true}});
  closeModal = () => this.setState({modalData: {'isOpen': false}});

  render() {
    var show = false
    if (this.state.modalData.isOpen === true) {
      show = true
    } else {
      show = false
    }

    // Validate the rest of the data passed in,
    // as this may be a 'close only' call
    var modalMsg = ""
    var confirmHandler = function(){}
    var dataName = ""
    var dataID = ""
    if (this.state.modalData.msg !== undefined) {
      modalMsg = this.state.modalData.msg
    }
    if (this.state.modalData.confirmHandler !== undefined) {
      confirmHandler = this.state.modalData.confirmHandler
    }
    if (this.state.modalData.confirmData !== undefined) {
      if (this.state.modalData.confirmData.id !== undefined) {
        dataName = this.state.modalData.confirmData.id
      }
      if (this.state.modalData.confirmData.name !== undefined) {
        dataID = this.state.modalData.confirmData.name
      }
    }

    return (
        <>
        <Modal
        show={show}
        onHide={this.closeModal}
        backdrop="static"
        keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Are You Sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Do you really want to delete this session? This process cannot be undone.</p>
            {modalMsg}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeModal}>Cancel</Button>
            <Button
              variant="danger"
              onClick={confirmHandler}
              data-id={dataName}
              data-name={dataID}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </>
      )
    }
}

export default SPConfirmModal;

