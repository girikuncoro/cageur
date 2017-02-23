import React, {Component} from 'react';
import {
  Row, Col, Grid, Panel, PanelBody,
  PanelHeader, FormControl, PanelContainer,
  Button, Icon
} from '@sketchpixy/rubix';
import Select from 'react-select';
import {API_URL, API_HEADERS} from '../common/constant';
import moment from 'moment';
import {toTitleCase} from '../utilities/util';
import Table from '../common/table/table';
import _ from 'lodash';

export default class PatientInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      patients: [],
      showSpinner: false,
      clinic: [],
      selectedClinic: null,
      selectedRows: [],
      oldGroup: []
    };
  }

  componentDidMount() {
    // Fetching all clinic
    fetch(API_URL+'/clinic', {
      headers: API_HEADERS
    })
    .then((response) => response.json())
    .then((responseData) => {
      let clinic = [];
      responseData.data.map(function(d,i) {
        clinic.push({id: d.id, value: d.name, label: toTitleCase(d.name)});
      })
      this.setState({clinic: clinic});
      this.selectClinic(clinic[0]);
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    })
  }

  selectClinic(newValue) {
    this.setState({
        selectedClinic: newValue,
        selectedRows: []
      });
    this.renderTable(newValue['id']);
  }

  renderTable(clinicId) {

    // Showing spinner while waiting response from DB
    this.setState({
      showSpinner: true,
      patients: []
    });

    // Fetching Patient Information based on selected clinic
    fetch(`${API_URL}/patient_disease_group/clinic/${clinicId}`, {
      headers: API_HEADERS
    })
    .then((response) => response.json())
    .then((responseData) => {
      let patients = [];
      responseData.data.map(function(d,i) {
        let patient = d["patient_disease_group"]["patient"],
            last_name = (patient["last_name"] !== null) ? patient["last_name"] : "",
            patient_created = (patient["patient_created_at"] !== null) ?
                              moment(patient["patient_created_at"]).locale("id").format("Do MMMM YY") : "",
            phone_number = patient["phone_number"],
            line_id = patient["line_user_id"];

        let disease_group = d["patient_disease_group"]["disease_group"],
            disease_created = [],
            group = [];

        if(disease_group) {
          disease_group.map(function(d,i) {
            disease_created.push(moment(d.disease["created_at"]).locale("id").format("Do MMMM YY"));
            group.push(
              {
                label: toTitleCase(d.disease["name"]),
                pdg_id: d["pdg_id"],
                value: d.disease['id']
              }
            );
          })
        }

        patients.push(
          {
            num: i+1,
            id: patient["id"],
            name: `${patient["first_name"]} ${last_name}`,
            group: group,
            patient_created: patient_created,
            disease_created: disease_created,
            phone_number: phone_number,
            line_id: line_id
          }
        );

      })
      this.setState({
        showSpinner: true,
        patients: patients
      });
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    })
  }

  handleRowSelection(selectedRows) {
    this.setState({
      selectedRows: selectedRows
    })
  }

  handleDelete() {
    const {selectedClinic,selectedRows} = this.state;
    const self = this;
    const endpoint = `${'/patient/'}`;

    selectedRows.map(function(d,i) {
      fetch(`${API_URL}${endpoint}${d}`, {
        method: 'delete',
        headers: API_HEADERS
      })
      .then((response) => response.json())
      .then((responseData) => {
          self.renderTable(selectedClinic['id']);
          self.setState({
            selectedRows: []
          })
      })
      .catch((error) => {
        console.log('Error fetching and parsing data', error);
      });
    })
  }

  handlePatientUpdate(row, dataField, value) {
    const {selectedClinic} = this.state,
          endpoint = `${'/patient/'}`;

    let fullName = row['name'].split(' ');
    let firstName = fullName[0];
    let lastName = (fullName.length > 1) ? fullName[1] : '';
    let body = {
                id: row['id'],
                clinic_id: selectedClinic['id'],
                phone_number: row['phone_number'],
                first_name: firstName,
                last_name: lastName,
                line_user_id: row['line_id']
            };

    switch(dataField) {
        case "name":
            fullName = value.split(' ');
            firstName = fullName[0];
            lastName = (fullName.length > 1) ? fullName[1] : '';

            body.first_name = firstName;
            body.last_name = lastName;
            break;
        case "phone_number":
            body.phone_number = value;
            break;
        case "line_id":
            body.line_id = value;
            break;
    }

    fetch(`${API_URL}${endpoint}${row['id']}`, {
      method: 'PUT',
      headers: API_HEADERS,
       body: JSON.stringify(body)
    })
    .then((response) => response.json())
    .then((responseData) => {
        this.renderTable(selectedClinic['id']);
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    });

  }

  handleInitEdit(row) {
    this.setState({
      oldGroup : row.group
    })
  }

  handleDiseaseGroupUpdate(selectedGroup, patientId) {
    let {oldGroup, selectedClinic} = this.state,
        newGroup = selectedGroup,
        method = '',
        endpoint = 'patient_disease_group';

    var result = _.intersectionWith(oldGroup, newGroup, _.isEqual);
    oldGroup = _.difference(oldGroup, result);
    newGroup = _.difference(newGroup, result);

    if (oldGroup.length > 0) {
      oldGroup.map((d) => {
        fetch(`${API_URL}/${endpoint}/${d.pdg_id}`, {
          method: 'DELETE',
          headers: API_HEADERS,
        })
        .then((response) => response.json())
        .then((responseData) => {
          this.renderTable(selectedClinic['id']);
        })
        .catch((error) => {
          console.log('Error fetching and parsing data', error);
        });
      })
    }

    if (newGroup.length > 0) {
      newGroup.map((d) => {
        let body = {
          patient_id: patientId,
          disease_group_id: d.value
        }
        fetch(`${API_URL}/${endpoint}`, {
          method: 'POST',
          headers: API_HEADERS,
           body: JSON.stringify(body)
        })
        .then((response) => response.json())
        .then((responseData) => {
          this.renderTable(selectedClinic['id']);
        })
        .catch((error) => {
          console.log('Error fetching and parsing data', error);
        });
      })
    }

  }

  render() {
    const {patients, selectedClinic,
           showSpinner, selectedRows} = this.state;
    const clinicId = (selectedClinic) ? selectedClinic['id'] : 'undefined';

    const renderDeleteButton = (selectedRows.length !== 0)
                              ?
                              (<Button bsStyle='danger' onClick={::this.handleDelete}>
                                  <Icon glyph='icon-fontello-trash-1'/>
                              </Button>) :
                              '';

    const renderPatiens = (patients) ?
                          (<Table patients={patients}
                                  selectedRows={selectedRows}
                                  showSpinner={showSpinner}
                                  handleRowSelection={::this.handleRowSelection}
                                  handlePatientUpdate={::this.handlePatientUpdate}
                                  handleInitEdit={::this.handleInitEdit}
                                  handleDiseaseGroupUpdate={::this.handleDiseaseGroupUpdate}
                                  />)
                          : '';

    return (
      <div>
        <Row>
          <Col xs={4} sm={4}>
          <Select
              ref="clinic-selection"
              matchProp="label"
              name="clinic-selection"
              value={this.state.selectedClinic}
              options={this.state.clinic}
              onChange={::this.selectClinic}
              placeholder="klinik"
              clearable={false}
              autofocus={true}
          />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <PanelContainer controls={false}>
              <Panel>
                <PanelBody>
                  <Grid>
                    <Row>
                      <Col xs={2}>
                        {renderDeleteButton}
                      </Col>
                    </Row>
                    <Row style={{'paddingBottom': '150px'}}>
                      <Col xs={12}>
                        {renderPatiens}
                      </Col>
                    </Row>
                  </Grid>
                </PanelBody>
              </Panel>
            </PanelContainer>
          </Col>
        </Row>
      </div>
    );
  }
}
