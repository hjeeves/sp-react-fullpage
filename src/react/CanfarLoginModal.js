import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";


class CanfarLoginModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isOpen: props.isOpen,
      modalURLs: props.modalURLs,
    }
  }

  handleClose() {
    this.setState({ isOpen: false });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  closeModal = () => this.setState({ isOpen: false });

  render() {
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
            <Modal.Title className="sp-modal-header">Authentication required</Modal.Title>
          </Modal.Header>
          <Modal.Body className="sp-auth-form-body">
            <form className="access-control" id="modalloginForm" role="form"
                  method="post"
                  action={this.state.modalURLs.baseURLCanfar +"/access/login"}>
              <div className="modal-body">
                <span id="modal_login_fail" className="text-danger help-block pull-left"></span>
                <div className="form-group">
                  <label htmlFor="username" className="d-none" id="modalUsernameLabel">Username</label>
                  <input type="text" id="modalUsername" name="username" className="form-control"
                         tabIndex="1" required="required"
                         placeholder="CADC Username"/>
                </div>
                <div className="form-group">
                  <label htmlFor="password" className="d-none" id="modalPasswordLabel">Password</label>
                  <input type="password" id="modalPassword" name="password" className="form-control" tabIndex="2"
                         required="required"
                         placeholder="Password"/>
                </div>
                <a href={this.state.modalURLs.passreset}
                   className="account_access_info"
                   tabIndex="5" className="account_access_info" title="Forgot Password">
                  Forgot your Account information?</a>
                <br/>
                <a href={this.state.modalURLs.acctrequest}
                   className="account_access_info"
                   tabIndex="6" title="Register" id="register_cadc_2">
                  Request a CADC Account</a>
              </div>
              <div className="modal-footer">
                <Button type="submit" variant="success">
                  <span className="glyphicon glyphicon-log-in">
                    <FontAwesomeIcon  icon={faRightToBracket} />
                  </span>
                Login

                </Button>
              </div>
            </form>
          </Modal.Body>
          {/*<Modal.Footer>*/}

          {/*</Modal.Footer>*/}
        </Modal>
      </>
    );
  }
}
export default CanfarLoginModal;