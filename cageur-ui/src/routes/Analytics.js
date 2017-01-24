import React from 'react';
import {
  Row, Col, Panel,
  PanelBody, PanelContainer, Button
} from '@sketchpixy/rubix';
import {API_URL, API_HEADERS} from '../common/constant';
import moment from 'moment';
import 'whatwg-fetch';

class Chart extends React.Component {
  render() {
    return (
      <PanelContainer>
        <Panel>
          <PanelBody style={{padding: 25}}>
            <div id={this.props.id}></div>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}

export default class Analytics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      pending: [],
      failed: [],
      delivered: []
    };
  }

  componentDidMount() {

    // Fetching analytics data
    fetch(API_URL+'/analytics/message/clinic/1', {
      headers: API_HEADERS
    })
    .then((response) => response.json())
    .then((responseData) => {
      let data = [];

      // save response data
      responseData.data.map(function(d,i) {
        data.push([
          {
            x: moment(d.time).locale("id").format("Do MMMM YY"),
            y: d.message[0]["pending"]
          },
          {
            x: moment(d.time).locale("id").format("Do MMMM YY"),
            y: d.message[0]["failed"]
          },
          {
            x: moment(d.time).locale("id").format("Do MMMM YY"),
            y: d.message[0]["delivered"]
          }
        ])
      })

      this.setState({
        data: data
      })
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    });
  }

  transformData(start, end) {
    let {data} = this.state;
    let pending = [],
        failed = [],
        delivered = [];

    // transform response data to status data
    for(let i = start; i < end; i++) {
      pending.push(data[i][0]);
      failed.push(data[i][1]);
      delivered.push(data[i][2]);
    }

    this.setState({
      pending: pending,
      failed: failed,
      delivered: delivered
    })

    this.renderChart();
  }

  renderChart() {
    // (() => {
      let chart = new Rubix('#stacked-multi-series-column-chart', {
        title: 'Angka Kontak',
        subtitle: '',
        titleColor: '#EA7882',
        subtitleColor: '#EA7882',
        height: 300,
        axis: {
          x: {
            type: 'ordinal'
          },
          y:  {
            type: 'linear',
            tickFormat: 'd',
            label: 'Jumlah Pasien'
          }
        },
        tooltip: {
          color: 'white',
          format: {
            y: '.0f'
          }
        },
        show_markers: true
      });

      let pending = chart.column_series({
        name: 'tertunda',
        color: '#EA7882'
      });

      pending.addData(this.state.pending);

      let failed = chart.column_series({
        name: 'gagal',
        color: '#79B0EC',
        marker: 'square'
      });

      failed.addData(this.state.failed);

      let delivered = chart.column_series({
        name: 'terkirim',
        color: '#55C9A6',
        marker: 'diamond'
      });

      delivered.addData(this.state.delivered);
    // })();
  }

  render() {

    return (
      <div>
      <Button bsStyle="success" onClick={this.transformData.bind(this, 1, 4)}>
        Plot
      </Button>
        <Row>
          <Col sm={12}>
            <Chart id='stacked-multi-series-column-chart' />
          </Col>
        </Row>
      </div>
    );
  }
}
