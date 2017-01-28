import React, {Component} from 'react';
import {
  Row, Col, Panel, PanelBody,
  PanelContainer, Button, ButtonGroup
} from '@sketchpixy/rubix';
import _ from 'underscore';

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
    let data;

    data = this.dataAggregation();
    this.renderChart(data['failed'], data['pending'], data['delivered']);
  }

  dataAggregation() {
    let data = this.props.data[this.props.year],
        failed = [], pending = [], delivered = [];

    let groupedByMonth = _.groupBy(data, function(item) {
      return item.time.substring(5,7);
    });

    if (this.props.month) {
      // daily data
      groupedByMonth['01'].map(function(d,i) {

        let failedVal = 0,
            pendingVal = 0,
            deliveredVal = 0;

        d.message.map(function(item,index) {
          d.message.map(function(item) {
            failedVal = failedVal + item.failed;
            pendingVal = pendingVal + item.pending;
            deliveredVal = deliveredVal + item.delivered;
          })
        })

        failed.push({x: i+1, y: failedVal});
        pending.push({x: i+1, y: pendingVal});
        delivered.push({x: i+1, y: deliveredVal});
      })

    } else {
      // monthly data
      Object.keys(groupedByMonth).sort().forEach(function(key, index) {
        let failedVal = 0,
            pendingVal = 0,
            deliveredVal = 0;
        groupedByMonth[key].map(function(d,i) {
          d.message.map(function(item) {
            failedVal = failedVal + item.failed;
            pendingVal = pendingVal + item.pending;
            deliveredVal = deliveredVal + item.delivered;
          })
        })

        failed.push({x: index+1, y: failedVal});
        pending.push({x: index+1, y: pendingVal});
        delivered.push({x: index+1, y: deliveredVal});
      })
    }
    // console.log(groupedByMonth);


    return {
      failed: failed,
      pending: pending,
      delivered: delivered
    }
  }

  renderChart(failed, pending, delivered) {
    let xlabel = (this.props.month) ? 'Hari' : 'Bulan',
        title = (this.props.month) ? 'Harian' : 'Bulanan';

    let chart = new Rubix(`#${this.props.id}`, {
      title: `Angka Kontak (${title})`,
      subtitle: '',
      titleColor: '#EA7882',
      subtitleColor: '#EA7882',
      height: 300,
      axis: {
        x: {
          type: 'datetime',
          label: `${xlabel}`,
          tickFormat: '%B'
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
      }
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
            <Chart id={this.props.id} />
          </Col>
        </Row>
      </div>
    );
  }
}
