import React, {Component} from 'react';
import _ from 'underscore';

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

    this.chart = c3.generate({
        bindto: `#${this.props.id}`,
        data: {
            columns: pieData,
            type : 'pie'
        },
        tooltip: {
            position: function(data, width, height, element) {
                return {top: 0, left: 0}
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
