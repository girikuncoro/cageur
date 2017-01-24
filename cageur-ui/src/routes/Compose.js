import React from 'react';
import Select from 'react-select';
import 'whatwg-fetch';
import {
  Form, FormGroup, FormControl, Col,
  Button, ControlLabel, Modal, Alert,
  PanelContainer, Panel, PanelBody, Progress
} from '@sketchpixy/rubix';
import Spinner from 'react-spinner';
import Template from '../common/template';
import {compare, toTitleCase} from '../utilities/util';
import {API_URL, API_HEADERS} from '../common/constant';

export default class Compose extends React.Component {
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
      responseMessage: '',
      template: [],
      selectedTemplate: null,
      progressTime: 0,
      showDialogueBox: false,
      showSpinner: false,
      showSendSpinner: false
    };
  }

  componentDidMount() {
    // Fetching Disease Group Data
    fetch(API_URL+'/disease_group', {
      headers: API_HEADERS
    })
    .then((response) => response.json())
    .then((responseData) => {
      let group = [];
      responseData.data.map(function(d,i) {
        group.push({id: d.id, value: d.name, label: toTitleCase(d.name)});
      })
      group.sort(compare);
      this.setState({group: group});
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    })
  }

  close() {
    this.setState({
        showModal: false,
        template: []
    });
  }

  open() {
    let {selectedGroup} = this.state;

    // Alert user to select group first before opening template
    if(selectedGroup === null) {
      this.setState({
        showGroupSelectAlert: true
      })
      return;
    }

    this.setState({ showModal: true });

    if (selectedGroup !== null) {
      // Showing spinner while waiting response from DB
      this.setState({showSpinner: true});

      // Fetching message template for selected disease group
      fetch(`${API_URL}/template/disease_group/${selectedGroup.id}`, {headers: API_HEADERS})
      .then((response) => response.json())
      .then((responseData) => {
        let template = [];
        responseData.data.map(function(d,i) {
          template.push({id: d.id, disease_group: d.disease_group, title: d.title, content: d.content});
        })
        this.setState({
            template: template,
            showSpinner: false
        });
      })
      .catch((error) => {
        console.log('Error fetching and parsing data', error);
      });
    }
  }

  setGroup(newValue) {
    this.setState({
      selectedGroup: newValue,
      showGroupSelectAlert: false,
    });
  }

  handleChange(e) {
    this.setState({text: e.target.value});
  }

  handleHideDialoge() {
    this.setState({showDialogueBox: false})
  }

  handleContinue() {
    this.setState({showDialogueBox: false})
    this.sendMessage();
  }

  sendMessage() {
    let {selectedGroup, text} = this.state;

    let message = {
      diseaseGroup: selectedGroup.id,
      body: text
    };

    // Showing spinner while waiting response from DB
    this.setState({showSendSpinner: true});

    // Fetching ...
    fetch(API_URL+'/message/send/clinic/1', {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(message)
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        responseMessage: `Pesan telah berhasil terkirim ke grup penyakit ${toTitleCase(selectedGroup.value)}. Mengarahkan ke kotak keluar ...`,
        messageAlert: true,
        showMessageAlert: true,
        messageError: 3,
        showSendSpinner: false
      });

      // redirect to outbox
      let self = this,
          showProgressBar = setInterval(() => (this.setState({progressTime: this.state.progressTime + 10})), 100);

      let redirect = function () {
        clearInterval(showProgressBar);
        return self.props.router.push("/mailbox/outbox");
      }

      setTimeout(redirect, 1000);
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
      this.setState({
        responseMessage: `Terdapat kesalahan berupa ${error}`,
        messageAlert: true,
        showMessageAlert: true,
        messageError: 2,
        showSendSpinner: false
      });
    });
  }

  handleSendMessage() {
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

    // Show dialogue box ensuring user to proceed
    this.setState({showDialogueBox: true});
  }

  handleAlertGroupSelectDismiss() {
    this.setState({showGroupSelectAlert: false})
  }

  handleAlertMessageDismiss() {
    this.setState({showMessageAlert: false})
  }

  handleUse(template) {
    this.setState({
      showModal: false,
      selectedTemplate: template,
      text: template.content
    })
  }

  render() {
    let {group, selectedGroup, showGroupSelectAlert, showMessageAlert,
         messageAlert, responseMessage, messageError,
         template, showDialogueBox, showSendSpinner} = this.state;

    let alertGroupSelect = (showGroupSelectAlert) ?
    (<Alert bsStyle="danger" onDismiss={::this.handleAlertGroupSelectDismiss}>
        <strong>Perhatian! </strong><span>Silahkan pilih salah satu grup penyakit.</span>
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

    let progressBar = (showMessageAlert && alertStyle === "success") ?
    (<Progress active bsStyle="success" value={this.state.progressTime} />) : "";

    return (
      <div>
        <PanelContainer controls={false}>
          <Panel>
            <PanelBody>
              <Form horizontal>
                <FormGroup controlId="alert">
                  <Col sm={2}>
                  </Col>
                  <Col sm={9}>
                    {alertGroupSelect}
                    {alertMessage}
                    {progressBar}
                  </Col>
                </FormGroup>
                <FormGroup controlId="formHorizontalEmail">
                  <Col componentClass={ControlLabel} sm={2}>
                    Grup Penyakit
                  </Col>
                  <Col sm={9}>
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
                  <Col sm={9}>
                    <FormControl style={{height: 200}} componentClass="textarea"
                      placeholder="Isi Pesan ..."
                      value={this.state.text}
                      onChange={::this.handleChange}
                    />
                  </Col>
                </FormGroup>

                <FormGroup>
                  <Col sm={7}>
                  </Col>
                  <Col sm={4}>
                    <Button style={{margin: '10px'}}>
                      BERKALA
                    </Button>
                    <Button bsStyle="primary" onClick={::this.open} style={{margin: '10px'}}>
                      TEMPLATE
                    </Button>
                    <Button bsStyle="success" onClick={::this.handleSendMessage} style={{margin: '10px'}}>
                      KIRIM PESAN
                    </Button>
                  </Col>
                </FormGroup>

              </Form>
            </PanelBody>
          </Panel>
        </PanelContainer>

        {/*  Template Modal */}
        <Template
          showModal={this.state.showModal}
          handleHide={::this.close}
          template={this.state.template}
          group={(this.state.selectedGroup!==null) ? this.state.selectedGroup.value : ""}
          handleUse={::this.handleUse}
          showSpinner={this.state.showSpinner}
          />

        {/*  Dialog Modal */}
        <Modal show={showDialogueBox} bsSize="small">
          <Modal.Body>
            <h1>Apakah anda yakin?</h1>
          </Modal.Body>
          <Modal.Footer>
             <Button onClick={::this.handleHideDialoge}>Tidak</Button>
             <Button onClick={::this.handleContinue}>Ya</Button>
          </Modal.Footer>
        </Modal>

        {/*  Spinner Modal */}
        <Modal show={showSendSpinner} bsSize="small">
            <Spinner style={{marginTop: "50px"}}/>
        </Modal>
      </div>
    );
  }
}
