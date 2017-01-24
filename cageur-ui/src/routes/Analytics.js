import React from 'react';
import {
  Row, Col, Panel, PanelBody,
  PanelContainer, Button, ButtonGroup
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
      start: 0,
      end: 4
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

      this.setState({data: data});

      let pending = [],
          failed = [],
          delivered = [];

      // transform response data to status data
      for(let i = 0; i < 4; i++) {
        pending.push(data[i][0]);
        failed.push(data[i][1]);
        delivered.push(data[i][2]);
      }
      (() => {
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

        let tertunda = chart.column_series({
          name: 'tertunda',
          color: '#EA7882'
        });

        tertunda.addData(pending);

        let gagal = chart.column_series({
          name: 'gagal',
          color: '#79B0EC',
          marker: 'square'
        });

        gagal.addData(failed);

        let terkirim = chart.column_series({
          name: 'terkirim',
          color: '#55C9A6',
          marker: 'diamond'
        });

        terkirim.addData(delivered);
      })();
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    });
  }

  render() {
    return (
      <div>
        <div className='text-center'>
          <ButtonGroup>
            <Button outlined bsStyle='darkblue' >Mundur</Button>
            <Button outlined bsStyle='darkblue' >Maju</Button>
          </ButtonGroup>
        </div>
        <Row>
          <Col sm={12}>
            <Chart id='stacked-multi-series-column-chart' />
          </Col>
        </Row>
      </div>
    );
  }
}
