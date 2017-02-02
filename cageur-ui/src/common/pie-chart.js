import React, {Component} from 'react';
import _ from 'underscore';
import moment from 'moment';

export default class PieChart extends Component {

  componentDidMount() {
    let pieData = this.dataAggregation();
    this.renderPieChart(pieData);
  }

  componentDidUpdate() {
    let pieData = this.dataAggregation();
    this.renderPieChart(pieData);
  }

  dataAggregation() {
    let data = this.props.data[this.props.year],
        pieData = [], groupByDisease;

    if (this.props.month) {
        let groupedByMonth = _.groupBy(data, function(item) {
          return item.time.substring(5,7);
        });

        groupByDisease = _.groupBy(_.flatten(_.pluck(groupedByMonth[this.props.month], 'message')), msg => msg.disease_group.name);

    } else {
        groupByDisease = _.groupBy(_.flatten(_.pluck(data, 'message')), msg => msg.disease_group.name);
    }

    Object.keys(groupByDisease).forEach(function(key,i) {

        let diseaseVal = 0;
        groupByDisease[key].map(function(d,i) {
            diseaseVal = diseaseVal + d['delivered'] + d['pending'] + d['failed'];
        })

        pieData.push([key, diseaseVal])

    })

    return pieData;
  }

  renderPieChart(pieData) {
    let {month} = this.props;
    let monthName = moment(new Date(2014, Number(month)-1, 1)).locale("id").format("MMM");
    let subtitle = (this.props.month) ?
                    `${monthName} ${this.props.year}`:
                    `${this.props.year}`;

    this.chart = c3.generate({
        bindto: `#${this.props.id}`,
        title: {
          text: `Grup penyakit dan % Pasien`,
        },
        data: {
            columns: pieData,
            type : 'donut'
        },
        tooltip: {
            position: function(data, width, height, element) {
                return {top: height, left: 0}
            }
        },
        color: {
            pattern: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
        },
        donut: {
            width: 50,
            title: subtitle
        }
    });
  }

  render() {
    return (
        <div id={this.props.id}></div>
    );
  }
}
