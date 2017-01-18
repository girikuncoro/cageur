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

class PatientInfoTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      patients: []
    };
  }

  componentDidMount() {

    // Fetching Patient Information
    fetch(API_URL+'/patient_disease_group', {
      headers: API_HEADERS
    })
    .then((response) => response.json())
    .then((responseData) => {
      let patients = [];
      responseData.data.map(function(d,i) {
        patients.push({name: d["patient_id"], group: d["disease_group_id"], date: d["updated_at"]});
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
            <th>Nama Pasien</th>
            <th>Penyakit</th>
            <th>Tanggal Terakhir</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>Nama Pasien</th>
            <th>Penyakit</th>
            <th>Tanggal Terakhir</th>
          </tr>
        </tfoot>
        <tbody>
          {patients.map((d,i) => (
            <tr key={i}>
              <td>{d.name}</td>
              <td>{d.group}</td>
              <td>{d.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export default class PatientInfo extends Component {
  handleClosePanel() {
    console.log(this);
  }
  render() {
    return (
      <Row>
        <Col xs={12}>
          <PanelContainer onRemove={::this.handleClosePanel}>
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
