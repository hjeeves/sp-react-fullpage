import React from 'react';
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col';
import Placeholder from 'react-bootstrap/Placeholder';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt'

import './css/index.css';
import './sp-session-list.css';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";

function SessionItem(props) {

  // Set up badging colours
  var bgClass = "";
  if (props.listType == "list") {
    if (props.sessData.status === "Running") {
      bgClass = "success"
    } else {
      bgClass = "secondary"
    }
  }

  return (
    <>
      {props.listType === "list" &&
      <Card className="sp-e-session-connect"
           >
        <Card.Body className="">
          <div
            className="sp-connect-div"
            onClick={props.sessData.connectHandler}
            data-connecturl={props.sessData.connectURL}>
            <Row><Col>
              <Card.Header className="sp-float-left-full">
                <img className="sp-icon-img" src={props.sessData.logo} alt={props.sessData.altText}></img>
                <span className="sp-session-name">{props.sessData.name}</span>
              </Card.Header>
            </Col></Row>
            <Row><Col>
              <div className="sp-card-pill sp-card-text">
                {/* For next pass */}
                {/*<Badge pill bg="warning">Expiring Soon</Badge>*/}
                <Badge pill bg={bgClass}>{props.sessData.status}</Badge>
              </div>
            </Col></Row>
            <Row><Col>
              <div className="sp-card-text">{props.sessData.image}</div>
              <br/>
              {/* For next pass */}
              {/*<div className="sp-card-text">cores: {props.sessData.cores} &nbsp; RAM: {props.sessData.RAM}</div><br/>*/}
            </Col></Row>
            <Row><Col>
              <div className="sp-card-text">up since: {props.sessData.startTime}</div>
              <br/>
            </Col></Row>
          </div>
          <Row><Col>
            <div className="sp-card-button sp-e-del-session">
              <OverlayTrigger
                key="top"
                placement="top"
                className="sp-b-tooltip"
                overlay={
                  <Tooltip className="sp-b-tooltip">
                    delete session
                  </Tooltip>
                }
              >
                <FontAwesomeIcon
                  onClick={props.sessData.deleteHandler}
                  data-id={props.sessData.id}
                  data-name={props.sessData.name}
                  className="sp-card-text"
                  icon={faTrashAlt}/>
              </OverlayTrigger>
            </div>

            <br/>
          </Col></Row>
        </Card.Body>
      </Card>
      }
      {props.listType === "loading" &&
        <>
          <Card>
            <Card.Body>
              <Row className="sp-title-placeholder"><Col>
                <Placeholder as={Card.Header} animation="glow">
                  <Placeholder xs={12} />
                </Placeholder>
              </Col></Row>
              
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={12} /> <Placeholder xs={12} />
                <Placeholder xs={12} /> <Placeholder xs={12} />{' '}
              </Placeholder>

            </Card.Body>
          </Card>
        </>
      }
      {props.listType === "empty" &&
      <>
        <Card className="sp-emptylist-card">
          <Card.Body>
            <Row ><Col>
              <Card.Title>
                <em>No interactive sessions found</em>
              </Card.Title>
            </Col></Row>
          </Card.Body>
        </Card>
      </>
      }
      </>
);
}

export default SessionItem;
