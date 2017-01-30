import React, {Component} from 'react';
import _ from 'underscore';
import moment from 'moment';

export default class Analytics extends Component {

  componentDidMount() {
    let data;

    data = this.dataAggregation();
    this.renderChart(data['failed'], data['pending'], data['delivered']);
  }

  componentDidUpdate() {
    let data;

    data = this.dataAggregation();
    this.renderChart(data['failed'], data['pending'], data['delivered']);
  }

  dataAggregation() {
    let data = this.props.data[this.props.year],
        failed = ['gagal'], pending = ['tunda'], delivered = ['terkirim'];

    let groupedByMonth = _.groupBy(data, function(item) {
      return item.time.substring(5,7);
    });

    if (this.props.month) {
      // daily data
      groupedByMonth[this.props.month].map(function(d,i) {

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

        failed.push(failedVal);
        pending.push(pendingVal);
        delivered.push(deliveredVal);
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

        failed.push(failedVal);
        pending.push(pendingVal);
        delivered.push(deliveredVal);
      })
    }

    return {
      failed: failed,
      pending: pending,
      delivered: delivered
    }
  }

  renderChart(failed, pending, delivered) {
    let months = ['x'],
        days = ['x'];

    if(this.props.months) {
      Object.keys(this.props.months).sort().forEach(function(key, index) {
        months.push(index);
      })
    }

    failed.map(function(d,i) {
      days.push(i+1);
    })

    let x = (this.props.month) ?
            days : months;

    let formatFunc = (this.props.month) ?
                      '%d' :
                      (function (x) {
                        return moment(new Date(2014, x, 1)).locale("id").format("MMMM");
                      });
    let title = (this.props.month) ? `Angka Kontak Harian (${this.props.year})` : 'Angka Kontak Bulanan'

    this.chart = c3.generate({
      bindto: `#${this.props.id}`,
      title: {
        text: title
      },
      data: {
        x: 'x',
        columns: [
          x,
          failed,
          pending,
          delivered
        ],
        type: 'bar',
        groups: [
          ['gagal', 'tunda','terkirim']
        ]
      },
      axis: {
          x: {
              tick: {
                  format: formatFunc
              }
          },
          y: {
            label: {
              text: 'Jumlah Pasien',
              position: 'outer-middle'
            }
          }
      }
    });
  }

  render() {
    return (
        <div id={this.props.id}></div>
    );
  }
}
