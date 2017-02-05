import React from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router';
import {
  Row,Col,Icon,Grid,Label,Badge,Panel,
  Button,PanelLeft,PanelBody,ListGroup,
  LoremIpsum,ButtonGroup,ButtonToolbar,
  ListGroupItem,PanelContainer,
} from '@sketchpixy/rubix';
import Spinner from 'react-spinner';
import {API_URL, API_HEADERS} from '../common/constant';
import {toTitleCase} from '../utilities/util';
import moment from 'moment';
import update from 'immutability-helper';
import _ from 'underscore';

class ScheduledNavItem extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={8} collapseLeft collapseRight>
            <Icon glyph={this.props.glyph} className='inbox-item-icon'/>
            <span>{this.props.title}</span>
          </Col>
          <Col xs={4} className='text-right' collapseLeft collapseRight>
            <div style={{marginTop: 5}}><Label className={this.props.labelClass}>{this.props.labelValue}</Label></div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

@withRouter
class ScheduledMessageItem extends React.Component {
  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    let {name,status,content,date} = this.props;
    let group_name = name;
    this.props.router.push(`/mailbox/mail/${group_name}/${status}/${content}/${date}/scheduled`);
  }

  render() {
    return (
      <a onClick={::this.handleClick} style={{'width': '90%', 'display': 'inline-block', 'paddingBottom': '10px', 'paddingTop': '10px'}}>
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

@withRouter
export default class Scheduled extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      sentMessages: [],
      showSpinner: false,
      selectedMessage: {},
      checkedAll: false
    };
  }

  componentDidMount() {
    // Showing spinner while waiting response from DB
    this.setState({showSpinner: true});

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
              group_name: d["disease_group"]["name"],
              title: d["title"],
              status: d["frequency"],
              content: d["content"],
              date: moment(d["schedule_at"]).locale("id").format("Do MMMM YY, HH:mm"),
              message_id: d["id"]
            }
          );

          selectedMessage[d["id"]] = false;
        })
        this.setState({
            sentMessages: sentMessages,
            showSpinner: false,
            selectedMessage: selectedMessage
        });
      } else {
        this.setState({
            sentMessages: sentMessages,
            showSpinner: false
        });
      }

    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    })
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.router.push('/mailbox/compose');
  }

  handleSelectItem(itemId) {
      let {selectedMessage} = this.state;
      this.setState({
        selectedMessage: update(selectedMessage, {[itemId]: {$set: !selectedMessage[itemId]}})
      })
  }

  handleSelectAll() {
    const {checkedAll, selectedMessage} = this.state;
    const newSelectedMessage = selectedMessage;
    Object.keys(selectedMessage).forEach(function(key) {
      newSelectedMessage[key] = !checkedAll;
    })

    this.setState({
      selectedMessage: newSelectedMessage,
      checkedAll: !checkedAll
    })
  }

  handleDelete() {
      const {selectedMessage} = this.state;
      const self = this;
      const endpoint = `${'/message/schedule/'}`;

      Object.keys(selectedMessage).forEach(function(d,i) {
          if(selectedMessage[d]) {
            fetch(`${API_URL}${endpoint}${d}`, {
              method: 'delete',
              headers: API_HEADERS
            })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                self.handleFetching();
            })
            .catch((error) => {
              console.log('Error fetching and parsing data', error);
            });
          }
      })
  }

  render() {
    let {sentMessages, showSpinner,
        selectedMessage, checkedAll} = this.state;
    const {handleSelectItem} = this;
    const self = this;

    const renderDeleteButton = (_.findKey(selectedMessage, function(d) {return d === true}))
                                ?
                                (<Button bsStyle='danger' onClick={::this.handleDelete}>
                                    <Icon glyph='icon-fontello-trash-1'/>
                                </Button>) :
                                '';

    const renderSentMessages = (
                                <div>
                                  <div  className='inbox-avatar inbox-item'
                                        style={{'padding': '0', 'backgroundColor': '#EEEDEB'}}>
                                    <input  id='all'
                                            type='checkbox'
                                            checked={checkedAll}
                                            onClick={::this.handleSelectAll}
                                            />
                                    <label  htmlFor='all'
                                            style={{'marginBottom': '0', 'marginTop': '10px'}}>
                                      Pilih semua
                                    </label>
                                  </div>
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

                                      const checked = selectedMessage[d.message_id];

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
                                </div>
                                )

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
        <PanelContainer className='inbox' collapseBottom controls={false}>
          <Panel>
            <PanelBody style={{paddingTop: 0}}>
              <Grid>
                <Row>
                  <Col xs={8} style={{paddingTop: 12.5}}>
                    <ButtonToolbar className='inbox-toolbar'>
                        <Button bsStyle='blue' onClick={::this.handleClick}>
                          <Icon glyph='icon-fontello-edit-1'/>
                        </Button>
                        {renderDeleteButton}
                    </ButtonToolbar>
                  </Col>
                  <Col xs={4} className='text-right'>
                    <div className='inbox-avatar'>
                      <img src='/imgs/app/avatars/avatar0.png' width='40' height='40' />
                      <div className='inbox-avatar-name hidden-xs hidden-sm'>
                        <div>LINEID</div>
                        <div><small>Kotak Pesan</small></div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Grid>
              <hr style={{margin: 0}}/>
              <Panel horizontal>
                <PanelLeft className='panel-sm-3 inbox-nav hidden-xs'>
                  <Grid>
                    <Row>
                      <Col xs={12}>
                        <h6><small className='fg-darkgray'>KOTAK PESAN</small></h6>
                        <ListGroup className='list-bg-blue'>
                          <ListGroupItem active>
                            <ScheduledNavItem glyph='icon-dripicons-calendar' title='Pesan Terjadwal' />
                          </ListGroupItem>
                        </ListGroup>
                        <hr/>
                        <h6><small className='fg-darkgray'>LAINNYA</small></h6>
                        <ListGroup>
                        </ListGroup>
                      </Col>
                    </Row>
                  </Grid>
                </PanelLeft>
                <PanelBody className='panel-sm-9 panel-xs-12' style={{ paddingTop: 0 }}>
                  <Grid>
                    <Row>
                      <Col xs={12}>
                        {(showSpinner) ? <Spinner/> : ""}
                        {(sentMessages.length !== 0 || showSpinner) ? renderSentMessages : emptyMessage}
                      </Col>
                    </Row>
                  </Grid>
                </PanelBody>
              </Panel>
            </PanelBody>
          </Panel>
        </PanelContainer>
      </div>
    );
  }
}
