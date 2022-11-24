import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";


class CanfarLoginModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      myText: props.myText,
      isOpen: props.isOpen,
      baseURLcanfar: props.baseURLcanfar,
    }
  }

  handleClose() {
    this.setState({ isOpen: false });
  }

  // TODO: quite likely need to use this if the props are changed from the outside,
  // as the regular science-portal modal will work.
  //componentWillReceiveProps(nextProps) {
  //  this.setState({ isOpen: nextProps.isOpen });
  //}

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });

  render() {
    //TODO: this is far more complicated than it needs to be, but
    // it illustrates how to set state to close the modal
    // This would be close to the same modal that science portal could use to
    // notify of different states, but could have the 'myText' value
    // that changes as the page state changes

    var show = false
    if (this.state.isOpen === true) {
      show = true
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
            <Modal.Title className="sp-auth-form-title">Authentication required</Modal.Title>
          </Modal.Header>
          <Modal.Body className="sp-auth-form-body">
            <form className="access-control" id="modalloginForm" role="form"
                  method="post"
                  action="/access/login">
              <div className="modal-body">
                <span id="modal_login_fail" className="text-danger help-block pull-left"></span>
                <div className="form-group">
                  <label htmlFor="username" className="hidden" id="modalUsernameLabel">Username</label>
                  <input type="text" id="modalUsername" name="username" className="form-control"
                         tabIndex="1" required="required"
                         placeholder="CADC Username"/>
                </div>
                <div className="form-group">
                  <label htmlFor="password" className="hidden" id="modalPasswordLabel">Password</label>
                  <input type="password" id="modalPassword" name="password" className="form-control" tabIndex="2"
                         required="required"
                         placeholder="Password"/>
                </div>
                <a href=""
                   className="account_access_info"
                   tabIndex="5" className="account_access_info" title="Forgot Username" id="forgot_username_2">
                  Forgot your Account information?</a>
                <br/>
                <a href="https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/en/auth/request.html"
                   className="account_access_info"
                   tabIndex="6" title="Register" id="register_cadc_2">
                  Request a CADC Account</a>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-success">
                  <span className="glyphicon glyphicon-log-in"><FontAwesomeIcon  icon={faRightToBracket} /></span> Login
                </button>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>

          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
export default CanfarLoginModal;