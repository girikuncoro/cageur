import React, {Component} from 'react';
import Select from 'react-select';
import StackedBar from '../common/stacked-bar';
import {Row, Col} from '@sketchpixy/rubix';
import {API_URL, API_HEADERS} from '../common/constant';
import _ from 'underscore';
import 'whatwg-fetch';

export default class Analytics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      groupedByYear: [],
      years: [],
      year: null,
      months: [],
      month: null
    };
  }

  componentDidMount() {

    // Fetching analytics data
    fetch(API_URL+'/analytics/message/clinic/1', {
      headers: API_HEADERS
    })
    .then((response) => response.json())
    .then((responseData) => {
      let data = responseData.data,
          years = [],
          months = [];

      let groupedByYear = _.groupBy(data, function(item) {
        return item.time.substring(0,4);
      });

      Object.keys(groupedByYear).forEach(function(d,i) {
        years.push({id: i, value: d, label: d});
      })

      let monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agus', 'Sep',
                    'Okt', 'Nov', 'Des'];

      monthName.map(function(d,i) {
        let value = (i<8) ? `0${i+1}` : `${i+1}`;
        months.push({id: i, value: value, label: d});
      })

      this.setState({
        data: responseData,
        groupedByYear: groupedByYear,
        years: years,
        year: years[0].value,
        months: months,
        month: months[0].value,
      })

    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    });
  }

  setYear(val) {
    let year = (val) ? val.value : null;
    let months = [];
    let data = this.state.groupedByYear[`${year}`];

    let groupedByMonth = _.groupBy(data, function(item) {
      return item.time.substring(5,7);
    });

    let monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agus', 'Sep',
                  'Okt', 'Nov', 'Des'];

    Object.keys(groupedByMonth).forEach(function(d,i) {
      let value = (i<8) ? `0${i+1}` : `${i+1}`;
      months.push({id: i, value: value, label: monthName[i]});
    })

    this.setState({
      year: year,
      months: months,
    });

    if (this.state.month > months.length-1) {
      this.setState({
        month: months[months.length-1].value
      })
    }
  }

  setMonth(val) {
    let month = (val) ? val.value : null;

    this.setState({month: month});
  }

  render() {
    let {groupedByYear, year, month, months} = this.state;

    let renderDaily = (groupedByYear != 0) ?
                      <StackedBar data={groupedByYear}
                                 id='Harian'
                                 year={year}
                                 month={month}
                       /> : "";

    let renderMonthly = (groupedByYear != 0) ?
                         <StackedBar data={groupedByYear}
                                    id='Bulanan'
                                    year={year}
                                    months={months}
                          /> : "";

    return (
      <div>
        <Row>
          <Col sm={2}>
          <Select
              ref="month-selection"
              matchProp="label"
              name="month-selection"
              value={this.state.month}
              options={this.state.months}
              onChange={::this.setMonth}
              placeholder="bulan"
              clearable={false}
              autofocus={true}
          />
          </Col>
        </Row>
        {renderDaily}
        <Row>
          <Col sm={2}>
          <Select
              ref="year-selection"
              matchProp="label"
              name="year-selection"
              value={this.state.year}
              options={this.state.years}
              onChange={::this.setYear}
              placeholder="tahun"
              clearable={false}
              autofocus={true}
          />
          </Col>
        </Row>
        {renderMonthly}
      </div>
    );
  }
}
