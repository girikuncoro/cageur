import React, {Component} from 'react';
import {
  Row, Col, Panel, PanelBody,
  PanelContainer, Button, ButtonGroup
} from '@sketchpixy/rubix';

class Chart extends Component {
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

export default class Analytics extends Component {

  componentDidMount() {
    this.renderChart();
  }

  renderChart() {
    let {pending, failed, delivered} = this.props;
    let chart = new Rubix('#daily', {
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
  }

  render() {
    return (
      <div>
        <Row>
          <Col sm={12}>
            <Chart id='daily' />
          </Col>
        </Row>
      </div>
    );
  }
}
