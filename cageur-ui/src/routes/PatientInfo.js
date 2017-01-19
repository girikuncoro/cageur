import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {
  Row,
  Col,
  Grid,
  Panel,
  Table,
  PanelBody,
  PanelHeader,
  FormControl,
  PanelContainer,
} from '@sketchpixy/rubix';
import {API_URL, API_HEADERS} from '../common/constant';
import moment from 'moment';
import {toTitleCase} from '../utilities/util';

class PatientInfoTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      patients: []
    };
  }

  componentDidMount() {

    // Fetching Patient Information
    fetch(`${API_URL}/patient_disease_group/clinic/1`, {
      headers: API_HEADERS
    })
    .then((response) => response.json())
    .then((responseData) => {
      let patients = [];
      responseData.data.map(function(d,i) {
        let patient = d["patient_disease_group"]["patient"],
            last_name = (patient["last_name"] !== null) ? patient["last_name"] : "",
            patient_created = (patient["patient_created_at"] !== null) ?
                              moment(patient["patient_created_at"]).locale("id").format("Do MMMM YY") : "";

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
            disease_created: disease_created
          }
        );

      })
      this.setState({patients: patients});
      $(ReactDOM.findDOMNode(this.table))
        .addClass('nowrap')
        .dataTable({
          responsive: true
      });

    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    })
  }

  render() {
    let {patients} = this.state;
    return (
      <Table ref={(c) => this.table = c} className='display' cellSpacing='0' width='100%'>
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama Pasien</th>
            <th>Penyakit</th>
            <th>Penyakit Muncul</th>
            <th>Pasien Terdaftar</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>No.</th>
            <th>Nama Pasien</th>
            <th>Penyakit</th>
            <th>Penyakit Muncul</th>
            <th>Pasien Terdaftar</th>
          </tr>
        </tfoot>
        <tbody>
          {patients.map((d,i) => (
            <tr key={i}>
              <td>{i+1}</td>
              <td>{d.name}</td>
              <td>
                {d.group.map((d) =>
                  (<p>{d}</p>)
                )}
              </td>
              <td>
                {d.disease_created.map((d) =>
                  (<p>{d}</p>)
                )}
              </td>
              <td>{d.patient_created}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export default class PatientInfo extends Component {
  render() {
    return (
      <Row>
        <Col xs={12}>
          <PanelContainer controls={false}>
            <Panel>
              <PanelBody>
                <Grid>
                  <Row>
                    <Col xs={12}>
                      <PatientInfoTable/>
                      <br/>
                    </Col>
                  </Row>
                </Grid>
              </PanelBody>
            </Panel>
          </PanelContainer>
        </Col>
      </Row>
    );
  }
}
