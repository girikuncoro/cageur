import React, {Component} from 'react';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import Spinner from 'react-spinner';
import {Badge} from '@sketchpixy/rubix';
import {API_URL} from '../common/constant';
import {toTitleCase} from '../utilities/util';
import moment from 'moment';

@withRouter
class SentMessageItem extends React.Component {
  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    let {name,status,content,date} = this.props;
    let group_name = name;
    this.props.router.push(`/dashboard/mailbox/mail/${group_name}/${status}/${content}/${date}/sent`);
  }
  render() {
    var classes = classNames({
      'inbox-item': true,
      'unread': this.props.unread
    });

    var linkProps = {
      href: '/dashboard/mailbox/mail',
      onClick: ::this.handleClick,
      className: classes,
    };

    return (
      <a {...linkProps}>
        <div className='inbox-avatar'>
          <div className='inbox-avatar-name'>
            <div className='fg-darkgrayishblue75'>{this.props.name}</div>
            <div><small><Badge className={this.props.labelClass} style={{marginRight: 5, display: this.props.labelValue ? 'inline':'none'}}>{this.props.labelValue}</Badge><span>{this.props.description}</span></small></div>
          </div>
          <div className='inbox-date hidden-sm hidden-xs fg-darkgray40 text-right'>
            <div style={{position: 'relative', top: 5}}>{`${this.props.date} WIB`}</div>
          </div>
        </div>
      </a>
    );
  }
}

export default class Sent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        sentMessages: [],
        showSpinner: false
      };
    }

    componentDidMount() {
      // Showing spinner while waiting response from DB
      this.setState({showSpinner: true});

      // Append token to api headers
      let API_HEADERS = {
        'Content-Type': 'application/json',
      }
      API_HEADERS['Authorization'] = (localStorage) ?
                                      (localStorage.getItem('token')) : '';

      // Fetching Sent Messages Information
      fetch(`${API_URL}/message/sent/clinic/1`, {
        headers: API_HEADERS
      })
      .then((response) => response.json())
      .then((responseData) => {
        let sentMessages = [];
        responseData.data.map(function(d,i) {
          sentMessages.push(
            {
              group_name: toTitleCase(d["disease_group"]["name"]),
              title: d["title"],
              status: d["processed"],
              content: d["content"],
              date: moment(d["updated_at"]).locale("id").format("Do MMMM YY, HH:mm")
            }
          );
        })
        this.setState({
            sentMessages: sentMessages,
            showSpinner: false,
        });
      })
      .catch((error) => {
        console.log('Error fetching and parsing data', error);
        this.props.router.push("/login");
      })
    }

    render() {
        let {sentMessages, showSpinner} = this.state;

        return (
            <div>
                {(showSpinner) ? <Spinner/> : ""}
                {sentMessages.map(function(d,i) {
                  let labelValue, labelColor;
                  switch(d.status) {
                    case "delivered":
                      labelValue = "terkirim";
                      labelColor = "green";
                      break;
                    case "pending":
                      labelValue = "tertunda";
                      labelColor = "yellow";
                      break;
                    case "failed":
                      labelValue = "gagal";
                      labelColor = "red";
                      break;
                  }
                  return (
                    <SentMessageItem key={i}
                                itemId={i}
                                name={d.group_name}
                                labelValue={labelValue}
                                labelClass={`bg-${labelColor} fg-white`}
                                description={<strong>{`${d.title} ...`}</strong>}
                                status={d.status}
                                content={d.content}
                                date={d.date} />
                  )
                })}
            </div>
        );
    }
}
