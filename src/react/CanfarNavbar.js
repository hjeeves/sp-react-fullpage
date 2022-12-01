import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import CanfarLoginModal from "./CanfarLoginModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";


class CanfarNavbar extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        baseURLcadc: props.baseURLcadc,
        baseURLcanfar: props.baseURLcanfar,
        openStackURL: props.openStackURL,
        isAuthenticated: props.isAuthenticated,
        authenticatedUser: props.authenticatedUser,
        loginHandler: props.loginHandler
      }
    }

    // This function allows data to move through and re-render
    // children using this data
    componentWillReceiveProps(nextProps) {
      this.setState({baseURLcadc: nextProps.baseURLcadc});
    }

    render() {
      const cadcSearchURL = this.state.baseURLcadc + "/en/search"
      const cadcGMUI = this.state.baseURLcadc + "/en/groups/"

      var authModal = ""

      if (this.state.isAuthenticated === false) {
        authModal = <CanfarLoginModal loginHandler={this.state.loginHandler}
                                      isOpen={true}
                                      baseURLcanfar={this.state.baseURLcanfar}/>
      }

  return (
    <div className="canfar-header">
    <Navbar expand="md">
      <Container fluid>
        <Navbar.Brand href="#home"><img src={this.state.baseURLcanfar + '/css/images/logo.png'}></img></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="justify-content-end flex-grow-1 pe-3">
          <Nav.Link href={this.state.baseURLcanfar + "/en/docs/quick_start/"}>Documentation</Nav.Link>
          <NavDropdown title="Services" id="basic-nav-dropdown">
            <NavDropdown.Item href={this.state.baseURLcanfar + "/storage/list"}  target="_blank">Storage Management</NavDropdown.Item>
            <NavDropdown.Item href={cadcGMUI} target="_blank">Group Management</NavDropdown.Item>
            <NavDropdown.Item href={this.state.baseURLcanfar + "/citation"}  target="_blank">Data Publication</NavDropdown.Item>
            <NavDropdown.Item href={this.state.baseURLcanfar + "/science-portal"}  target="_blank">Science Portal</NavDropdown.Item>
            <NavDropdown.Item href={cadcSearchURL} target="_blank">CADC Search</NavDropdown.Item>
            <NavDropdown.Item href={this.state.openStackURL} target="_blank">OpenStack Cloud</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href={this.state.baseURLcanfar + "/en/about/organization/"}>About</Nav.Link>
          <Nav.Link href="https://github.com/opencadc">Open Source</Nav.Link>
          <NavDropdown title="Support" id="basic-nav-dropdown">
            <NavDropdown.Item href="mailto:support@canfar.net"  target="_blank">Help</NavDropdown.Item>
            <NavDropdown.Item href={this.state.baseURLcanfar + "/slack"} target="_blank">Join us on Slack</NavDropdown.Item>
          </NavDropdown>
            {this.state.isAuthenticated === false &&
            <NavDropdown title="Login" id="basic-nav-dropdown" alignRight>
              <NavDropdown.Item alignRight >
                {/* For Now, this doesn't matter as there is a blocking modal for login on this panel */}
                {/*<Card alignRight>*/}
                {/*  <form className="form-inline access-control" id="loginForm" role="form" method="post"*/}
                {/*        action="/access/login">*/}
                {/*    <span id="login_fail" className="help-block text-danger pull-left"></span>*/}
                {/*    <div className="form-group">*/}
                {/*      <label htmlFor="username" className="hidden" id="usernameLabel">Username</label>*/}
                {/*      <input type="text" id="username" name="username" className="form-control" tabIndex="1"*/}
                {/*             required="required"*/}
                {/*             placeholder="Username"/>*/}
                {/*    </div>*/}
                {/*    <div className="form-group">*/}
                {/*      <label htmlFor="password" className="hidden" id="passwordLabel">Password</label>*/}
                {/*      <input type="password" id="password" name="password" className="form-control" tabIndex="2"*/}
                {/*             required="required"*/}
                {/*             placeholder="Password"/>*/}
                {/*    </div>*/}
                {/*    <button type="submit" id="submitLogin" tabIndex="2" className="btn btn-success">*/}
                {/*      <span className="glyphicon glyphicon-log-in"></span> Login*/}
                {/*    </button>*/}
                {/*  </form>*/}
                {/*  <a href=""*/}
                {/*     className="account_access_info"*/}
                {/*     tabIndex="5" title="Forgot Username" id="forgot_username_1">*/}
                {/*    Forgot your Account information?</a>*/}
                {/*  /!*<a href=""*!/*/}
                {/*  /!*   className="account_access_info"*!/*/}
                {/*  /!*   tabIndex="6" title="Register" id="register_cadc_1">*!/*/}
                {/*  /!*  Request a CADC Account</a>*!/*/}

                {/*</Card>*/}
              </NavDropdown.Item>
            </NavDropdown>
            }

            {this.state.isAuthenticated === true &&
              <NavDropdown title={this.state.authenticatedUser} id="basic-nav-dropdown">
                <NavDropdown.Item href={this.state.baseURLcadc + "/en/auth/update.html"}  target="_blank">Update Profile</NavDropdown.Item>
                <NavDropdown.Item href={this.state.baseURLcadc + "/en/auth/resetPassword.html"} target="_blank">Reset Password</NavDropdown.Item>
                <NavDropdown.Item href={this.state.baseURLcadc + "/cred/priv?daysValid=30"} target="_blank">Obtain Certificate</NavDropdown.Item>
                <NavDropdown.Item href={this.state.baseURLcadc + "/en/auth/logout"} target="_blank">
                  <span><FontAwesomeIcon  icon={faRightFromBracket} /></span>Logout
                </NavDropdown.Item>
              </NavDropdown>
            }

          {/*<Button variant="outline-success">Login</Button>*/}
          {/* TODO: need login modal that is here duplicated */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      {authModal}
      </div>
  )
}


}

export default CanfarNavbar;



