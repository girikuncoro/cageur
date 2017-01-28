import React, {Component} from 'react';
import StackedBar from '../common/stacked-bar';
import {API_URL, API_HEADERS} from '../common/constant';
import _ from 'underscore';
import 'whatwg-fetch';

export default class Analytics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      groupedByYear: []
    };
  }

  componentDidMount() {

    // Fetching analytics data
    fetch(API_URL+'/analytics/message/clinic/1', {
      headers: API_HEADERS
    })
    .then((response) => response.json())
    .then((responseData) => {
      let data = responseData.data;

      let groupedByYear = _.groupBy(data, function(item) {
        return item.time.substring(0,4);
      });

      this.setState({
        data: responseData,
        groupedByYear: groupedByYear
      })

    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    });
  }

  render() {
    let {groupedByYear} = this.state;
    let renderMonthly = (groupedByYear != 0) ?
                         <StackedBar data={groupedByYear}
                                    id='Bulanan'
                                    year={'2015'}
                          /> : "";

    let renderDaily = (groupedByYear != 0) ?
                      <StackedBar data={groupedByYear}
                                 id='Harian'
                                 year={'2015'}
                                 month={'01'}
                       /> : "";

    return (
      <div>
        {renderMonthly}
        {renderDaily}
      </div>
    );
  }
}
