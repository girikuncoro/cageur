import React, {Component} from 'react';
import _ from 'underscore';
import moment from 'moment';

export default class PieChart extends Component {

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

    let failedVal = 0,
        pendingVal = 0,
        deliveredVal = 0;

    if (this.props.month) {

      // daily data
      groupedByMonth[this.props.month].map(function(d,i) {
        d.message.map(function(item,index) {
            failedVal = failedVal + item.failed;
            pendingVal = pendingVal + item.pending;
            deliveredVal = deliveredVal + item.delivered;
        })

      })

    } else {

      // monthly data
      Object.keys(groupedByMonth).sort().forEach(function(key, index) {

        groupedByMonth[key].map(function(d,i) {

          d.message.map(function(item) {
            failedVal = failedVal + item.failed;
            pendingVal = pendingVal + item.pending;
            deliveredVal = deliveredVal + item.delivered;
          })

        })

      })
    }

    failed.push(failedVal);
    pending.push(pendingVal);
    delivered.push(deliveredVal);

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
      data: {
            // iris data from R
            columns: [
               ['data1', 30],
               ['data2', 120],
            ],
            type : 'pie'
        }
    });
  }

  render() {
    return (
        <div id={this.props.id}></div>
    );
  }
}
