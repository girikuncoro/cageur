import React from 'react';
import Select from 'react-select';
import 'whatwg-fetch';

import {
  Form, FormGroup, FormControl, Col,
  Button, ControlLabel,Modal
} from '@sketchpixy/rubix';

const API_URL = 'http://localhost:5000/api/v1';
const API_HEADERS = {
  'Content-Type': 'application/json'
}

export default class Message extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      group: [],
      selectedGroup: {}
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
    console.log('State changed to ' + newValue);
    this.setState({
      selectedGroup: newValue
    });
  }

  sendMessage() {
    let {selectedGroup} = this.state;

    // Alert user to select group first befor sending a message
    if(Object.keys(selectedGroup).length === 0 && selectedGroup.constructor === Object) {
      alert("Please select group before sending message.");
      return;
    }

    let message = {
      diseaseGroup: selectedGroup.id,
      body: 'tes message'
    };

    fetch(API_URL+'/message/send', {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(message)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log(responseData.message);
    });
  }

  render() {
    let {group, selectedGroup} = this.state;

    return (
      <div>
        <Form horizontal>
        	<FormGroup controlId="formHorizontalEmail">
        	  <Col componentClass={ControlLabel} sm={2}>
        		  Group
        	  </Col>
        	  <Col sm={10}>
              <Select
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
        	    <FormControl componentClass="textarea" placeholder="Message" />
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
