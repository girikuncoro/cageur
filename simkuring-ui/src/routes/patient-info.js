import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {
  Row, Col, Grid, Panel, Table, PanelBody,
  PanelHeader, FormControl, PanelContainer
} from '@sketchpixy/rubix';
import Spinner from 'react-spinner';
import Select from 'react-select';
import {API_URL, API_HEADERS} from '../common/constant';
import moment from 'moment';
import {compare, toTitleCase} from '../utilities/util';

class PatientInfoTable extends Component {
  componentDidMount() {
    $(ReactDOM.findDOMNode(this.table))
      .addClass('nowrap')
      .dataTable({
        responsive: true
    });
  }

  render() {
    let {patients, showSpinner} = this.props;
    return (
      <Table ref={(c) => this.table = c} className='display' cellSpacing='0' width='100%'>
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama Pasien</th>
            <th>Penyakit</th>
            <th>Penyakit Muncul</th>
            <th>Pasien Terdaftar</th>
            <th>No. Telp</th>
            <th>LineID</th>
          </tr>
          {(showSpinner) ? <tr><Spinner style={{left: "700%", marginTop: "50px"}}/> </tr> : ""}
        </thead>
        <tfoot>
          <tr>
            <th>No.</th>
            <th>Nama Pasien</th>
            <th>Penyakit</th>
            <th>Penyakit Muncul</th>
            <th>Pasien Terdaftar</th>
            <th>No. Telp</th>
            <th>LineID</th>
          </tr>
        </tfoot>
        <tbody>
          {patients.map((d,i) => (
            <tr key={i}>
              <td>{i+1}</td>
              <td>{d.name}</td>
              <td>
                {d.group.map((d,i) =>
                  (<p key={i}>{d}</p>)
                )}
              </td>
              <td>
                {d.disease_created.map((d,i) =>
                  (<p key={i}>{d}</p>)
                )}
              </td>
              <td>{d.patient_created}</td>
              <td>{d.phone_number}</td>
              <td>{d.line_id}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export default class PatientInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      patients: [],
      showSpinner: false,
      clinic: [],
      selectedClinic: null,
    };
  }

  componentDidMount() {
    // Fetching all clinic
    fetch(API_URL+'/clinic', {
      headers: API_HEADERS
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log(responseData);
      let clinic = [];
      responseData.data.map(function(d,i) {
        clinic.push({id: d.id, value: d.name, label: toTitleCase(d.name)});
      })
      clinic.sort(compare);
      this.setState({clinic: clinic});
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    })
  }

  selectClinic(newValue) {
    this.setState({selectedClinic: newValue});
    this.renderTable(newValue['id']);
  }

  renderTable(clinicId) {

    // Showing spinner while waiting response from DB
    this.setState({showSpinner: true});

    // Fetching Patient Information
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

        if(disease_group.length > 0) {
          disease_group.map(function(d,i) {
            disease_created.push(moment(d["disease_created_at"]).locale("id").format("Do MMMM YY"));
            group.push(toTitleCase(d["name"]));
          })
        }


        patients.push(
          {
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
        patients: patients,
        showSpinner: false
      });
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    })
  }

  render() {
    const {patients, selectedClinic} = this.state;
    const clinicId = (selectedClinic) ? selectedClinic['id'] : 'undefined';

    console.log(selectedClinic);
    console.log(patients);

    const renderPatiens = (patients) ?
                          (<PatientInfoTable patients={patients}
                                             showSpinner={this.state.showSpinner}/>) : '';

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
                      <Col xs={12}>
                        {renderPatiens}
                        <br/>
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
