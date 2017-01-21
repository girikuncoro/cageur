import React from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router';
import {
  Row,Col,Icon,Grid,Label,Badge,Panel,
  Button,PanelLeft,PanelBody,ListGroup,
  LoremIpsum,ButtonGroup,ButtonToolbar,
  ListGroupItem,PanelContainer,
} from '@sketchpixy/rubix';
import {API_URL, API_HEADERS} from '../common/constant';
import {toTitleCase} from '../utilities/util';
import moment from 'moment';

class InboxNavItem extends React.Component {
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

class OutboxNavTag extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12} collapseLeft collapseRight>
            <Badge className={this.props.badgeClass}>{' '}</Badge>
            <span>{this.props.title}</span>
          </Col>
        </Row>
      </Grid>
    );
  }
}

@withRouter
class OutboxItem extends React.Component {
  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    let {name,status,content,date} = this.props;
    let group_name = name;
    this.props.router.push(`/mailbox/mail/${group_name}/${status}/${content}/${date}`);
  }
  render() {
    var classes = classNames({
      'inbox-item': true,
      'unread': this.props.unread
    });

    var linkProps = {
      href: '/mailbox/mail',
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
            <div style={{position: 'relative', top: 5}}>{this.props.date}</div>
            <div style={{position: 'relative', top: -5}}><small>#{this.props.itemId}</small></div>
          </div>
        </div>
      </a>
    );
  }
}

@withRouter
export default class Outbox extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      sent_messages: []
    };
  }

  componentDidMount() {

    // Fetching Sent Messages Information
    fetch(`${API_URL}/message/sent/clinic/1`, {
      headers: API_HEADERS
    })
    .then((response) => response.json())
    .then((responseData) => {
      let sent_messages = [];
      responseData.data.map(function(d,i) {
        sent_messages.push(
          {
            group_name: toTitleCase(d["disease_group"]["name"]),
            title: d["title"],
            status: d["processed"],
            content: d["content"],
            date: moment(d["updated_at"]).locale("id").format("Do MMMM YY")
          }
        );
      })
      this.setState({sent_messages: sent_messages});
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

  render() {
    let {sent_messages} = this.state;
    return (
      <div>
        <PanelContainer className='inbox' collapseBottom controls={false}>
          <Panel>
            <PanelBody style={{paddingTop: 0}}>
              <Grid>
                <Row>
                  <Col xs={8} style={{paddingTop: 12.5}}>
                    <ButtonToolbar className='inbox-toolbar'>
                      <ButtonGroup>
                        <Button bsStyle='blue' onClick={::this.handleClick}>
                          <Icon glyph='icon-fontello-edit-1'/>
                        </Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                  <Col xs={4} className='text-right'>
                    <div className='inbox-avatar'>
                      <img src='/imgs/app/avatars/avatar0.png' width='40' height='40' />
                      <div className='inbox-avatar-name hidden-xs hidden-sm'>
                        <div>Teteh Cageur</div>
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
                            <InboxNavItem glyph='icon-dripicons-return' title='Pesan Keluar' />
                          </ListGroupItem>
                        </ListGroup>
                        <hr/>
                        <h6><small className='fg-darkgray'>LAINNYA</small></h6>
                        <ListGroup>
                          <ListGroupItem>
                            <InboxNavItem glyph='icon-fontello-trash-1' title='Trash' />
                          </ListGroupItem>
                        </ListGroup>
                      </Col>
                    </Row>
                  </Grid>
                </PanelLeft>
                <PanelBody className='panel-sm-9 panel-xs-12' style={{ paddingTop: 0 }}>
                  <Grid>
                    <Row>
                      <Col xs={12}>
                        {sent_messages.map(function(d,i) {
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
                            <OutboxItem key={i}
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
