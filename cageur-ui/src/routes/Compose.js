import React from 'react';
import { withRouter } from 'react-router';
import Select from 'react-select';
import 'whatwg-fetch';
import {
  Form, FormGroup, FormControl, Col,
  Button, ControlLabel, Modal, Alert,
  PanelContainer, Panel, PanelBody, Progress
} from '@sketchpixy/rubix';
import Spinner from 'react-spinner';
import Datetime from 'react-datetime';
import moment from 'moment';
import Template from '../common/template';
import {compare, toTitleCase} from '../utilities/util';
import {API_URL, API_HEADERS} from '../common/constant';
require('moment/locale/id');

@withRouter
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
      showSendSpinner: false,
      schedulePanel: false,
      scheduleOption: 'none',
      scheduleDate: null,
      showScheduledAlert: false
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
      this.props.router.push("/login");
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
    let {selectedGroup, text, scheduleOption, scheduleDate} = this.state;

    // Showing spinner while waiting response from DB
    this.setState({showSendSpinner: true});

    // Fetching ...
    const endpoint = (scheduleOption == 'none') ?
                      '/message/send/clinic/1' :
                      '/message/schedule/clinic/1';

    const message = (scheduleOption == 'none') ?
                {
                  diseaseGroup: selectedGroup.id,
                  body: text
                } :
                {
                  clinic_id: 1,
                  disease_group: selectedGroup.id,
                  body: text,
                  frequency: (scheduleOption === 'once') ? 'none' : scheduleOption,
                  scheduled_at: moment.utc(scheduleDate).format('YYYY-MM-DD HH:mm')
                };

    const responseMessage = (scheduleOption == 'none') ?
                            'kotak keluar' :
                            'daftar pesan terjadwal';


    fetch(`${API_URL}${endpoint}`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(message)
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        responseMessage: `Pesan dikirimkan ke grup penyakit ${toTitleCase(selectedGroup.value)}. Mengarahkan ke ${responseMessage} ...`,
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
        const route = (scheduleOption === 'none') ?
                      self.props.router.push("/mailbox/outbox/sent") :
                      self.props.router.push("/mailbox/outbox/scheduled");
        return route
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
    let {selectedGroup, text,
        scheduleOption, scheduleDate} = this.state;

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

    // Alert user to at least write something in message body
    if(text === '') {
      this.setState({
        showMessageAlert: true,
        messageAlert: false,
        messageError: 1
      })
      return;
    }

    // Focus user to insert scheduled date if selection is not none
    if(scheduleOption !== 'none' && scheduleDate === null) {
      this.setState({
        showScheduledAlert: true
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

  toggleSchedulePanel() {
    const scheduleOption = (this.state.schedulePanel) ? 'none' : 'once';
    this.setState({
      schedulePanel: !this.state.schedulePanel,
      scheduleOption: scheduleOption
    })
  }

  handleOptionChange(e) {
    this.setState({
      scheduleOption: e.target.value
    })
  }

  handleInputCalendar(datetime) {
    this.setState({
      scheduleDate: datetime,
      showScheduledAlert: false
    })
  }

  handleFocusInputCalendar() {
    this.setState({
      scheduleDate: null
    })
  }

  handleAlertScheduledDismiss() {
    this.setState({
      showScheduledAlert: false
    })
  }

  render() {
    let {group, selectedGroup, showGroupSelectAlert,
         showMessageAlert, messageAlert, responseMessage,
         messageError, template, showDialogueBox,
         showSendSpinner, schedulePanel, scheduleOption,
         scheduleDate, showScheduledAlert} = this.state;

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

    let alertScheduledInput = (showScheduledAlert) ?
    (<Alert bsStyle="danger" onDismiss={::this.handleAlertScheduledDismiss}>
        <span>Anda memilih untuk menjadwalkan pesan, silahkan masukan tanggal.</span>
    </Alert>) : ""

    let progressBar = (showMessageAlert && alertStyle === "success") ?
    (<Progress active bsStyle="success" value={this.state.progressTime} />) : "";

    const renderSchedulePanel = (schedulePanel) ?
            (<FormGroup>
              <Col componentClass={ControlLabel} sm={2}>
              </Col>
              <Col sm={3}>
                <Datetime value={scheduleDate}
                           inputProps={{placeholder: 'Pilih tanggal dan jam'}}
                           onFocus={::this.handleFocusInputCalendar}
                           onChange={::this.handleInputCalendar}
                           locale="id"
                />
                <p>
                  <input id="once" type="radio" value="once" style={{'marginRight': '10px'}}
                                checked={this.state.scheduleOption === 'once'}
                                onChange={::this.handleOptionChange} />
                  <label htmlFor='once'>
                    Kirim sekali saja
                  </label>
                </p>
                <p>
                  <input id="daily" type="radio" value="daily" style={{'marginRight': '10px'}}
                                checked={this.state.scheduleOption === 'daily'}
                                onChange={::this.handleOptionChange} />
                  <label htmlFor='daily'>
                    Setiap hari
                  </label>
                </p>
                <p>
                  <input id="monthly" type="radio" value="monthly" style={{'marginRight': '10px'}}
                                checked={this.state.scheduleOption === 'monthly'}
                                onChange={::this.handleOptionChange} />
                  <label htmlFor='monthly'>
                    Setiap bulan
                  </label>
                </p>
              </Col>
            </FormGroup>) : '';

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
                    {alertScheduledInput}
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
                  <Col sm={2}>
                  </Col>
                  <Col sm={3}>
                    <Button bsStyle="primary" outlined
                            active={schedulePanel}
                            onClick={::this.toggleSchedulePanel}
                            style={{margin: '10px'}}>
                      BERKALA
                    </Button>
                    <Button bsStyle="primary" outlined
                            onClick={::this.open} style={{margin: '10px'}}>
                      TEMPLATE
                    </Button>
                  </Col>
                  <Col sm={4}>
                  </Col>
                  <Col sm={2}>
                    <Button bsStyle="success" outlined
                            onClick={::this.handleSendMessage} style={{margin: '10px'}}>
                      {(schedulePanel) ? `SIMPAN PESAN` : `KIRIM PESAN`}
                    </Button>
                  </Col>
                </FormGroup>

                {/* Shedule Panel */}
                {renderSchedulePanel}

                <FormGroup></FormGroup>
                <FormGroup></FormGroup>
                <FormGroup></FormGroup>
                <FormGroup></FormGroup>
                <FormGroup></FormGroup>
                <FormGroup></FormGroup>
                <FormGroup></FormGroup>
                <FormGroup></FormGroup>
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
