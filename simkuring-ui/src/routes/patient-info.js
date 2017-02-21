import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {
  Row, Col, Grid, Panel, PanelBody,
  PanelHeader, FormControl, PanelContainer
} from '@sketchpixy/rubix';
import Spinner from 'react-spinner';
import Select from 'react-select';
import {API_URL, API_HEADERS} from '../common/constant';
import moment from 'moment';
import {compare, toTitleCase} from '../utilities/util';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

class CustomRow extends Component {

  render() {
    let renderCustomRow = this.props.cell.map(function(d,i) {
      return (<tr key={i}><td>{d}</td></tr>)
    })

    return (
      <div>
        {renderCustomRow}
      </div>
    )
  }
}

class PatientInfoTable extends Component {
  diseaseFormatter(cell, row) {
    let newCell = (typeof cell  === 'string') ? cell.split(',') : cell;
    return <CustomRow cell={newCell}/>
  }
  render() {
    let {patients, showSpinner} = this.props;

    const cellEdit = {
      mode: 'click',
      blurToSave: true
    };

    const noDataText = (showSpinner && patients.length === 0) ?
                        <Spinner style={{marginTop: '40px'}}/> :
                        'Data tidak ditemukan';
    const options = {
      noDataText: noDataText
    }

    return (
      <BootstrapTable data={patients}
                      options={options}
                      striped
                      hover
                      pagination
                      cellEdit={ cellEdit }>
          <TableHeaderColumn  dataSort
                              width="70"
                              editable={ false }
                              dataAlign='center'
                              dataField='num'>
                                No.
          </TableHeaderColumn>
          <TableHeaderColumn  dataSort
                              dataField='name'
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari nama'
                                  }
                              }>
                                Nama Pasien
          </TableHeaderColumn>
          <TableHeaderColumn  dataField='group' dataSort
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari penyakit'
                                  }
                              }
                              dataFormat = {this.diseaseFormatter}>
                              Penyakit
          </TableHeaderColumn>
          <TableHeaderColumn  dataField='disease_created' dataSort
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari tanggal'
                                  }
                              }
                              dataFormat = {this.diseaseFormatter}>
                              Penyakit Muncul
          </TableHeaderColumn>
          <TableHeaderColumn  dataField='patient_created'
                              dataSort
                              editable={ false }
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari tanggal'
                                  }
                              }>
                                Pasien Terdaftar
          </TableHeaderColumn>
          <TableHeaderColumn dataField='phone_number' dataSort
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari nomor'
                                  }
                              }>
                                No. Telp
          </TableHeaderColumn>
          <TableHeaderColumn isKey dataField='line_id' dataSort
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari ID'
                                  }
                              }>
                                LineID
          </TableHeaderColumn>
      </BootstrapTable>
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
      this.setState({clinic: clinic});
      this.selectClinic(clinic[0]);
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

        if(disease_group.length > 0) {
          disease_group.map(function(d,i) {
            disease_created.push(moment(d["disease_created_at"]).locale("id").format("Do MMMM YY"));
            group.push(toTitleCase(d["name"]));
          })
        }


        patients.push(
          {
            num: i+1,
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

  render() {
    const {patients, selectedClinic, showSpinner} = this.state;
    const clinicId = (selectedClinic) ? selectedClinic['id'] : 'undefined';

    const renderPatiens = (patients) ?
                          (<PatientInfoTable  patients={patients}
                                              showSpinner={showSpinner}/>) : '';

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
