import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import CanfarNavbar from "./react/CanfarNavbar";
import SessionItem from "./react/SessionItem";
import SciencePortalForm from "./react/SciencePortalForm";
import SciencePortalModal from "./react/SciencePortalModal";
import SPConfirmModal from "./react/SPConfirmModal";

import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import './react/css/App.css';
// TODO: is this file *and* App.css necessary?
// font definitions are in index.css TODO: change these to math CANFAR branding
import './react/css/index.css'
// This is in the node_modules directory
import 'bootstrap/dist/css/bootstrap.min.css';

// This is after bootstrap so values can be overridden
import './react/sp-session-list.css';


// TODO: this is test data that would be in a test .js file,
// injected the say way that data from science-portal app would be
const SESSION_LIST_DATA = [
  {
    "name": "TESTDATAnotebook",
    "id": "abcd1234",
    "image": "images-rc.canfar.net/alinga/jupyter:canucs.v1.2.2",
    "status": "Running",
    "RAM": "2G",
    "cores": "2 cores",
    "logo": "https://www.canfar.net/science-portal/images/jupyterLogo.jpg",
    "altText": "jupyter lab",
    "deleteHandler": handleDeleteSession,
    "connectHandler": handleConnectRequest,
    "startTime" : '2022-11-22T20:11:30Z'
  },
  {
    "name": "TESTDATAcarta",
    "id": "abcd1234",
    "image": "images-rc.canfar.net/skaha/carta:3.0",
    "status": "Pending",
    "RAM": "2G",
    "cores": "2 cores",
    "logo": "https://www.canfar.net/science-portal/images/cartaLogo.png",
    "altText": "carta",
    "deleteHandler": handleDeleteSession,
    "connectHandler": handleConnectRequest,
    "startTime" : '2022-11-22T20:49:56Z'
  }
];

const MODAL_DATA = {
  'title': "Initializing Portal",
  'msg': "Initalizing...",
  'isOpen': true,
  'showSpinner' : true,
  'showReload' : false,
  'showHome' : false
}

const CONFIRM_MODAL_DATA = {
  'title': "Are you sure?",
  'msg': "Click the red button to confirm",
  'isOpen': true,
  'confirmHandler': handleConfirm,
  'buttonText': 'Delete',
  'confirmData': {"name": "myName", "id": "abc1234"}
}

const URLS = {
  baseURLcanfar: "https://www.canfar.net",
  baseURLcadc: "https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca"
}

// Data for a single type will be passed in
// at render time
const FORM_DATA = {
  "contextData": {
    "availableCores": [1, 2, 4, 16],
    "defaultCores": 2,
    "availableRAM": [1, 2, 4, 8, 16, 32, 64, 128, 256],
    "defaultRAM": 16
  },
  "imageList": ["test_image_1", "test_image_2"],
  "types": ["notebook", "carta", "desktop", "contributed"],
  "selectedType": "notebook",
  "sessionName": "notebook1",
  "submitHandler" : handleSubmit,
  "changeTypeHandler" : handleChangeType
}

const LOGIN_MODAL_DATA = {
  "loginHandler": handleLogin
}


function handleSubmit(e) {
  e.preventDefault();
  alert("no submission handler defined for launch form")
}

function handleChangeType(e) {
  e.preventDefault();
  alert("no session type change handler defined for launch form")
}

function handleDeleteSession(e) {
  e.preventDefault();
  var deleteData = e.currentTarget.dataset
  console.log("delete data found: " + deleteData.name + ": " + deleteData.id)
  alert("no session delete handler defined for launch form")
}

function handleConnectRequest(e) {
  e.preventDefault();
  var sessionData = e.currentTarget.dataset
  console.log("session data found: "  + sessionData.id)
  alert("no session connect handler defined for launch form")
}

function handleConfirm(e) {
  e.preventDefault();
  var deleteData = e.currentTarget.dataset
  console.log("delete data found: " + deleteData.name + ": " + deleteData.id)
  alert("no session delete handler defined for launch form")
}

function handleLogin(e) {
  e.preventDefault();
  var username = e.currentTarget[0].value
  var pwd = e.currentTarget[1].value
  console.log("login data found: " + username + ": " + pwd)
  alert("no session login handler defined for launch form")
}


class SciencePortalApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sessionData: SESSION_LIST_DATA,
      modalData: MODAL_DATA,
      fData: FORM_DATA,
      urls: URLS,
      confirmModalData: {}
    };
  }

  // Use this function via the window ref in order to
  // inject session data into the component.
  updateSessionList(sArrayData) {
    this.setState({sessionData: sArrayData})
  }

  updateModal(sModalData) {
    this.setState({modalData: sModalData})
  }

  openConfirmModal(sModalData) {
    this.setState({confirmModalData: sModalData})
  }

  closeConfirmModal() {
    this.setState({confirmModalData: {isOpen: false}})
  }

  updateLaunchForm(sFormData) {
    this.setState({fData: sFormData})
  }

  updateURLs(sURLs) {
    this.setState({urls: sURLs})
  }

  render() {
    return (
      <Container fluid className="bg-white">
          <CanfarNavbar
            baseURLcadc={this.state.urls.baseURLcadc}
            baseURLcanfar={this.state.urls.baseURLcanfar}
            openStackURL="https://arbutus-canfar.cloud.computecanada.ca"
            isAuthenticated={false}
            authenticatedUser="Test User"
            loginHandler={handleLogin}
          ></CanfarNavbar>

          <Container fluid className="sp-body">
            <Row><Col>
              <h3 className="sp-page-header">Science Portal</h3>
            </Col></Row>

            <Container fluid className="bg-white sp-session-list-container rounded-1">
              <Row><Col>
                <div className="sp-title sp-panel-heading">Active Sessions</div>
              </Col></Row>

              {/*  attribute 'striped' can be put on for when app is busy */}
              {/* height is controlled by div.progress css */}
              <Row><Col>
                <ProgressBar variant="success" now={100} className="sp-progress-bar" />
              </Col></Row>

              <Row xs={1} md={3} className="g-4">
                {/*// TODO: how do you sort these?*/}
                {this.state.sessionData.map(mapObj => (
                  <Col className="sp-card-container">
                    <SessionItem
                      sessData={mapObj}
                      baseURLcanfar={this.state.urls.baseURLcanfar}/>
                  </Col>
                ))}
              </Row>


            {/*<Row className="sp-button-row"><Col>*/}
            {/*          <div className="sp-button-bar sp-b-tooltip btn-group-sm">*/}
            {/*            <Button type="button" className="sp-e-add-session btn btn-primary">New Session*/}
            {/*            </Button>*/}
            {/*            <Button className="sp-button-bar-button sp-e-session-reload btn btn-default" type="button">Refresh List*/}
            {/*            </Button>*/}
            {/*            /!*<button type="button" className="sp-e-add-session btn btn-primary" data-toggle="tooltip" title=""*!/*/}
            {/*            /!*        data-original-title="new session">New Session*!/*/}
            {/*            /!*</button>*!/*/}
            {/*            /!*<button className="sp-button-bar-button sp-e-session-reload btn btn-default" data-toggle="tooltip" title=""*!/*/}
            {/*            /!*        data-original-title="reload session list" type="button">Refresh List*!/*/}
            {/*            /!*</button>*!/*/}
            {/*          </div>*/}
            {/*</Col></Row>*/}
            </Container>

            <SciencePortalForm fData={this.state.fData}/>
          </Container>
        {this.state.modalData.msg !== undefined &&  <SciencePortalModal modalData={this.state.modalData}
                                                                                       baseURLCanfar={this.state.urls.baseURLcanfar}/> }
        {this.state.confirmModalData.confirmData !== undefined && <SPConfirmModal modalData={this.state.confirmModalData}/>}
      </Container>

    );
  }
}

export default SciencePortalApp;

// ========================================

// science-portal hook is "react-mountpoint"
// For development, set the elementID here to 'root',
// Then for build prior to deployment, set it to the id of the
// DOM element this component should render itself into
const root = ReactDOM.createRoot(document.getElementById("root"));
//const root = ReactDOM.createRoot(document.getElementById("react-mountpoint"));

// ref= value here is setting the window.SciencePortalApp hook so the program
// this is embedded in can inject data and listen to DOM events
root.render(<SciencePortalApp ref={SciencePortalApp => { window.SciencePortalApp = SciencePortalApp }} />);
