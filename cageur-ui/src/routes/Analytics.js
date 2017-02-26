import React, {Component} from 'react';
import { withRouter } from 'react-router';
import Select from 'react-select';
import StackedBar from '../common/stacked-bar';
import PieChart from '../common/pie-chart';
import {
  Row, Col, Panel, PanelBody,
  PanelContainer
} from '@sketchpixy/rubix';
import Spinner from 'react-spinner';
import {API_URL, API_HEADERS} from '../common/constant';
import _ from 'underscore';
import 'whatwg-fetch';

const monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
                'Agustus', 'September', 'Oktober', 'November', 'Desember'];

class ChartContainer extends React.Component {
  render() {
    return (
      <PanelContainer controls={false}>
        <Panel>
          <PanelBody style={{padding: 25}}>
            {this.props.children}
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}

@withRouter
export default class Analytics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      groupedByYear: [],
      years: [],
      year: null,
      months: [],
      month: null,
      showSpinner: false,
    };
  }

  componentDidMount() {
    // Showing spinner while waiting response from DB
    this.setState({showSpinner: true});

    // Fetching analytics data
    fetch(API_URL+'/analytics/message/clinic/1', {
      headers: API_HEADERS
    })
    .then((response) => response.json())
    .then((responseData) => {
        let data = responseData.data,
          years = [],
          months = [];

        // Group by year response data
        let groupedByYear = _.groupBy(data, function(item) {
            return item.time.substring(0,4);
        });

        Object.keys(groupedByYear).forEach(function(d,i) {
            years.push({id: i, value: d, label: d});
        })

        // Group by month of the latest yearly data
        let groupedByMonth = _.groupBy(groupedByYear[years[years.length-1].value], function(item) {
            return item.time.substring(5,7);
        });

        // Push list of month to select for current year
        Object.keys(groupedByMonth).forEach(function(d,i) {
            let value = (i<9) ? `0${i+1}` : `${i+1}`;
            months.push({id: i, value: value, label: monthName[i]});
        })

        // Set state with the latest year and month
        this.setState({
            data: responseData,
            groupedByYear: groupedByYear,
            years: years.reverse(),
            year: years[0].value,
            months: months,
            month: months[months.length-1].value,
            showSpinner: false,
        })

    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
      this.props.router.push("/login");
    });
  }

  setYear(val) {
    let year = (val) ? val.value : null;
    let months = [];
    let data = this.state.groupedByYear[`${year}`];

    let groupedByMonth = _.groupBy(data, function(item) {
      return item.time.substring(5,7);
    });

    Object.keys(groupedByMonth).forEach(function(d,i) {
      let value = (i<9) ? `0${i+1}` : `${i+1}`;
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
    let {groupedByYear, year, month, months, showSpinner} = this.state;

    let renderBarDaily = (groupedByYear != 0) ?
                      <StackedBar data={groupedByYear}
                                 id='bar-month'
                                 year={year}
                                 month={month}
                       /> : "";

    let renderBarMonthly = (groupedByYear != 0) ?
                         <StackedBar data={groupedByYear}
                                    id='bar-year'
                                    year={year}
                                    months={months}
                          /> : "";

    let renderPieMonth = (groupedByYear != 0) ?
                    <PieChart data={groupedByYear}
                               id='pie-month'
                               year={year}
                               month={month}
                     /> : "";

    let renderPieYear = (groupedByYear != 0) ?
                    <PieChart data={groupedByYear}
                              id='pie-year'
                              year={year}
                              months={months}
                    /> : "";

    return (
      <div>
        <Row>
          <Col xs={2} sm={2}>
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
        <Row>
            <Col sm={6} md={8}>
                <ChartContainer>
                  {(showSpinner) ? <Spinner/> : ""}
                  {renderBarDaily}
                </ChartContainer>
            </Col>
            <Col sm={6} md={4}>
                <ChartContainer>
                  {(showSpinner) ? <Spinner/> : ""}
                  {renderPieMonth}
                </ChartContainer>
            </Col>
        </Row>

        <Row>
          <Col xs={2} sm={2}>
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
        <Row>
            <Col sm={6} md={8}>
                <ChartContainer>
                    {(showSpinner) ? <Spinner/> : ""}
                    {renderBarMonthly}
                </ChartContainer>
            </Col>
            <Col sm={6} md={4}>
                <ChartContainer>
                    {(showSpinner) ? <Spinner/> : ""}
                    {renderPieYear}
                </ChartContainer>
            </Col>
        </Row>
      </div>
    );
  }
}
