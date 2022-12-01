import React from 'react';
import './css/index.css';

import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Button from "react-bootstrap/Button";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Tooltip from 'react-bootstrap/Tooltip';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import {faRefresh} from "@fortawesome/free-solid-svg-icons/faRefresh";


function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, (e) => {
    var a = e.target
  });

  return (
 <Button id="formButton" size="sm" variant="outline-success" onClick={decoratedOnClick}>
Launch Session
 {/*{children}*/}

</Button>
  );
}

class SciencePortalForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      fData:props.fData,
    }
    this.handleSubmit = props.fData.submitHandler
    this.handleChangeType = props.fData.changeTypeHandler
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ fData: nextProps.fData });
  }

  //renderTooltip(text, children) {
  //  return <OverlayTrigger
  //    trigger="click"
  //    key="top"
  //    placement="top"
  //    rootClose={true}
  //    overlay={
  //      <Tooltip>
  //        text
  //      </Tooltip>
  //    }
  //  >
  //{children}
  //  </OverlayTrigger>
  //
  //}

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

  // TODO: consider making the Accordion a Tab setup
  render() {
    return (
      <Container fluid className="bg-white sp-container rounded-1">
        {/*<Accordion defaultActiveKey="0">  This one will have the accordian open */}
          <Accordion >
          <Card>
            <Card.Header className="bg-white sp-container">
              <CustomToggle eventKey="0">New Session</CustomToggle>
                <OverlayTrigger
                  key="top"
                  placement="top"
                  className="sp-b-tooltip"
                  overlay={
                    <Tooltip>
                      refresh session list
                    </Tooltip>
                  }
                  >
                  <Button size="sm" variant="outline-primary"><FontAwesomeIcon icon={faRefresh}/></Button>
              </OverlayTrigger>

            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Row><Col>
                  <ProgressBar variant="success" now={100} className="sp-progress-bar" />
                </Col></Row>
                <Form onSubmit={this.state.fData.submitHandler} className="sp-form">
                  <Row className="sp-form-row">
                    <Col sm={3}>
                      <Form.Label  className="sp-form-label">type
                        {this.renderPopover("Session Type","Select from the list of supported session types")}
                      </Form.Label>
                    </Col>
                    <Col md={6}>
                      <Form.Select
                        //defaultValue={this.state.fData.selectedType}
                        value={this.state.fData.selectedType}
                        onChange={this.state.fData.changeTypeHandler}
                        name="type"
                        size="sm"
                      >
                        {this.state.fData.types.map(mapObj => (
                          <option className="sp-form" name={mapObj} value={mapObj}>{mapObj}</option>
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
                          <option className="sp-form" value={mapObj}>{mapObj}</option>
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
                          //defaultValue={this.state.fData.sessionName}
                          value={this.state.fData.sessionName}
                          name="name"
                          className="sp-form"
                      />
                    </Col>
                  </Row>
                  <Row className="sp-form-row">
                    <Col sm={3}>
                      <Form.Label  className="sp-form-label">memory
                        {this.renderPopover("Memory","System memory (RAM) to be used for the session. Default: 16G")}
                      </Form.Label>
                    </Col>
                    <Col md={6}>
                      <Form.Select
                        defaultValue={this.state.fData.contextData.defaultRAM}
                        name="ram"
                        >
                        {this.state.fData.contextData.availableRAM.map(mapObj => (
                          <option value={mapObj}>{mapObj}</option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className="sp-form-row">
                    <Col sm={3}>
                      <Form.Label  className="sp-form-label"># cores
                        {this.renderPopover("# of Cores","Number of cores used by the session. Default: 2")}
                      </Form.Label>
                    </Col>
                    <Col md={6}>
                      <Form.Select
                        defaultValue={this.state.fData.contextData.defaultCores}
                        name="cores"
                        >
                        {this.state.fData.contextData.availableCores.map(mapObj => (
                          <option value={mapObj}>{mapObj}</option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>

                  <Row className="sp-form-row">
                    <Col sm={3}>
                    {/* placeholder column so buttons line up with form entry elements */}
                    </Col>
                    <Col md={6}>
                      <Button variant="primary" type="submit"  size="sm" className="sp-form-button">Launch</Button>
                      <Button variant="secondary" size="sm" type="reset" className="sp-reset-button">Reset</Button>
                    </Col>
                  </Row>
                </Form>

              </Card.Body>
            </Accordion.Collapse>
          </Card>

        </Accordion>
      </Container>
    )
  }
}

export default SciencePortalForm;