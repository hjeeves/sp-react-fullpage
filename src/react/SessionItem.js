import React from 'react';
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt'


import './css/index.css';
import './sp-session-list.css';

function SessionItem(props) {

  // Set up badging colours
  var bgClass = "";
  if (props.sessData.status === "Running") {
    bgClass = "success"
  } else {
    bgClass = "secondary"
  }

  return (
    <Card className="sp-e-session-connect" data-connecturl={props.sessData.connectURL}>
      <Card.Body className="">
        <Row><Col>
          <Card.Title className="sp-float-left-full">
                <img className="sp-icon-img" src={props.sessData.logo} alt={props.sessData.altText} ></img>
                <span className="sp-session-name">{props.sessData.name}</span>
          </Card.Title>
        </Col></Row>
        <Row><Col>
        <div className="sp-card-text">
          {/* For next pass */}
          <Badge pill bg="warning">Expiring Soon</Badge>
          <Badge pill bg={bgClass}>{props.sessData.status}</Badge>
        </div>
        </Col></Row>
        <Row><Col>
        <div className="sp-card-text">{props.sessData.image}</div><br/>
        {/* For next pass */}
        {/*<div className="sp-card-text">cores: {props.sessData.cores} &nbsp; RAM: {props.sessData.RAM}</div><br/>*/}
        </Col></Row>
        <Row><Col>
        <div className="sp-card-text">up since: {props.sessData.startTime}</div><br/>
        </Col></Row>
        <Row><Col>
        <div className="sp-card-button sp-e-del-session">
          <FontAwesomeIcon
            onClick={props.sessData.deleteHandler}
            data-id={props.sessData.id}
            data-name={props.sessData.name}
            className="sp-card-text"
            icon={faTrashAlt} />
        </div><br/>
        </Col></Row>
      </Card.Body>
    </Card>
);
}

export default SessionItem;
