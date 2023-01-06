import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import CanfarLoginModal from "./CanfarLoginModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {faCaretDown} from '@fortawesome/free-solid-svg-icons'


class CanfarNavbar extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        isAuthenticated: props.isAuthenticated,
        authenticatedUser: props.authenticatedUser,
        headerURLs: props.headerURLs
      }
    }

    // This function allows data to move through and re-render
    // children using this data
    componentWillReceiveProps(nextProps) {
      this.setState(nextProps);
    }

    renderButton() {
      return (
        <Button size="sm" variant="outline-primary">{this.state.authenticatedUser}<span className="sp-buffer-span-left"><FontAwesomeIcon icon={faCaretDown} /></span></Button>
      )
    }

  renderLoginButton() {
    return (
      <Button size="sm" variant="outline-primary">Login<span className="sp-buffer-span-left"><FontAwesomeIcon icon={faCaretDown} /></span></Button>
    )
  }

    render() {
      const baseURLCanfar = this.state.headerURLs.baseURLCanfar

      var authModal = ""
      if (this.state.isAuthenticated === false) {
        authModal = <CanfarLoginModal isOpen={true}
                                      modalURLs={this.state.headerURLs}/>
      }

      var showBanner = false
      if (typeof this.props.bannerText !== "undefined"
        && this.props.bannerText !== "") {
        showBanner = true
      }

      return (
        <div className="canfar-header">
        <Navbar expand="md">
          <Container fluid>
            <Navbar.Brand href="#home"><img src={baseURLCanfar + '/css/images/logo.png'}></img></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
              <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link href={this.state.baseURLcanfar + "/en/docs/quick_start/"}>Documentation</Nav.Link>
              <NavDropdown title="Services" id="basic-nav-dropdown">
                <NavDropdown.Item href={baseURLCanfar + "/storage/list"}  target="_blank">Storage Management</NavDropdown.Item>
                <NavDropdown.Item href={this.state.headerURLs.groups} target="_blank">Group Management</NavDropdown.Item>
                <NavDropdown.Item href={baseURLCanfar + "/citation"}  target="_blank">Data Publication</NavDropdown.Item>
                <NavDropdown.Item href={baseURLCanfar + "/science-portal"}  target="_blank">Science Portal</NavDropdown.Item>
                <NavDropdown.Item href={this.state.headerURLs.search} target="_blank">CADC Search</NavDropdown.Item>
                <NavDropdown.Item href="https://arbutus-canfar.cloud.computecanada.ca" target="_blank">OpenStack Cloud</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href={baseURLCanfar + "/en/about/organization/"}>About</Nav.Link>
              <Nav.Link href="https://github.com/opencadc">Open Source</Nav.Link>
              <NavDropdown title="Support" id="basic-nav-dropdown">
                <NavDropdown.Item href="mailto:support@canfar.net"  target="_blank">Help</NavDropdown.Item>
                <NavDropdown.Item href={baseURLCanfar + "/slack"} target="_blank">Join us on Slack</NavDropdown.Item>
              </NavDropdown>
              </Nav>

              {this.state.isAuthenticated === false &&
              <NavDropdown nocaret align="end" title={this.renderLoginButton()} id="authenticated-nav-dropdown" className="sp-auth-dropdown">
                <NavDropdown.Item >
                  {/* For now, a login modal isn't implemented here as there is a blocking modal for login for Science Portal */}
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
                <NavDropdown noCaret align="end" title={this.renderButton()} id="authenticated-nav-dropdown" className="sp-auth-dropdown">
                  <NavDropdown.Item href={this.state.headerURLs.acctupdate}  target="_blank">Update Profile</NavDropdown.Item>
                  <NavDropdown.Item href={this.state.headerURLs.passchg} target="_blank">Reset Password</NavDropdown.Item>
                  <NavDropdown.Item href="https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/cred/priv?daysValid=30">Obtain Certificate</NavDropdown.Item>
                  <NavDropdown.Item href={baseURLCanfar + "/access/logout?target=" + baseURLCanfar + "/science-portal/"}>
                    <span className="sp-buffer-span-right"><FontAwesomeIcon  icon={faRightFromBracket} /></span>Logout
                  </NavDropdown.Item>
                </NavDropdown>
              }

            </Navbar.Collapse>
          </Container>
        </Navbar>
          {showBanner &&
          <Card className="sp-warning-card">
            <div className="sp-warn-heading"></div>
            <div className="sp-warn-body">
              <p>{this.props.bannerText}</p>
            </div>
          </Card>
          }
          {authModal}
          </div>
      )
    }


}

export default CanfarNavbar;



