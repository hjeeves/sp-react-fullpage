import React from 'react';
import './css/index.css';

import Button from "react-bootstrap/Button";
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Placeholder from 'react-bootstrap/Placeholder';
import Popover from 'react-bootstrap/Popover';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";

class SciencePortalForm extends React.Component {

  constructor(props) {
    super(props)
    this.selectedRAM = ""
    this.selectedCores = ""
    if (typeof props.fData.contextData !== "undefined") {
      this.selectedRAM = props.fData.contextData.defaultRAM
      this.selectedCores = props.fData.contextData.defaultCores
    }
    this.state = {
      fData:props.fData,
      selectedRAM: this.selectedRAM,
      selectedCores: this.selectedCores
    }
    this.handleChange = this.handleChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  handleChange(event) {
    // Entire session form state data object needs to be put back
    // into the form on session name input change or the
    // form can't render
    var tmpData = this.state.fData
    tmpData.sessionName = event.target.value
    this.setState({fData: tmpData});
  }

  handleRAMChange(event) {
    this.setState({
      selectedRAM: event.target.value
    });
  }

  handleCoresChange(event) {
    this.setState({
      selectedCores: event.target.value
    });
  }

  resetForm(event) {
    event.stopPropagation();

    this.setState({
      selectedCores : this.state.fData.contextData.defaultCores,
      selectedRAM : this.state.fData.contextData.defaultRAM
    });
        this.state.fData.resetHandler();

  }

  componentWillReceiveProps(nextProps) {
    this.setState({ fData: nextProps.fData });
  }


  renderPopover(headerText, bodyText) {
    return <OverlayTrigger
      trigger="click"
      key="top"
      placement="top"
      rootClose={true}
        overlay={
          <Popover id={`popover-positioned-top`}>
            <Popover.Header as="h3">{headerText}</Popover.Header>
            <Popover.Body className="sp-form">
              {bodyText}
            </Popover.Body>
          </Popover>
        }
      >
        <FontAwesomeIcon className="popover-blue" icon={faQuestionCircle} />
      </OverlayTrigger>
  }

  renderPlaceholder() {
    return (
        <Col md={6}>
          <Placeholder className="sp-form-p" as="p" animation="glow">
            <Placeholder className="sp-form-placeholder" bg="secondary" md={12} sz="sm" />
          </Placeholder>
        </Col>
    );
  }

  render() {
    // For now, these are the only fields conditionally displayed
    // per session type, so they'll be handled simply
    // They are parsed out of the session json data in science_portal_form.js
    var showRAM = false
    var showCores = false
    if (this.state.fData.formFields !== undefined) {
      if (this.state.fData.formFields.showRAM !== undefined) {
        showRAM = this.state.fData.formFields.showRAM
      }
      var showCores = false
      if (this.state.fData.formFields.showCores !== undefined) {
        showCores = this.state.fData.formFields.showCores
      }
    }

    return (
      <>
        {Object.keys(this.state.fData).length !== 0 &&
            <Form onSubmit={this.state.fData.submitHandler} className="sp-form">

              <Row className="sp-form-row">
                <Col sm={3}>
                  <Form.Label  className="sp-form-label">type
                    {this.renderPopover("Session Type","Select from the list of supported session types")}
                  </Form.Label>
                </Col>
                <Col md={6}>
                  <Form.Select
                    value={this.state.fData.selectedType}
                    onChange={this.state.fData.changeTypeHandler}
                    name="type"
                    size="sm"
                  >
                    {this.state.fData.types.map(mapObj => (
                      <option className="sp-form" key={mapObj} name={mapObj} value={mapObj}>{mapObj}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <Row className="sp-form-row">
                <Col sm={3}>
                  <Form.Label  className="sp-form-label">container image
                    {this.renderPopover("Container Image","Reference to an image to use to start the session container")}
                  </Form.Label>
                </Col>
                <Col md={6}>
                  <Form.Select
                    name="image"
                    >
                    {this.state.fData.imageList.map(mapObj => (
                      <option className="sp-form" key={mapObj} value={mapObj}>{mapObj}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <Row className="sp-form-row">
                <Col sm={3}>
                  <Form.Label className="sp-form-label">name
                    {this.renderPopover("Session Name","Name for the session. Default name reflects the current number of sessions of the selected type.\n" +
                      "Alphanumeric characters only. 15 character maximum.")}
                  </Form.Label>
                </Col>
                <Col md={6}>
                  <Form.Control
                      type="text"
                      placeholder="Enter session name"
                      value={this.state.fData.sessionName}
                      onChange={this.handleChange}
                      name="name"
                      className="sp-form-input"
                  />
                </Col>
              </Row>
              {showRAM === true &&
              <Row className="sp-form-row">
                <Col sm={3}>
                  <Form.Label className="sp-form-label">memory
                    {this.renderPopover("Memory", "System memory (RAM) to be used for the session. Default: 16G")}
                  </Form.Label>
                </Col>
                <Col md={6}>
                  <Form.Select
                    value={this.state.selectedRAM || this.state.fData.contextData.defaultRAM}
                    name="ram"
                    onChange={this.handleRAMChange.bind(this)}>
                    {this.state.fData.contextData.availableRAM.map(mapObj => (
                      <option key={mapObj} value={mapObj}>{mapObj}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              }
              {showCores === true &&
              <Row className="sp-form-row">
                <Col sm={3}>
                  <Form.Label className="sp-form-label"># cores
                    {this.renderPopover("# of Cores", "Number of cores used by the session. Default: 2")}
                  </Form.Label>
                </Col>
                <Col md={6}>
                  <Form.Select
                    name="cores"
                    value={this.state.selectedCores || this.state.fData.contextData.defaultCores}
                    onChange={this.handleCoresChange.bind(this)}>
                    {this.state.fData.contextData.availableCores.map(mapObj => (
                      <option key={mapObj} value={mapObj}>{mapObj}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              }
              <Row className="sp-form-row">
                <Col sm={3}>
                {/* placeholder column so buttons line up with form entry elements */}
                </Col>
                <Col md={6}>
                  <Button variant="primary" type="submit"  size="sm" className="sp-form-button">Launch</Button>
                  <Button variant="secondary" size="sm" onClick={this.resetForm} className="sp-reset-button">Reset</Button>
                </Col>
              </Row>
            </Form>

          }

        {Object.keys(this.state.fData).length === 0 &&
          <Form className="sp-form">
            <Row className="sp-form-row">
              <Col className="sp-placeholder" sm={3}>
                <Form.Label  className="sp-form-label">type
                  {this.renderPopover("Session Type","Select from the list of supported session types")}
                </Form.Label>
              </Col>
              {this.renderPlaceholder()}
            </Row>
            <Row className="sp-form-row">
              <Col className="sp-placeholder" sm={3}>
                <Form.Label  className="sp-form-label">container image
                  {this.renderPopover("Container Image","Reference to an image to use to start the session container")}
                </Form.Label>
              </Col>
              {this.renderPlaceholder()}
            </Row>
            <Row className="sp-form-row">
              <Col className="sp-placeholder" sm={3}>
                <Form.Label className="sp-form-label">name
                  {this.renderPopover("Session Name","Name for the session. Default name reflects the current number of sessions of the selected type.\n" +
                    "Alphanumeric characters only. 15 character maximum.")}
                </Form.Label>
              </Col>
              {this.renderPlaceholder()}
            </Row>
            <Row className="sp-form-row">
              <Col className="sp-placeholder" sm={3}>
                <Form.Label  className="sp-form-label">memory
                  {this.renderPopover("Memory","System memory (RAM) to be used for the session. Default: 16G")}
                </Form.Label>
              </Col>
              {this.renderPlaceholder()}
            </Row>
            <Row className="sp-form-row">
              <Col className="sp-placeholder" sm={3}>
                <Form.Label  className="sp-form-label"># cores
                  {this.renderPopover("# of Cores","Number of cores used by the session. Default: 2")}
                </Form.Label>
              </Col>
              {this.renderPlaceholder()}
            </Row>

            <Row className="sp-form-row">
              <Col sm={3}>
                {/* placeholder column so buttons line up with form entry elements */}
              </Col>
              <Col className="sp-button-placeholder-row" md={6}>
                <Placeholder.Button className="sp-button-placeholder" bg="secondary"  aria-hidden="true" animation="glow" />
                <Placeholder.Button className="sp-button-placeholder" bg="secondary"  aria-hidden="true" animation="glow" />
              </Col>
            </Row>
         </Form>
        }
      </>

    )
  }
}

export default SciencePortalForm;