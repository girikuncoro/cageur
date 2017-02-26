import React, {Component} from 'react';
import { withRouter } from 'react-router';
import {Badge} from '@sketchpixy/rubix';
import Spinner from 'react-spinner';
import {API_URL, API_HEADERS} from '../common/constant';
import {toTitleCase} from '../utilities/util';
import moment from 'moment';

@withRouter
class ScheduledMessageItem extends Component {
  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    let {name,status,content,date} = this.props;
    let group_name = name;
    this.props.router.push(`/mailbox/mail/${group_name}/${status}/${content}/${date}/scheduled`);
  }

  render() {
    return (
      <a  onClick={::this.handleClick}
          style={{
                'width': '90%',
                'display': 'inline-block',
                'paddingBottom': '10px',
                'paddingTop': '10px'
                }}>
          <div className='inbox-avatar-name'>
            <div className='fg-darkgrayishblue75'>{this.props.name}</div>
            <div><small><Badge className={this.props.labelClass} style={{marginRight: 5, display: this.props.labelValue ? 'inline':'none'}}>{this.props.labelValue}</Badge><span>{this.props.description}</span></small></div>
          </div>
          <div className='inbox-date hidden-sm hidden-xs fg-darkgray40 text-left'>
            <strong>Jadwal kiriman</strong>
            <div style={{position: 'relative', top: 5}}>{`${this.props.date} WIB`}</div>
          </div>
      </a>
    );
  }
}

export default class Scheduled extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sentMessages: [],
      showSpinner: false,
    };
  }

  componentDidMount() {
    // Showing spinner while waiting response from DB
    this.setState({showSpinner: true});

    // Fetch data first time
    this.handleFetching();
  }

  handleFetching() {
    // Fetching Sent Messages Information
    fetch(`${API_URL}/message/schedule/clinic/1`, {
      headers: API_HEADERS
    })
    .then((response) => response.json())
    .then((responseData) => {
      let sentMessages = [], selectedMessage = {};

      if (responseData.data !== undefined) {
        responseData.data.map(function(d,i) {
          sentMessages.push(
            {
              group_name: toTitleCase(d["disease_group"]["name"]),
              title: d["title"],
              status: d["frequency"],
              content: d["content"],
              date: moment(d["scheduled_at"]).locale("id").format("Do MMMM YY, HH:mm"),
              message_id: d["id"]
            }
          );

          selectedMessage[d["id"]] = false;
        })

        this.setState({
            sentMessages: sentMessages,
            showSpinner: false,
        });

        this.props.setSelectedMessage(selectedMessage);
      } else {
        this.setState({
            sentMessages: sentMessages,
            showSpinner: false
        });
      }

    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
      this.props.router.push("/login");
    })
  }

  handleSelectItem(itemId) {
      this.props.handleSelectItem(itemId)
  }

  handleSelectAll() {
      this.props.handleSelectAll();
  }

  render() {
    const self = this;
    const {showSpinner} = this.state;
    const {selectedMessage, checkedAll} = this.props;
    const sentMessages = (this.props.sentMessages) ? this.props.sentMessages : this.state.sentMessages;

    const renderCheckAll = (!showSpinner) ?
                            (<div   className='inbox-avatar inbox-item'
                                    style={{'padding': '0', 'backgroundColor': '#EEEDEB'}}>
                                  <input  id='all'
                                          type='checkbox'
                                          checked={this.props.checkedAll}
                                          onClick={::this.handleSelectAll}
                                          />
                                  <label  htmlFor='all'
                                          style={{'marginBottom': '0', 'marginTop': '10px'}}>
                                    Pilih semua
                                  </label>
                            </div>) : '';

    const renderSentMessages = (<div>
                                  {renderCheckAll}
                                  {
                                    sentMessages.map(function(d,i) {

                                      let labelValue, labelColor;
                                      switch(d.status) {
                                        case "daily":
                                          labelValue = "harian";
                                          labelColor = "green";
                                          break;
                                        case "monthly":
                                          labelValue = "bulanan";
                                          labelColor = "yellow";
                                          break;
                                      }

                                      const checked = (selectedMessage) ? selectedMessage[d.message_id] : false;

                                      return (
                                        <div key={i} className='inbox-avatar inbox-item' style={{'padding': '0'}}>
                                        <input  id={`checkbox${i}`}
                                                type='checkbox'
                                                checked={checked}
                                                onClick={self.handleSelectItem.bind(self,d.message_id)}
                                                />
                                        <label  htmlFor={`checkbox${i}`}></label>
                                        <ScheduledMessageItem
                                                   itemId={d.message_id}
                                                   name={d.group_name}
                                                   labelValue={labelValue}
                                                   labelClass={`bg-${labelColor} fg-white`}
                                                   description={<strong>{`${d.title} ...`}</strong>}
                                                   status={d.status}
                                                   content={d.content}
                                                   date={d.date}
                                                   checked={checked}
                                               />
                                        </div>
                                      )
                                    })
                                  }
                                </div>)

    const emptyMessage = (<div className='inbox-avatar-name'
                              style={{
                                'width': '100%',
                                'height': '100%',
                                'display': 'inline-block',
                                'paddingBottom': '10px',
                                'paddingTop': '70px',
                                'textAlign': 'center',
                              }}>
                              Tidak ada pesan terjadwal
                          </div>)

    return (
      <div>
        {(showSpinner) ? <Spinner/> : ""}
        {(sentMessages.length !== 0 || showSpinner) ? renderSentMessages : emptyMessage}
      </div>
    );
  }
}
