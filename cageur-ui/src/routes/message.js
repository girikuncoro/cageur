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
      selectedGroup: null,
      text: '',
      showGroupSelectAlert: false,
      showMessageAlert: false,
      messageAlert: false,
      messageError: 1,
      responseMessage: ''
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
      // console.log(group);
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
    });
    console.log(newValue);
  }

  handleChange(e) {
    this.setState({text: e.target.value});
  }

  sendMessage() {
    let {selectedGroup, text} = this.state;

    // Alert user to select group first before sending a message
    if(selectedGroup === null) {
      this.setState({
        showGroupSelectAlert: true
      })
      return;
    }

    // Alert user to at least write something in message body
    if(text === '') {
      this.setState({
        showMessageAlert: true,
        messageAlert: false,
        messageError: 1
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
        responseMessage: `Pesan telah berhasil terkirim ke grup penyakit ${selectedGroup.value}`,
        messageAlert: true,
        showMessageAlert: true,
        messageError: 3,
      });
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
      this.setState({
        responseMessage: `Terdapat kesalahan berupa ${error}`,
        messageAlert: true,
        showMessageAlert: true,
        messageError: 2,
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
         messageAlert, responseMessage, messageError} = this.state;
    let alertGroupSelect = (showGroupSelectAlert) ?
    (<Alert bsStyle="danger" onDismiss={::this.handleAlertGroupSelectDismiss}>
        <strong>Perhatian! </strong><span>Silahkan pilih salah satu grup penyakit sebelum mengirim pesan.</span>
    </Alert>) : ""

    let message = (messageAlert) ?
        responseMessage :
        "Silahkan isi bagian pesan sebelum mengirim pesan.";
    let alertStyle;

    if (messageError == 1) {
      alertStyle = "danger";
    } else if (messageError == 2) {
      alertStyle = "danger";
    } else if (messageError == 3) {
      alertStyle = "success";
    }

    let alertMessage = (showMessageAlert) ?
    (<Alert bsStyle={alertStyle} onDismiss={::this.handleAlertMessageDismiss}>
        <span>{message}</span>
    </Alert>) : "";

    return (
      <div>
        <Form horizontal>
          {alertGroupSelect}
          {alertMessage}
        	<FormGroup controlId="formHorizontalEmail">
        	  <Col componentClass={ControlLabel} sm={2}>
        		  Grup Penyakit
        	  </Col>
        	  <Col sm={10}>
              <Select
                  ref="groupDiseaseSelect"
                  matchProp="label"
                  name="select-group-disease"
                  value={selectedGroup}
                  options={group}
                  onChange={::this.setGroup}
                  placeholder="Pilih Grup Penyakit"
                  autofocus={true}
              />
        	  </Col>
        	</FormGroup>

          <FormGroup controlId="formControlsTextarea">
            <Col componentClass={ControlLabel} sm={2}>
              Pesan
            </Col>
            <Col sm={10}>
        	    <FormControl style={{height: 200}} componentClass="textarea"
                placeholder="Isi Pesan ..."
                value={this.state.value}
                onChange={::this.handleChange}
              />
            </Col>
        	</FormGroup>

        	<FormGroup>
            <Col smOffset={2} sm={10}>
          		<Button>
          		  BERKALA
          		</Button>
              <Button bsStyle="primary" onClick={::this.open}>
                TEMPLATE
              </Button>
              <Button bsStyle="success" onClick={::this.sendMessage}>
                KIRIM PESAN
              </Button>
            </Col>
        	</FormGroup>
        </Form>
        <Modal show={this.state.showModal} onHide={::this.close}>
    		  <Modal.Header closeButton>
    			   <Modal.Title>Template Pesan Untuk Grup Penyakit</Modal.Title>
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
