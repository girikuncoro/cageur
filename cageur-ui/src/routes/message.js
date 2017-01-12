import React from 'react';
import Select from 'react-select';
import 'whatwg-fetch';

import {
  Form, FormGroup, FormControl, Col,
  Button, ControlLabel, Modal, Alert
} from '@sketchpixy/rubix';

const API_URL = 'http://localhost:5000/api/v1';
const API_HEADERS = {
  'Content-Type': 'application/json'
}

function compare(a,b) {
  // c: object property
  let c = 'value';
  if (a[c] < b[c])
    return -1;
  if (a[c] > b[c])
    return 1;
  return 0;
}

export default class Message extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      group: [],
      selectedGroup: {},
      text: '',
      showGroupSelectAlert: false,
      showMessageAlert: false,
      groupSelectAlert: 'success',
      messageAlert: 'success'
    };
  }

 componentDidMount(){
    // Fetching Disease Group Data
    fetch(API_URL+'/disease_group', {headers: API_HEADERS})
    .then((response) => response.json())
    .then((responseData) => {
      let group = [];
      responseData.data.map(function(d,i) {
        group.push({id: d.id, value: d.name, label: d.name});
      })
      group.sort(compare);
      this.setState({group: group});
      console.log(group);
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    });
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  setGroup(newValue) {
    this.setState({
      selectedGroup: newValue,
      showGroupSelectAlert: false,
      groupSelectAlert: "success"
    });
  }

  handleChange(e) {
    this.setState({text: e.target.value});
  }

  sendMessage() {
    let {selectedGroup, text} = this.state;

    // Alert user to select group first befor sending a message
    if(Object.keys(selectedGroup).length === 0 && selectedGroup.constructor === Object) {
      this.setState({
        showGroupSelectAlert: true,
        groupSelectAlert: "danger"
      })
      return;
    }

    // Alert user to at least write something in message body
    if(text === '') {
      this.setState({
        showMessageAlert: true,
        messageAlert: "danger"
      })
      return;
    }

    let message = {
      diseaseGroup: selectedGroup.id,
      body: text
    };

    fetch(API_URL+'/message/send', {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(message)
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        responseMessage: responseData.message,
        messageAlert: "success"
      });
    });
  }

  handleAlertGroupSelectDismiss() {
    this.setState({showGroupSelectAlert: false})
  }

  handleAlertMessageDismiss() {
    this.setState({showMessageAlert: false})
  }

  render() {
    let {group, selectedGroup, showGroupSelectAlert, showMessageAlert,
         groupSelectAlert, messageAlert, responseMessage} = this.state;
    let alertGroupSelect = (showGroupSelectAlert) ?
    (<Alert bsStyle={groupSelectAlert} onDismiss={::this.handleAlertGroupSelectDismiss}>
        <strong>Oh snap! </strong><span>Please select group before sending message.</span>
    </Alert>) : ""

    let message = (messageAlert == "success") ?
        this.state.responseMessage :
        "Please write something or use a template:)";
    let alertMessage = (showMessageAlert) ?
    (<Alert bsStyle={messageAlert} onDismiss={::this.handleAlertMessageDismiss}>
        <span>{message}</span>
    </Alert>) : "";

    return (
      <div>
        <Form horizontal>
          {alertGroupSelect}
          {alertMessage}
        	<FormGroup controlId="formHorizontalEmail">
        	  <Col componentClass={ControlLabel} sm={2}>
        		  Group
        	  </Col>
        	  <Col sm={10}>
              <Select
                  matchProp="label"
                  name="form-field-name"
                  value={selectedGroup}
                  options={group}
                  onChange={::this.setGroup}
              />
        	  </Col>
        	</FormGroup>

          <FormGroup controlId="formControlsTextarea">
            <Col componentClass={ControlLabel} sm={2}>
              Message
            </Col>
            <Col sm={10}>
        	    <FormControl componentClass="textarea"
                placeholder="Message"
                value={this.state.value}
                onChange={::this.handleChange}
              />
            </Col>
        	</FormGroup>

        	<FormGroup>
            <Col smOffset={2} sm={10}>
          		<Button>
          		  Schedule
          		</Button>
              <Button bsStyle="primary" onClick={::this.open}>
                Template
              </Button>
              <Button bsStyle="success" onClick={::this.sendMessage}>
                Send Now
              </Button>
            </Col>
        	</FormGroup>
        </Form>
        <Modal show={this.state.showModal} onHide={::this.close}>
    		  <Modal.Header closeButton>
    			   <Modal.Title>Group Message Template</Modal.Title>
    		  </Modal.Header>
    		  <Modal.Body>
            <h1>All</h1>
            <ul>
              <li>Bla 1</li>
              <li>Bla 2</li>
              <li>Bla 3</li>
            </ul>
            <h1>Asam Urat</h1>
            <ul>
              <li>Bla 1</li>
              <li>Bla 2</li>
              <li>Bla 3</li>
            </ul>
            <h1>Diabetes</h1>
            <ul>
              <li>Bla 1</li>
              <li>Bla 2</li>
              <li>Bla 3</li>
            </ul>
    		  </Modal.Body>
    		  <Modal.Footer>
    			   <Button onClick={::this.close}>Close</Button>
    		  </Modal.Footer>
    		</Modal>
      </div>
    );
  }
}
