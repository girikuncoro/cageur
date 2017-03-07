import React, {Component} from 'react';
import { withRouter } from 'react-router';
import {
  Row, Col, Icon, Grid, Panel, Label,
  Button, PanelLeft, PanelBody, ListGroup,
  ButtonToolbar, ListGroupItem, PanelContainer,
} from '@sketchpixy/rubix';
import {API_URL} from '../common/constant';
import {toTitleCase} from '../utilities/util';
import moment from 'moment';
import update from 'immutability-helper';
import _ from 'underscore';

class OutboxNavItem extends Component {
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
export default class Outbox extends Component {

  constructor(props) {
      super(props);

      this.state = {
          sentMessages: undefined,
          selectedMessage: null,
          checkedAll: false
      };
  }

  componentDidMount() {
    // Redirect when no token found
    if (localStorage.getItem('token') == '') {
      this.props.router.push("/login");
    }
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.router.push('/dashboard/mailbox/compose');
  }

  handleClickNav(route) {
    this.props.router.push(`/dashboard/mailbox/outbox${route}`);
  }

  setSelectedMessage(selectedMessage) {
    this.setState({
        selectedMessage: selectedMessage
    })
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

      // Append token to api headers
      let API_HEADERS = {
        'Content-Type': 'application/json',
      }
      API_HEADERS['Authorization'] = (localStorage) ?
                                      (localStorage.getItem('token')) : '';

      Object.keys(selectedMessage).forEach(function(d,i) {
          if(selectedMessage[d]) {
            fetch(`${API_URL}${endpoint}${d}`, {
              method: 'delete',
              headers: API_HEADERS
            })
            .then((response) => response.json())
            .then((responseData) => {
                self.handleFetching();
            })
            .catch((error) => {
              console.log('Error fetching and parsing data', error);
              this.props.router.push("/login");
            });
          }
      })
  }

  handleFetching() {
    // Append token to api headers
    let API_HEADERS = {
      'Content-Type': 'application/json',
    }
    API_HEADERS['Authorization'] = (localStorage) ?
                                    (localStorage.getItem('token')) : '';

    // Fetching Sent Messages Information
    let clinic_id = localStorage.getItem('clinic_id');
    fetch(`${API_URL}/message/schedule/clinic/${clinic_id}`, {
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
              date: moment(d["schedule_at"]).locale("id").format("Do MMMM YY, HH:mm"),
              message_id: d["id"]
            }
          );

          selectedMessage[d["id"]] = false;
        })

        this.setState({
            sentMessages: sentMessages,
            selectedMessage: selectedMessage
        });

      } else {
        this.setState({
            sentMessages: sentMessages,
            selectedMessage: selectedMessage
        });
      }

    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
      this.props.router.push("/login");
    })
  }


  render() {
    const {selectedMessage, checkedAll, sentMessages} = this.state;
    const self = this;

    const renderDeleteButton = (_.findKey(selectedMessage, function(d) {return d === true}))
                              ?
                              (<Button bsStyle='danger' onClick={::this.handleDelete}>
                                  <Icon glyph='icon-fontello-trash-1'/>
                              </Button>) :
                              '';

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
                            <div onClick={this.handleClickNav.bind(this,'/sent')} style={{cursor: 'pointer'}}>
                                <ListGroupItem active={(this.props.location.pathname === '/dashboard/mailbox/outbox/sent')}>
                                  <OutboxNavItem glyph='icon-dripicons-return' title='Keluar' />
                                </ListGroupItem>
                            </div>

                            <div onClick={this.handleClickNav.bind(this,'/scheduled')} style={{cursor: 'pointer'}}>
                                <ListGroupItem active={(this.props.location.pathname === '/dashboard/mailbox/outbox/scheduled')}>
                                  <OutboxNavItem glyph='icon-dripicons-calendar' title='Terjadwal' />
                                </ListGroupItem>
                            </div>
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
                        {React.Children.map(
                               this.props.children,
                               child => React.cloneElement(child,
                                           {
                                              handleSelectItem: self.handleSelectItem.bind(self),
                                              handleSelectAll: self.handleSelectAll.bind(self),
                                              setSelectedMessage: self.setSelectedMessage.bind(self),
                                              selectedMessage: selectedMessage,
                                              checkedAll: checkedAll,
                                              sentMessages: sentMessages
                                           })
                        )}
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
