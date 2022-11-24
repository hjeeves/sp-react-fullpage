import React from 'react';
import './css/index.css';
import SessionItem from "./SessionItem";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';


class SessionList extends React.Component {

  constructor(props) {
    super(props)
    this.sessionList = props.sessionList
    this.state = {
      sessionData: props.sessionList,
      baseURLcadc:props.baseURLcadc,
      baseURLcanfar: props.baseURLcanfar
    }
  }

  // This function allows data to move through and re-render
  // children using this data
  componentWillReceiveProps(nextProps) {
    this.setState({ sessionData: nextProps.sessionList });
  }

  render() {
    return (
        <Container fluid className="panel-body sp-panel-body sp-session-panel-body" id="sp_session_list">
            <Row xs={1} md={3} className="g-4">
              {this.state.sessionData.map(mapObj => (
                <Col className="sp-card-container">
                  <SessionItem sessData={mapObj} baseURLcanfar={this.state.baseURLcanfar}/>
                </Col>
              ))}
            </Row>
        </Container>
    )
  }
}


export default SessionList;