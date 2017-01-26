import React, {Component} from 'react';
import StackedBar from '../common/stacked-bar';
import {API_URL, API_HEADERS} from '../common/constant';
import moment from 'moment';
import 'whatwg-fetch';

export default class Analytics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      start: 0,
      end: 4,
      pending: [],
      failed: [],
      delivered: []
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
      this.setState({
        pending: pending,
        failed: failed,
        delivered: delivered
      })
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    });
  }

  render() {
    let {pending, failed, delivered} = this.state;
    let renderStackedBar = (pending != 0) ?
                            <StackedBar pending={pending}
                                        failed={failed}
                                        delivered={delivered}/> : "";
    return (
      <div>
        {renderStackedBar}
      </div>
    );
  }
}
